import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

interface MessageHistoryItem {
  type: "user" | "bot";
  channel: string;
  content: string;
  timestamp: string;
  from?: string;
  role?: string;
}

interface LLMScenarioContext {
  initialSituation: string;
  overallGoal: string;
  keyMilestones?: string[];
  awardedBadges: string[];
  userMessage: {
    channel: string;
    content: string;
    mentionedBotIds?: string[];
  };
  messageHistory?: MessageHistoryItem[];
}

interface LLMResponse {
  simulationStatus?: {
    awardedBadges?: string[];
    isResolved?: boolean;
  };
  botResponses: {
    from: string;
    role: string;
    channel: string;
    message: string;
  }[];
  narrativeResponse: string;
  scheduledResponses?: {
    delay: number;
    response: {
      from: string;
      role: string;
      channel: string;
      message: string;
    };
  }[];
}

// OpenAI API types
interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAICompletionChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  index: number;
}

interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAICompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LLMService {
  private apiKey: string;
  private apiEndpoint: string;
  private model: string;
  private maxRetries: number;
  private retryDelay: number; // in ms

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.apiEndpoint =
      process.env.OPENAI_API_ENDPOINT ||
      "https://api.openai.com/v1/chat/completions";
    this.model = process.env.OPENAI_MODEL || "gpt-4";
    this.maxRetries = parseInt(process.env.OPENAI_MAX_RETRIES || "3", 10);
    this.retryDelay = parseInt(process.env.OPENAI_RETRY_DELAY || "1000", 10);

    if (!this.apiKey) {
      console.warn("No OpenAI API key found in environment variables");
    }
  }

  async processScenarioMessage(
    systemPrompt: string,
    context: LLMScenarioContext
  ): Promise<LLMResponse> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify({
          initialSituation: context.initialSituation,
          overallGoal: context.overallGoal,
          keyMilestones: context.keyMilestones || [],
          awardedBadges: context.awardedBadges,
          userMessage: context.userMessage,
          messageHistory: context.messageHistory || [],
        }),
      },
    ];

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.maxRetries) {
      try {
        const response = await axios.post<OpenAICompletionResponse>(
          this.apiEndpoint,
          {
            model: this.model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }, // Ensure JSON response format
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const completion = response.data.choices[0]?.message?.content;
        if (!completion) {
          throw new Error("No completion returned from OpenAI");
        }

        try {
          return JSON.parse(completion) as LLMResponse;
        } catch (e) {
          console.error("Failed to parse OpenAI response as JSON:", completion);
          throw new Error("OpenAI response was not valid JSON");
        }
      } catch (error) {
        lastError = error as Error;
        attempt++;

        // Handle specific OpenAI error cases
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const statusCode = axiosError.response?.status;

          // Don't retry on client errors (except rate limits)
          if (statusCode && statusCode !== 429 && statusCode < 500) {
            const responseData = axiosError.response?.data as any;
            const errorMessage =
              responseData?.error?.message || axiosError.message;
            throw new Error(
              `OpenAI API error (${statusCode}): ${errorMessage}`
            );
          }

          // For rate limit errors, use exponential backoff
          if (statusCode === 429) {
            const delay = this.retryDelay * Math.pow(2, attempt - 1);
            console.warn(`Rate limited by OpenAI, retrying in ${delay}ms`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }

        // For server errors or network issues, retry after delay
        if (attempt < this.maxRetries) {
          console.warn(
            `OpenAI request failed, retrying (${attempt}/${this.maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    // If we've exhausted retries, throw the last error
    throw new Error(
      `Failed to process message with OpenAI after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }
}
