import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

const Admin = () => {
  const { token, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verify admin status on component mount
  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) {
        navigate("/");
      }
    };

    verifyAdmin();
  }, [checkAdminStatus, navigate]);

  // Fetch admin panel data
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch basic admin message
        const basicResponse = await fetch("http://localhost:4000/api/admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!basicResponse.ok) {
          throw new Error("Failed to verify admin access");
        }

        const basicData = await basicResponse.json();
        setAdminMessage(basicData.message);

        // Fetch users list
        const usersResponse = await fetch("http://localhost:4000/api/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Fetch admin stats
        const statsResponse = await fetch("http://localhost:4000/api/admin/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        setError(null);
      } catch (err) {
        console.error("Admin data fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load admin data");
        // If authentication failed, redirect
        if (err instanceof Error && err.message.includes("admin access")) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token, navigate]);

  // Handle toggling user admin status
  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/admin`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      // Update the users list
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: !currentStatus } 
          : user
      ));

      // Update stats if they exist
      if (stats) {
        setStats({
          ...stats,
          adminUsers: currentStatus 
            ? stats.adminUsers - 1 
            : stats.adminUsers + 1,
          regularUsers: currentStatus 
            ? stats.regularUsers + 1 
            : stats.regularUsers - 1,
        });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {adminMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{adminMessage}</p>
        </div>
      )}
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Admin Users</h3>
            <p className="text-3xl font-bold">{stats.adminUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Regular Users</h3>
            <p className="text-3xl font-bold">{stats.regularUsers}</p>
          </div>
        </div>
      )}
      
      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin; 