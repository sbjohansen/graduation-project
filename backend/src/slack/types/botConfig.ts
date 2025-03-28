export interface BotConfig {
  id: string;
  name: string;
  botToken: string;
  signingSecret: string;
  appToken: string;
  role: string;
  personality?: string;
  avatar?: string;
  description?: string;
}

export interface BotInstance {
  config: BotConfig;
  app: any; // Slack Bolt App instance
  isActive: boolean;
}
