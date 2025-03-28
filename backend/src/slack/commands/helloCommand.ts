import { CommandHandler } from "../types";

export const helloCommand: CommandHandler = {
  name: "/hello",
  description: "Get a friendly greeting",
  handler: async ({ command, ack, say }) => {
    await ack();
    await say(`Hello <@${command.user_id}>! 👋`);
  },
};
