export interface UserData {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}
