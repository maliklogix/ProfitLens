import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  referralFee: number;
}

interface MistralSettings {
  apiKey: string;
  model: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
  mistralSettings: MistralSettings;
  onSaveMistral: (settings: MistralSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories: initialCategories,
  onSave,
  mistralSettings: initialMistral,
  onSaveMistral,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [mistral, setMistral] = useState<MistralSettings>(initialMistral);

  const addCategory = () => {
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      referralFee: 0,
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleSave = () => {
    onSave(categories.filter((c) => c.name.trim() !== ''));
    onSaveMistral(mistral);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:left-1/2 md:right-auto md:w-full md:max-w-xl md:-ml-[288px] glass-card z-[60] p-6 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Manage Categories & Fees
                </h3>
                <button
                  onClick={addCategory}
                  className="flex items-center gap-2 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                      className="w-full glass-input px-3 py-2 text-sm rounded-lg"
                    />
                  </div>
                  <div className="w-24">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Fee %"
                        value={category.referralFee}
                        onChange={(e) => updateCategory(category.id, { referralFee: parseFloat(e.target.value) || 0 })}
                        className="w-full glass-input pl-3 pr-7 py-2 text-sm rounded-lg text-right"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                  AI Infrastructure (Mistral)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">API Key</label>
                    <input
                      type="password"
                      placeholder="Enter Mistral API Key"
                      value={mistral.apiKey}
                      onChange={(e) => setMistral({ ...mistral, apiKey: e.target.value })}
                      className="w-full glass-input px-3 py-2 text-sm rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</label>
                    <select
                      value={mistral.model}
                      onChange={(e) => setMistral({ ...mistral, model: e.target.value })}
                      className="w-full glass-input px-3 py-2 text-sm rounded-lg appearance-none cursor-pointer"
                    >
                      <option value="mistral-tiny">Mistral Tiny</option>
                      <option value="mistral-small">Mistral Small</option>
                      <option value="mistral-medium">Mistral Medium</option>
                      <option value="mistral-large-latest">Mistral Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-xl font-semibold text-sm hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
