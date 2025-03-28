import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { slackService } from '@/services/slackService';
import { Drill } from '@/types/drill';
import { useState } from 'react';
import { toast } from 'sonner';

interface DrillCardProps {
  drill: Drill;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case 'Hard':
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export const DrillCard = ({ drill }: DrillCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDrill = async () => {
    try {
      setIsLoading(true);
      const channelInfo = await slackService.createDrillChannels(drill.id);

      toast.success('Drill Started', {
        description: `You have been invited to two Slack channels:
          - ${channelInfo.businessChannelName}
          - ${channelInfo.incidentChannelName}
          
          Please check your Slack workspace to join the channels.`,
      });
    } catch (error) {
      console.error('Error starting drill:', error);
      toast.error('Failed to start the drill', {
        description: 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{drill.name}</CardTitle>
          <Badge variant="secondary" className={getDifficultyColor(drill.difficulty)}>
            {drill.difficulty}
          </Badge>
        </div>
        <CardDescription>{drill.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Duration: {drill.duration} minutes</p>
          <p className="text-sm text-muted-foreground">Topics: {drill.topics.join(', ')}</p>
        </div>
        <Badge variant="outline" className="mt-2">
          {drill.category}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartDrill} disabled={isLoading} className="w-full">
          {isLoading ? 'Starting...' : 'Start Drill'}
        </Button>
      </CardFooter>
    </Card>
  );
};
