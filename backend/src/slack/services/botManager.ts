import { App, AppOptions, LogLevel } from "@slack/bolt";
import { botConfigs } from "../config/bots";
import { BotConfig, BotInstance } from "../types/botConfig";

// Define interface for Slack message structure
interface SlackMessage {
  type?: string;
  user?: string;
  text?: string;
  ts?: string;
  bot_id?: string;
  subtype?: string;
  channel?: string;
  team?: string;
  [key: string]: any; // Allow for other properties
}

class BotManager {
  private bots: Map<string, BotInstance> = new Map();
  private monitoredChannels: Set<string> = new Set();
  private channelCheckInterval: NodeJS.Timeout | null = null;

  // Add message tracking to prevent duplicates
  private processedMessages: Map<string, number> = new Map();
  private readonly MESSAGE_EXPIRY_MS = 60 * 1000; // Clear processed messages after 1 minute

  // Channel activity tracking for adaptive polling
  private channelLastActivity: Map<string, number> = new Map();
  private readonly BASE_POLLING_INTERVAL = 15000; // Base polling interval: 15 seconds
  private readonly ACTIVE_POLLING_INTERVAL = 5000; // More frequent polling for active channels: 5 seconds
  private readonly ACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes - channels with activity within this time are considered "active"

  constructor() {
    this.initializeBots();

    // Set up periodic cleanup of message tracking
    setInterval(() => this.cleanupProcessedMessages(), 30 * 1000); // Cleanup every 30 seconds
  }

  /**
   * Track processed messages to prevent duplicates
   */
  hasProcessedMessage(
    channelId: string,
    userId: string,
    ts: string,
    text: string
  ): boolean {
    const messageKey = `${channelId}:${userId}:${ts}`;
    const now = Date.now();

    if (this.processedMessages.has(messageKey)) {
      return true;
    }

    // Store the message with current timestamp
    this.processedMessages.set(messageKey, now);
    return false;
  }

  /**
   * Clean up old processed messages
   */
  private cleanupProcessedMessages(): void {
    const now = Date.now();

    for (const [key, timestamp] of this.processedMessages.entries()) {
      if (now - timestamp > this.MESSAGE_EXPIRY_MS) {
        this.processedMessages.delete(key);
      }
    }
  }

  private async initializeBots() {
    for (const config of botConfigs) {
      try {
        await this.createBot(config);
        console.log(`Bot ${config.name} initialized successfully`);
      } catch (error) {
        console.error(`Failed to initialize bot ${config.name}:`, error);
      }
    }
  }

  async createBot(config: BotConfig): Promise<BotInstance> {
    // Validate required environment variables
    if (!config.botToken || !config.signingSecret || !config.appToken) {
      throw new Error(`Missing required configuration for bot ${config.name}`);
    }

    console.log(`Creating bot ${config.name} with Socket Mode enabled`);

    // Make sure the app token starts with xapp-
    if (!config.appToken.startsWith("xapp-")) {
      console.warn(
        `WARNING: App token for ${config.name} does not start with 'xapp-'. This may cause Socket Mode issues.`
      );
    }

    // Create the app options with socket mode configuration
    const appOptions: AppOptions = {
      token: config.botToken,
      signingSecret: config.signingSecret,
      socketMode: true,
      appToken: config.appToken,
      // Add more detailed logging to help diagnose socket mode issues
      logLevel: LogLevel.DEBUG,
    };

    const app = new App(appOptions);

    const botInstance: BotInstance = {
      config,
      app,
      isActive: false,
    };

    this.bots.set(config.id, botInstance);
    return botInstance;
  }

