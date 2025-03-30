import { API_BASE_URL } from '@/config/api';
import { Scenario } from '@/types/scenario';
import axios from 'axios';

export const simulationService = {
  async getScenarios(): Promise<Scenario[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_BASE_URL}/simulations/scenarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.scenarios.map((scenario: any) => ({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      difficulty: scenario.difficulty,
      length: scenario.length,
    }));
  },

  async getActiveSimulation(userId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_BASE_URL}/simulations/${userId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.status;
  },
};
