import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PageTitle } from './components/PageTitle';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeProvider } from './components/theme-provider';
import AboutUs from './pages/AboutUs';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Drills from './pages/Drills';
import Home from './pages/Home';
import Instructions from './pages/Instructions';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
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
            }          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
