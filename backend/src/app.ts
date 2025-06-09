import { App, LogLevel } from "@slack/bolt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import simulationRoutes from "./routes/simulationRoutes";
import { messageHandler } from "./slack/messageHandler";
import { botManager } from "./slack/services/botManager";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/simulations", simulationRoutes);

// Add a diagnostic endpoint for Slack events
app.post("/api/slack/debug-events", express.json(), (req, res) => {
  console.log("Received Slack event:", JSON.stringify(req.body, null, 2));

  // Check if this is a URL verification challenge
  if (req.body.type === "url_verification") {
    console.log("Received URL verification challenge");
    return res.json({ challenge: req.body.challenge });
  }

  // Acknowledge the event
  res.status(200).send("Event received");
});

// Add debugging endpoint for channel checks
app.get("/api/debug/channels", (req, res) => {
  try {
    const { channelManager } = require("./slack/services/channelManager");

    // If a channel ID was provided, look it up specifically
    const channelId = req.query.channelId;
    if (channelId) {
      console.log(`Debug request for channel ID: ${channelId}`);
      const channelInfo = channelManager.getChannelInfo(channelId as string);

      if (channelInfo) {
        return res.json({
          found: true,
          channelInfo,
        });
      } else {
        return res.json({
          found: false,
          message: `No channel info found for ID: ${channelId}`,
        });
      }
    }

    // Otherwise print all channels
    channelManager.debugPrintAllChannels();

    // Get all active scenarios
    const scenarioService = require("./slack/messageHandler").messageHandler
      .scenarioService;
    const activeScenarios = scenarioService.getAllActiveScenarios();

    return res.json({
      activeChannelsCount: channelManager.activeChannels?.size || 0,
      activeScenariosCount: activeScenarios.length,
      activeScenarios: activeScenarios.map((scenario: any) => ({
        userId: scenario.userId,
        userEmail: scenario.userEmail,
        scenarioId: scenario.scenario.scenarioId,
        businessChannelId: scenario.businessChannelId,
        incidentChannelId: scenario.incidentChannelId,
        messageHistoryCount: scenario.messageHistory.length,
      })),
    });
  } catch (error: unknown) {
    console.error("Error in debug endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json({ error: "Debug endpoint error", details: errorMessage });
  }
});

// Add debug endpoint to test message sending to channels
app.post("/api/debug/send-message", express.json(), async (req, res) => {
  try {
    const { channelId, message } = req.body;

    if (!channelId || !message) {
      return res
        .status(400)
        .json({ error: "Both channelId and message are required" });
    }

    const { botManager } = require("./slack/services/botManager");
    const csBot = botManager.getBot("cs-bot");

    if (!csBot) {
      return res.status(500).json({ error: "CS-Bot not found" });
    }

    console.log(`Debug: Sending test message to channel ${channelId}`);

    // Verify the channel exists
    let channelInfo;
    try {
      channelInfo = await csBot.app.client.conversations.info({
        channel: channelId,
      });

      console.log(
        `Debug: Channel info: ${JSON.stringify(
          channelInfo?.channel?.name || "unknown"
        )}`
      );
    } catch (error: unknown) {
      console.error("Error verifying channel:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res.status(400).json({
        error: "Channel verification failed",
        details: errorMessage,
      });
    }

    // Send test message
    try {
      const result = await csBot.app.client.chat.postMessage({
        channel: channelId,
        text: `[DEBUG] ${message}`,
        username: "Debug Bot",
      });

      return res.json({
        success: true,
        messageTs: result.ts,
        channel: channelId,
      });
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        error: "Failed to send message",
        details: errorMessage,
      });
    }
  } catch (error: unknown) {
    console.error("Error in send-message endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json({ error: "Debug endpoint error", details: errorMessage });
  }
});

