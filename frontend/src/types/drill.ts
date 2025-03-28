export interface Drill {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topics: string[];
}
