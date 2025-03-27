import DashboardCards from '@/components/dashboard/DashboardCards';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import { UserDashboardData } from '@/types';
import { PageTitle } from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { userData } = useAuth();

  // Convert userData to our type
  const dashboardUserData: UserDashboardData | null = userData
    ? {
        email: userData.email,
      }
    : null;

  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <WelcomeCard userData={dashboardUserData} />

        <DashboardCards />
      </div>
    </>
  );
};

export default Dashboard;