// Add debug endpoint to check inactivity timer status
app.get("/api/debug/inactivity-timers", async (req, res) => {
  try {
    const scenarioService = require("./slack/messageHandler").messageHandler
      .scenarioService;

    const activeScenarios = scenarioService.getAllActiveScenarios();
    const allTimers = scenarioService.getAllInactivityTimers();

    const timerStatus = activeScenarios.map((scenario: any) => {
      const timerInfo = scenarioService.getInactivityTimerStatus(scenario.userId);
      return {
        userId: scenario.userId,
        userEmail: scenario.userEmail,
        scenarioStatus: scenario.status,
        hasInactivityTimer: timerInfo.hasTimer,
        timeoutMs: timerInfo.timeoutMs,
        timeoutSeconds: timerInfo.timeoutMs / 1000,
      };
    });

    return res.json({
      totalActiveScenarios: activeScenarios.length,
      totalActiveTimers: allTimers.length,
      scenarios: timerStatus,
      allTimerUserIds: allTimers,
    });
  } catch (error: unknown) {
    console.error("Error in inactivity timer debug endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json({ error: "Inactivity timer debug error", details: errorMessage });
  }
});

// Check if CS-Bot configuration is present
const validateCSBotConfig = () => {
  const token = process.env.CS_BOT_TOKEN;
  const signingSecret = process.env.CS_BOT_SIGNING_SECRET;
  const appToken = process.env.CS_BOT_APP_TOKEN;

  if (!token || !signingSecret || !appToken) {
    console.error("\n=== CS-Bot Configuration Error ===");
    if (!token) console.error("❌ CS_BOT_TOKEN is missing");
    if (!signingSecret) console.error("❌ CS_BOT_SIGNING_SECRET is missing");
    if (!appToken) console.error("❌ CS_BOT_APP_TOKEN is missing");

    console.error("\nPlease ensure all CS-Bot environment variables are set:");
    console.error("1. Go to your Slack App at https://api.slack.com/apps");
    console.error(
      "2. For CS_BOT_TOKEN: Copy from 'OAuth & Permissions' > 'Bot User OAuth Token'"
    );
    console.error(
      "3. For CS_BOT_SIGNING_SECRET: Copy from 'Basic Information' > 'Signing Secret'"
    );
    console.error(
      "4. For CS_BOT_APP_TOKEN: Generate a new token in 'Basic Information' > 'App-Level Tokens'"
    );
    console.error("   - Add the 'connections:write' scope");
    console.error("   - The token will start with 'xapp-'");

    return false;
  }

  // Validate app token format
  if (!appToken.startsWith("xapp-")) {
    console.warn(
      "⚠️ CS_BOT_APP_TOKEN does not start with 'xapp-'. This may be incorrect."
    );
    console.warn(
      "App tokens should begin with 'xapp-' and can be generated in your Slack App's 'Basic Information' page."
    );
  }

  return true;
};

// Initialize and register bots
const initializeBots = async () => {
  try {
    // First, validate CS-Bot configuration
    if (!validateCSBotConfig()) {
      throw new Error(
        "CS-Bot configuration is incomplete. Please check the error messages above."
      );
    }

    console.log("Initializing CS-Bot...");
    // Initialize CS-Bot (main bot)
    const csBotApp = new App({
      token: process.env.CS_BOT_TOKEN,
      signingSecret: process.env.CS_BOT_SIGNING_SECRET,
      socketMode: true,
      appToken: process.env.CS_BOT_APP_TOKEN,
      logLevel: LogLevel.DEBUG,
    });

    // Debug bot token scopes
    console.log("==== VERIFYING BOT SCOPES ====");
    try {
      console.log("Requesting bot token info to check scopes...");
      csBotApp.client.auth
        .test()
        .then((response) => {
          if (response.ok) {
            console.log("Bot connection verified successfully");

            // Check token scopes
            csBotApp.client.auth
              .test({ token: process.env.CS_BOT_TOKEN })
              .then((tokenInfo) => {
                console.log("Bot token info:", tokenInfo);
              });

            // List all connected channels
            csBotApp.client.users
              .conversations({
                token: process.env.CS_BOT_TOKEN,
                types: "public_channel,private_channel",
              })
              .then((channels) => {
                console.log(
                  `Bot is a member of ${
                    channels.channels?.length || 0
                  } channels`
                );
                if (channels.channels) {
                  channels.channels.forEach((channel) => {
                    console.log(`- Channel: ${channel.name} (${channel.id})`);
                  });
                }
              })
              .catch((err) => {
                console.error("Error listing channels:", err);
                console.error(
                  "This indicates missing 'channels:read' or 'groups:read' scope"
                );
              });
          } else {
            console.error("Bot token validation failed:", response.error);
          }
        })
        .catch((err) => {
          console.error("Error testing bot auth:", err);
          if (err.message && err.message.includes("missing_scope")) {
            console.error(
              "MISSING SCOPES DETECTED. Please add the following scopes to your bot:"
            );
            console.error(
              "Required scopes: channels:read, channels:write, channels:manage, groups:read, groups:write, chat:write, chat:write.public, im:read, im:write, mpim:read, mpim:write, users:read, users:read.email"
            );
          }
        });
    } catch (error) {
      console.error("Error in bot token verification:", error);
    }
    console.log("===========================");

    // General error handler for debugging
    csBotApp.error(async (error) => {
      console.error("CS-Bot ERROR:", error);

      // Try to reconnect if this is a socket-related issue
      if (
        typeof error.message === "string" &&
        (error.message.includes("socket") ||
          error.message.includes("connection"))
      ) {
        console.log("Attempting to reconnect CS-Bot socket...");
        try {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await csBotApp.start();
          console.log("Successfully reconnected CS-Bot socket");
        } catch (reconnectError) {
          console.error("Failed to reconnect CS-Bot socket:", reconnectError);
        }
      }
    });

    // Register CS-Bot
    botManager.registerBot("cs-bot", csBotApp);

    // Setup message handling using CS-Bot
    messageHandler.setupMessageHandling(csBotApp);

    // Start CS-Bot
    try {
      await csBotApp.start();
      console.log("✅ CS-Bot is running!");
    } catch (error: any) {
      console.error("Failed to start CS-Bot:", error);
      if (
        typeof error.message === "string" &&
        error.message.includes("An API error occurred: invalid_auth")
      ) {
        console.error(
          "❌ Authentication failed. Please check that your CS_BOT_TOKEN is valid and has the necessary scopes."
        );
      }
      if (
        typeof error.message === "string" &&
        error.message.includes("You provided an invalid app_token")
      ) {
        console.error(
          "❌ App token is invalid. Make sure CS_BOT_APP_TOKEN starts with 'xapp-' and is valid."
        );
      }
      throw error;
    }

    // Function to initialize a character bot if env vars are present
    const initBot = async (name: string, prefix: string) => {
      const token = process.env[`${prefix}_BOT_TOKEN`];
      const signingSecret = process.env[`${prefix}_BOT_SIGNING_SECRET`];
      const appToken = process.env[`${prefix}_BOT_APP_TOKEN`];

      if (token && signingSecret && appToken) {
        console.log(`Initializing ${name} bot...`);
        try {
          const botApp = new App({
            token,
            signingSecret,
            socketMode: true,
            appToken,
          });

          botManager.registerBot(name.toLowerCase(), botApp);
          await botApp.start();
          console.log(`✅ ${name} bot is running!`);
          return true;
        } catch (error: any) {
          console.error(
            `Failed to initialize ${name} bot:`,
            error.message || error
          );
          console.warn(`⚠️ ${name} bot will not be available for scenarios.`);
          return false;
        }
      }
      return false;
    };

    // Character bots to initialize
    const characterBots = [
      { name: "pete", prefix: "PETE" },
      { name: "hanna", prefix: "HANNA" },
      { name: "john", prefix: "JOHN" },
      { name: "peter", prefix: "PETER" },
      { name: "mike", prefix: "MIKE" },
      { name: "lazar", prefix: "LAZAR" },
    ];

    // Initialize character bots
    console.log("Initializing character bots...");
    const botResults = await Promise.all(
      characterBots.map((bot) => initBot(bot.name, bot.prefix))
    );

    const successfulBots = botResults.filter((result) => result).length;
    console.log(
      `Successfully initialized ${successfulBots}/${characterBots.length} character bots.`
    );

    if (successfulBots === 0) {
      console.warn(
        "⚠️ No character bots were initialized. The simulation will still work, but CS-Bot will handle all messages."
      );
    }

    console.log("Bot initialization complete!");
  } catch (error: any) {
    console.error("Error initializing bots:", error?.message || error);
    throw error;
  }
};

// Start the server
(async () => {
  try {
    // Initialize all bots
    await initializeBots();

    // Check if CS-Bot configuration is present
    const csBotConfig =
      process.env.CS_BOT_TOKEN &&
      process.env.CS_APP_TOKEN &&
      process.env.CS_SIGNING_SECRET;

    if (csBotConfig) {
      console.log("Initializing CS-Bot with Socket Mode");

      // Initialize the bot manager and CS-Bot
      const { botManager } = require("./slack/services/botManager");
      const csBot = botManager.getBot("cs-bot");

      // Start the CS-Bot
      if (csBot) {
        // Initialize the CS-Bot with message handling
        const { MessageHandler } = require("./slack/messageHandler");
        const messageHandler = new MessageHandler();
        messageHandler.setupMessageHandling(csBot.app);

        // Start channel monitoring as a fallback for message events
        console.log(
          "Starting active channel monitoring as fallback for message events"
        );
        botManager.startChannelMonitoring();

        // Check for any existing channels to monitor
        setTimeout(async () => {
          try {
            // Get all active scenarios and register their channels for monitoring
            const {
              channelManager,
            } = require("./slack/services/channelManager");

            // Get existing channels from channel manager
            try {
              // Use debug method instead of accessing private property directly
              channelManager.debugPrintAllChannels();

              // Find all channel info objects
              const allChannelInfos = [];

              // We'll use the getChannelInfo method with our existing logic to look for channel IDs
              // First, get all active scenarios
              const { messageHandler } = require("./slack/messageHandler");
              const activeScenarios =
                messageHandler.scenarioService.getAllActiveScenarios();

              console.log(`Found ${activeScenarios.length} active scenarios`);

              // Register channels from active scenarios
              for (const scenario of activeScenarios) {
                if (scenario.businessChannelId) {
                  console.log(
                    `Registering business channel ${scenario.businessChannelId} for monitoring`
                  );
                  botManager.monitorChannel(scenario.businessChannelId);
                }

                if (scenario.incidentChannelId) {
                  console.log(
                    `Registering incident channel ${scenario.incidentChannelId} for monitoring`
                  );
                  botManager.monitorChannel(scenario.incidentChannelId);
                }
              }
            } catch (err) {
              console.error(
                "Error setting up channel monitoring for existing channels:",
                err
              );
            }
          } catch (err) {
            console.error(
              "Error setting up channel monitoring for existing channels:",
              err
            );
          }
        }, 5000); // Wait 5 seconds after startup before checking existing channels

        console.log("CS-Bot initialized successfully");
      } else {
        console.warn(
          "CS-Bot configuration is present but bot initialization failed"
        );
      }
    } else {
      console.warn("CS-Bot configuration missing, skipping bot initialization");
    }

    // Start the Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("❌ Error starting application:", error?.message || error);
    process.exit(1);
  }
})();
