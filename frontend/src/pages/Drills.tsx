import { DrillCard } from '@/components/drills/DrillCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { drills } from '@/data/drills';

const Drills = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Training Drills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Enhance your cybersecurity skills through interactive training drills. Each drill
            focuses on different aspects of security awareness and incident response.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </div>
  );
};

export default Drills;
