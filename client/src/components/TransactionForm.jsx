import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, DollarSign, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Shopping',
  'Bills',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Salary',
  'Investment',
  'Other'
];

const TransactionForm = ({ onTransactionAdded }) => {
  const { api } = useAuth();

  // Standard Form State
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // AI Parser State
  const [aiText, setAiText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null); // { message, type }

  const handleAiParse = async (e) => {
    e.preventDefault();
    if (!aiText.trim()) return;

    setParsing(true);
    setAlert(null);
    try {
      const res = await api.post('/ai/parse', { text: aiText });
      if (res.data.success && res.data.data) {
        const { amount, type, category, description, date } = res.data.data;

        // Populate fields
        if (amount) setAmount(amount.toString());
        if (type) setType(type);
        if (category) setCategory(category);
        if (description) setDescription(description);
        if (date) setDate(date.split('T')[0]);

        setAlert({
          type: 'success',
          message: `AI parsed successfully! Mode: ${res.data.mode}. Review the form fields below and click Save.`
        });
      } else {
        setAlert({
          type: 'error',
          message: 'AI was unable to parse this input. Please enter details manually.'
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        message: 'Failed to reach AI parsing service. Please log manually.'
      });
    } finally {
      setParsing(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAlert({
        type: 'error',
        message: 'Please enter a valid positive amount.'
      });
      return;
    }

    setSaving(true);
    setAlert(null);

    try {
      const res = await api.post('/transactions', {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date)
      });

      if (res.data.success) {
        // Clear inputs
        setAmount('');
        setDescription('');
        setAiText('');
        setDate(new Date().toISOString().split('T')[0]);

        if (res.data.budgetWarning) {
          setAlert({
            type: 'warning',
            message: res.data.budgetWarning
          });
        } else {
          setAlert({
            type: 'success',
            message: 'Transaction saved successfully!'
          });
        }

        if (onTransactionAdded) {
          onTransactionAdded();
        }
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Error saving transaction.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Quick Input Block */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-chart-2/20 bg-chart-2/5 p-6 shadow-card"
      >
        <div className="flex items-center gap-2 text-chart-2 font-bold text-base mb-1.5">
          <Sparkles className="h-5 w-5 text-chart-2 fill-chart-2/10" />
          AI Quick-Parse Input
        </div>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          Type how much you spent or received in plain language and let the AI fill the form for you!
          <br />
          <span className="text-muted-foreground/70 text-xs italic">
            Example: "spent 35 dollars on lunch yesterday at subway" or "earned 250 bucks in dividend today"
          </span>
        </p>

        <form onSubmit={handleAiParse} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="spent 25 dollars on coffee tonight..."
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            disabled={parsing}
            className="flex-grow rounded-xl border border-input bg-card py-2.5 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-chart-2 focus:ring-1 focus:ring-chart-2/50 disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={parsing || !aiText.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-chart-2 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Parse
          </motion.button>
        </form>
      </motion.div>

      {/* Main Manual / Pre-filled Form Block */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <h3 className="text-lg font-bold text-foreground mb-1">Transaction Ledger Form</h3>
        <p className="text-xs text-muted-foreground mb-5">
          Review, modify, and submit transaction records to your financial database.
        </p>

        {/* Dynamic AnimatePresence Alert banners */}
        <AnimatePresence mode="wait">
          {alert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div
                className={`flex gap-2.5 rounded-xl border p-4 text-sm font-medium ${
                  alert.type === 'success'
                    ? 'border-chart-1/20 bg-chart-1/10 text-chart-1'
                    : alert.type === 'warning'
                    ? 'border-chart-2/20 bg-chart-2/10 text-chart-2'
                    : 'border-destructive/20 bg-destructive/10 text-destructive'
                }`}
              >
                {alert.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
                {alert.type === 'error' && <Info className="h-5 w-5 flex-shrink-0" />}
                <div className="flex-1 leading-normal">{alert.message}</div>
                <button
                  type="button"
                  onClick={() => setAlert(null)}
                  className="text-xs font-semibold opacity-60 hover:opacity-100"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted p-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
              </select>
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-input bg-muted py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted p-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted py-2 px-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card"
              />
            </div>
          </div>

          {/* Description input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Description / Vendor</label>
            <input
              type="text"
              placeholder="e.g., Starbucks, Target, Rent invoice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted py-2.5 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-card placeholder:text-muted-foreground"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md glow-primary transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Transaction'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionForm;
