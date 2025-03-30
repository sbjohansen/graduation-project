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
      // Change log level to INFO to reduce verbosity
      logLevel: LogLevel.INFO,
    };

    const app = new App(appOptions);

    let botSlackId: string | undefined;
    try {
      // Wait briefly for the app to potentially connect before auth.test
      // This might not be strictly necessary but can help in some race conditions
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const authResult = await app.client.auth.test({
        token: config.botToken, // Ensure the correct token is used
      });
      if (authResult.ok) {
        botSlackId = authResult.user_id;
        console.log(
          `Successfully fetched Slack User ID for ${config.name}: ${botSlackId}`
        );
      } else {
        console.warn(
          `Failed to fetch Slack User ID for ${config.name}: ${authResult.error}`
        );
      }
    } catch (error) {
      console.error(`Error fetching Slack User ID for ${config.name}:`, error);
    }

    const botInstance: BotInstance = {
      config,
      app,
      isActive: false,
      slackUserId: botSlackId, // Store the fetched Slack User ID
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

    console.log("[CHANNEL_MONITOR] Starting channel monitoring loop");

    // Use a single interval, calling a unified check function
    this.channelCheckInterval = setInterval(() => {
      this.performChannelCheck();
    }, this.ACTIVE_POLLING_INTERVAL); // Use the faster interval for responsiveness
  }

  /**
   * Stop channel monitoring
   */
  stopChannelMonitoring() {
    if (this.channelCheckInterval) {
      clearInterval(this.channelCheckInterval);
      this.channelCheckInterval = null;
      console.log("[CHANNEL_MONITOR] Stopped channel monitoring loop");
    }
  }

  /**
   * Add a channel to be actively monitored for messages
   */
  monitorChannel(channelId: string) {
    if (!this.monitoredChannels.has(channelId)) {
      this.monitoredChannels.add(channelId);
      this.channelLastActivity.set(channelId, Date.now());
      console.log(`[CHANNEL_MONITOR] Now monitoring channel: ${channelId}`);
      // if (!this.channelCheckInterval) {
      //   this.startChannelMonitoring(); // COMMENTED OUT - Rely on event subscriptions
      // }
    }
  }

  /**
   * Stop monitoring a specific channel
   */
  stopMonitoringChannel(channelId: string) {
    if (this.monitoredChannels.has(channelId)) {
      this.monitoredChannels.delete(channelId);
      this.channelLastActivity.delete(channelId); // Clean up activity map too
      console.log(`[CHANNEL_MONITOR] Stopped monitoring channel: ${channelId}`);
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
   * Unified check function for monitored channels.
   * Checks a small subset of channels in each run to distribute load.
   */
  private async performChannelCheck() {
    // Renamed from checkActiveChannels
    if (this.monitoredChannels.size === 0) {
      return;
    }

    const csBot = this.getBot("cs-bot");
    if (!csBot) {
      return; // Cannot check without cs-bot
    }

    // Convert monitored channels to an array to easily grab a subset
    const channels = Array.from(this.monitoredChannels);

    // Determine how many channels to check in this cycle (e.g., up to 3)
    const checkLimit = 3;
    const channelsToCheck = channels.slice(0, checkLimit);

    // Rotate the channels list for next time, simple approach:
    // Move the checked channels to the end of the set for the next iteration.
    // This isn't perfect round-robin but ensures all get checked eventually.
    channelsToCheck.forEach((channelId) => {
      this.monitoredChannels.delete(channelId);
      this.monitoredChannels.add(channelId);
    });

    if (channelsToCheck.length === 0) {
      return; // No channels to check
    }

    // Only log occasionally
    if (Math.random() < 0.05) {
      console.log(
        `[CHANNEL_MONITOR] Performing check on subset: ${channelsToCheck.join(
          ", "
        )}`
      );
    }

    for (const channelId of channelsToCheck) {
      await this.checkSingleChannel(channelId, csBot);
    }
  }

  /**
   * Check a single channel for new messages (Logic remains the same)
   */
  private async checkSingleChannel(channelId: string, csBot: BotInstance) {
    try {
      const result = await csBot.app.client.conversations.history({
        channel: channelId,
        limit: 3,
      });

      if (!result.ok) {
        console.error(
          `[CHANNEL_MONITOR] Error fetching messages from channel ${channelId}: ${result.error}`
        );
        return;
      }

      if (result.messages && result.messages.length > 0) {
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
          .reverse();

        if (newUserMessages.length > 0) {
          console.log(
            `[CHANNEL_MONITOR] Found ${newUserMessages.length} new user messages in channel ${channelId}` // Keep this log
          );
          this.updateChannelActivity(channelId);

          for (const msg of newUserMessages as SlackMessage[]) {
            try {
              // console.log(
              //    `[CHANNEL_MONITOR] Processing message: "${msg.text}" from user ${msg.user}` // Can likely remove this too if needed
              // );
              const { messageHandler } = require("../messageHandler");
              await messageHandler.scenarioService.processUserMessage(
                msg.user as string,
                channelId,
                msg.text as string
              );
              // console.log(
              //   `[CHANNEL_MONITOR] Successfully processed message from user ${msg.user}` // And this
              // );
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
}

export const botManager = new BotManager();
