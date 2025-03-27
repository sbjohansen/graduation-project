import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drill } from '@/data/drills';

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
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{drill.name}</CardTitle>
          <Badge variant="secondary" className={getDifficultyColor(drill.difficulty)}>
            {drill.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-2">{drill.description}</p>
        <Badge variant="outline" className="mt-2">
          {drill.category}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="default">
          Start Drill
        </Button>
      </CardFooter>
    </Card>
  );
};
