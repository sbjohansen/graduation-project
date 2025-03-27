import { AdminStats as AdminStatsType, UserData } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAlerts from '../components/admin/AdminAlerts';
import AdminStats from '../components/admin/AdminStats';
import LoadingState from '../components/admin/LoadingState';
import UserManagementTable from '../components/admin/UserManagementTable';
import { PageTitle } from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { token, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verify admin status on component mount
  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdminStatus();
      if (!isAdmin) {
        navigate('/');
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
        const basicResponse = await fetch('http://localhost:4000/api/admin', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!basicResponse.ok) {
          throw new Error('Failed to verify admin access');
        }

        const basicData = await basicResponse.json();
        setAdminMessage(basicData.message);

        // Fetch users list
        const usersResponse = await fetch('http://localhost:4000/api/admin/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Fetch admin stats
        const statsResponse = await fetch('http://localhost:4000/api/admin/stats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        setError(null);
      } catch (err) {
        console.error('Admin data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
        // If authentication failed, redirect
        if (err instanceof Error && err.message.includes('admin access')) {
          navigate('/');
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
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      // Update the users list
      setUsers(
        users.map((user) => (user.id === userId ? { ...user, isAdmin: !currentStatus } : user))
      );

      // Update stats if they exist
      if (stats) {
        setStats({
          ...stats,
          adminUsers: currentStatus ? stats.adminUsers - 1 : stats.adminUsers + 1,
          regularUsers: currentStatus ? stats.regularUsers + 1 : stats.regularUsers - 1,
        });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminAlerts error={error} adminMessage={adminMessage} />
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <AdminStats stats={stats} />
            <UserManagementTable users={users} onToggleAdmin={handleToggleAdmin} />
          </>
        )}
      </div>
    </>
  );
};

export default Admin;
