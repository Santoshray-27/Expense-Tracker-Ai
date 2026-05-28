import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Target, Trash2, Plus, Calendar, DollarSign, Trophy, Sparkles, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const GoalTracker = () => {
  const { api } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Inline "Add Savings" state per goal
  const [addAmt, setAddAmt] = useState({}); // goalId: amount
  const [updatingGoalId, setUpdatingGoalId] = useState(null);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.error('Fetch Goals Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name || !target || isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
      setFormError('Please enter a valid goal name and target amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/goals', {
        name,
        target: parseFloat(target),
        deadline: deadline || null
      });

      if (res.data.success) {
        setFormSuccess(`Goal "${name}" created successfully!`);
        setName('');
        setTarget('');
        setDeadline('');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error creating goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSavings = async (goalId, currentSaved) => {
    const increment = parseFloat(addAmt[goalId]);
    if (isNaN(increment) || increment <= 0) return;

    setUpdatingGoalId(goalId);
    try {
      const res = await api.put(`/goals/${goalId}`, {
        current: currentSaved + increment
      });

      if (res.data.success) {
        // Clear input for this goal
        setAddAmt(prev => ({ ...prev, [goalId]: '' }));
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingGoalId(null);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const res = await api.delete(`/goals/${id}`);
      if (res.data.success) {
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
        <span className="text-muted-foreground text-xs font-semibold">Syncing wealth goals...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Create New Goal Card */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card h-fit"
      >
        <div className="flex items-center gap-2 text-foreground font-bold text-base mb-1">
          <Target className="h-5 w-5 text-primary" />
          Establish Wealth Goals
        </div>
        <p className="text-muted-foreground text-xs mb-5">
          Establish saving targets for major items (e.g. emergency savings, vehicle, vacations).
        </p>

        {formError && (
          <div className="mb-4 flex gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 flex gap-2 rounded-xl border border-chart-1/20 bg-chart-1/10 p-3 text-xs text-chart-1 font-medium animate-pulse">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted py-2 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Target Amount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                required
                placeholder="0.00"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Target Deadline (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted py-2 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md glow-primary transition-all hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Set Savings Target
          </motion.button>
        </form>
      </motion.div>

      {/* Goal Cards Grid List */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Active Savings Milestones</h3>
            <p className="text-xs text-muted-foreground">Track and fund your long-term compound savings goals.</p>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-card">
            <Target className="h-10 w-10 text-muted-foreground/30 mb-2" />
            <h4 className="text-sm font-bold text-foreground">No active wealth milestones</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
              Setup a long term saving goal on the left to start budgeting towards your milestones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {goals.map((g) => {
                const percent = Math.min((g.current / g.target) * 100, 100);
                const isCompleted = percent >= 100;

                return (
                  <motion.div
                    key={g._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card card-hover flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Completion glow banner */}
                    {isCompleted && (
                      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full blur-xl" style={{ background: 'var(--chart-1)', opacity: 0.15 }} />
                    )}

                    <div>
                      {/* Card Title Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-chart-1" />
                          ) : (
                            <Trophy className="h-4 w-4 text-chart-2" />
                          )}
                          <span className="font-bold text-foreground text-sm leading-tight">{g.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(g._id)}
                          className="text-muted-foreground/40 hover:text-destructive rounded-lg p-1 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Currency metrics */}
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-xl font-extrabold text-foreground">${g.current.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">target: <b>${g.target.toLocaleString()}</b></span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5 mb-5">
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${isCompleted ? 'bg-chart-1' : 'bg-primary'}`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                          <span>{percent.toFixed(0)}% Completed</span>
                          {g.deadline && (
                            <span className="flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(g.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Funding controller block */}
                    {!isCompleted && (
                      <div className="pt-3 border-t border-border flex gap-2">
                        <div className="relative flex-grow">
                          <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="number"
                            placeholder="Add funds"
                            value={addAmt[g._id] || ''}
                            onChange={(e) => setAddAmt(prev => ({ ...prev, [g._id]: e.target.value }))}
                            className="w-full rounded-lg border border-input bg-muted py-1.5 pl-7 pr-2 text-xs text-foreground outline-none focus:border-primary focus:bg-card placeholder:text-muted-foreground"
                          />
                        </div>
                        <button
                          onClick={() => handleAddSavings(g._id, g.current)}
                          disabled={updatingGoalId === g._id || !addAmt[g._id]}
                          className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-colors"
                        >
                          {updatingGoalId === g._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Fund'}
                        </button>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="pt-2 border-t border-border/50 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-chart-1 bg-chart-1/10 border border-chart-1/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Milestone Complete!
                        </span>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GoalTracker;
