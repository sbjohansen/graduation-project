import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { LLMService } from "../../llm/llmService";
import { botManager } from "./botManager";
import { channelManager } from "./channelManager";

interface Scenario {
  scenarioId: string;
  scenarioTitle: string;
  scenarioDescription: string;
  initialSituation: string;
  overallGoal: string;
  initialBotMessages?: BotMessage[];
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

interface BotMessage {
  from: string;
  role: string;
  channel: string;
  message: string;
}

interface ActiveScenario {
  userId: string;
  userEmail: string;
  scenario: Scenario;
  businessChannelId: string;
  incidentChannelId: string;
  startedAt: Date;
  status: "pending_start" | "active" | "resolved";
  keyMilestones?: string[];
  awardedBadges: string[];
  messageHistory: Array<UserMessage | SystemBotResponse>;
  waitingForDecision?: boolean; // New field to track if bots are waiting for user decision
  lastDecisionRequest?: Date; // Track when the last decision request was made
}

interface BotResponse {
  from: string;
  role: string;
  channel: string;
  message: string;
}

interface LLMResponse {
  simulationStatus?: {
    awardedBadges?: string[];
    isResolved?: boolean;
  };
  botResponses: BotResponse[];
  narrativeResponse: string;
}

class ScenarioService {
  private activeScenarios: Map<string, ActiveScenario> = new Map();
  private llmService: LLMService;
  private systemPrompt: string;
  private readonly MAX_HISTORY_ITEMS = 20;
    // Inactivity timer management
  private inactivityTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly INACTIVITY_TIMEOUT_MS = 20000; // 20 seconds - reduced for better responsiveness
  constructor(llmServiceDep: LLMService) {
    this.llmService = llmServiceDep;
    this.systemPrompt = fs.readFileSync(
      path.join(__dirname, "../scenarios/system-prompt.md"),
      "utf8"
    );
  }
  /**
   * Reset the inactivity timer for a user
   */
  private resetInactivityTimer(userId: string): void {
    // Clear existing timer if it exists
    const existingTimer = this.inactivityTimers.get(userId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      console.log(`[INACTIVITY] Cleared existing timer for user ${userId}`);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.handleInactivityTimeout(userId);
    }, this.INACTIVITY_TIMEOUT_MS);

    this.inactivityTimers.set(userId, timer);
    console.log(`[INACTIVITY] Reset inactivity timer for user ${userId} (${this.INACTIVITY_TIMEOUT_MS}ms = ${this.INACTIVITY_TIMEOUT_MS/1000}s)`);
  }

