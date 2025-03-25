import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our App</h1>

      {isAuthenticated ? (
        <div className="space-y-4">
          <p className="text-lg">You are logged in!</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Dashboard</h2>
            <p>Here you'll see your personalized content...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">Please log in to access all features</p>
          <p>Discover what our app can do for you by creating an account!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
