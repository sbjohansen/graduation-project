import { App } from "@slack/bolt";
import { SlackConfig, SlackService } from "../types";

export class SlackServiceImpl implements SlackService {
  public app: App;

  constructor(config: SlackConfig) {
    this.app = new App({
      token: config.token,
      signingSecret: config.signingSecret,
      socketMode: true,
      appToken: config.appToken,
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.app.start();
      console.log("⚡️ Slack Bolt app is running!");
    } catch (error) {
      console.error("Error starting Slack bot:", error);
      throw error;
    }
  }

  async sendMessage(channel: string, message: string): Promise<void> {
    try {
      await this.app.client.chat.postMessage({
        channel,
        text: message,
      });
    } catch (error) {
      console.error("Error sending Slack message:", error);
      throw error;
    }
  }
}
