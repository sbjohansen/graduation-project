import { App } from "@slack/bolt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  authenticateToken,
  AuthRequest,
  requireAdmin,
} from "./middleware/auth";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import simulationRoutes from "./routes/simulationRoutes";
import { messageHandler } from "./slack/messageHandler";
import slackRoutes from "./slack/routes";
import { botManager } from "./slack/services/botManager";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Protected route example
app.get("/api/protected", authenticateToken, (req: AuthRequest, res) => {
  res.json({
    message: "This is a protected route",
    user: { id: req.user?.id, email: req.user?.email },
  });
});

// Admin-only protected route
app.get(
  "/api/admin",
  authenticateToken,
  requireAdmin,
  (req: AuthRequest, res) => {
    res.json({ message: "This is an admin-only route" });
  }
);

// Admin routes group
app.use("/api/admin", authenticateToken, requireAdmin, adminRoutes);

// Slack routes
app.use("/api/slack", slackRoutes);

// Simulation routes
app.use("/api/simulations", simulationRoutes);

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
      console.warn(
        "CS-Bot configuration is incomplete. Continuing without Slack integration."
      );
      return;
    }

    console.log("Initializing CS-Bot...");
    // Initialize CS-Bot (main bot)
    const csBotApp = new App({
      token: process.env.CS_BOT_TOKEN,
      signingSecret: process.env.CS_BOT_SIGNING_SECRET,
      socketMode: true,
      appToken: process.env.CS_BOT_APP_TOKEN,
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
      console.warn("Continuing without Slack integration.");
      return;
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
    console.warn("Continuing without Slack integration.");
  }
};

// Start the server
(async () => {
  try {
    // Initialize all bots
    await initializeBots().catch((error) => {
      console.error("Failed to initialize bots:", error);
      console.warn("Continuing without Slack integration.");
    });

    // Start the Express server
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (error: any) {
    console.error("❌ Error starting application:", error?.message || error);
    process.exit(1);
  }
})();
