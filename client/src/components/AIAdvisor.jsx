import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BrainCircuit, Shield, Loader2, ArrowRight, TrendingUp } from 'lucide-react';

const LOADING_STEPS = [
  'Establishing secure pipeline to AI neural models...',
  'Compiling transactions history registers...',
  'Extracting active category-level budgets...',
  'Computing relative monthly spending quotients...',
  'Querying Google Gemini API generative core...',
  'Synthesizing savings coaching strategies and audits...'
];

const AIAdvisor = ({ transactions, budgets }) => {
  const { api } = useAuth();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [aiMode, setAiMode] = useState('');

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleConsultCoach = async () => {
    setLoading(true);
    setErrorMsg('');
    setAnalysis('');

    try {
      const res = await api.get('/ai/coach');
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setAiMode(res.data.mode);
      } else {
        setErrorMsg('AI Engine was unable to compile advice. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch coaching report. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const parseBoldText = (text) => {
    if (!text) return '';
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      return i % 2 === 1 ? (
        <strong key={i} className="font-bold text-foreground">
          {part}
        </strong>
      ) : (
        part
      );
    });
  };

  const renderAdvisorReport = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Heading 1 (# title)
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-6 mb-3">
            {trimmed.substring(2)}
          </h1>
        );
      }

      // Heading 2 (## subtitle)
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-5 mb-2.5 pb-1 border-b border-border">
            {trimmed.substring(3)}
          </h2>
        );
      }

      // Heading 3 (### section)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-chart-2 tracking-tight mt-4 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      }

      // Bullet Points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="ml-5 mb-1.5 list-disc text-sm sm:text-base text-foreground/80 leading-relaxed">
            {parseBoldText(trimmed.substring(2))}
          </li>
        );
      }

      // Numbered Lists (e.g., 1. item)
      const numberedMatch = trimmed.match(/^\d+\.\s+(.*)/);
      if (numberedMatch) {
        return (
          <li key={index} className="ml-5 mb-2 list-decimal text-sm sm:text-base text-foreground/80 leading-relaxed">
            {parseBoldText(numberedMatch[1])}
          </li>
        );
      }

      // Paragraph spaces
      if (trimmed === '') {
        return <div key={index} className="h-2.5" />;
      }

      // Horizontal rules
      if (trimmed === '---') {
        return <hr key={index} className="my-5 border-border" />;
      }

      // Normal text
      return (
        <p key={index} className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-2">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <BrainCircuit className="h-6 w-6 text-primary" />
            SmartWealth AI™ Financial Coach
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Leverage Google Gemini AI to audit your expenditures and output tailored suggestions.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleConsultCoach}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md glow-primary transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none self-stretch sm:self-auto justify-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? 'Consulting AI...' : 'Consult Coach'}
        </motion.button>
      </div>

      <hr className="my-5 border-border" />

      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted py-12 px-6 text-center"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h4 className="text-base font-bold text-foreground">Reviewing Ledger Portfolio</h4>
            <p className="text-xs text-chart-2 font-medium italic mt-1 bg-chart-2/10 border border-chart-2/20 px-3 py-1 rounded-full transition-all max-w-[400px]">
              "{LOADING_STEPS[loadingStep]}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive font-medium">
          {errorMsg}
        </div>
      )}

      {/* Analysis Output Result container */}
      <AnimatePresence mode="wait">
        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-chart-1/10 px-3 py-1 text-xs font-semibold text-chart-1 border border-chart-1/20">
              <Shield className="h-3.5 w-3.5" />
              Wealth Coach Audit Active: {aiMode}
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 md:p-8 shadow-card">
              <div className="max-w-3xl mx-auto">
                {renderAdvisorReport(analysis)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Default */}
      {!analysis && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 py-12 px-4 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <h4 className="text-sm font-bold text-foreground">Financial Advisor Offline</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[420px] mb-5 leading-relaxed">
            Record a few transactions, setup budget ceilings, and click the consult button to summon the SmartWealth AI coach.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConsultCoach}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-card px-4 py-2 text-xs font-bold text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            Consult Coach Now
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default AIAdvisor;
