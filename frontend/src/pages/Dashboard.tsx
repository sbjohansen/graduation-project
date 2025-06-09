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
      <PageTitle title="Dashboard" />      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Your Training Center
              </h1>
              <p className="text-lg text-muted-foreground">
                Your cybersecurity incident response training dashboard. Track your progress, 
                start new scenarios, and enhance your skills.
              </p>
            </div>
            
            <WelcomeCard userData={dashboardUserData} />
          </div>
        </section>

        {/* Dashboard Cards Section */}
        <section className="pb-8 md:pb-12">
          <div className="container mx-auto px-4">
            <DashboardCards />
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
