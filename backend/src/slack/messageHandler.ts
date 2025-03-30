import { App } from "@slack/bolt";
import { LLMService } from "../llm/llmService";
import ScenarioService from "./services/scenarioService";

export class MessageHandler {
  private scenarioService: ScenarioService;

  constructor() {
    const llmService = new LLMService();
    this.scenarioService = new ScenarioService(llmService);
    console.log("MessageHandler initialized");
  }

  setupMessageHandling(app: App): void {
    console.log("[MESSAGE_TRACKER] Setting up message event listener");

    // Debug Slack app URLs
    try {
      if (app && app.client) {
        app.client.auth
          .test()
          .then((response) => {
            if (response.ok) {
              console.log("==== CS-BOT INFO ====");
              console.log(`Bot name: ${response.bot_id}`);
              console.log(`Team: ${response.team}`);
              console.log(`User ID: ${response.user_id}`);
              console.log(`User name: ${response.user}`);
              console.log(`URL: ${response.url}`);
              console.log("=====================");
            } else {
              console.error("Failed to get bot info:", response.error);
            }
          })
          .catch((err) => {
            console.error("Error getting bot info:", err);
          });
      }
    } catch (error) {
      console.error("Error setting up bot info debug:", error);
    }

    // CRITICAL: Subscribe to ALL message events with more verbose debugging
    app.message(/.*/, async ({ message, say }) => {
      try {
        // --- START DEBUG LOG ---
        console.log(
          "[DEBUG] app.message handler triggered for message: ",
          JSON.stringify(message, null, 2)
        );
        // --- END DEBUG LOG ---

        // Debug more detailed message source information
        console.log(
          `[MESSAGE_TRACKER] Message event type: ${message.type || "unknown"}`
        );
        if (message && "channel_type" in message) {
          console.log(
            `[MESSAGE_TRACKER] Channel type: ${message.channel_type}`
          );
        }

        // Skip messages from bots and messages with subtypes
        if ("bot_id" in message || message.subtype) {
          // console.log(
          //   "[MESSAGE_TRACKER] Ignoring bot message or message with subtype"
          // );
          return;
        }

        // Log the message text, user info, and channel info
        // Using type assertion or optional chaining since these properties might not exist on all message types
        if (message && "text" in message) {
          console.log(`[MESSAGE_TRACKER] Message text: ${message.text}`);
        }
        if (message && "user" in message) {
          console.log(`[MESSAGE_TRACKER] Message from user: ${message.user}`);
        }
        if (message && "channel" in message) {
          console.log(
            `[MESSAGE_TRACKER] Message in channel: ${message.channel}`
          );

          // Check deduplication if we have necessary fields
          if ("ts" in message && "user" in message && "text" in message) {
            const channelId = message.channel as string;
            const userId = message.user as string;
            const messageTs = message.ts as string;
            const text = message.text as string;

            const { botManager } = require("./services/botManager");
            const alreadyProcessed = botManager.hasProcessedMessage(
              channelId,
              userId,
              messageTs,
              text
            );
            // --- START DEBUG LOG ---
            console.log(
              `[DEBUG] hasProcessedMessage check for ts=${messageTs}: ${alreadyProcessed}`
            );
            // --- END DEBUG LOG ---
            if (alreadyProcessed) {
              return; // Skip if already processed
            }
          }

          // Cross-reference with channel cache
          try {
            const { channelManager } = require("./services/channelManager");
            const channelInfo = channelManager.getChannelInfo(message.channel);
            if (channelInfo) {
              console.log(`[MESSAGE_TRACKER] FOUND MATCHING CHANNEL IN CACHE:`);
              if (channelInfo.businessChannelId === message.channel) {
                console.log(
                  `[MESSAGE_TRACKER] This is a BUSINESS channel for drill: ${channelManager.findDrillIdByChannelId(
                    message.channel
                  )}`
                );
              } else if (channelInfo.incidentChannelId === message.channel) {
                console.log(
                  `[MESSAGE_TRACKER] This is an INCIDENT channel for drill: ${channelManager.findDrillIdByChannelId(
                    message.channel
                  )}`
                );
              }
            } else {
              console.log(
                `[MESSAGE_TRACKER] Channel ${message.channel} NOT FOUND in channel cache`
              );
              // Dump all known channels for debugging
              channelManager.debugPrintAllChannels();
            }
          } catch (err) {
            console.error(
              "[MESSAGE_TRACKER] Error checking channel cache:",
              err
            );
          }
        }

        // Optionally respond to direct mentions for debugging
        if (
          message &&
          "text" in message &&
          typeof message.text === "string" &&
          message.text.includes("<@U08KRR2SJAZ>")
        ) {
          // Update with CS-Bot's user ID if needed
          try {
            console.log(
              "[MESSAGE_TRACKER] CS-Bot was mentioned, responding for debugging"
            );
            await say({
              text: `I received your message: "${message.text}". Channel ID: ${message.channel}`,
            });
          } catch (err) {
            console.error(
              "[MESSAGE_TRACKER] Error responding to mention:",
              err
            );
          }
        }

        // Update channel activity to help with adaptive polling
        if (message && "channel" in message) {
          try {
            const { botManager } = require("./services/botManager");
            botManager.updateChannelActivity(message.channel as string);
          } catch (err) {
            console.error(
              "[MESSAGE_TRACKER] Error updating channel activity:",
              err
            );
          }
        }

        // If this is a user message in a channel, manually forward to processUserMessage
        if (
          message &&
          "channel" in message &&
          "user" in message &&
          "text" in message &&
          !("bot_id" in message) &&
          !message.subtype
        ) {
          try {
            const { channelManager } = require("./services/channelManager");
            const channelInfo = channelManager.getChannelInfo(message.channel);
            // --- START DEBUG LOG ---
            console.log(
              `[DEBUG] Looked up channel ${
                message.channel
              }. Found channelInfo: ${!!channelInfo}`
            );
            // --- END DEBUG LOG ---

            if (channelInfo) {
              const drillId = channelManager.findDrillIdByChannelId(
                message.channel
              );
              // --- START DEBUG LOG ---
              console.log(
                `[DEBUG] Looked up drill ID for channel ${message.channel}. Found drillId: ${drillId}`
              );
              // --- END DEBUG LOG ---

              if (drillId) {
                const activeScenarios =
                  this.scenarioService.getAllActiveScenarios();
                const matchingScenario = activeScenarios.find(
                  (s) =>
                    s.businessChannelId === message.channel ||
                    s.incidentChannelId === message.channel
                );
                // --- START DEBUG LOG ---
                console.log(
                  `[DEBUG] Found matching scenario for channel ${
                    message.channel
                  }: ${!!matchingScenario}`
                );
                // --- END DEBUG LOG ---

                if (matchingScenario) {
                  // --- START DEBUG LOG ---
                  console.log(
                    `[DEBUG] >>> Calling scenarioService.processUserMessage for user ${matchingScenario.userId}`
                  );
                  // --- END DEBUG LOG ---
                  await this.scenarioService.processUserMessage(
                    matchingScenario.userId,
                    message.channel as string,
                    message.text as string
                  );
                  // --- START DEBUG LOG ---
                  console.log(
                    `[DEBUG] <<< Returned from scenarioService.processUserMessage for user ${matchingScenario.userId}`
                  );
                  // --- END DEBUG LOG ---
                } else {
                  // console.log(
                  //   `[MESSAGE_TRACKER] No matching active scenario found for channel ${message.channel}`
                  // );
                }
              }
            }
          } catch (err) {
            console.error(
              "[DEBUG] Error during message forwarding logic:", // Changed to DEBUG
              err
            );
          }
        }
      } catch (error) {
        console.error(
          "[DEBUG] Error in app.message wildcard handler:", // Changed to DEBUG
          error
        );
      }
    });

    console.log("[MESSAGE_TRACKER] Message event listener setup complete");
  }

