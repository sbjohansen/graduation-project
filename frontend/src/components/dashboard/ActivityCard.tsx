import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ActivityCard = () => {
  return (
    <Card className="h-full ">
      <CardHeader>
        <CardTitle>Your Activities</CardTitle>
        <CardDescription>View and manage your recent activities</CardDescription>
      </CardHeader>
      <CardContent>
        <p>No recent activities to display.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View All</Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
