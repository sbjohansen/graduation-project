import dotenv from "dotenv";
import { helloCommand, helpCommand } from "./commands";
import { helloMessageHandler } from "./handlers/messageHandlers";
import { SlackServiceImpl } from "./services/slackService";
import { CommandRegistry } from "./utils/commandRegistry";

dotenv.config();

// Initialize Slack service
const slackService = new SlackServiceImpl({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  appToken: process.env.SLACK_APP_TOKEN!,
});

// Initialize command registry
const commandRegistry = new CommandRegistry();
commandRegistry.registerAll([helpCommand, helloCommand]);

// Set up message handlers
slackService.app.message(
  helloMessageHandler.pattern,
  helloMessageHandler.handler
);

// Set up command handlers
commandRegistry.setup(slackService.app);

export const initializeSlackBot = async () => {
  await slackService.initialize();
};

export default slackService;
