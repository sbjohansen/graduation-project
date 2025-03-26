export interface UserDashboardData {
  email: string;
  name?: string;
  id?: number;
}

export interface ActivityData {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
} 