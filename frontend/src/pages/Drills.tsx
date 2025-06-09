import { DrillCard } from '@/components/drills/DrillCard';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { simulationService } from '@/services/simulationService';
import { Drill } from '@/types/drill';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Target, Clock, Users, AlertTriangle } from 'lucide-react';

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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cybersecurity Training Scenarios
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Master incident response through immersive AI-powered scenarios. Each drill simulates 
                real-world cybersecurity challenges to enhance your skills and decision-making abilities.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {isLoading ? '---' : drills.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Available Scenarios</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-green-50/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    30-90
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes Per Drill</div>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-purple-50/50 to-violet-100/50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-800/50">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    AI Team
                  </div>
                  <div className="text-sm text-muted-foreground">Realistic Personas</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Drills Section */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="h-80">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : drills.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Available Training Scenarios</h2>
                    <p className="text-muted-foreground">
                      Choose a scenario that matches your experience level and learning objectives.
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-muted/50">
                    {drills.length} scenarios available
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drills.map((drill) => (
                    <DrillCard key={drill.id} drill={drill} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Training Scenarios Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Training scenarios are currently being prepared. Please check back later or contact support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Refresh Page
                    </button>
                    <button 
                      onClick={() => toast.info('Support contact feature coming soon!')}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      Contact Support
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Drills;
