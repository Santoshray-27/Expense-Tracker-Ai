import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { Loader2, ChevronLeft } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  // State to switch from Landing Page to Login/Signup card
  const [showAuth, setShowAuth] = useState(false);

  // Reset to landing page when user logs out
  useEffect(() => {
    if (!user && !loading) {
      setShowAuth(false);
    }
  }, [user, loading]);

  // Dark mode state — default to light theme
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smartwealth-theme');
      if (stored) return stored === 'dark';
    }
    return false; // Light mode by default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('smartwealth-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smartwealth-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-screen bg-background"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="mb-4"
          >
            <Loader2 className="w-10 h-10 text-primary" />
          </motion.div>
          <p className="text-muted-foreground text-sm font-semibold">
            Syncing your wealth workspace...
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col min-h-screen bg-background"
        >
          {/* Header Nav */}
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogin={() => setShowAuth(true)} />

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {user ? (
                // 1. Authenticated view: Dashboard
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Dashboard />
                </motion.div>
              ) : showAuth ? (
                // 2. Unauthenticated Login/Signup view
                <motion.div
                  key="auth-portal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="py-6"
                >
                  <div className="max-w-md mx-auto px-4 mt-6">
                    <button
                      onClick={() => setShowAuth(false)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2 bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      Back to homepage
                    </button>
                  </div>
                  <Auth />
                </motion.div>
              ) : (
                // 3. Public landing page
                <motion.div
                  key="landing-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LandingPage onGetStarted={() => setShowAuth(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="py-6 border-t border-border bg-card text-center text-xs text-muted-foreground mt-auto">
            © {new Date().getFullYear()} SmartWealth AI.
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
