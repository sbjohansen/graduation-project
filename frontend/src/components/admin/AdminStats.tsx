import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStats as AdminStatsType } from "@/types";

interface AdminStatsProps {
  stats: AdminStatsType | null;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.adminUsers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Regular Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.regularUsers}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats; 