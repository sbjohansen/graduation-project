import { v4 as uuidv4 } from "uuid";
import { botManager } from "./botManager";

interface ChannelInfo {
  businessChannelId: string;
  incidentChannelId: string;
  businessChannelName: string;
  incidentChannelName: string;
}

class ChannelManager {
  async createDrillChannels(
    userEmail: string,
    drillId: string
  ): Promise<ChannelInfo> {
    // Use CS-Bot to create channels as it's our main bot
    const csBot = botManager.getBot("cs-bot");
    if (!csBot) {
      throw new Error("CS-Bot not found");
    }

    // Create unique channel names using drill ID and a shared UUID
    const uniqueId = uuidv4();
    const businessChannelName = `drill-${drillId}-business-${uniqueId}`;
    const incidentChannelName = `drill-${drillId}-incident-${uniqueId}`;

    try {
      // Create business channel
      const businessChannel = await csBot.app.client.conversations.create({
        name: businessChannelName,
        is_private: true,
      });

      // Create incident channel
      const incidentChannel = await csBot.app.client.conversations.create({
        name: incidentChannelName,
        is_private: true,
      });

      // Invite user to both channels
      await this.inviteUserToChannels(
        userEmail,
        businessChannel.channel.id,
        incidentChannel.channel.id
      );

      return {
        businessChannelId: businessChannel.channel.id,
        incidentChannelId: incidentChannel.channel.id,
        businessChannelName,
        incidentChannelName,
      };
    } catch (error) {
      console.error("Error creating drill channels:", error);
      throw error;
    }
  }

  private async inviteUserToChannels(
    userEmail: string,
    businessChannelId: string,
    incidentChannelId: string
  ): Promise<void> {
    const csBot = botManager.getBot("cs-bot");
    if (!csBot) {
      throw new Error("CS-Bot not found");
    }

    try {
      // Get user ID from email
      const userResponse = await csBot.app.client.users.lookupByEmail({
        email: userEmail,
      });

      if (!userResponse.ok || !userResponse.user) {
        throw new Error(`User not found with email: ${userEmail}`);
      }

      const userId = userResponse.user.id;

      // Invite to business channel
      await csBot.app.client.conversations.invite({
        channel: businessChannelId,
        users: userId,
      });

      // Invite to incident channel
      await csBot.app.client.conversations.invite({
        channel: incidentChannelId,
        users: userId,
      });
    } catch (error) {
      console.error("Error inviting user to channels:", error);
      throw error;
    }
  }

  async deleteDrillChannels(
    businessChannelId: string,
    incidentChannelId: string
  ): Promise<void> {
    const csBot = botManager.getBot("cs-bot");
    if (!csBot) {
      throw new Error("CS-Bot not found");
    }

    try {
      // Archive and delete business channel
      await csBot.app.client.conversations.archive({
        channel: businessChannelId,
      });

      // Archive and delete incident channel
      await csBot.app.client.conversations.archive({
        channel: incidentChannelId,
      });
    } catch (error) {
      console.error("Error deleting drill channels:", error);
      throw error;
    }
  }
}

export const channelManager = new ChannelManager();
