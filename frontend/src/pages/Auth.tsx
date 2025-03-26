import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.token) {
        login(data.token);
        navigate("/");
      } else {
        // Handle authentication error from API
        setErrorMessage(data.message || "Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMessage("Failed to connect to authentication service. Please try again later.");
    }
  };

  // Clear error when user makes changes to the form
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (errorMessage) setErrorMessage("");
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">
        {isLogin ? "Login" : "Register"}
      </h1>
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleInputChange(setName, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleInputChange(setEmail, e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => handleInputChange(setPassword, e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setErrorMessage("");
        }}
        className="w-full mt-4 text-blue-500"
      >
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
};

export default Auth;
