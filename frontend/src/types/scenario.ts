import { Drill } from './drill';

// For compatibility with existing Drill interface
export type Scenario = Drill;

export interface ScenarioDetails {
  scenarioId: string;
  scenarioTitle: string;
  currentStep: number;
  totalSteps: number;
  startedAt: string;
  completedObjectives: Record<number, string[]>;
  awardedBadges: string[];
  channels: {
    business: string;
    incident: string;
  };
}
