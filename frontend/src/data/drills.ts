import { Drill } from '@/types/drill';

export const drills: Drill[] = [
  {
    id: '1',
    name: 'Phishing Email Detection',
    title: 'Phishing Email Detection',
    description: 'Learn to identify and analyze suspicious emails to prevent phishing attacks.',
    duration: 30,
    difficulty: 'Easy',
    category: 'Email Security',
    topics: ['Email Security', 'Phishing', 'Social Engineering'],
  },
  {
    id: '2',
    name: 'Password Security Assessment',
    title: 'Password Security Assessment',
    description:
      'Test your knowledge of password security best practices and learn how to create strong passwords.',
    duration: 30,
    difficulty: 'Easy',
    category: 'Authentication',
    topics: ['Password Security', 'Authentication', 'Access Control'],
  },
  {
    id: '3',
    name: 'Network Traffic Analysis',
    title: 'Network Traffic Analysis',
    description:
      'Analyze network traffic patterns to identify potential security threats and anomalies.',
    duration: 45,
    difficulty: 'Medium',
    category: 'Network Security',
    topics: ['Network Security', 'Traffic Analysis', 'Threat Detection'],
  },
  {
    id: '4',
    name: 'Social Engineering Defense',
    title: 'Social Engineering Defense',
    description:
      'Practice identifying and responding to social engineering attempts in various scenarios.',
    duration: 45,
    difficulty: 'Medium',
    category: 'Social Engineering',
    topics: ['Social Engineering', 'Human Security', 'Awareness'],
  },
  {
    id: '5',
    name: 'Malware Analysis',
    title: 'Malware Analysis',
    description: 'Learn to analyze and identify different types of malware and their behaviors.',
    duration: 60,
    difficulty: 'Hard',
    category: 'Malware',
    topics: ['Malware', 'Threat Analysis', 'Security Tools'],
  },
  {
    id: '6',
    name: 'Incident Response Simulation',
    title: 'Incident Response Simulation',
    description: 'Practice responding to various security incidents in a controlled environment.',
    duration: 60,
    difficulty: 'Hard',
    category: 'Incident Response',
    topics: ['Incident Response', 'Security Operations', 'Crisis Management'],
  },
];
