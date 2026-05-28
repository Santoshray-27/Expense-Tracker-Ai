import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, User, Loader2, ArrowRight } from 'lucide-react';

const Auth = () => {
  const { login, register, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const toggleAuthMode = (mode) => {
    setIsRegister(mode);
    clearError();
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (isRegister && !username) {
      setLocalError('Username is required for registration');
      return;
    }

    setSubmitting(true);
    let success = false;
    if (!isRegister) {
      success = await login(email, password);
    } else {
      success = await register(username, email, password);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 border border-primary/20 pulse-ring">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isRegister ? 'Get started on managing your wealth' : 'Log in to sync your ledger'}
          </p>
        </div>

        {/* Sliding Pill Tabs */}
        <div className="relative flex p-1 bg-muted rounded-xl mb-6">
          <button
            type="button"
            onClick={() => toggleAuthMode(false)}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold text-center transition-colors rounded-lg duration-300 focus:outline-none ${
              !isRegister ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => toggleAuthMode(true)}
            className={`relative z-10 w-1/2 py-2 text-sm font-semibold text-center transition-colors rounded-lg duration-300 focus:outline-none ${
              isRegister ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Register
          </button>

          {/* Background Pill Slider */}
          <motion.div
            className="absolute top-1 bottom-1 left-1 bg-card rounded-lg shadow-sm border border-border"
            style={{ width: 'calc(50% - 4px)' }}
            animate={{ x: isRegister ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </div>

        {/* Error Feedback */}
        <AnimatePresence mode="wait">
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive font-medium">
                {localError || error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-1 focus:ring-ring"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md glow-primary transition-all hover:opacity-90 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
