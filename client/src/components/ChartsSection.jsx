import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';

// Using CSS variable-derived chart colors for consistency
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#8b5cf6', // Violet fallback
  '#ec4899', // Pink fallback
  '#06b6d4', // Cyan fallback
  '#14b8a6'  // Teal fallback
];

// Hex fallback colors for Recharts (which may not handle CSS vars in all cases)
const CHART_HEX_COLORS = [
  '#4dd0b0', // chart-1 approx
  '#1fab8e', // chart-2 approx
  '#13876e', // chart-3 approx
  '#0e6d59', // chart-4 approx
  '#0a5545', // chart-5 approx
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#14b8a6'
];

const ChartsSection = ({ transactions, budgets }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // 1. Pie Chart groupings (All expenses grouped by category)
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
    const cat = t.category;
    acc[cat] = (acc[cat] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  // 2. Bar Chart groups (Budgets vs. Spent, current month only)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const budgetBarData = budgets.map(b => {
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category.toLowerCase() === b.category.toLowerCase() &&
        new Date(t.date) >= startOfMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: b.category,
      Limit: b.limit,
      Spent: parseFloat(spent.toFixed(2))
    };
  });

  const hasExpenses = pieData.length > 0;
  const hasBudgets = budgetBarData.length > 0;

  return (
    <div className={`grid grid-cols-1 ${hasBudgets ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
      {/* Category Breakdown Pie Chart */}
      <div className="flex flex-col h-[380px] rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-1.5">
          <PieIcon className="h-5 w-5 text-primary" />
          <h4 className="text-base font-bold text-foreground">Expense Allocation Breakdown</h4>
        </div>
        <p className="text-muted-foreground text-xs mb-6">
          Proportional breakdown of all expenses registered in your workspace ledger.
        </p>

        {!hasExpenses ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 p-4">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-muted-foreground">No expense records found</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">Add an expense to activate this distribution map</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[220px] mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--foreground)' }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  formatter={(value) => [`$${value}`, 'Spent']}
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: 'var(--card)', color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Budget limits comparison chart */}
      {hasBudgets && (
        <div className="flex flex-col h-[380px] rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-1.5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h4 className="text-base font-bold text-foreground">Budget vs Monthly Spending</h4>
          </div>
          <p className="text-muted-foreground text-xs mb-6">
            Compare active monthly budget ceilings against your real-time cash outflows.
          </p>

          <div className="w-full h-[220px] mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <ChartTooltip
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: 'var(--card)', color: 'var(--foreground)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Limit" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Budget Limit" />
                <Bar dataKey="Spent" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Current Month Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsSection;
