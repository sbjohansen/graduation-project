import { API_BASE_URL } from '@/config/api';
import axios from 'axios';

interface ChannelInfo {
  businessChannelId: string;
  incidentChannelId: string;
  businessChannelName: string;
  incidentChannelName: string;
}

export const slackService = {
  async createDrillChannels(drillId: string): Promise<ChannelInfo> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_BASE_URL}/slack/drills/${drillId}/channels`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.channelInfo;
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
