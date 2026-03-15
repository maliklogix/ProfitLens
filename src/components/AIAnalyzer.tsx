import React from 'react';
import { Sparkles, Brain, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIAnalyzerProps {
  data: {
    netProfit: number;
    margin: number;
    roi: number;
    buyingPrice: number;
    sellingPrice: number;
  } | null;
}

const AIAnalyzer: React.FC<AIAnalyzerProps> = ({ data }) => {
  if (!data) return null;

  const recommendations = [];
  
  if (data.roi > 50) {
    recommendations.push({
      type: 'success',
      icon: CheckCircle2,
      text: "Elite ROI detected. This is a high-conviction deal. Consider immediate procurement.",
    });
  } else if (data.roi > 25) {
    recommendations.push({
      type: 'info',
      icon: TrendingUp,
      text: "Healthy margins. Performance aligns with benchmark standards for modern architects.",
    });
  } else if (data.roi > 0) {
    recommendations.push({
      type: 'warning',
      icon: AlertTriangle,
      text: "Margins are thin. Verify all overheads (prep/shipping) to ensure break-even safety.",
    });
  } else {
    recommendations.push({
      type: 'error',
      icon: AlertTriangle,
      text: "Negative yield predicted. Re-evaluate sourcing price or target selling category.",
    });
  }

  if (data.sellingPrice > data.buyingPrice * 3) {
    recommendations.push({
      type: 'info',
      icon: Sparkles,
      text: "Value-to-cost ratio is exceptional. Potential for high PPC scaling efficiency.",
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
          <Brain className="text-sky-500" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">AI Strategic Analyzer</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs text-left">Real-time heuristics and market sentiment analysis (Nexus Engine).</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec, i) => (
          <div 
            key={i}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              rec.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
              rec.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400' :
              rec.type === 'error' ? 'bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400' :
              'bg-sky-500/5 border-sky-500/10 text-sky-600 dark:text-sky-400'
            }`}
          >
            <rec.icon size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed text-left">{rec.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mistral Engine Online</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Tier: Advanced</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAnalyzer;
