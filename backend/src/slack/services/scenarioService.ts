import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { LLMService } from "../../llm/llmService";
import { botManager } from "./botManager";
import { channelManager } from "./channelManager";

interface ScenarioStep {
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  objectives: string[];
  hints: string[];
  isFulfilled: boolean;
  botMessages: BotMessage[];
}

interface BotMessage {
  from: string;
  role: string;
  channel: string;
  message: string;
}

interface Scenario {
  scenarioId: string;
  scenarioTitle: string;
  scenarioDescription: string;
  steps: ScenarioStep[];
}

interface UserMessage {
  userId: string;
  channel: string;
  content: string;
  timestamp: Date;
}

interface SystemBotResponse {
  from: string;
  role: string;
  channel: string;
  message: string;
  timestamp: Date;
}

interface ActiveScenario {
  userId: string;
  userEmail: string;
  scenario: Scenario;
  currentStep: number;
  businessChannelId: string;
  incidentChannelId: string;
  startedAt: Date;
  completedObjectives: Record<number, string[]>;
  awardedBadges: string[];
  messageHistory: Array<UserMessage | SystemBotResponse>;
}

interface StepStatus {
  currentStep: number;
  objectivesFulfilled: string[];
  nextStep: number | null;
  awardedBadges: string[];
  otherStepData?: Record<string, any>;
}

interface BotResponse {
  from: string;
  role: string;
  channel: string;
  message: string;
}

interface LLMResponse {
  stepStatus: StepStatus;
  botResponses: BotResponse[];
  narrativeResponse: string;
}

