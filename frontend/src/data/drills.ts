export interface Drill {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export const drills: Drill[] = [
  {
    id: '1',
    name: 'Phishing Email Detection',
    description: 'Learn to identify and analyze suspicious emails to prevent phishing attacks.',
    difficulty: 'Easy',
    category: 'Email Security',
  },
  {
    id: '2',
    name: 'Password Security Assessment',
    description:
      'Test your knowledge of password security best practices and learn how to create strong passwords.',
    difficulty: 'Easy',
    category: 'Authentication',
  },
  {
    id: '3',
    name: 'Network Traffic Analysis',
    description:
      'Analyze network traffic patterns to identify potential security threats and anomalies.',
    difficulty: 'Medium',
    category: 'Network Security',
  },
  {
    id: '4',
    name: 'Social Engineering Defense',
    description:
      'Practice identifying and responding to social engineering attempts in various scenarios.',
    difficulty: 'Medium',
    category: 'Social Engineering',
  },
  {
    id: '5',
    name: 'Malware Analysis',
    description: 'Learn to analyze and identify different types of malware and their behaviors.',
    difficulty: 'Hard',
    category: 'Malware',
  },
  {
    id: '6',
    name: 'Incident Response Simulation',
    description:
      'Participate in a simulated security incident and practice your response procedures.',
    difficulty: 'Hard',
    category: 'Incident Response',
  },
];
