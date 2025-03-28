import { CommandHandler } from "../types";

export const helpCommand: CommandHandler = {
  name: "/help",
  description: "Show available commands",
  handler: async ({ command, ack, say }) => {
    await ack();
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Available Commands:*\n• `/hello` - Get a friendly greeting\n• `/help` - Show this help message",
          },
        },
      ],
    });
  },
};
