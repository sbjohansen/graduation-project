import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PageTitle } from './components/PageTitle';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import AboutUs from './pages/AboutUs';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Drills from './pages/Drills';
import Home from './pages/Home';
import Instructions from './pages/Instructions';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Home" />
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <PageTitle title="About Us" />
                <AboutUs />
              </>
            }
          />
          <Route
            path="/auth"
            element={
              <>
                <PageTitle title="Authentication" />
                <Auth />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <>
                  <PageTitle title="Dashboard" />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructions"
            element={
              <ProtectedRoute requireAdmin={false}>
                <>
                  <PageTitle title="Instructions" />
                  <Instructions />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <>
                  <PageTitle title="Admin Dashboard" />
                  <Admin />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/drills"
            element={
              <ProtectedRoute requireAdmin={false}>
                <>
                  <PageTitle title="Drills" />
                  <Drills />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
