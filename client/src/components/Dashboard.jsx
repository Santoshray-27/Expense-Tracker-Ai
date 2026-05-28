import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  HelpCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Download,
  Search,
  Filter
} from 'lucide-react';

import TransactionForm from './TransactionForm';
import ChartsSection from './ChartsSection';
import BudgetManager from './BudgetManager';
import GoalTracker from './GoalTracker';
import AIAdvisor from './AIAdvisor';

const TABS = [
  { id: 0, label: 'Overview & Analytics', icon: LayoutDashboard },
  { id: 1, label: 'Add Transaction', icon: PlusCircle },
  { id: 2, label: 'Budget Guards', icon: ShieldCheck },
  { id: 3, label: 'Savings Goals', icon: Target },
  { id: 4, label: 'AI Wealth Coach', icon: Sparkles }
];

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

const Dashboard = () => {
  const { api } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);
    setErrorMsg('');
    try {
      const [transRes, budgetRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets')
      ]);

      if (transRes.data.success) {
        setTransactions(transRes.data.data);
      }
      if (budgetRes.data.success) {
        setBudgets(budgetRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to sync financial data with the cloud server.');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTransaction = async (id) => {
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        fetchDashboardData(true); // silent refresh
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error deleting transaction record.');
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    // Build headers row
    const headers = ['Date', 'Description/Vendor', 'Category', 'Type', 'Amount ($)'];
    
    // Convert transaction rows
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      `"${t.description?.replace(/"/g, '""') || 'N/A'}"`,
      t.category,
      t.type,
      t.amount.toFixed(2)
    ]);

    // Build overall CSV text
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    // Create a virtual anchor and click it to trigger native download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartWealth_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Arithmetic computations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Filter computation logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground text-sm font-medium">Syncing your cashflow ledgers...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Alert */}
      {errorMsg && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Floating Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Income Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card card-hover relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-chart-1 rounded-l-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Income</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-chart-1 tracking-tight mt-1">
                ${totalIncome.toFixed(2)}
              </h3>
            </div>
            <div className="h-10 w-10 bg-chart-1/10 text-chart-1 rounded-xl flex items-center justify-center border border-chart-1/20 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </motion.div>

        {/* Expenses Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card card-hover relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive rounded-l-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Outflow</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-destructive tracking-tight mt-1">
                ${totalExpense.toFixed(2)}
              </h3>
            </div>
            <div className="h-10 w-10 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center border border-destructive/20 shadow-sm">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card card-hover relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
            netSavings >= 0 ? 'bg-primary' : 'bg-chart-2'
          }`} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Net Wealth Balance</p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${
                netSavings >= 0 ? 'text-primary' : 'text-chart-2'
              }`}>
                ${netSavings.toFixed(2)}
              </h3>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm ${
              netSavings >= 0 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'bg-chart-2/10 border-chart-2/20 text-chart-2'
            }`}>
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Segmented Slide Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted rounded-xl max-w-full">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg focus:outline-none transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}

                {/* Background Slider Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm -z-10 border border-border"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Sync button */}
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={syncing}
          className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </button>
      </div>

      {/* Active Tab View Rendering */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 0: Overview, Analytics & Searchable Table */}
          {activeTab === 0 && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Chart Sections */}
              <ChartsSection transactions={transactions} budgets={budgets} />

              {/* Transactions Ledger Panel */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                
                {/* Header Action Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Financial Transactions Ledger</h3>
                    <p className="text-xs text-muted-foreground">
                      Complete history of your logged deposits and expenditures.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleExportCSV}
                      disabled={transactions.length === 0}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent transition-colors disabled:opacity-40"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </button>
                    <button
                      onClick={() => setActiveTab(1)}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-colors"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Log Record
                    </button>
                  </div>
                </div>

                <hr className="my-4 border-border" />

                {/* SEARCH & FILTER PARAMETERS PANEL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search vendor / description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-input bg-muted py-2 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary focus:bg-card focus:ring-1 focus:ring-ring transition-all placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Type:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="flex-grow rounded-xl border border-input bg-muted p-2 text-xs text-foreground outline-none focus:border-primary focus:bg-card"
                    >
                      <option value="all">All Entries</option>
                      <option value="expense">Expenses (-)</option>
                      <option value="income">Income (+)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Category:</span>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="flex-grow rounded-xl border border-input bg-muted p-2 text-xs text-foreground outline-none focus:border-primary focus:bg-card"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TABLE RENDERER */}
                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-muted/50">
                    <HelpCircle className="h-10 w-10 text-muted-foreground/40 mb-2" />
                    <h4 className="text-sm font-bold text-foreground">No matching entries found</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                      Try adjusting your search criteria or register a new transaction.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border max-h-[360px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-sm text-muted-foreground">
                      <thead className="bg-muted/70 sticky top-0 z-10 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-6 py-3 bg-muted">Date</th>
                          <th scope="col" className="px-6 py-3 bg-muted">Description</th>
                          <th scope="col" className="px-6 py-3 bg-muted">Category</th>
                          <th scope="col" className="px-6 py-3 bg-muted">Type</th>
                          <th scope="col" className="px-6 py-3 bg-muted text-right">Amount</th>
                          <th scope="col" className="px-6 py-3 bg-muted text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTransactions.map((t) => (
                          <tr key={t._id} className="hover:bg-accent/50 transition-colors">
                            <td className="px-6 py-3.5 whitespace-nowrap text-foreground/70 font-medium text-xs">
                              {new Date(t.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-3.5 text-foreground font-semibold">{t.description || 'N/A'}</td>
                            <td className="px-6 py-3.5">
                              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                                {t.category}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                t.type === 'income' 
                                  ? 'bg-chart-1/10 text-chart-1 border border-chart-1/20' 
                                  : 'bg-destructive/10 text-destructive border border-destructive/20'
                              }`}>
                                {t.type}
                              </span>
                            </td>
                            <td className={`px-6 py-3.5 text-right font-extrabold text-sm ${
                              t.type === 'income' ? 'text-chart-1' : 'text-foreground'
                            }`}>
                              {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-3.5 text-center">
                              <button
                                onClick={() => handleDeleteTransaction(t._id)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 1: Form logs */}
          {activeTab === 1 && (
            <motion.div
              key="add-transaction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <TransactionForm onTransactionAdded={() => fetchDashboardData(true)} />
            </motion.div>
          )}

          {/* TAB 2: Budget Managers */}
          {activeTab === 2 && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BudgetManager
                budgets={budgets}
                transactions={transactions}
                onBudgetUpdated={() => fetchDashboardData(true)}
              />
            </motion.div>
          )}

          {/* TAB 3: Goals Trackers */}
          {activeTab === 3 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GoalTracker />
            </motion.div>
          )}

          {/* TAB 4: AI Coach Reports */}
          {activeTab === 4 && (
            <motion.div
              key="ai-coach"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AIAdvisor transactions={transactions} budgets={budgets} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
