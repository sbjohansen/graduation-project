import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserDashboardData } from '@/types';

interface WelcomeCardProps {
  userData: UserDashboardData | null;
}

const WelcomeCard = ({ userData }: WelcomeCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        {userData && (
          <CardDescription>
            You are logged in as: <span className="font-medium">{userData.email}</span>
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
