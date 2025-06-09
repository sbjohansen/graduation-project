import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserDashboardData } from '@/types';
import { User, Shield } from 'lucide-react';

interface WelcomeCardProps {
  userData: UserDashboardData | null;
}

const WelcomeCard = ({ userData }: WelcomeCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Welcome back to SecureShield!</CardTitle>
            <CardDescription className="text-base">
              Ready to enhance your cybersecurity incident response skills?
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {userData && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Logged in as:</span>
            <Badge variant="outline" className="bg-background/50">
              {userData.email}
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WelcomeCard;
