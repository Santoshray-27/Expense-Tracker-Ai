import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BrainCircuit, BarChart3, Coins, Database, ChevronRight, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const LandingPage = ({ onGetStarted }) => {
  // AI Demo Input
  const [demoText, setDemoText] = useState('spent 42 dollars on groceries at Walmart today');
  const [demoOutput, setDemoOutput] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  // Growth Simulator
  const [income, setIncome] = useState(5000);
  const [saveRate, setSaveRate] = useState(25); // percentage
  const [annualReturn, setAnnualReturn] = useState(8); // percentage

  const handleDemoParse = (e) => {
    e.preventDefault();
    setDemoLoading(true);
    setDemoOutput(null);

    // High fidelity offline client-side parsing simulation matching our server's smart fallback
    setTimeout(() => {
      const normalized = demoText.toLowerCase();
      let type = 'expense';
      if (normalized.includes('earned') || normalized.includes('salary') || normalized.includes('received') || normalized.includes('freelance') || normalized.includes('dividend')) {
        type = 'income';
      }

      let amount = 0;
      const cleanText = normalized.replace(/,/g, '');
      const numberMatches = cleanText.match(/\b\d+(\.\d+)?\b/);
      if (numberMatches) {
        amount = parseFloat(numberMatches[0]);
      } else {
        amount = 15.00; // default mock
      }

      let category = 'Other';
      if (normalized.includes('pizza') || normalized.includes('groceries') || normalized.includes('food') || normalized.includes('lunch') || normalized.includes('coffee')) category = 'Food';
      else if (normalized.includes('uber') || normalized.includes('taxi') || normalized.includes('gas') || normalized.includes('bus')) category = 'Transport';
      else if (normalized.includes('rent') || normalized.includes('electricity') || normalized.includes('wifi') || normalized.includes('phone')) category = 'Bills';
      else if (normalized.includes('movie') || normalized.includes('netflix') || normalized.includes('game') || normalized.includes('drinks')) category = 'Entertainment';
      else if (normalized.includes('clothes') || normalized.includes('shopping') || normalized.includes('amazon')) category = 'Shopping';
      else if (type === 'income') category = 'Salary';

      let description = demoText
        .replace(/spent|received|earned|for|on|at|dollars|bucks|rupees|today|yesterday/gi, '')
        .trim();
      description = description ? description.charAt(0).toUpperCase() + description.slice(1) : 'Logged transaction';

      setDemoOutput({
        amount,
        type,
        category,
        description,
        date: new Date().toISOString().split('T')[0]
      });
      setDemoLoading(false);
    }, 800);
  };

  // Generate 5-year Compound Savings Projection Data
  const generateProjectionData = () => {
    const monthlyContribution = income * (saveRate / 100);
    const r = (annualReturn / 100) / 12; // monthly rate
    const data = [];
    let balance = 0;
    let totalInvested = 0;

    // Push starting point
    data.push({ month: 'Start', Wealth: 0, Invested: 0 });

    for (let year = 1; year <= 5; year++) {
      for (let m = 1; m <= 12; m++) {
        balance = (balance + monthlyContribution) * (1 + r);
        totalInvested += monthlyContribution;
      }
      data.push({
        month: `Yr ${year}`,
        Wealth: Math.round(balance),
        Invested: Math.round(totalInvested)
      });
    }
    return data;
  };

  const projectionData = generateProjectionData();
  const yearlySavings = Math.round(income * (saveRate / 100) * 12);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-50 blur-[100px]" style={{ background: 'var(--chart-1)' }} />
      <div className="absolute top-[400px] right-1/4 -z-10 h-[600px] w-[600px] translate-x-1/2 rounded-full opacity-30 blur-[120px]" style={{ background: 'var(--chart-3)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary/30 text-primary" />
            Introducing the Next-Generation Wealth Assistant
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight sm:leading-none"
          >
            Command your capital. <br />
            <span className="gradient-text">
              Powered by Intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground text-base sm:text-lg mt-6 leading-relaxed"
          >
            SmartWealth AI transcends simple expense logs. Speak to it naturally to record cash flows, map dynamic category budget guards, and receive empathetic savings advice engineered by Google Gemini.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          >
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg glow-primary hover:opacity-90 transition-all self-stretch sm:self-auto"
            >
              Start Syncing Ledger
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#sandbox"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-all self-stretch sm:self-auto"
            >
              Test AI Sandbox
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* INTERACTIVE DEMOS SECTION */}
        <div id="sandbox" className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16 pt-8">
          
          {/* SANDBOX AI DEMO CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card card-hover"
          >
            <div>
              <div className="flex items-center gap-2 text-chart-2 font-extrabold text-lg mb-1">
                <BrainCircuit className="h-5.5 w-5.5 text-chart-2 fill-chart-2/5" />
                Interactive AI Parsing Playground
              </div>
              <p className="text-muted-foreground text-xs mb-6">
                Type an expense below to test our smart Natural Language processing logic. See the structured schema we build instantly.
              </p>

              <form onSubmit={handleDemoParse} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    className="flex-grow rounded-xl border border-input bg-muted py-2.5 px-4 text-xs sm:text-sm text-foreground outline-none focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    disabled={demoLoading || !demoText.trim()}
                    className="rounded-xl bg-chart-2 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {demoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Structured Output Matrix</div>
                <div className="rounded-xl border border-border bg-foreground/95 dark:bg-background p-4 text-xs font-mono text-chart-1 overflow-x-auto min-h-[140px] flex items-center">
                  {demoLoading ? (
                    <div className="flex items-center justify-center gap-2 mx-auto text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Parsing text parameters...
                    </div>
                  ) : demoOutput ? (
                    <pre className="w-full text-left">{JSON.stringify(demoOutput, null, 2)}</pre>
                  ) : (
                    <span className="text-muted-foreground italic mx-auto">Click "Run" to test compile values.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-chart-1" />
                Privacy Protected: Sandbox calculations are completely client-side.
              </span>
            </div>
          </motion.div>

          {/* GROWTH SIMULATOR INTERACTIVE GRAPH */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-primary font-extrabold text-lg mb-1">
                <Coins className="h-5.5 w-5.5 text-primary" />
                Compound Wealth Simulator
              </div>
              <p className="text-muted-foreground text-xs mb-6">
                Simulate your future portfolio growth. Slide your monthly cashflow variables to model 5-year projections.
              </p>

              <div className="space-y-4 mb-6">
                {/* Income Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Monthly Income</span>
                    <span className="text-primary font-bold">${income.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Savings Rate Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Target Savings Rate</span>
                    <span className="text-primary font-bold">{saveRate}% (${Math.round(income * (saveRate / 100)).toLocaleString()}/mo)</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="75"
                    step="5"
                    value={saveRate}
                    onChange={(e) => setSaveRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Expected Return Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Annual Interest Return</span>
                    <span className="text-primary font-bold">{annualReturn}% (Compounded)</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Area Chart visualization */}
              <div className="w-full h-[150px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Total Wealth']}
                      contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: '11px', background: 'var(--card)', color: 'var(--foreground)' }}
                    />
                    <Area type="monotone" dataKey="Wealth" stroke="var(--chart-1)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWealth)" />
                    <Area type="monotone" dataKey="Invested" stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>Annual Savings: <b className="text-foreground">${yearlySavings.toLocaleString()}</b></span>
              <span>5-Yr Projected: <b className="text-primary">${projectionData[projectionData.length - 1].Wealth.toLocaleString()}</b></span>
            </div>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-28">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Built with modern financial guardrails</h2>
            <p className="text-muted-foreground text-sm mt-2">Every feature you need to secure and optimize your financial balance sheets.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BrainCircuit, title: 'Gemini AI Coach', desc: 'Receive customized markdown-based financial audits compiling cashflows, patterns, and budgets.' },
              { icon: Zap, title: 'Conversational Input', desc: 'Avoid typing complex details manually. Speak naturally and let the smart NLP parser extract database values.' },
              { icon: ShieldCheck, title: 'Budget Guardrails', desc: 'Color-coded warning progress gauges prevent and alert you of limit overruns before they happen.' },
              { icon: Database, title: 'Data Portability', desc: 'Own and control your records. Click a single button to download your entire ledger history as a standard CSV report.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card card-hover group"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20 group-hover:glow-primary transition-all">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-base">{feature.title}</h3>
                <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA BOTTOM ROW */}
        <div className="mt-28 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-chart-4 to-chart-5 p-8 sm:p-12 text-center text-primary-foreground relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to master your capital?</h2>
          <p className="text-white/70 text-xs sm:text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Join thousands of users leveraging smart, secure artificial intelligence to monitor transactions, secure budget limits, and build lasting net wealth today.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-primary shadow-lg mt-8 hover:bg-white/90 hover:shadow-xl transition-all"
          >
            Launch Free Console
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
