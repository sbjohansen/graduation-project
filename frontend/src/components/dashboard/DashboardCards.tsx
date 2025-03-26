import ActivityCard from "./ActivityCard";
import SettingsCard from "./SettingsCard";

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActivityCard />
      <SettingsCard />
    </div>
  );
};

export default DashboardCards; 