import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserDashboardData } from '@/types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface SlackInviteCardProps {
  userData: UserDashboardData | null;
}

const SlackInviteCard = ({ userData }: SlackInviteCardProps) => {
  const slackInviteUrl =
    'https://join.slack.com/t/cybershieldlabs/shared_invite/zt-32rl77e0x-Sr5m57oqM1plIpKGxBsY2w';

  const handleJoinSlack = () => {
    window.open(slackInviteUrl, '_blank');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinSlack();
    }
  };

  return (
    <Card className="h-full border-2 border-primary shadow-lg">
      <CardHeader className="bg-primary/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle>Required Action</CardTitle>
        </div>
        <CardDescription className="font-medium text-base">
          Join Slack for Drill Simulations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col space-y-2.5">
          <p className="text-sm font-medium">
            As an Incident Manager, you must join our Slack workspace to participate in
            cybersecurity drill simulations.
          </p>
          <p className="text-sm text-muted-foreground">
            The simulations take place in Slack, emulating real communication environments during
            security incidents. This is a required step to access and participate in the drill
            exercises.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleJoinSlack}
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          tabIndex={0}
          aria-label="Join Slack for Cybersecurity Drills"
          onKeyDown={handleKeyDown}
        >
          Join Slack to Participate
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SlackInviteCard;
