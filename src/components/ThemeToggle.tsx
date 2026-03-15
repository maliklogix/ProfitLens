import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 dark:bg-slate-100 border border-slate-700/60 dark:border-slate-300/60 hover:bg-slate-800 hover:dark:bg-slate-200 transition-all duration-150"
      aria-label="Toggle theme"
    >
      <div className="relative w-10 h-5 rounded-full bg-slate-800 dark:bg-slate-200 flex items-center px-0.5">
        <motion.div
          layout
          className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow-md"
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          animate={{ x: isDark ? 18 : 0 }}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="flex items-center gap-1 text-[11px] font-semibold tracking-wide"
        >
          {isDark ? (
            <>
              <Moon className="w-4 h-4 text-slate-900" />
              <span className="text-slate-900">Night</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-slate-100">Day</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
