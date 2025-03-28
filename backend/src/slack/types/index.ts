import { App } from "@slack/bolt";

export interface SlackConfig {
  token: string;
  signingSecret: string;
  appToken: string;
}

export interface SlackService {
  app: App;
  initialize(): Promise<void>;
  sendMessage(channel: string, message: string): Promise<void>;
}

export interface CommandHandler {
  name: string;
  description: string;
  handler: (args: any) => Promise<void>;
}

export interface MessageHandler {
  pattern: string | RegExp;
  handler: (args: any) => Promise<void>;
}
