import { v4 as uuidv4 } from "uuid";
import { botManager } from "./botManager";

interface ChannelInfo {
  businessChannelId: string;
  incidentChannelId: string;
  businessChannelName: string;
  incidentChannelName: string;
  // Store raw channel info for debugging
  businessChannelRaw?: any;
  incidentChannelRaw?: any;
}

class ChannelManager {
  // Keep track of active channels
  private activeChannels: Map<string, ChannelInfo> = new Map();

  // Generate valid Slack channel names (lowercase, no special chars, max 80 chars)
  private formatChannelName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "")
      .substring(0, 80);
  }

  // Generate a shorter unique ID for channels (first 8 chars of UUID)
  private generateShortId(): string {
    return uuidv4().split("-")[0];
  }

  // Helper method to log channel details to assist with debugging
  private logChannelDetails(channelInfo: ChannelInfo): void {
    console.log(`[CHANNEL_DEBUG] Channel Info Details:`);
    console.log(
      `[CHANNEL_DEBUG] Business channel ID: ${channelInfo.businessChannelId}`
    );
    console.log(
      `[CHANNEL_DEBUG] Business channel name: ${channelInfo.businessChannelName}`
    );
    console.log(
      `[CHANNEL_DEBUG] Incident channel ID: ${channelInfo.incidentChannelId}`
    );
    console.log(
      `[CHANNEL_DEBUG] Incident channel name: ${channelInfo.incidentChannelName}`
    );

    // Log raw channel info if available
    if (channelInfo.businessChannelRaw) {
      console.log(`[CHANNEL_DEBUG] Business Channel Raw Info:`);
      console.log(`  - ID: ${channelInfo.businessChannelRaw.id}`);
      console.log(`  - Name: ${channelInfo.businessChannelRaw.name}`);
      console.log(
        `  - Is Private: ${channelInfo.businessChannelRaw.is_private}`
      );
    }

    if (channelInfo.incidentChannelRaw) {
      console.log(`[CHANNEL_DEBUG] Incident Channel Raw Info:`);
      console.log(`  - ID: ${channelInfo.incidentChannelRaw.id}`);
      console.log(`  - Name: ${channelInfo.incidentChannelRaw.name}`);
      console.log(
        `  - Is Private: ${channelInfo.incidentChannelRaw.is_private}`
      );
    }
  }

  async createDrillChannels(
    userEmail: string,
    drillId: string
  ): Promise<ChannelInfo> {
    // Use CS-Bot to create channels as it's our main bot
    const csBot = botManager.getBot("cs-bot");
    if (!csBot) {
      throw new Error("CS-Bot not found");
    }

    // Create unique channel names using drill ID and a short unique ID
    const shortId = this.generateShortId();

    // Check if drillId already has "drill-" prefix to avoid duplication
    const drillPrefix = drillId.startsWith("drill-") ? "" : "drill-";

    const businessChannelName = this.formatChannelName(
      `${drillPrefix}${drillId}-business-${shortId}`
    );
    const incidentChannelName = this.formatChannelName(
      `${drillPrefix}${drillId}-incident-${shortId}`
    );

    console.log(
      `Creating channels with names: ${businessChannelName} and ${incidentChannelName}`
    );

    try {
      console.log(
        `Creating channels: ${businessChannelName} and ${incidentChannelName}`
      );

      // Create business channel
      try {
        console.log(
          `Attempting to create business channel: ${businessChannelName}`
        );
        const businessChannel = await csBot.app.client.conversations.create({
          name: businessChannelName,
          is_private: true,
        });

        if (
          !businessChannel.ok ||
          !businessChannel.channel ||
          !businessChannel.channel.id
        ) {
          throw new Error(
            `Failed to create business channel: ${JSON.stringify(
              businessChannel
            )}`
          );
        }

        console.log(
          `Business channel created with ID: ${businessChannel.channel.id}`
        );

        // Allow a small delay between channel creations
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create incident channel
        console.log(
          `Attempting to create incident channel: ${incidentChannelName}`
        );
        const incidentChannel = await csBot.app.client.conversations.create({
          name: incidentChannelName,
          is_private: true,
        });

        if (
          !incidentChannel.ok ||
          !incidentChannel.channel ||
          !incidentChannel.channel.id
        ) {
          throw new Error(
            `Failed to create incident channel: ${JSON.stringify(
              incidentChannel
            )}`
          );
        }

        console.log(
          `Incident channel created with ID: ${incidentChannel.channel.id}`
        );

        const channelInfo: ChannelInfo = {
          businessChannelId: businessChannel.channel.id,
          incidentChannelId: incidentChannel.channel.id,
          businessChannelName,
          incidentChannelName,
          // Store raw channel data
          businessChannelRaw: businessChannel.channel,
          incidentChannelRaw: incidentChannel.channel,
        };

        // Log channel details
        this.logChannelDetails(channelInfo);

        // Store the channel information for later reference
        this.activeChannels.set(drillId, channelInfo);

        // Also store by channel ID for quick lookup
        const channelIdKey = `channel-${businessChannel.channel.id}`;
        this.activeChannels.set(channelIdKey, channelInfo);

        const incidentChannelIdKey = `channel-${incidentChannel.channel.id}`;
        this.activeChannels.set(incidentChannelIdKey, channelInfo);

        console.log(`Stored channel info by drill ID: ${drillId}`);
        console.log(
          `Stored channel info by business channel ID: ${channelIdKey}`
        );
        console.log(
          `Stored channel info by incident channel ID: ${incidentChannelIdKey}`
        );

        // Register channels for active monitoring
        console.log(`Registering channels for active polling`);
        botManager.monitorChannel(businessChannel.channel.id);
        botManager.monitorChannel(incidentChannel.channel.id);

        // Verify channels are accessible before proceeding
        console.log("Verifying channels are accessible...");

        // Wait a moment to allow Slack to fully provision channels
        await new Promise((resolve) => setTimeout(resolve, 3000));

        try {
          // Verify business channel
          console.log(
            `Attempting to verify business channel: ${businessChannel.channel.id}`
          );
          const businessCheck = await csBot.app.client.conversations.info({
            channel: businessChannel.channel.id,
          });

          if (!businessCheck.ok) {
            console.warn(
              `Business channel verification failed: ${JSON.stringify(
                businessCheck
              )}`
            );
          } else {
            console.log(
              `Business channel verified: ${businessChannel.channel.id}`
            );

            // Print member info
            try {
              const membersList = await csBot.app.client.conversations.members({
                channel: businessChannel.channel.id,
              });

              if (membersList.ok && membersList.members) {
                console.log(
                  `Business channel has ${membersList.members.length} members:`
                );
                console.log(membersList.members);
              }
            } catch (err) {
              console.error(`Error getting business channel members:`, err);
            }
          }
        } catch (error: any) {
          console.warn(`Error verifying business channel: ${error}`);

          // Check if this is a missing scope error
          if (error.message && error.message.includes("missing_scope")) {
            console.error(
              `PERMISSION ERROR: Missing required scopes to verify business channel`
            );
            console.error(
              `Required scopes likely include: groups:read, channels:read, im:read`
            );
            console.error(
              `Please check your CS-Bot has these OAuth scopes in Slack API Dashboard`
            );
            // Continue anyway - we'll try to use the channel even if we couldn't verify it
          }
        }

        try {
          // Verify incident channel
          console.log(
            `Attempting to verify incident channel: ${incidentChannel.channel.id}`
          );
          const incidentCheck = await csBot.app.client.conversations.info({
            channel: incidentChannel.channel.id,
          });

          if (!incidentCheck.ok) {
            console.warn(
              `Incident channel verification failed: ${JSON.stringify(
                incidentCheck
              )}`
            );
          } else {
            console.log(
              `Incident channel verified: ${incidentChannel.channel.id}`
            );

            // Print member info
            try {
              const membersList = await csBot.app.client.conversations.members({
                channel: incidentChannel.channel.id,
              });

              if (membersList.ok && membersList.members) {
                console.log(
                  `Incident channel has ${membersList.members.length} members:`
                );
                console.log(membersList.members);
              }
            } catch (err) {
              console.error(`Error getting incident channel members:`, err);
            }
          }
        } catch (error: any) {
          console.warn(`Error verifying incident channel: ${error}`);

          // Check if this is a missing scope error
          if (error.message && error.message.includes("missing_scope")) {
            console.error(
              `PERMISSION ERROR: Missing required scopes to verify incident channel`
            );
            console.error(
              `Required scopes likely include: groups:read, channels:read, im:read`
            );
            console.error(
              `Please check your CS-Bot has these OAuth scopes in Slack API Dashboard`
            );
            // Continue anyway - we'll try to use the channel even if we couldn't verify it
          }
        }

        // Invite user to both channels
        await this.inviteUserToChannels(
          userEmail,
          businessChannel.channel.id,
          incidentChannel.channel.id
        );

        // Add all bots to the channels
        await this.inviteBotsToChannels(
          businessChannel.channel.id,
          incidentChannel.channel.id
        );

        return channelInfo;
      } catch (error: any) {
        console.error(`Error creating channel: ${error}`);

        // Check if this is a missing scope error
        if (error.message && error.message.includes("missing_scope")) {
          console.error(
            `PERMISSION ERROR: Missing required scopes to create channels`
          );
          console.error(
            `Required scopes include: channels:manage, groups:write`
          );
          console.error(
            `Please check your CS-Bot has these OAuth scopes in Slack API Dashboard`
          );
        }

        throw error;
      }
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
      console.log(`Looking up user by email: ${userEmail}`);
      // Get user ID from email
      const userResponse = await csBot.app.client.users.lookupByEmail({
        email: userEmail,
      });

      if (!userResponse.ok || !userResponse.user) {
        throw new Error(`User not found with email: ${userEmail}`);
      }

      const userId = userResponse.user.id;
      console.log(`Found user with ID: ${userId}, inviting to channels`);

      // Function to invite with retries
      const inviteWithRetry = async (
        channelId: string,
        channelType: string,
        userIdToInvite: string
      ) => {
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(
              `Inviting user/bot to ${channelType} channel (attempt ${attempt})...`
            );
            const inviteResult = await csBot.app.client.conversations.invite({
              channel: channelId,
              users: userIdToInvite,
            });

            if (inviteResult.ok) {
              console.log(
                `Successfully invited to ${channelType} channel on attempt ${attempt}`
              );
              return true;
            } else {
              console.error(
                `Failed to invite to ${channelType} channel on attempt ${attempt}: ${JSON.stringify(
                  inviteResult
                )}`
              );

              if (attempt < 3) {
                const delay = 1000 * attempt; // Increasing delay for each retry
                console.log(`Waiting ${delay}ms before next attempt...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
              }
            }
          } catch (error) {
            console.error(
              `Error inviting to ${channelType} channel on attempt ${attempt}:`,
              error
            );

            if (attempt < 3) {
              const delay = 1000 * attempt;
              console.log(`Waiting ${delay}ms before next attempt...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }

        return false;
      };

      // Invite user to business channel with retries
      const businessSuccess = await inviteWithRetry(
        businessChannelId,
        "business",
        userId
      );
      if (!businessSuccess) {
        console.error(
          `Failed to invite user to business channel after 3 attempts`
        );
      }

      // Invite user to incident channel with retries
      const incidentSuccess = await inviteWithRetry(
        incidentChannelId,
        "incident",
        userId
      );
      if (!incidentSuccess) {
        console.error(
          `Failed to invite user to incident channel after 3 attempts`
        );
      }

      if (businessSuccess && incidentSuccess) {
        console.log(`Successfully invited user to both channels`);
      } else if (!businessSuccess && !incidentSuccess) {
        throw new Error(`Failed to invite user to both channels`);
      } else {
        console.warn(
          `User was only invited to ${
            businessSuccess ? "business" : "incident"
          } channel`
        );
      }
    } catch (error) {
      console.error("Error inviting user to channels:", error);
      throw error;
    }
  }

  // Add a new method to invite all bots to the channels
  private async inviteBotsToChannels(
    businessChannelId: string,
    incidentChannelId: string
  ): Promise<void> {
    const csBot = botManager.getBot("cs-bot");
    if (!csBot) {
      throw new Error("CS-Bot not found");
    }

    console.log("[DEBUG] Inviting all bots (including cs-bot) to channels...");

    // Get all bots from bot manager
    const allBots = botManager.getAllBots();

    // REMOVED FILTER: Invite cs-bot along with character bots
    // const botsToInvite = allBots.filter((bot) => bot.config.id !== "cs-bot");
    const botsToInvite = allBots; // Now includes cs-bot

    for (const bot of botsToInvite) {
      try {
        const botName = bot.config.name;
        const botInternalId = bot.config.id;
        console.log(
          `[DEBUG] Processing invitation for bot ${botName} (${botInternalId})`
        );

        // Get bot user ID (its Slack ID)
        // Use the stored slackUserId if available, otherwise fetch via auth.test
        let botSlackId = bot.slackUserId;
        if (!botSlackId) {
          console.warn(
            `[DEBUG] Slack User ID not found directly for ${botName}. Attempting auth.test...`
          );
          try {
            const botInfo = await bot.app.client.auth.test();
            if (!botInfo.ok || !botInfo.user_id) {
              console.warn(
                `[DEBUG] Failed to get bot info via auth.test for ${botName}, skipping invitation.`
              );
              continue;
            }
            botSlackId = botInfo.user_id;
          } catch (authErr) {
            console.error(
              `[DEBUG] Error during auth.test for ${botName}:`,
              authErr
            );
            console.warn(
              `[DEBUG] Skipping invitation for ${botName} due to auth error.`
            );
            continue;
          }
        }

        // Skip if the bot being processed is the same as the inviting bot (cs-bot)
        if (csBot.slackUserId && botSlackId === csBot.slackUserId) {
          console.log(`[DEBUG] Skipping self-invite for ${botName}.`);
          continue; // Move to the next bot in the loop
        }

        console.log(
          `[DEBUG] Inviting bot ${botName} (Slack ID: ${botSlackId}) to channels`
        );

        // Invite to business channel using cs-bot's client
        try {
          const inviteBusinessResult =
            await csBot.app.client.conversations.invite({
              channel: businessChannelId,
              users: botSlackId,
            });
          if (inviteBusinessResult.ok) {
            console.log(
              `[DEBUG] Successfully invited ${botName} to business channel ${businessChannelId}.`
            );
          } else {
            // Log expected errors like 'already_in_channel' without failing
            if (inviteBusinessResult.error === "already_in_channel") {
              console.log(
                `[DEBUG] Bot ${botName} already in business channel ${businessChannelId}.`
              );
            } else {
              console.error(
                `[DEBUG] Error inviting ${botName} to business channel ${businessChannelId}: ${inviteBusinessResult.error}`
              );
            }
          }
        } catch (error) {
          console.error(
            `[DEBUG] Exception inviting ${botName} to business channel:`,
            error
          );
        }

        // Small delay between invites
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Invite to incident channel using cs-bot's client
        try {
          const inviteIncidentResult =
            await csBot.app.client.conversations.invite({
              channel: incidentChannelId,
              users: botSlackId,
            });
          if (inviteIncidentResult.ok) {
            console.log(
              `[DEBUG] Successfully invited ${botName} to incident channel ${incidentChannelId}.`
            );
          } else {
            // Log expected errors like 'already_in_channel' without failing
            if (inviteIncidentResult.error === "already_in_channel") {
              console.log(
                `[DEBUG] Bot ${botName} already in incident channel ${incidentChannelId}.`
              );
            } else {
              console.error(
                `[DEBUG] Error inviting ${botName} to incident channel ${incidentChannelId}: ${inviteIncidentResult.error}`
              );
            }
          }
        } catch (error) {
          console.error(
            `[DEBUG] Exception inviting ${botName} to incident channel:`,
            error
          );
        }

        // Small delay before next bot
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        // Error processing a single bot, log and continue with others
        console.error(
          `[DEBUG] Error in invitation loop for bot ${bot.config.name}:`,
          error
        );
      }
    }
    console.log("[DEBUG] Finished inviting bots.");
  }

  getChannelInfo(drillId: string): ChannelInfo | undefined {
    // Check if this is a channel ID lookup (starts with "channel-")
    if (drillId.startsWith("channel-")) {
      return this.activeChannels.get(drillId);
    }

    // Try direct lookup by drill ID
    const directLookup = this.activeChannels.get(drillId);
    if (directLookup) {
      return directLookup;
    }

    // If the input is a raw channel ID (not prefixed with "channel-"), try that format
    const channelIdKey = `channel-${drillId}`;
    const byChannelId = this.activeChannels.get(channelIdKey);
    if (byChannelId) {
      return byChannelId;
    }

    // Last resort: try to find by matching channel IDs in stored channel infos
    for (const [_, channelInfo] of this.activeChannels.entries()) {
      if (
        channelInfo.businessChannelId === drillId ||
        channelInfo.incidentChannelId === drillId
      ) {
        return channelInfo;
      }
    }

    // No matches found
    console.log(`[CHANNEL_DEBUG] No channel info found for key: ${drillId}`);
    return undefined;
  }

  // Add method to find drill ID by channel ID
  findDrillIdByChannelId(channelId: string): string | undefined {
    for (const [key, channelInfo] of this.activeChannels.entries()) {
      if (
        !key.startsWith("channel-") && // Only return drill IDs, not channel ID keys
        (channelInfo.businessChannelId === channelId ||
          channelInfo.incidentChannelId === channelId)
      ) {
        return key;
      }
    }
    return undefined;
  }

  // Debug helper to print all active channels
  debugPrintAllChannels(): void {
    console.log(`[CHANNEL_DEBUG] ===== ALL ACTIVE CHANNELS =====`);
    console.log(`[CHANNEL_DEBUG] Total entries: ${this.activeChannels.size}`);

    for (const [key, channelInfo] of this.activeChannels.entries()) {
      console.log(`[CHANNEL_DEBUG] Key: ${key}`);
      console.log(
        `[CHANNEL_DEBUG]   - Business: ${channelInfo.businessChannelId} (${channelInfo.businessChannelName})`
      );
      console.log(
        `[CHANNEL_DEBUG]   - Incident: ${channelInfo.incidentChannelId} (${channelInfo.incidentChannelName})`
      );
    }

    console.log(`[CHANNEL_DEBUG] ===============================`);
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
      console.log(
        `Archiving channels: ${businessChannelId} and ${incidentChannelId}`
      );

      // Archive business channel
      try {
        await csBot.app.client.conversations.archive({
          channel: businessChannelId,
        });
        console.log(
          `Successfully archived business channel: ${businessChannelId}`
        );
      } catch (error) {
        console.error(
          `Error archiving business channel: ${businessChannelId}`,
          error
        );
        // Continue even if one channel fails
      }

      // Archive incident channel
      try {
        await csBot.app.client.conversations.archive({
          channel: incidentChannelId,
        });
        console.log(
          `Successfully archived incident channel: ${incidentChannelId}`
        );
      } catch (error) {
        console.error(
          `Error archiving incident channel: ${incidentChannelId}`,
          error
        );
      }

      // Remove from active channels (find by channel ID)
      for (const [drillId, info] of this.activeChannels.entries()) {
        if (
          info.businessChannelId === businessChannelId ||
          info.incidentChannelId === incidentChannelId
        ) {
          this.activeChannels.delete(drillId);
          break;
        }
      }
    } catch (error) {
      console.error("Error deleting drill channels:", error);
      throw error;
    }
  }
}

export const channelManager = new ChannelManager();
