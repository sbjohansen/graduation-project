import { DrillCard } from '@/components/drills/DrillCard';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { simulationService } from '@/services/simulationService';
import { Drill } from '@/types/drill';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Drills = () => {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setIsLoading(true);
        const scenarios = await simulationService.getScenarios();
        setDrills(scenarios);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        toast.error('Failed to load training drills', {
          description: 'Please try refreshing the page.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  return (
    <>
      <PageTitle title="Security Training Drills" />
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="h-64">
                <CardHeader>
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : drills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drills.map((drill) => (
              <DrillCard key={drill.id} drill={drill} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                No training drills are available at this time.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Drills;
