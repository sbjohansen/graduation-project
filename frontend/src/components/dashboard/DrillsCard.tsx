import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Play, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DrillsCard = () => {
  const navigate = useNavigate();

  const handleStartDrills = () => {
    navigate('/drills');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartDrills();
    }
  };

  return (
    <Card className="h-full shadow-md flex flex-col bg-gradient-to-br from-green-50/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader className="bg-green-100/50 dark:bg-green-900/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-full">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-800 dark:text-green-200">Training Scenarios</CardTitle>
        </div>
        <CardDescription className="font-medium text-green-700 dark:text-green-300">
          Start practicing with real-world incident simulations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 flex-grow">
        <div className="flex flex-col space-y-2.5">
          <p className="text-sm text-green-800 dark:text-green-200">
            Jump into immersive cybersecurity incident response training scenarios. 
            Practice handling ransomware attacks, data breaches, and APT incidents.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <Zap className="h-4 w-4" />
            <span>AI-powered realistic simulations</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <Play className="h-4 w-4" />
            <span>50+ scenario types available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          onClick={handleStartDrills}
          onKeyDown={handleKeyDown}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Training
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DrillsCard;
