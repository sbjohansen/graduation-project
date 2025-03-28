import express from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { botManager } from "./services/botManager";
import { channelManager } from "./services/channelManager";
import { BotConfig } from "./types/botConfig";

const router = express.Router();

// Health check endpoint for Slack integration
router.get("/health", authenticateToken, (req: AuthRequest, res) => {
  res.json({ status: "ok", message: "Slack integration is running" });
});

// Create a new bot
router.post("/bots", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const botConfig: BotConfig = req.body;
    const bot = await botManager.createBot(botConfig);
    res.json({ success: true, bot });
  } catch (error) {
    console.error("Error creating bot:", error);
    res.status(500).json({ error: "Failed to create bot" });
  }
});

// Start a bot
router.post(
  "/bots/:botId/start",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      await botManager.startBot(req.params.botId);
      res.json({ success: true, message: "Bot started successfully" });
    } catch (error) {
      console.error("Error starting bot:", error);
      res.status(500).json({ error: "Failed to start bot" });
    }
  }
);

// Stop a bot
router.post(
  "/bots/:botId/stop",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      await botManager.stopBot(req.params.botId);
      res.json({ success: true, message: "Bot stopped successfully" });
    } catch (error) {
      console.error("Error stopping bot:", error);
      res.status(500).json({ error: "Failed to stop bot" });
    }
  }
);

// Get all bots
router.get("/bots", authenticateToken, (req: AuthRequest, res) => {
  const bots = botManager.getAllBots();
  res.json({ success: true, bots });
});

// Get a specific bot
router.get("/bots/:botId", authenticateToken, (req: AuthRequest, res) => {
  const bot = botManager.getBot(req.params.botId);
  if (!bot) {
    return res.status(404).json({ error: "Bot not found" });
  }
  res.json({ success: true, bot });
});

// Send a message using a specific bot
router.post(
  "/bots/:botId/send-message",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { channel, message } = req.body;
      if (!channel || !message) {
        return res
          .status(400)
          .json({ error: "Channel and message are required" });
      }

      await botManager.sendMessage(req.params.botId, channel, message);
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

// Create drill channels and invite user
router.post(
  "/drills/:drillId/channels",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { drillId } = req.params;
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(400).json({ error: "User email not found" });
      }

      const channelInfo = await channelManager.createDrillChannels(
        userEmail,
        drillId
      );
      res.json({ success: true, channelInfo });
    } catch (error) {
      console.error("Error creating drill channels:", error);
      res.status(500).json({ error: "Failed to create drill channels" });
    }
  }
);

// Delete drill channels
router.delete(
  "/drills/:drillId/channels",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { drillId } = req.params;
      const { businessChannelId, incidentChannelId } = req.body;

      if (!businessChannelId || !incidentChannelId) {
        return res.status(400).json({ error: "Channel IDs are required" });
      }

      await channelManager.deleteDrillChannels(
        businessChannelId,
        incidentChannelId
      );
      res.json({
        success: true,
        message: "Drill channels deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting drill channels:", error);
      res.status(500).json({ error: "Failed to delete drill channels" });
    }
  }
);

export default router;