class ScenarioService {
  private activeScenarios: Map<string, ActiveScenario> = new Map();
  private llmService: LLMService;
  private systemPrompt: string;
  private readonly MAX_HISTORY_ITEMS = 20;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
    // Load the system prompt
    this.systemPrompt = fs.readFileSync(
      path.join(__dirname, "../scenarios/system-prompt.md"),
      "utf8"
    );
  }

  async startScenario(
    userEmail: string,
    scenarioId: string
  ): Promise<ActiveScenario> {
    try {
      // Load scenario from file
      const scenarioPath = path.join(
        __dirname,
        `../scenarios/${scenarioId}.json`
      );
      const scenarioData = fs.readFileSync(scenarioPath, "utf8");
      const scenario: Scenario = JSON.parse(scenarioData);

      // Create channels for the drill
      const channels = await channelManager.createDrillChannels(
        userEmail,
        scenarioId
      );

      // Get the user's Slack ID from their email
      const csBot = botManager.getBot("cs-bot");
      if (!csBot) {
        throw new Error("CS-Bot not found");
      }

      console.log(`Looking up Slack ID for user email: ${userEmail}`);
      let userId;
      try {
        const userResponse = await csBot.app.client.users.lookupByEmail({
          email: userEmail,
        });

        if (!userResponse.ok || !userResponse.user) {
          console.warn(
            `User not found with email: ${userEmail}, using generated ID`
          );
          userId = uuidv4(); // Fallback to a UUID if email lookup fails
        } else {
          userId = userResponse.user.id;
          console.log(`Found Slack user ID: ${userId} for email: ${userEmail}`);
        }
      } catch (error) {
        console.error(`Error looking up user by email: ${userEmail}`, error);
        userId = uuidv4(); // Fallback to a UUID if lookup fails
      }

      // Create active scenario record
      const activeScenario: ActiveScenario = {
        userId,
        userEmail,
        scenario,
        currentStep: 1,
        businessChannelId: channels.businessChannelId,
        incidentChannelId: channels.incidentChannelId,
        startedAt: new Date(),
        completedObjectives: {},
        awardedBadges: [],
        messageHistory: [],
      };

      // Store in active scenarios map
      this.activeScenarios.set(userId, activeScenario);
      console.log(
        `Started scenario ${scenarioId} for user ID: ${userId} (email: ${userEmail})`
      );

      // Send initial bot messages for step 1
      await this.sendInitialBotMessages(activeScenario);

      return activeScenario;
    } catch (error) {
      console.error("Error starting scenario:", error);
      throw error;
    }
  }

  private async sendInitialBotMessages(
    activeScenario: ActiveScenario
  ): Promise<void> {
    const { scenario, currentStep, businessChannelId, incidentChannelId } =
      activeScenario;

    console.log(
      `Sending initial bot messages for step ${currentStep} in scenario ${scenario.scenarioId}`
    );
    console.log(
      `Using channels: business=${businessChannelId}, incident=${incidentChannelId}`
    );

    // Add a delay to allow Slack to fully provision the channels
    console.log(
      `Waiting for 3 seconds to allow channels to be fully provisioned...`
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(`Resuming after delay`);

    // Get initial messages for the current step
    const step = scenario.steps.find((s) => s.stepNumber === currentStep);
    if (!step) {
      throw new Error(`Step ${currentStep} not found in scenario`);
    }

    // Send all bot messages for this step
    for (const botMsg of step.botMessages) {
      try {
        const bot = botManager.getBot(botMsg.from);
        if (!bot) {
          console.error(`Bot ${botMsg.from} not found, skipping message`);
          continue;
        }

        const channelId =
          botMsg.channel === "business" ? businessChannelId : incidentChannelId;

        console.log(
          `Sending message from ${botMsg.from} to channel ${channelId}`
        );

        // Wait a small amount of time between messages
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify the channel exists
        let channelExists = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            const channelInfo = await bot.app.client.conversations.info({
              channel: channelId,
            });

            if (channelInfo.ok) {
              channelExists = true;
              console.log(`Verified channel ${channelId} exists`);
              break;
            } else {
              console.error(
                `Channel verification failed on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(channelInfo)}`
              );
              // Wait before retry
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(
              `Error verifying channel ${channelId} on attempt ${
                retryCount + 1
              }:`,
              error
            );
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (!channelExists) {
          console.error(
            `Could not verify channel ${channelId} after 3 attempts, skipping message`
          );
          continue;
        }

        // Send the message
        const result = await bot.app.client.chat.postMessage({
          channel: channelId,
          text: botMsg.message,
          username: `${botMsg.from} (${botMsg.role})`,
        });

        if (!result.ok) {
          console.error(`Failed to send message: ${JSON.stringify(result)}`);
          continue;
        }

        console.log(
          `Successfully sent message from ${botMsg.from} to channel ${channelId}`
        );

        // Record this bot message in history
        activeScenario.messageHistory.push({
          from: botMsg.from,
          role: botMsg.role,
          channel: botMsg.channel,
          message: botMsg.message,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(`Error sending message from ${botMsg.from}:`, error);
        // Continue with other messages even if one fails
      }
    }
  }

  async processUserMessage(
    userId: string,
    channelId: string,
    message: string
  ): Promise<void> {
    console.log(
      `[SCENARIO] Processing user message from ${userId} in channel ${channelId}: "${message}"`
    );

    // Verify channel information
    try {
      const { channelManager } = require("./channelManager");
      console.log(`[SCENARIO] Looking up channel info for ${channelId}`);
      const channelInfo = channelManager.getChannelInfo(channelId);

      if (channelInfo) {
        console.log(`[SCENARIO] FOUND CHANNEL INFO in cache:`);
        console.log(
          `[SCENARIO] Business channel ID: ${channelInfo.businessChannelId}`
        );
        console.log(
          `[SCENARIO] Incident channel ID: ${channelInfo.incidentChannelId}`
        );

        // Determine if this is a business or incident channel
        const isBusinessChannel = channelInfo.businessChannelId === channelId;
        const isIncidentChannel = channelInfo.incidentChannelId === channelId;

        console.log(
          `[SCENARIO] Channel type: ${
            isBusinessChannel
              ? "BUSINESS"
              : isIncidentChannel
              ? "INCIDENT"
              : "UNKNOWN"
          }`
        );
      } else {
        console.log(`[SCENARIO] Channel ${channelId} not found in cache`);
      }

      // Get drill ID for the channel
      const drillId = channelManager.findDrillIdByChannelId(channelId);
      if (drillId) {
        console.log(
          `[SCENARIO] Found drill ID: ${drillId} for channel: ${channelId}`
        );
      } else {
        console.log(
          `[SCENARIO] Could not find drill ID for channel: ${channelId}`
        );
      }
    } catch (err) {
      console.error(`[SCENARIO] Error checking channel info:`, err);
    }

    // Debug channel info from Slack API directly
    try {
      console.log(`[SCENARIO] Fetching channel info from Slack API`);
      const { botManager } = require("./botManager");
      const csBot = botManager.getBot("cs-bot");

      if (csBot) {
        const channelInfo = await csBot.app.client.conversations.info({
          channel: channelId,
        });

        if (channelInfo.ok) {
          console.log(`[SCENARIO] Channel API info:`);
          console.log(`- Name: ${channelInfo.channel.name}`);
          console.log(`- Is Private: ${channelInfo.channel.is_private}`);
          console.log(`- Member count: ${channelInfo.channel.num_members}`);
        } else {
          console.log(
            `[SCENARIO] Failed to get channel API info: ${channelInfo.error}`
          );
        }
      }
    } catch (err) {
      console.error(`[SCENARIO] Error fetching channel info from API:`, err);
    }

    // Find the active scenario by userId
    const activeScenario = this.activeScenarios.get(userId);

    if (!activeScenario) {
      console.log(`[SCENARIO] No active scenario found for user ${userId}`);

      // Try to find by channel instead - convert Map to array first
      const activeScenarioArray = Array.from(this.activeScenarios.values());
      const scenarioByChannel = activeScenarioArray.find(
        (scenario) =>
          scenario.businessChannelId === channelId ||
          scenario.incidentChannelId === channelId
      );

      if (scenarioByChannel) {
        console.log(
          `[SCENARIO] Found scenario by channel match instead of user ID`
        );
        console.log(
          `[SCENARIO] Using scenario for user ${scenarioByChannel.userId} (${scenarioByChannel.userEmail})`
        );

        // Process the message with the correct scenario
        await this.handleUserMessage(scenarioByChannel, channelId, message);
        return;
      }

      // Debug active scenarios
      console.log(`[SCENARIO] Active scenarios: ${this.activeScenarios.size}`);

      const scenariosArray = Array.from(this.activeScenarios.values());
      scenariosArray.forEach((s, index) => {
        console.log(`[SCENARIO] Scenario ${index + 1}:`);
        console.log(`- User ID: ${s.userId}`);
        console.log(`- User Email: ${s.userEmail}`);
        console.log(`- Business Channel: ${s.businessChannelId}`);
        console.log(`- Incident Channel: ${s.incidentChannelId}`);

        // Check for partial matches
        const businessPartialMatch =
          s.businessChannelId.includes(channelId) ||
          channelId.includes(s.businessChannelId);
        const incidentPartialMatch =
          s.incidentChannelId.includes(channelId) ||
          channelId.includes(s.incidentChannelId);

        if (businessPartialMatch) {
          console.log(`- PARTIAL MATCH with business channel`);
        }
        if (incidentPartialMatch) {
          console.log(`- PARTIAL MATCH with incident channel`);
        }
      });

      // Return early as we can't process the message without a scenario
      return;
    }

    // Process the message with the active scenario
    await this.handleUserMessage(activeScenario, channelId, message);
  }

  private updateScenarioState(
    activeScenario: ActiveScenario,
    llmResponse: LLMResponse
  ): void {
    const { stepStatus } = llmResponse;

    // Update completed objectives
    if (stepStatus.objectivesFulfilled.length > 0) {
      activeScenario.completedObjectives[activeScenario.currentStep] =
        stepStatus.objectivesFulfilled;
    }

    // Add any awarded badges
    if (stepStatus.awardedBadges && stepStatus.awardedBadges.length > 0) {
      activeScenario.awardedBadges = [
        ...activeScenario.awardedBadges,
        ...stepStatus.awardedBadges.filter(
          (badge) => !activeScenario.awardedBadges.includes(badge)
        ),
      ];
    }

    // Move to next step if specified
    if (stepStatus.nextStep !== null) {
      activeScenario.currentStep = stepStatus.nextStep;
    }
  }

  private async sendBotResponses(
    activeScenario: ActiveScenario,
    botResponses: BotResponse[]
  ): Promise<void> {
    console.log(
      `[MESSAGE_TRACKER] sendBotResponses: Sending ${botResponses.length} bot responses for user ${activeScenario.userId}`
    );

    for (const response of botResponses) {
      try {
        const bot = botManager.getBot(response.from);
        if (!bot) {
          console.error(
            `[MESSAGE_TRACKER] Bot ${response.from} not found, skipping response`
          );
          continue;
        }

        const channelId =
          response.channel === "business"
            ? activeScenario.businessChannelId
            : activeScenario.incidentChannelId;

        console.log(
          `[MESSAGE_TRACKER] Sending response from ${response.from} to channel ${channelId} (${response.channel})`
        );
        console.log(
          `[MESSAGE_TRACKER] Message content: "${response.message.substring(
            0,
            50
          )}${response.message.length > 50 ? "..." : ""}"`
        );

        // Wait a small amount of time between messages
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verify the channel exists before sending with retries
        let channelExists = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            console.log(
              `[MESSAGE_TRACKER] Verifying channel ${channelId} exists (attempt ${
                retryCount + 1
              })`
            );
            const channelInfo = await bot.app.client.conversations.info({
              channel: channelId,
            });

            if (channelInfo.ok) {
              channelExists = true;
              console.log(
                `[MESSAGE_TRACKER] Verified channel ${channelId} exists on attempt ${
                  retryCount + 1
                }`
              );
              break;
            } else {
              console.error(
                `[MESSAGE_TRACKER] Channel verification failed on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(channelInfo)}`
              );
              // Wait before retry with increasing backoff
              const delay = 1000 * (retryCount + 1);
              console.log(
                `[MESSAGE_TRACKER] Waiting ${delay}ms before next attempt...`
              );
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          } catch (error) {
            console.error(
              `[MESSAGE_TRACKER] Error verifying channel ${channelId} on attempt ${
                retryCount + 1
              }:`,
              error
            );
            // Wait before retry with increasing backoff
            const delay = 1000 * (retryCount + 1);
            console.log(
              `[MESSAGE_TRACKER] Waiting ${delay}ms before next attempt...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!channelExists) {
          console.error(
            `[MESSAGE_TRACKER] Could not verify channel ${channelId} after 3 attempts, skipping message`
          );
          continue;
        }

        // Send the message with retries
        let messageSent = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            console.log(
              `[MESSAGE_TRACKER] Sending message to channel ${channelId} (attempt ${
                retryCount + 1
              })`
            );
            const result = await bot.app.client.chat.postMessage({
              channel: channelId,
              text: response.message,
              username: `${response.from} (${response.role})`,
            });

            if (result.ok) {
              messageSent = true;
              console.log(
                `[MESSAGE_TRACKER] Successfully sent response from ${
                  response.from
                } to channel ${channelId} on attempt ${retryCount + 1}`
              );
              if (result.ts) {
                console.log(
                  `[MESSAGE_TRACKER] Message timestamp: ${result.ts}`
                );
              }
              break;
            } else {
              console.error(
                `[MESSAGE_TRACKER] Failed to send response on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(result)}`
              );
              // Wait before retry with increasing backoff
              const delay = 1000 * (retryCount + 1);
              console.log(
                `[MESSAGE_TRACKER] Waiting ${delay}ms before next attempt...`
              );
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          } catch (error) {
            console.error(
              `[MESSAGE_TRACKER] Error sending response on attempt ${
                retryCount + 1
              }:`,
              error
            );
            // Wait before retry with increasing backoff
            const delay = 1000 * (retryCount + 1);
            console.log(
              `[MESSAGE_TRACKER] Waiting ${delay}ms before next attempt...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!messageSent) {
          console.error(
            `[MESSAGE_TRACKER] Could not send message after 3 attempts, skipping`
          );
          continue;
        }

        // Record this bot message in history
        activeScenario.messageHistory.push({
          from: response.from,
          role: response.role,
          channel: response.channel,
          message: response.message,
          timestamp: new Date(),
        });
        console.log(
          `[MESSAGE_TRACKER] Message recorded in history, total messages: ${activeScenario.messageHistory.length}`
        );
      } catch (error) {
        console.error(
          `[MESSAGE_TRACKER] Error sending response from ${response.from}:`,
          error
        );
        // Continue with other responses even if one fails
      }
    }

    console.log(`[MESSAGE_TRACKER] Finished sending all bot responses`);
  }

  async endScenario(userId: string): Promise<void> {
    const activeScenario = this.activeScenarios.get(userId);
    if (!activeScenario) {
      throw new Error(`No active scenario found for user ${userId}`);
    }

    try {
      // Archive channels
      await channelManager.deleteDrillChannels(
        activeScenario.businessChannelId,
        activeScenario.incidentChannelId
      );

      // Remove from active scenarios
      this.activeScenarios.delete(userId);
    } catch (error) {
      console.error("Error ending scenario:", error);
      throw error;
    }
  }

  getActiveScenario(userId: string): ActiveScenario | undefined {
    return this.activeScenarios.get(userId);
  }

  getAllActiveScenarios(): ActiveScenario[] {
    return Array.from(this.activeScenarios.values());
  }

  updateUserId(oldUserId: string, newUserId: string): void {
    const activeScenario = this.activeScenarios.get(oldUserId);
    if (activeScenario) {
      this.activeScenarios.delete(oldUserId);
      this.activeScenarios.set(newUserId, activeScenario);
      console.log(`Updated user ID from ${oldUserId} to ${newUserId}`);
    }
  }

  // Add helper method to handle messages with a known scenario
  private async handleUserMessage(
    activeScenario: any, // Type will match your activeScenario structure
    channelId: string,
    message: string
  ): Promise<void> {
    console.log(
      `[SCENARIO] Handling message in scenario ${activeScenario.scenario.scenarioId}`
    );

    // Determine which channel the message came from
    const isBusinessChannel = channelId === activeScenario.businessChannelId;
    const isIncidentChannel = channelId === activeScenario.incidentChannelId;

    if (!isBusinessChannel && !isIncidentChannel) {
      console.log(
        `[SCENARIO] Warning: Channel ${channelId} doesn't match either channel in the scenario`
      );
      console.log(
        `[SCENARIO] Business: ${activeScenario.businessChannelId}, Incident: ${activeScenario.incidentChannelId}`
      );
      return;
    }

    const channelType = isBusinessChannel ? "business" : "incident";
    console.log(`[SCENARIO] Message is for the ${channelType} channel`);

    // Get userId from scenario
    const userId = activeScenario.userId;

    // Add user message to history
    const userMessage = {
      userId,
      channel: channelType,
      content: message,
      timestamp: new Date(),
    };

    activeScenario.messageHistory.push(userMessage);
    console.log(
      `[SCENARIO] Added message to history. History size: ${activeScenario.messageHistory.length}`
    );

    // Send acknowledgement message to channel to confirm receipt
    try {
      const { botManager } = require("./botManager");
      const csBot = botManager.getBot("cs-bot");

      // Optional debug response to show we're processing
      if (csBot) {
        try {
          await csBot.app.client.chat.postMessage({
            channel: channelId,
            text: `[DEBUG] Processing your message: "${message.substring(
              0,
              30
            )}${message.length > 30 ? "..." : ""}"`,
            username: "Debug Bot",
          });
        } catch (err) {
          console.error(`[SCENARIO] Error sending debug response:`, err);
        }
      }
    } catch (err) {
      console.error(`[SCENARIO] Error getting bot:`, err);
    }

    // Limit message history size
    if (activeScenario.messageHistory.length > this.MAX_HISTORY_ITEMS) {
      activeScenario.messageHistory = activeScenario.messageHistory.slice(
        activeScenario.messageHistory.length - this.MAX_HISTORY_ITEMS
      );
      console.log(
        `[SCENARIO] Trimmed history to ${this.MAX_HISTORY_ITEMS} items`
      );
    }

    // Prepare context for LLM
    const context = {
      scenarioData: activeScenario.scenario,
      currentStep: activeScenario.currentStep,
      completedObjectives: activeScenario.completedObjectives,
      awardedBadges: activeScenario.awardedBadges,
      userMessage: {
        channel: channelType,
        content: message,
      },
      messageHistory: activeScenario.messageHistory.map((msg: any) => {
        if ("userId" in msg) {
          // It's a user message
          return {
            type: "user" as const,
            channel: msg.channel,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
          };
        } else {
          // It's a bot message
          return {
            type: "bot" as const,
            from: msg.from,
            role: msg.role,
            channel: msg.channel,
            content: msg.message,
            timestamp: msg.timestamp.toISOString(),
          };
        }
      }),
    };

    console.log(
      `[SCENARIO] Prepared LLM context with ${context.messageHistory.length} message history items`
    );
    console.log(`[SCENARIO] Current step: ${activeScenario.currentStep}`);

    // Send to LLM for processing
    console.log(`[SCENARIO] Sending message to LLM for processing...`);
    try {
      const llmResponse = (await this.llmService.processScenarioMessage(
        this.systemPrompt,
        context
      )) as any; // Type will match your LLMResponse structure

      console.log(
        `[SCENARIO] Received LLM response with ${llmResponse.botResponses.length} bot responses`
      );

      // Update scenario state based on LLM response
      this.updateScenarioState(activeScenario, llmResponse);
      console.log(
        `[SCENARIO] Updated scenario state. Current step: ${activeScenario.currentStep}`
      );

      // Send bot responses
      await this.sendBotResponses(activeScenario, llmResponse.botResponses);
    } catch (err) {
      console.error(`[SCENARIO] Error processing message with LLM:`, err);

      // Send error message to channel
      try {
        const { botManager } = require("./botManager");
        const csBot = botManager.getBot("cs-bot");

        if (csBot) {
          await csBot.app.client.chat.postMessage({
            channel: channelId,
            text: `Sorry, I encountered an error processing your message. The system admin has been notified.`,
            username: "System",
          });
        }
      } catch (sendErr) {
        console.error(`[SCENARIO] Error sending error message:`, sendErr);
      }
    }
  }
}

export default ScenarioService;
