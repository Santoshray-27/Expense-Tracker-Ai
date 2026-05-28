import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Coins, LogOut, LogIn, Sparkles, Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode, onLogin }) => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border glass-panel !rounded-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm glow-primary">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground tracking-tight text-lg flex items-center gap-1.5 leading-none">
                SmartWealth
                <span className="inline-flex items-center gap-1 rounded-full bg-chart-1/10 px-2 py-0.5 text-[10px] font-medium text-chart-2 border border-chart-1/20">
                  <Sparkles className="h-2.5 w-2.5 fill-chart-1 text-chart-1" />
                  AI Coach
                </span>
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>

            {user ? (
              /* Logged-in: avatar + logout */
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-foreground">{user.username}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </motion.button>
              </div>
            ) : (
              /* Not logged-in: Login button */
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
