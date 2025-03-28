import { MessageHandler } from "../types";

export const helloMessageHandler: MessageHandler = {
  pattern: "hello",
  handler: async ({ message, say }) => {
    await say(`Hey there <@${message.user}>! 👋`);
  },
};
