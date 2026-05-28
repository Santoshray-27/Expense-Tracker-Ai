import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Trash2, HelpCircle, Check, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Shopping',
  'Bills',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Other'
];

const BudgetManager = ({ budgets, transactions, onBudgetUpdated }) => {
  const { api } = useAuth();

  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const calculateSpent = (catName) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category.toLowerCase() === catName.toLowerCase() &&
        new Date(t.date) >= startOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!limit || isNaN(parseFloat(limit)) || parseFloat(limit) < 0) {
      setErrorMsg('Please enter a valid positive budget limit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/budgets', {
        category,
        limit: parseFloat(limit)
      });

      if (res.data.success) {
        setSuccessMsg(`Monthly budget configured for "${category}"!`);
        setLimit('');
        if (onBudgetUpdated) onBudgetUpdated();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error configuring budget limit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/budgets/${budgetId}`);
      if (res.data.success) {
        setSuccessMsg('Budget guard removed successfully.');
        if (onBudgetUpdated) onBudgetUpdated();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to remove budget guard.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Set Budget Form Card */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card h-fit"
      >
        <div className="flex items-center gap-2 text-foreground font-bold text-base mb-1">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Establish Limits
        </div>
        <p className="text-muted-foreground text-xs mb-5">
          Establish monthly ceilings for categories to prevent overspending alerts.
        </p>

        {errorMsg && (
          <div className="mb-4 flex gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex gap-2 rounded-xl border border-chart-1/20 bg-chart-1/10 p-3 text-xs text-chart-1 font-medium animate-pulse">
            <Check className="h-4 w-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSetBudget} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted p-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Monthly Ceiling ($)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted py-2.5 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card placeholder:text-muted-foreground"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md glow-primary transition-all hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Category Guard'}
          </motion.button>
        </form>
      </motion.div>

      {/* Progress Bars & Grid Display */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <h3 className="text-lg font-bold text-foreground mb-1">Monthly Ceiling Monitors & Gauges</h3>
        <p className="text-xs text-muted-foreground mb-5">
          Real-time check on active budget guards. System automatically flags limits in orange or red.
        </p>

        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 p-12 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <h4 className="text-sm font-bold text-foreground">No active budget guards</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
              Set up a monthly budget ceiling on the left to activate visual spending progress tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-sm text-muted-foreground">
              <thead className="bg-muted/70 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3 text-right">Limit</th>
                  <th scope="col" className="px-6 py-3 text-right">Spent (Month)</th>
                  <th scope="col" className="px-6 py-3">Progress Status</th>
                  <th scope="col" className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {budgets.map((b) => {
                  const spent = calculateSpent(b.category);
                  const percent = b.limit > 0 ? (spent / b.limit) * 100 : 0;

                  let progressColor = 'bg-chart-1';
                  let textColor = 'text-chart-1';
                  let statusText = 'Safe';

                  if (percent > 100) {
                    progressColor = 'bg-destructive';
                    textColor = 'text-destructive';
                    statusText = 'Exceeded!';
                  } else if (percent >= 80) {
                    progressColor = 'bg-chart-2';
                    textColor = 'text-chart-2';
                    statusText = 'Warning!';
                  }

                  return (
                    <tr key={b._id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{b.category}</td>
                      <td className="px-6 py-4 text-right font-medium text-foreground/70">${b.limit.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">${spent.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-[160px]">
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percent, 100)}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full ${progressColor}`}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-muted-foreground font-medium">{percent.toFixed(0)}% used</span>
                            <span className={`font-bold ${textColor}`}>{statusText}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteBudget(b._id)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BudgetManager;