  /**
   * Register a bot directly with an App instance
   */
  registerBot(botId: string, app: App): void {
    console.log(`Registering bot ${botId} with existing App instance`);

    // Create a minimal bot instance
    const botInstance: BotInstance = {
      config: {
        id: botId,
        name: botId,
        botToken: "registered-directly", // Placeholder, as the app is already configured
        signingSecret: "registered-directly", // Placeholder
        appToken: "registered-directly", // Placeholder
        role: botId === "cs-bot" ? "system" : "character", // Set appropriate role
      },
      app,
      isActive: true, // Assume it's active since it's being registered directly
    };

    // Add error handling for socket mode connection issues
    app.error(async (error: Error) => {
      console.error(`Socket Mode ERROR for bot ${botId}:`, error);
      // If this is a socket mode connection issue, try to reconnect
      if (
        typeof error.message === "string" &&
        (error.message.includes("socket") ||
          error.message.includes("connection") ||
          error.message.includes("connect"))
      ) {
        console.log(`Attempting to reconnect ${botId} socket...`);
        try {
          // Give a short delay before trying to reconnect
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await app.start();
          console.log(`Successfully reconnected ${botId} socket`);
        } catch (reconnectError) {
          console.error(`Failed to reconnect ${botId} socket:`, reconnectError);
        }
      }
    });

    this.bots.set(botId, botInstance);
    console.log(`Bot ${botId} registered directly`);
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    try {
      console.log(`Starting bot ${bot.config.name}...`);
      await bot.app.start();
      bot.isActive = true;
      console.log(`⚡️ Bot ${bot.config.name} is running!`);

      // Add error handling for socket mode after start
      bot.app.error(async (error: Error) => {
        console.error(`Socket Mode ERROR for bot ${botId}:`, error);
        // If this is a socket mode connection issue, try to reconnect
        if (
          typeof error.message === "string" &&
          (error.message.includes("socket") ||
            error.message.includes("connection") ||
            error.message.includes("connect"))
        ) {
          console.log(`Attempting to reconnect ${botId} socket...`);
          try {
            // Give a short delay before trying to reconnect
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await bot.app.start();
            console.log(`Successfully reconnected ${botId} socket`);
          } catch (reconnectError) {
            console.error(
              `Failed to reconnect ${botId} socket:`,
              reconnectError
            );
          }
        }
      });
    } catch (error) {
      console.error(`Error starting bot ${bot.config.name}:`, error);
      throw error;
    }
  }

  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    try {
      await bot.app.stop();
      bot.isActive = false;
      console.log(`Bot ${bot.config.name} stopped`);
    } catch (error) {
      console.error(`Error stopping bot ${bot.config.name}:`, error);
      throw error;
    }
  }

  getBot(botId: string): BotInstance | undefined {
    return this.bots.get(botId);
  }

  getAllBots(): BotInstance[] {
    return Array.from(this.bots.values());
  }

  async sendMessage(
    botId: string,
    channel: string,
    message: string
  ): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    try {
      await bot.app.client.chat.postMessage({
        channel,
        text: message,
      });
    } catch (error) {
      console.error(
        `Error sending message from bot ${bot.config.name}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Start actively monitoring channels for messages
   * This is a fallback method when event subscriptions aren't working properly
   */
  startChannelMonitoring() {
    if (this.channelCheckInterval) {
      console.log("Channel monitoring already active");
      return;
    }

    console.log("[CHANNEL_MONITOR] Starting adaptive channel monitoring");

    // Check all channels using adaptive polling strategy
    this.channelCheckInterval = setInterval(() => {
      this.checkActiveChannels(); // Check actively used channels more frequently
    }, this.ACTIVE_POLLING_INTERVAL);

    // Also set up a less frequent check for all channels
    setInterval(() => {
      this.checkAllMonitoredChannels();
    }, this.BASE_POLLING_INTERVAL);
  }

  /**
   * Stop channel monitoring
   */
  stopChannelMonitoring() {
    if (this.channelCheckInterval) {
      clearInterval(this.channelCheckInterval);
      this.channelCheckInterval = null;
      console.log("[CHANNEL_MONITOR] Stopped active channel monitoring");
    }
  }

  /**
   * Add a channel to be actively monitored for messages
   */
  monitorChannel(channelId: string) {
    if (!this.monitoredChannels.has(channelId)) {
      this.monitoredChannels.add(channelId);
      // Mark as active when first added
      this.channelLastActivity.set(channelId, Date.now());
      console.log(`[CHANNEL_MONITOR] Now monitoring channel: ${channelId}`);

      // Start monitoring if not already started
      if (!this.channelCheckInterval) {
        this.startChannelMonitoring();
      }
    }
  }

  /**
   * Stop monitoring a specific channel
   */
  stopMonitoringChannel(channelId: string) {
    if (this.monitoredChannels.has(channelId)) {
      this.monitoredChannels.delete(channelId);
      console.log(`[CHANNEL_MONITOR] Stopped monitoring channel: ${channelId}`);

      // If no more channels to monitor, stop the interval
      if (this.monitoredChannels.size === 0) {
        this.stopChannelMonitoring();
      }
    }
  }

  /**
   * Update channel activity timestamp
   */
  updateChannelActivity(channelId: string) {
    this.channelLastActivity.set(channelId, Date.now());
  }

  /**
   * Check only recently active channels
   */
  private async checkActiveChannels() {
    if (this.monitoredChannels.size === 0) {
      return;
    }

    const csBot = this.getBot("cs-bot");
    if (!csBot) {
      return;
    }

    const now = Date.now();
    const activeChannels: string[] = [];

    // Find channels with recent activity
    for (const [
      channelId,
      lastActivity,
    ] of this.channelLastActivity.entries()) {
      if (
        now - lastActivity < this.ACTIVITY_THRESHOLD &&
        this.monitoredChannels.has(channelId)
      ) {
        activeChannels.push(channelId);
      }
    }

    if (activeChannels.length === 0) {
      return; // No active channels to check
    }

    // Only log occasionally to avoid console spam
    if (Math.random() < 0.05) {
      console.log(
        `[CHANNEL_MONITOR] Checking ${activeChannels.length} active channels`
      );
    }

    // Check up to 3 active channels per cycle to avoid rate limits
    const channelsToCheck = activeChannels.slice(0, 3);

    for (const channelId of channelsToCheck) {
      await this.checkSingleChannel(channelId, csBot);
    }
  }

  /**
   * Check a single channel for new messages
   */
  private async checkSingleChannel(channelId: string, csBot: BotInstance) {
    try {
      // Fetch recent messages from the channel
      const result = await csBot.app.client.conversations.history({
        channel: channelId,
        limit: 3, // Reduced from 5 to 3 to minimize data transfer
      });

      if (!result.ok) {
        console.error(
          `[CHANNEL_MONITOR] Error fetching messages from channel ${channelId}: ${result.error}`
        );
        return;
      }

      // Process messages if any exist
      if (result.messages && result.messages.length > 0) {
        // Process only messages that haven't been processed yet
        // and aren't from bots
        const newUserMessages = result.messages
          .filter(
            (msg: SlackMessage) =>
              !msg.bot_id &&
              !msg.subtype &&
              msg.ts &&
              msg.user &&
              msg.text &&
              !this.hasProcessedMessage(
                channelId,
                msg.user,
                msg.ts,
                msg.text || ""
              )
          )
          .reverse(); // Process oldest messages first

        if (newUserMessages.length > 0) {
          console.log(
            `[CHANNEL_MONITOR] Found ${newUserMessages.length} new messages in channel ${channelId}`
          );

          // Mark this channel as active
          this.updateChannelActivity(channelId);

          // Process each new message
          for (const msg of newUserMessages as SlackMessage[]) {
            // Directly handle the message by emitting it through the event handler
            try {
              console.log(
                `[CHANNEL_MONITOR] Processing message: "${msg.text}" from user ${msg.user}`
              );

              // Get a reference to the message handler to process the message
              const { messageHandler } = require("../messageHandler");

              // Use the scenario service directly
              await messageHandler.scenarioService.processUserMessage(
                msg.user as string,
                channelId,
                msg.text as string
              );

              // Confirm we processed the message
              console.log(
                `[CHANNEL_MONITOR] Successfully processed message from user ${msg.user}`
              );
            } catch (err) {
              console.error(`[CHANNEL_MONITOR] Error processing message:`, err);
            }
          }
        }
      }
    } catch (error) {
      console.error(
        `[CHANNEL_MONITOR] Error checking channel ${channelId}:`,
        error
      );
    }
  }

  /**
   * Check for new messages in all monitored channels - runs less frequently as a backup
   */
  private async checkAllMonitoredChannels() {
    if (this.monitoredChannels.size === 0) {
      return;
    }

    const csBot = this.getBot("cs-bot");
    if (!csBot) {
      console.error(
        "[CHANNEL_MONITOR] CS-Bot not found, cannot monitor channels"
      );
      return;
    }

    // Log infrequently to avoid console spam
    if (Math.random() < 0.2) {
      console.log(
        `[CHANNEL_MONITOR] Performing full check of all ${this.monitoredChannels.size} channels`
      );
    }

    // Convert to array so we can take a subset
    const allChannels = Array.from(this.monitoredChannels);

    // Check only a portion of channels each time (5 max) to reduce API load
    const channelsToCheck = allChannels.slice(0, 5);

    for (const channelId of channelsToCheck) {
      // Don't check channels that were just checked by the active checker
      const lastActivity = this.channelLastActivity.get(channelId) || 0;
      const now = Date.now();

      // Skip if checked within the last few seconds
      if (now - lastActivity < this.ACTIVE_POLLING_INTERVAL) {
        continue;
      }

      await this.checkSingleChannel(channelId, csBot);
    }
  }
}

export const botManager = new BotManager();
