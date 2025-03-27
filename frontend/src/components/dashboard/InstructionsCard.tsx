import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructionsCard = () => {
  const navigate = useNavigate();

  const handleViewInstructions = () => {
    navigate('/instructions');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleViewInstructions();
    }
  };

  return (
    <Card className="h-full shadow-md flex flex-col">
      <CardHeader className="bg-secondary/20">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-secondary" />
          <CardTitle>How It Works</CardTitle>
        </div>
        <CardDescription className="font-medium">
          Learn about the cybersecurity drill process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 flex-grow">
        <div className="flex flex-col space-y-2.5">
          <p className="text-sm">
            Access detailed instructions on how to participate in cybersecurity drill simulations as
            an Incident Manager.
          </p>
          <p className="text-sm text-muted-foreground">
            Our step-by-step guide explains the simulation process, your role, and how to
            effectively respond to security incidents.
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          onClick={handleViewInstructions}
          className="cursor-pointer"
          tabIndex={0}
          aria-label="View Instructions for Cybersecurity Drills"
          onKeyDown={handleKeyDown}
        >
          View Instructions
          <BookOpen className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstructionsCard;
