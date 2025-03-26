import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
