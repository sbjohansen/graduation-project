import { useAuth } from '../../contexts/AuthContext';
import DrillsCard from './DrillsCard';
import InstructionsCard from './InstructionsCard';
import SlackInviteCard from './SlackInviteCard';

const DashboardCards = () => {
  const { userData } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
        <p className="text-muted-foreground">
          Get started with your cybersecurity training journey through these essential steps.
        </p>
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <SlackInviteCard userData={userData} />
        <InstructionsCard />
        <DrillsCard />
      </div>
    </div>
  );
};

export default DashboardCards;
