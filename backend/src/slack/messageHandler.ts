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
        console.log(
          "[MESSAGE_TRACKER] ===== MESSAGE HANDLER TRIGGERED (app.message) ====="
        );
        console.log(
          "[MESSAGE_TRACKER] Received message event (via app.message):",
          JSON.stringify(message, null, 2)
        );

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
          console.log(
            "[MESSAGE_TRACKER] Ignoring bot message or message with subtype"
          );
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

            // Check if this message has already been processed
            const { botManager } = require("./services/botManager");
            if (
              botManager.hasProcessedMessage(channelId, userId, messageTs, text)
            ) {
              console.log(
                `[MESSAGE_TRACKER] Skipping already processed message with ts=${messageTs}`
              );
              return;
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
            // NOTE: We've already verified this message isn't a duplicate above,
            // so we can safely process it now
            console.log(
              "[MESSAGE_TRACKER] Manual message forwarding activated"
            );
            const { channelManager } = require("./services/channelManager");
            const channelInfo = channelManager.getChannelInfo(message.channel);

            if (channelInfo) {
              const drillId = channelManager.findDrillIdByChannelId(
                message.channel
              );
              if (drillId) {
                console.log(
                  `[MESSAGE_TRACKER] Processing message for drill: ${drillId}`
                );

                // Get active scenarios to cross-reference
                const activeScenarios =
                  this.scenarioService.getAllActiveScenarios();
                const matchingScenario = activeScenarios.find(
                  (s) =>
                    s.businessChannelId === message.channel ||
                    s.incidentChannelId === message.channel
                );

                if (matchingScenario) {
                  console.log(
                    `[MESSAGE_TRACKER] Found matching scenario, manually forwarding message`
                  );
                  await this.scenarioService.processUserMessage(
                    matchingScenario.userId,
                    message.channel as string,
                    message.text as string
                  );
                } else {
                  console.log(
                    `[MESSAGE_TRACKER] No matching active scenario found for channel ${message.channel}`
                  );
                }
              }
            }
          } catch (err) {
            console.error(
              "[MESSAGE_TRACKER] Error in manual message forwarding:",
              err
            );
          }
        }
      } catch (error) {
        console.error(
          "[MESSAGE_TRACKER] Error in message wildcard handler:",
          error
        );
      }
    });

    // Listen for all events for debugging - expanded to include more event types
    app.event(/.*/, async ({ event, client }) => {
      try {
        // Expanded list of relevant event types
        const relevantEventTypes = [
          "message",
          "channel_created",
          "member_joined_channel",
          "message.channels",
          "message.groups",
          "app_mention",
          "im_created",
          "channel_rename",
          "team_join",
        ];

        const eventType = event.type || "unknown";

        // For message events, always log them
        if (
          eventType === "message" ||
          (typeof eventType === "string" && eventType.startsWith("message."))
        ) {
          console.log("[MESSAGE_TRACKER] ===== MESSAGE EVENT TRIGGERED =====");
          console.log(
            `[MESSAGE_TRACKER] Received message event via app.event:`,
            JSON.stringify(event, null, 2)
          );

          // Check for channel info
          if ("channel" in event) {
            try {
              const { channelManager } = require("./services/channelManager");
              const channelInfo = channelManager.getChannelInfo(event.channel);
              if (channelInfo) {
                console.log(
                  `[MESSAGE_TRACKER] EVENT: Found channel info for ${event.channel}`
                );
                console.log(
                  `[MESSAGE_TRACKER] Associated drill: ${channelManager.findDrillIdByChannelId(
                    event.channel
                  )}`
                );
              }
            } catch (err) {
              console.error(
                "[MESSAGE_TRACKER] Error checking channel for event:",
                err
              );
            }
          }
        }
        // For other relevant events, log them
        else if (relevantEventTypes.includes(eventType)) {
          console.log(
            `[MESSAGE_TRACKER] ===== EVENT HANDLER: ${eventType} =====`
          );
          console.log(
            `[MESSAGE_TRACKER] Received ${eventType} event:`,
            JSON.stringify(event, null, 2)
          );
        }
      } catch (error) {
        console.error(
          "[MESSAGE_TRACKER] Error in global event handler:",
          error
        );
      }
    });

    // Listen specifically for message events
    app.event("message", async ({ event, client, say }) => {
      try {
        console.log(
          "[MESSAGE_TRACKER] ===== MESSAGE EVENT HANDLER TRIGGERED =====",
          new Date().toISOString()
        );
        console.log(
          "[MESSAGE_TRACKER] Received message event:",
          JSON.stringify(event, null, 2)
        );

        // Ignore bot messages and messages with subtypes
        if ("bot_id" in event || event.subtype) {
          console.log(
            "[MESSAGE_TRACKER] Ignoring bot message or message with subtype"
          );
          return;
        }

        const channelId = event.channel;

        // Make sure we have user and text properties
        if (!("user" in event) || !("text" in event)) {
          console.log(
            "[MESSAGE_TRACKER] Ignoring message without user or text properties"
          );
          return;
        }

        const userId = event.user as string;
        const text = event.text as string;
        const messageTs = event.ts as string;

        // Check if this message has already been processed using the botManager
        const { botManager } = require("./services/botManager");
        if (
          botManager.hasProcessedMessage(channelId, userId, messageTs, text)
        ) {
          console.log(
            `[MESSAGE_TRACKER] Skipping already processed message with ts=${messageTs}`
          );
          return;
        }

        console.log(
          `[MESSAGE_TRACKER] Processing message from user ${userId} in channel ${channelId}: "${text}"`
        );

        // Update channel activity to help with adaptive polling
        try {
          botManager.updateChannelActivity(channelId);
        } catch (err) {
          console.error(
            "[MESSAGE_TRACKER] Error updating channel activity:",
            err
          );
        }

        // Debug channel info
        try {
          const { channelManager } = require("./services/channelManager");
          console.log(
            `[MESSAGE_TRACKER] Checking channel cache for channel ${channelId}`
          );
          const channelInfo = channelManager.getChannelInfo(channelId);

          if (channelInfo) {
            console.log(`[MESSAGE_TRACKER] Found channel in cache`);
            console.log(
              `[MESSAGE_TRACKER] Business channel ID: ${channelInfo.businessChannelId}`
            );
            console.log(
              `[MESSAGE_TRACKER] Incident channel ID: ${channelInfo.incidentChannelId}`
            );
          } else {
            console.log(`[MESSAGE_TRACKER] Channel not found in cache`);

            // Debug channel info from Slack API
            try {
              const csBot = require("./services/botManager").botManager.getBot(
                "cs-bot"
              );
              if (csBot) {
                console.log(
                  `[MESSAGE_TRACKER] Fetching channel info from Slack API`
                );
                const channelInfo = await csBot.app.client.conversations.info({
                  channel: channelId,
                });

                if (channelInfo.ok) {
                  console.log(`[MESSAGE_TRACKER] Channel API info:`);
                  console.log(`- Name: ${channelInfo.channel.name}`);
                  console.log(
                    `- Is Private: ${channelInfo.channel.is_private}`
                  );
                  console.log(`- Is Member: ${channelInfo.channel.is_member}`);
                } else {
                  console.log(
                    `[MESSAGE_TRACKER] Failed to get channel API info: ${channelInfo.error}`
                  );
                }
              }
            } catch (err) {
              console.error(
                `[MESSAGE_TRACKER] Error fetching channel info from API:`,
                err
              );
            }
          }
        } catch (err) {
          console.error(`[MESSAGE_TRACKER] Error checking channel cache:`, err);
        }

        // Check if this is a message in an active scenario channel
        const activeScenarios = this.scenarioService.getAllActiveScenarios();
        console.log(
          `[MESSAGE_TRACKER] Active scenarios: ${activeScenarios.length}`
        );

        if (activeScenarios.length > 0) {
          console.log(
            `[MESSAGE_TRACKER] Active scenario user IDs: ${activeScenarios
              .map((s) => s.userId)
              .join(", ")}`
          );
          console.log(
            `[MESSAGE_TRACKER] Active scenario channel IDs: ${activeScenarios
              .map(
                (s) =>
                  `business=${s.businessChannelId}, incident=${s.incidentChannelId}`
              )
              .join(" | ")}`
          );
        }

        // First try to find by channel ID since that's more reliable
        const relevantScenarioByChannel = activeScenarios.find(
          (scenario) =>
            scenario.businessChannelId === channelId ||
            scenario.incidentChannelId === channelId
        );

        // Then try to find by user ID as a backup
        const relevantScenarioByUser = activeScenarios.find(
          (scenario) => scenario.userId === userId
        );

        let relevantScenario =
          relevantScenarioByChannel || relevantScenarioByUser;

        if (!relevantScenario) {
          console.log(
            `[MESSAGE_TRACKER] No active scenario found for channel ${channelId} or user ${userId}`
          );

          // Check all channels to see if there's any match
          if (activeScenarios.length > 0) {
            console.log("[MESSAGE_TRACKER] Checking channel matches manually:");
            for (const scenario of activeScenarios) {
              console.log(
                `[MESSAGE_TRACKER] Comparing: business=${scenario.businessChannelId}==${channelId}, incident=${scenario.incidentChannelId}==${channelId}`
              );
              console.log(
                `[MESSAGE_TRACKER] Match business: ${
                  scenario.businessChannelId === channelId
                }`
              );
              console.log(
                `[MESSAGE_TRACKER] Match incident: ${
                  scenario.incidentChannelId === channelId
                }`
              );
            }
          }

          // Last attempt - try to respond directly in this channel
          try {
            await say(
              `[DEBUG] I received your message but couldn't find an active scenario for this channel. Channel ID: ${channelId}`
            );
          } catch (err) {
            console.error(
              `[MESSAGE_TRACKER] Error sending debug response:`,
              err
            );
          }

          return;
        }

        console.log(
          `[MESSAGE_TRACKER] Found relevant scenario for user ${relevantScenario.userId} (email: ${relevantScenario.userEmail})`
        );
        console.log(
          `[MESSAGE_TRACKER] Channel match: Business=${
            relevantScenario.businessChannelId === channelId
          }, Incident=${relevantScenario.incidentChannelId === channelId}`
        );

        // Additional check to debug user ID mapping
        if (relevantScenario.userId !== userId && relevantScenarioByChannel) {
          console.log(
            `[MESSAGE_TRACKER] Warning: Message user ID (${userId}) doesn't match scenario user ID (${relevantScenario.userId})`
          );
          // Try to update the user ID mapping
          console.log(
            `[MESSAGE_TRACKER] Updating user ID from ${relevantScenario.userId} to ${userId}`
          );
          this.scenarioService.updateUserId(relevantScenario.userId, userId);

          // Also update the scenario object's userId
          relevantScenario.userId = userId;
        }

        // Process the message through the scenario service
        console.log(`[MESSAGE_TRACKER] Sending message to processUserMessage`);
        await this.scenarioService.processUserMessage(
          relevantScenario.userId,
          channelId,
          text
        );
        console.log(`[MESSAGE_TRACKER] Message processing complete`);
      } catch (error) {
        console.error("[MESSAGE_TRACKER] Error handling message event:", error);
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

export const messageHandler = new MessageHandler();
