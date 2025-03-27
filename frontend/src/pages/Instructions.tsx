import { PageTitle } from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';

const Instructions = () => {
  const { userData } = useAuth();

  return (
    <>
      <PageTitle title="Instructions" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Instructions</h1>
        <div className="prose dark:prose-invert max-w-none">
          <h2>Getting Started</h2>
          <p>Welcome to our platform! Here's how to get started:</p>
          <ol>
            <li>Create an account or log in to your existing account</li>
            <li>Navigate to the dashboard to access your workspace</li>
            <li>Explore the available features and tools</li>
          </ol>

          <h2>Key Features</h2>
          <ul>
            <li>User-friendly interface</li>
            <li>Secure authentication</li>
            <li>Real-time updates</li>
            <li>Responsive design</li>
          </ul>

          <h2>Need Help?</h2>
          <p>
            If you need assistance or have any questions, please don't hesitate to contact our
            support team.
          </p>
        </div>
      </div>
    </>
  );
};

export default Instructions;
