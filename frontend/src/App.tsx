import { ThemeProvider } from "./components/theme-provider";
import { Layout } from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Auth from "./pages/Auth";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