  async startScenario(
    userEmail: string,
    scenarioId: string
  ): Promise<{
    businessChannelId: string;
    incidentChannelId: string;
  }> {
    console.log(
      `[MESSAGE_TRACKER] Starting scenario ${scenarioId} for user ${userEmail}`
    );

    const activeScenario = await this.scenarioService.startScenario(
      userEmail,
      scenarioId
    );

    console.log(
      `[MESSAGE_TRACKER] Scenario started successfully, user ID: ${activeScenario.userId}`
    );
    console.log(
      `[MESSAGE_TRACKER] Business channel: ${activeScenario.businessChannelId}`
    );
    console.log(
      `[MESSAGE_TRACKER] Incident channel: ${activeScenario.incidentChannelId}`
    );

    return {
      businessChannelId: activeScenario.businessChannelId,
      incidentChannelId: activeScenario.incidentChannelId,
    };
  }

  async endScenario(userId: string): Promise<void> {
    console.log(`[MESSAGE_TRACKER] Ending scenario for user ${userId}`);
    await this.scenarioService.endScenario(userId);
    console.log(`[MESSAGE_TRACKER] Scenario ended for user ${userId}`);
  }

  getActiveScenario(userId: string) {
    const scenario = this.scenarioService.getActiveScenario(userId);
    if (scenario) {
      console.log(`[MESSAGE_TRACKER] Found active scenario for user ${userId}`);
    } else {
      console.log(
        `[MESSAGE_TRACKER] No active scenario found for user ${userId}`
      );
    }
    return scenario;
  }

  getAllActiveScenarios() {
    const scenarios = this.scenarioService.getAllActiveScenarios();
    console.log(`[MESSAGE_TRACKER] All active scenarios: ${scenarios.length}`);
    return scenarios;
  }
}

// Create and export a single instance of MessageHandler
export const messageHandler = new MessageHandler();
