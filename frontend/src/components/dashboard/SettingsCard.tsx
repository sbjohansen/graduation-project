import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SettingsCard = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Manage your account settings and preferences here.</p>
      </CardContent>
      <CardFooter>
        <Button>Manage Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsCard; 