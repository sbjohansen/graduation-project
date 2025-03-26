import { useAuth } from "../contexts/AuthContext";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardCards from "@/components/dashboard/DashboardCards";
import { UserDashboardData } from "@/types";

const Dashboard = () => {
  const { userData } = useAuth();
  
  // Convert userData to our type
  const dashboardUserData: UserDashboardData | null = userData ? {
    email: userData.email,
    // Add any other properties from userData if they exist
  } : null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <WelcomeCard userData={dashboardUserData} />
      
      <DashboardCards />
    </div>
  );
};

export default Dashboard; 