  /**
   * Clear the inactivity timer for a user
   */
  private clearInactivityTimer(userId: string): void {
    const timer = this.inactivityTimers.get(userId);
    if (timer) {
      clearTimeout(timer);
      this.inactivityTimers.delete(userId);
      console.log(`[INACTIVITY] Cleared inactivity timer for user ${userId}`);
    }
  }
  /**
   * Handle inactivity timeout - send current history to LLM for follow-up
   */
  private async handleInactivityTimeout(userId: string): Promise<void> {
    console.log(`[INACTIVITY] Handling inactivity timeout for user ${userId}`);
    
    const activeScenario = this.activeScenarios.get(userId);
    if (!activeScenario) {
      console.log(`[INACTIVITY] No active scenario found for user ${userId}`);
      return;
    }

    if (activeScenario.status !== "active") {
      console.log(`[INACTIVITY] Scenario not active for user ${userId}, skipping follow-up`);
      return;
    }

    // Check if we're already waiting for a decision and it's been less than 60 seconds
    if (activeScenario.waitingForDecision && activeScenario.lastDecisionRequest) {
      const timeSinceLastRequest = Date.now() - activeScenario.lastDecisionRequest.getTime();
      if (timeSinceLastRequest < 60000) { // Less than 60 seconds
        console.log(`[INACTIVITY] Already waiting for decision from user ${userId}, not sending more messages`);
        // Reset timer to continue monitoring
        this.resetInactivityTimer(userId);
        return;
      }
    }    try {      
      // Check the conversation for recent task assignments vs just questions
      const recentMessages = activeScenario.messageHistory.slice(-10);
      const recentUserMessages = recentMessages.filter(msg => "userId" in msg) as UserMessage[];
      const recentBotMessages = recentMessages.filter(msg => !("userId" in msg)) as SystemBotResponse[];
      
      // Look for actual task assignments from the user (like "John, analyze that email")
      const hasRecentTaskAssignments = recentUserMessages.some(msg => {
        const content = msg.content.toLowerCase();
        return (
          content.includes("analyze") ||
          content.includes("check") ||
          content.includes("investigate") ||
          content.includes("look into") ||
          content.includes("examine") ||
          content.includes("review") ||
          content.includes("block") ||
          content.includes("implement")
        ) && (
          content.includes("john") ||
          content.includes("mike") ||
          content.includes("peter") ||
          content.includes("lazar") ||
          content.includes("hanna")
        );
      });
      
      // Look for bots asking initial questions without any assignments yet
      const hasUnansweredQuestions = recentBotMessages.some(msg => 
        (msg.message.includes("Should I begin") || 
         msg.message.includes("What's our") ||
         msg.message.includes("awaiting") ||
         msg.message.includes("Need investigation orders")) &&
        !hasRecentTaskAssignments
      );

      if (hasUnansweredQuestions && !hasRecentTaskAssignments) {
        // Only send decision request if bots are genuinely waiting for initial assignments
        console.log(`[INACTIVITY] Bots waiting for initial task assignments, sending decision request to user ${userId}`);
        
        const csBot = botManager.getBot("cs-bot");
        if (csBot) {
          const userMention = `<@${userId}>`; // Tag the actual user
          await csBot.app.client.chat.postMessage({
            channel: activeScenario.businessChannelId, // Send to business channel for visibility
            text: `${userMention} Your team is waiting for initial task assignments. Please respond to continue the incident response.`,
            username: "Incident Coordinator",
          });
        }

        // Mark as waiting for decision
        activeScenario.waitingForDecision = true;
        activeScenario.lastDecisionRequest = new Date();
        
        // Reset timer to continue monitoring
        this.resetInactivityTimer(userId);
        return;
      }      // If there are recent task assignments, let bots complete their work and report back
      const taskCompletionMessage = hasRecentTaskAssignments ? 
        `[SYSTEM: User <@${userId}> has been inactive for 20 seconds. Bots with assigned tasks MUST complete their work and report specific findings. CRITICAL RULES: (1) Complete assigned tasks and provide specific results. (2) MAXIMUM 1 bot responds. (3) Format: "[Task] complete. [Specific findings]. @incident-manager [Next question]?" (4) If no assigned tasks, stay SILENT.]` :
        `[SYSTEM: User <@${userId}> has been inactive for 20 seconds. CRITICAL RULES: (1) If ANY bot has asked a question in recent messages, ALL bots MUST stay SILENT. (2) If information was already provided, do NOT repeat it. (3) MAXIMUM 1 bot responds with MAXIMUM 1 sentence. (4) Only provide NEW task completion updates or stay SILENT.]`;
      
      const context = {
        initialSituation: activeScenario.scenario.initialSituation,
        overallGoal: activeScenario.scenario.overallGoal,
        keyMilestones: activeScenario.keyMilestones || [],
        awardedBadges: activeScenario.awardedBadges,
        userMessage: {
          userId: userId,
          channel: "system", // Indicate this is a system-triggered follow-up
          content: taskCompletionMessage,
          mentionedBotIds: [],
        },
        messageHistory: activeScenario.messageHistory
          .slice(-this.MAX_HISTORY_ITEMS)
          .map((msg: UserMessage | SystemBotResponse) => {
            if ("userId" in msg) {
              return {
                type: "user" as const,
                channel: msg.channel,
                content: msg.content,
                timestamp: msg.timestamp.toISOString(),
              };
            } else {
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

      console.log(`[INACTIVITY] Requesting follow-up from LLM for user ${userId}`);
      const llmResponse = await this.llmService.processScenarioMessage(
        this.systemPrompt,
        context
      );
      
      // Process the response as usual, but reset the timer to continue the inactivity cycle
      if (llmResponse.botResponses && llmResponse.botResponses.length > 0) {
        console.log(`[INACTIVITY] Sending ${llmResponse.botResponses.length} follow-up responses for user ${userId}`);
        await this.sendBotResponses(activeScenario, llmResponse.botResponses);
        
        // Check if any bot asked a question in the response
        const askedQuestion = llmResponse.botResponses.some(response => 
          response.message.includes("?") || 
          response.message.includes("Should I") ||
          response.message.includes("What") ||
          response.message.includes("How")
        );
        
        if (askedQuestion) {
          activeScenario.waitingForDecision = true;
          activeScenario.lastDecisionRequest = new Date();
        }
        
        // Reset the timer to continue monitoring for more inactivity
        this.resetInactivityTimer(userId);
      } else {
        console.log(`[INACTIVITY] No follow-up responses generated, resetting timer anyway`);
        // Reset timer even if no responses to continue monitoring
        this.resetInactivityTimer(userId);
      }

      // Handle other response elements if needed
      if (llmResponse.simulationStatus?.awardedBadges && llmResponse.simulationStatus.awardedBadges.length > 0) {
        activeScenario.awardedBadges = [
          ...activeScenario.awardedBadges,
          ...llmResponse.simulationStatus.awardedBadges.filter(
            (badge) => !activeScenario.awardedBadges.includes(badge)
          ),
        ];
      }

      if (llmResponse.simulationStatus?.isResolved === true) {
        this.updateScenarioStatus(activeScenario, "resolved");
        await this.sendBotResponses(activeScenario, llmResponse.botResponses);
        const finalizationDelay = 45 * 1000;
        setTimeout(() => {
          this.sendFinalSummaryAndArchive(activeScenario.userId);
        }, finalizationDelay);
        return;
      }

    } catch (error) {
      console.error(`[INACTIVITY] Error handling inactivity timeout for user ${userId}:`, error);
    }
  }

  async startScenario(
    userEmail: string,
    scenarioId: string
  ): Promise<ActiveScenario> {
    try {
      const scenarioPath = path.join(
        __dirname,
        `../scenarios/${scenarioId}.json`
      );
      const scenarioData = fs.readFileSync(scenarioPath, "utf8");
      const scenario: Scenario = JSON.parse(scenarioData);

      const channels = await channelManager.createDrillChannels(
        userEmail,
        scenarioId
      );

      const csBot = botManager.getBot("cs-bot");
      if (!csBot) {
        throw new Error("CS-Bot not found");
      }

      let userId;
      try {
        const userResponse = await csBot.app.client.users.lookupByEmail({
          email: userEmail,
        });

        if (!userResponse.ok || !userResponse.user) {
          console.warn(
            `User not found with email: ${userEmail}, using generated ID`
          );
          userId = uuidv4();
        } else {
          userId = userResponse.user.id;
        }
      } catch (error) {
        console.error(`Error looking up user by email: ${userEmail}`, error);
        userId = uuidv4();
      }

      const activeScenario: ActiveScenario = {
        userId,
        userEmail,
        scenario,
        businessChannelId: channels.businessChannelId,
        incidentChannelId: channels.incidentChannelId,
        startedAt: new Date(),
        status: "pending_start",
        awardedBadges: [],
        messageHistory: [],
      };

      this.activeScenarios.set(userId, activeScenario);
      console.log(
        `Scenario ${scenarioId} created for user ${userId}, status: pending_start`
      );

      // --- Send Instructions ---
      try {
        const instructions = `>*Welcome to the ${scenario.scenarioTitle} drill!*\n>\n>*Your Goal:* ${scenario.scenarioDescription}.\n>\n>Navigate the situation described below and work with your team to identify the root cause, mitigate the issue, and restore normal operations.\n>\n>*Channels:*\n>- \`#${channels.businessChannelName}\` (this channel): For high-level updates, business impact discussions, and communication with the CEO (Pete).\n>- \`#${channels.incidentChannelName}\`: For technical investigation, coordination with the engineering/security team (Hanna, John, Mike, Peter, Lazar), and detailed findings.\n>\n>*Interacting with Bots:*\n>- Mention bots using \`@BotName\` (e.g., \`@hanna\`, \`@pete\`) to direct tasks or questions.\n>- Bots will respond based on their roles and the information available.\n>- Some tasks take time; bots will acknowledge and follow up later using scheduled messages.\n>\n>*Initial Situation:*\n>${scenario.initialSituation}\n>\n>*Ready to begin? Please type \`START\` in this channel.*`;

        if (csBot) {
          await csBot.app.client.chat.postMessage({
            channel: channels.businessChannelId,
            text: instructions,
            username: "Drill Master",
          });
          console.log(
            `Instructions sent to business channel ${channels.businessChannelId}`
          );
        } else {
          console.error("CS-Bot not found, cannot send instructions.");
        }
      } catch (instrError) {
        console.error("Error sending instructions:", instrError);
      }

      // Do NOT send initial bot messages yet.
      // await this.sendInitialBotMessages(activeScenario);

      return activeScenario; // Return the pending scenario
    } catch (error) {
      console.error("Error starting scenario:", error);
      throw error;
    }
  }

  private async sendInitialBotMessages(
    activeScenario: ActiveScenario
  ): Promise<void> {
    const { scenario, businessChannelId, incidentChannelId } = activeScenario;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const initialBotMessages = scenario.initialBotMessages;
    if (!initialBotMessages || initialBotMessages.length === 0) {
      return;
    }

    for (const botMsg of initialBotMessages) {
      try {
        const bot = botManager.getBot(botMsg.from);
        if (!bot) {
          console.error(`Bot ${botMsg.from} not found, skipping message`);
          continue;
        }

        const channelId =
          botMsg.channel === "business" ? businessChannelId : incidentChannelId;

        await new Promise((resolve) => setTimeout(resolve, 500));

        let channelExists = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            const channelInfo = await bot.app.client.conversations.info({
              channel: channelId,
            });
            if (channelInfo.ok) {
              channelExists = true;
              break;
            } else {
              console.error(
                `Channel verification failed on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(channelInfo)}`
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(
              `Error verifying channel ${channelId} on attempt ${
                retryCount + 1
              }:`,
              error
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (!channelExists) {
          console.error(
            `Could not verify channel ${channelId} after 3 attempts, skipping message`
          );
          continue;
        }        const formattedMessage = this.formatMentions(botMsg.message, activeScenario.userId);
        
        const result = await bot.app.client.chat.postMessage({
          channel: channelId,
          text: formattedMessage,
          username: `${botMsg.from} (${botMsg.role})`,
        });

        if (!result.ok) {
          console.error(`Failed to send message: ${JSON.stringify(result)}`);
          continue;
        }

        activeScenario.messageHistory.push({
          from: botMsg.from,
          role: botMsg.role,
          channel: botMsg.channel,
          message: botMsg.message,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(`Error sending message from ${botMsg.from}:`, error);
      }
    }
  }
  async processUserMessage(
    userId: string,
    channelId: string,
    message: string
  ): Promise<void> {
    let activeScenario = this.activeScenarios.get(userId);

    if (!activeScenario) {
      const activeScenarioArray = Array.from(this.activeScenarios.values());
      activeScenario = activeScenarioArray.find(
        (scenario) =>
          scenario.businessChannelId === channelId ||
          scenario.incidentChannelId === channelId
      );

      if (activeScenario) {
        // Update the user ID for future lookups
        this.activeScenarios.delete(userId);
        this.activeScenarios.set(activeScenario.userId, activeScenario);
      } else {
        console.log(
          `[SCENARIO] No active scenario found for user ${userId} or channel ${channelId}`
        );
        return;
      }
    }    // Reset inactivity timer when user sends a message
    this.resetInactivityTimer(activeScenario.userId);
    
    // Clear decision-waiting flag when user responds
    if (activeScenario.waitingForDecision) {
      console.log(`[INACTIVITY] User ${activeScenario.userId} responded, clearing waitingForDecision flag`);
      activeScenario.waitingForDecision = false;
      activeScenario.lastDecisionRequest = undefined;
    }

    await this.handleUserMessage(activeScenario, channelId, message);
  }
  // --- Helper function to format mentions ---
  private formatMentions(messageText: string, userId?: string): string {
    // First, replace @incident-manager with actual user ID if provided
    let formattedMessage = messageText;
    if (userId) {
      formattedMessage = formattedMessage.replace(/@incident-manager/g, `<@${userId}>`);
    }
    
    // Then handle bot mentions: Regex to find @ followed by bot names (adjust chars allowed in name if needed)
    const mentionRegex = /@([a-zA-Z0-9_\-]+)/g;
    return formattedMessage.replace(mentionRegex, (match, botId) => {
      const bot = botManager.getBot(botId.toLowerCase()); // Use lowercase ID for lookup
      if (bot && bot.slackUserId) {
        return `<@${bot.slackUserId}>`; // Replace with Slack mention format
      }
      return match; // Return original text if bot or slackUserId not found
    });
  }

  private async sendBotResponses(
    activeScenario: ActiveScenario,
    responses: BotResponse[]
  ): Promise<void> {
    console.log(
      `[MESSAGE_TRACKER] Sending ${responses.length} immediate bot responses for user ${activeScenario.userId}`
    );
    for (const response of responses) {
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

        await new Promise((resolve) => setTimeout(resolve, 500));

        let channelExists = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            const channelInfo = await bot.app.client.conversations.info({
              channel: channelId,
            });

            if (channelInfo.ok) {
              channelExists = true;
              break;
            } else {
              console.error(
                `[MESSAGE_TRACKER] Channel verification failed on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(channelInfo)}`
              );
              const delay = 1000 * (retryCount + 1);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          } catch (error) {
            console.error(
              `[MESSAGE_TRACKER] Error verifying channel ${channelId} on attempt ${
                retryCount + 1
              }:`,
              error
            );
            const delay = 1000 * (retryCount + 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!channelExists) {
          console.error(
            `[MESSAGE_TRACKER] Could not verify channel ${channelId} after 3 attempts, skipping message`
          );
          continue;
        }        // --- Format mentions before sending ---
        const formattedMessage = this.formatMentions(response.message, activeScenario.userId);

        let messageSent = false;
        for (let retryCount = 0; retryCount < 3; retryCount++) {
          try {
            const result = await bot.app.client.chat.postMessage({
              channel: channelId,
              text: formattedMessage, // Use formatted message
              username: `${response.from} (${response.role})`,
            });

            if (result.ok) {
              messageSent = true;
              break;
            } else {
              console.error(
                `[MESSAGE_TRACKER] Failed to send response on attempt ${
                  retryCount + 1
                }: ${JSON.stringify(result)}`
              );
              const delay = 1000 * (retryCount + 1);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          } catch (error) {
            console.error(
              `[MESSAGE_TRACKER] Error sending response on attempt ${
                retryCount + 1
              }:`,
              error
            );
            const delay = 1000 * (retryCount + 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!messageSent) {
          console.error(
            `[MESSAGE_TRACKER] Could not send message after 3 attempts, skipping`
          );
          continue;
        }

        // Store original message in history for LLM context
        activeScenario.messageHistory.push({
          from: response.from,
          role: response.role,
          channel: response.channel,
          message: response.message, // Store original message
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(
          `[MESSAGE_TRACKER] Error sending response from ${response.from}:`,
          error
        );
      }
    }
  }
  async endScenario(userId: string): Promise<void> {
    const activeScenario = this.activeScenarios.get(userId);
    if (!activeScenario) {
      console.log(
        `Attempted to end scenario for user ${userId}, but none was active.`
      );
      return;
    }
    console.log(`Ending scenario for user ${userId}.`);
    
    // Clear inactivity timer when ending scenario
    this.clearInactivityTimer(userId);
    
    try {
      await channelManager.deleteDrillChannels(
        activeScenario.businessChannelId,
        activeScenario.incidentChannelId
      );
      this.activeScenarios.delete(userId);
      console.log(`Scenario ended successfully for user ${userId}.`);
    } catch (error) {
      console.error("Error ending scenario:", error);
      this.activeScenarios.delete(userId);
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
    }
  }

  private async handleUserMessage(
    activeScenario: ActiveScenario,
    channelId: string,
    message: string
  ): Promise<void> {
    // --- START Pre-start Check ---
    if (activeScenario.status === "pending_start") {      if (
        channelId === activeScenario.businessChannelId &&
        message.trim().toUpperCase() === "START"
      ) {        console.log(
          `Starting scenario ${activeScenario.scenario.scenarioId} for user ${activeScenario.userId} after receiving START command.`
        );
        this.updateScenarioStatus(activeScenario, "active");
        
        // Trigger initial bot messages now
        await this.sendInitialBotMessages(activeScenario);
        return; // Don't process START command further
      } else {
        // Optionally remind the user to type START
        console.log(
          `Ignoring message from user ${activeScenario.userId} while scenario is pending start.`
        );
        try {
          const csBot = botManager.getBot("cs-bot");
          if (csBot) {
            await csBot.app.client.chat.postMessage({
              channel: activeScenario.businessChannelId, // Remind in business channel
              text: `Please type \`START\` in this channel to begin the simulation.`,
              username: "Drill Master",
            });
          }
        } catch (remindErr) {
          /* Ignore error sending reminder */
        }
        return; // Ignore other messages while pending
      }
    }
    // --- END Pre-start Check ---

    // --- START Resolved Check ---
    if (activeScenario.status === "resolved") {
      console.log(
        `Ignoring message from user ${activeScenario.userId} as scenario is resolved.`
      );
      return; // Don't process messages after resolution
    }
    // --- END Resolved Check ---

    // --- Original handleUserMessage logic starts here ---
    const isBusinessChannel = channelId === activeScenario.businessChannelId;
    const isIncidentChannel = channelId === activeScenario.incidentChannelId;

    if (!isBusinessChannel && !isIncidentChannel) {
      console.warn(
        `[SCENARIO] Warning: Channel ${channelId} doesn't match known channels for active scenario ${activeScenario.scenario.scenarioId}`
      );
      return;
    }

    const channelType = isBusinessChannel ? "business" : "incident";

    const userId = activeScenario.userId;

    const mentionedBotIds: string[] = [];
    const mentionRegex = /<@(\w+)>/g;
    let match;
    const allBots = botManager.getAllBots();

    while ((match = mentionRegex.exec(message)) !== null) {
      const mentionedSlackId = match[1];
      const foundBot = allBots.find(
        (bot) => bot.slackUserId === mentionedSlackId
      );
      if (foundBot) {
        const internalBotId = foundBot.config.id;
        if (!mentionedBotIds.includes(internalBotId)) {
          mentionedBotIds.push(internalBotId);
        }
      }
    }

    const userMessage: UserMessage = {
      userId,
      channel: channelType,
      content: message,
      timestamp: new Date(),
    };

    activeScenario.messageHistory.push(userMessage);

    if (activeScenario.messageHistory.length > this.MAX_HISTORY_ITEMS) {
      activeScenario.messageHistory = activeScenario.messageHistory.slice(
        activeScenario.messageHistory.length - this.MAX_HISTORY_ITEMS
      );
    }

    const filteredHistory = activeScenario.messageHistory
      .filter((msg) => msg.channel === channelType)
      .map((msg: UserMessage | SystemBotResponse) => {
        if ("userId" in msg) {
          return {
            type: "user" as const,
            channel: msg.channel,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
          };
        } else {
          return {
            type: "bot" as const,
            from: msg.from,
            role: msg.role,
            channel: msg.channel,
            content: msg.message,
            timestamp: msg.timestamp.toISOString(),
          };
        }
      });

    const context = {
      initialSituation: activeScenario.scenario.initialSituation,
      overallGoal: activeScenario.scenario.overallGoal,
      keyMilestones: activeScenario.keyMilestones || [],
      awardedBadges: activeScenario.awardedBadges,
      userMessage: {
        channel: channelType,
        content: message,
        mentionedBotIds: mentionedBotIds,
      },
      messageHistory: filteredHistory,
    };

    try {
      const llmResponse = (await this.llmService.processScenarioMessage(
        this.systemPrompt,
        context
      )) as LLMResponse;

      console.log(
        "[DEBUG] Raw LLM Response:",
        JSON.stringify(llmResponse, null, 2)
      );

      if (
        llmResponse.simulationStatus?.awardedBadges &&
        llmResponse.simulationStatus.awardedBadges.length > 0
      ) {
        activeScenario.awardedBadges = [
          ...activeScenario.awardedBadges,
          ...llmResponse.simulationStatus.awardedBadges.filter(
            (badge) => !activeScenario.awardedBadges.includes(badge)
          ),
        ];
        console.log(
          `[SCENARIO] Badges awarded: ${llmResponse.simulationStatus.awardedBadges.join(
            ", "
          )}`
        );
      }      // --- Check for Resolution ---
      if (llmResponse.simulationStatus?.isResolved === true) {        console.log(
          `[SCENARIO] LLM signaled resolution for scenario ${activeScenario.scenario.scenarioId}, user ${userId}.`
        );
        this.updateScenarioStatus(activeScenario, "resolved");

        // Send immediate final bot responses (likely congratulations)
        await this.sendBotResponses(activeScenario, llmResponse.botResponses);

        // --- Schedule the final summary and cleanup ---
        const finalizationDelay = 45 * 1000; // 45 seconds delay
        console.log(
          `[SCENARIO] Scheduling final summary and cleanup in ${
            finalizationDelay / 1000
          } seconds for user ${userId}.`
        );

        setTimeout(() => {
          this.sendFinalSummaryAndArchive(activeScenario.userId);
        }, finalizationDelay);

        return; // Stop processing this message further, but allow existing timers to run
      }
      // --- END Check for Resolution ---

      if (llmResponse.narrativeResponse) {
        try {
          const csBot = botManager.getBot("cs-bot");
          if (csBot) {
            await csBot.app.client.chat.postMessage({
              channel: channelId,
              text: `_${llmResponse.narrativeResponse}_`,
              username: "Narrator",
            });
          } else {
            console.warn(
              "[SCENARIO] CS-Bot not found, cannot send narrative response."
            );
          }
        } catch (narrativeErr) {
          console.error(
            "[SCENARIO] Error sending narrative response:",
            narrativeErr
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 750));
      }      await this.sendBotResponses(activeScenario, llmResponse.botResponses);

      // Remove the old scheduled responses logic - we now use inactivity-based follow-ups
      // The inactivity timer will trigger follow-ups if the user doesn't respond within 35 seconds
      
    } catch (err) {
      console.error(`[SCENARIO] Error processing message with LLM:`, err);
      try {
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
  /**
   * @deprecated This method is no longer used. We now use inactivity-based follow-ups instead of scheduled responses.
   */
  private async sendScheduledResponse(
    userId: string,
    response: BotResponse
  ): Promise<void> {
    console.warn(`[DEPRECATED] sendScheduledResponse called for user ${userId}. This method is deprecated.`);
    // Method kept for backward compatibility but no longer used
  }

  // --- ADD new method to send summary and schedule archival ---
  private async sendFinalSummaryAndArchive(userId: string): Promise<void> {
    const activeScenario = this.getActiveScenario(userId);
    // Double-check scenario still exists and is resolved (though it should be)
    if (!activeScenario || activeScenario.status !== "resolved") {
      console.log(
        `[SCENARIO] Final summary requested for user ${userId}, but scenario not found or not resolved.`
      );
      return;
    }
    console.log(`[SCENARIO] Sending final summary for user ${userId}.`);

    try {
      const feedbackTips = `\n\n*Feedback & Tips:*\n- Effective delegation to bots based on their roles (e.g., Network Engineer for traffic, Security Analyst for logs) is key.\n- Clearly stating desired actions helps guide the team.\n- In a real DDoS, quick identification and implementation of WAF rules or IP blocks are crucial first steps.\n- Always verify mitigation effectiveness before declaring resolution.`;
      const archiveNotice = `\n\n_These simulation channels will be archived in approximately 5 minutes._`;
      const summary = `>*Congratulations!* You've successfully resolved the **${
        activeScenario.scenario.scenarioTitle
      }** incident.\n>\n>*Summary:*\n>- You effectively coordinated the team to investigate the performance degradation.\n>- You guided the identification and mitigation of the root cause.\n>- Normal service was restored.\n${
        activeScenario.awardedBadges.length > 0
          ? `>\n>*Badges Awarded:* ${activeScenario.awardedBadges.join(", ")}`
          : ""
      }\n>${feedbackTips}\n>${archiveNotice}`;

      const csBot = botManager.getBot("cs-bot");
      if (csBot) {
        await csBot.app.client.chat.postMessage({
          channel: activeScenario.businessChannelId,
          text: summary,
          username: "Drill Master",
        });
        console.log(`Resolution summary sent for user ${userId}.`);

        // Schedule channel cleanup 5 minutes after summary is sent
        const cleanupDelay = 5 * 60 * 1000;
        setTimeout(() => this.endScenario(userId), cleanupDelay);
        console.log(
          `Scheduled channel cleanup for user ${userId} in 5 minutes.`
        );
      } else {
        console.error(
          "CS-Bot not found, cannot send resolution summary or schedule cleanup."
        );
      }
    } catch (summaryErr) {
      console.error(
        "Error sending resolution summary or scheduling cleanup:",
        summaryErr
      );
    }
  }

  /**
   * Update scenario status and handle inactivity timer accordingly
   */
  private updateScenarioStatus(activeScenario: ActiveScenario, newStatus: "pending_start" | "active" | "resolved"): void {
    const oldStatus = activeScenario.status;
    activeScenario.status = newStatus;
    
    console.log(`[INACTIVITY] Scenario status changed from ${oldStatus} to ${newStatus} for user ${activeScenario.userId}`);
    
    // Handle timer based on status changes
    if (newStatus === "active" && oldStatus !== "active") {
      // Start timer when becoming active
      this.resetInactivityTimer(activeScenario.userId);
    } else if (newStatus !== "active" && oldStatus === "active") {
      // Clear timer when leaving active state
      this.clearInactivityTimer(activeScenario.userId);
    }
  }

  /**
   * Debug method to check inactivity timer status
   */
  getInactivityTimerStatus(userId: string): { hasTimer: boolean; timeoutMs: number } {
    const hasTimer = this.inactivityTimers.has(userId);
    return {
      hasTimer,
      timeoutMs: this.INACTIVITY_TIMEOUT_MS
    };
  }

  /**
   * Debug method to list all active inactivity timers
   */
  getAllInactivityTimers(): string[] {
    return Array.from(this.inactivityTimers.keys());
  }
}

export default ScenarioService;
