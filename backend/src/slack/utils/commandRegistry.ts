import { App } from "@slack/bolt";
import { CommandHandler } from "../types";

export class CommandRegistry {
  private commands: Map<string, CommandHandler> = new Map();

  register(command: CommandHandler): void {
    this.commands.set(command.name, command);
  }

  registerAll(commands: CommandHandler[]): void {
    commands.forEach((command) => this.register(command));
  }

  setup(app: App): void {
    this.commands.forEach((command, name) => {
      app.command(name, command.handler);
    });
  }

  getCommands(): CommandHandler[] {
    return Array.from(this.commands.values());
  }
}
