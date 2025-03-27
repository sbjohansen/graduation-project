import { useAuth } from '../../contexts/AuthContext';
import ActivityCard from './ActivityCard';
import InstructionsCard from './InstructionsCard';
import SettingsCard from './SettingsCard';
import SlackInviteCard from './SlackInviteCard';

const DashboardCards = () => {
  const { userData } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SlackInviteCard userData={userData} />
      <InstructionsCard />
      <ActivityCard />
      <SettingsCard />
    </div>
  );
};

export default DashboardCards;
