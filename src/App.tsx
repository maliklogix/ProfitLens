import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import SingleDealCalculator from './components/SingleDealCalculator';
import ThemeToggle from './components/ThemeToggle';
import SettingsModal from './components/SettingsModal';
import Background3D from './components/Background3D';

interface Category {
  id: string;
  name: string;
  referralFee: number;
}

interface MistralSettings {
  apiKey: string;
  model: string;
}

const DEFAULT_MISTRAL: MistralSettings = {
  apiKey: '',
  model: 'mistral-tiny',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Beauty, Health and Personal Care', referralFee: 15.3 },
  { id: '2', name: 'Electronics', referralFee: 8.16 },
  { id: '3', name: 'Home & Kitchen', referralFee: 15.3 },
  { id: '4', name: 'Toys & Games', referralFee: 15.3 },
  { id: '5', name: 'Clothing & Accessories', referralFee: 15.3 },
];

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return true; // first time landing: default to dark/night
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [mistralSettings, setMistralSettings] = useState<MistralSettings>(() => {
    const saved = localStorage.getItem('mistralSettings');
    return saved ? JSON.parse(saved) : DEFAULT_MISTRAL;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mistralSettings', JSON.stringify(mistralSettings));
  }, [mistralSettings]);

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-brand-500/30">
      <Background3D isDark={isDark} key={isDark ? 'dark' : 'light'} />
      
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900 dark:bg-slate-100 border-2 border-b-4 border-slate-700 dark:border-slate-300 hover:translate-y-[1px] hover:border-b-2 active:translate-y-[3px] active:border-b-0 transition-all duration-100 flex items-center justify-center shadow-lg"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-slate-100 dark:text-slate-900" />
        </button>
      </div>

      <main className="relative z-10 px-4 py-12 md:py-20 flex flex-col items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <header className="mb-12 text-left">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white"
                >
                  Profit<span className="text-sky-500">Lens</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-light"
                >
                  Precision sourcing for the modern Amazon architect. 
                  Uncover hidden margins with absolute clarity.
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="hidden md:inline-flex items-center gap-2 rounded-full glass-card px-5 py-2.5 text-xs text-slate-600 dark:text-slate-300"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-pulse-slow shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                <span className="font-semibold tracking-widest uppercase">Nexus Edition</span>
              </motion.div>
            </div>
          </header>

          <SingleDealCalculator customCategories={categories} />
        </motion.div>
      </main>
      
      <footer className="relative z-10 py-10 border-t border-slate-200 dark:border-slate-900 text-center text-slate-400 dark:text-slate-600 text-[10px] tracking-[0.2em] uppercase">
        <p>© {new Date().getFullYear()} ProfitLens – Advanced Sourcing Infrastructure</p>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={categories}
        onSave={setCategories}
        mistralSettings={mistralSettings}
        onSaveMistral={setMistralSettings}
      />
    </div>
  );
}

export default App;

