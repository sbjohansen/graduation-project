import { App } from "@slack/bolt";
import { botConfigs } from "../config/bots";
import { BotConfig, BotInstance } from "../types/botConfig";

class BotManager {
  private bots: Map<string, BotInstance> = new Map();

  constructor() {
    this.initializeBots();
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

    const app = new App({
      token: config.botToken,
      signingSecret: config.signingSecret,
      socketMode: true,
      appToken: config.appToken,
    });

    const botInstance: BotInstance = {
      config,
      app,
      isActive: false,
    };

    this.bots.set(config.id, botInstance);
    return botInstance;
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot with ID ${botId} not found`);
    }

    try {
      await bot.app.start();
      bot.isActive = true;
      console.log(`⚡️ Bot ${bot.config.name} is running!`);
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
}

export const botManager = new BotManager();
