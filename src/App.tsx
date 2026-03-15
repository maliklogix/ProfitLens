import { motion } from 'framer-motion';
import SingleDealCalculator from './components/SingleDealCalculator';
import Background3D from './components/Background3D';

function App() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Background3D />
      
      <main className="relative z-10 px-4 py-12 md:py-20 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl"
        >
          <header className="mb-12 text-center md:text-left">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6"
                >
                  Profit<span className="text-brand-400">Lens</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-slate-400 max-w-2xl leading-relaxed font-light"
                >
                  Precision sourcing for the modern Amazon architect. 
                  Uncover hidden margins with absolute clarity.
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2.5 text-sm text-slate-200"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse-slow shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                <span className="font-semibold tracking-widest uppercase text-[10px]">Nexus Edition</span>
              </motion.div>
            </div>
          </header>

          <SingleDealCalculator />
        </motion.div>
      </main>
      
      <footer className="relative z-10 py-10 border-t border-slate-900 text-center text-slate-500 text-xs tracking-widest uppercase">
        <p>© {new Date().getFullYear()} ProfitLens – Advanced Sourcing Infrastructure</p>
      </footer>
    </div>
  );
}

export default App;

