import { API_BASE_URL } from '@/config/api';
import axios from 'axios';

interface ChannelInfo {
  businessChannelId: string;
  incidentChannelId: string;
  businessChannelName?: string;
  incidentChannelName?: string;
}

export const slackService = {
  async createDrillChannels(scenarioId: string): Promise<ChannelInfo> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get user email from token (in real app you might want to get this from your auth context)
    const userEmail = JSON.parse(atob(token.split('.')[1])).email;

    try {
      console.log(`Starting simulation for scenario ${scenarioId} with user ${userEmail}`);

      const response = await axios.post(
        `${API_BASE_URL}/simulations/start`,
        {
          userEmail,
          scenarioId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract channel info from the response
      const channelInfo = response.data.channelInfo;

      if (!channelInfo || !channelInfo.businessChannelId || !channelInfo.incidentChannelId) {
        throw new Error('Invalid channel information returned from server');
      }

      console.log(`Successfully created channels: ${JSON.stringify(channelInfo)}`);

      // Format channel names for display - they might be cryptic IDs in Slack
      return {
        ...channelInfo,
        // If names aren't provided by the API, generate readable names
        businessChannelName: channelInfo.businessChannelName || `#business-${scenarioId}`,
        incidentChannelName: channelInfo.incidentChannelName || `#incident-${scenarioId}`,
      };
    } catch (error) {
      console.error('Error creating drill channels:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Server error: ${error.response.data?.error || error.message}`);
      }
      throw error;
    }
  },

  async deleteDrillChannels(
    drillId: string,
    businessChannelId: string,
    incidentChannelId: string
  ): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    await axios.delete(`${API_BASE_URL}/slack/drills/${drillId}/channels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { businessChannelId, incidentChannelId },
    });
  },
};
