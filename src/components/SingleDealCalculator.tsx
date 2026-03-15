import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Info, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  TrendingUpDown,
  DollarSign,
  Percent,
  Package,
  ShoppingCart,
  Zap,
  ShieldCheck,
  AlertCircle,
  LayoutDashboard,
  Box,
  PoundSterling
} from 'lucide-react';
import AIAnalyzer from './AIAnalyzer';

interface Category {
  id: string;
  name: string;
  referralFee: number;
}

type DealInputs = {
  productName: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  fbaFee: number;
  prepCost: number;
  storage: number;
  vatRate: number;
  ppcRate: number;
  closingFee: number;
  inboundShipping: number;
  placementFee: number;
  lowInventoryFee: number;
  returnsFee: number;
  miscFee: number;
};

const DEFAULT_INPUTS: DealInputs = {
  productName: '',
  category: 'Beauty, Health and Personal Care',
  buyingPrice: 0,
  sellingPrice: 0,
  fbaFee: 0,
  prepCost: 0,
  storage: 0,
  vatRate: 20,
  ppcRate: 0,
  closingFee: 0,
  inboundShipping: 0,
  placementFee: 0,
  lowInventoryFee: 0,
  returnsFee: 0,
  miscFee: 0
};

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '£0.00';
  return `£${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

function guessReferralRate(category: string, sellingPrice: number): { rate: number; minFee: number } {
  const cat = category.toLowerCase();
  const minFee = 0.25;

  if (cat.includes('beauty') || cat.includes('health') || cat.includes('personal')) {
    if (sellingPrice <= 10) return { rate: 0.08, minFee };
    if (sellingPrice <= 100) return { rate: 0.15, minFee };
    return { rate: 0.08, minFee };
  }

  if (cat.includes('toy') || cat.includes('game')) return { rate: 0.15, minFee };
  if (cat.includes('grocery') || cat.includes('food')) {
    if (sellingPrice <= 10) return { rate: 0.05, minFee: 0 };
    return { rate: 0.15, minFee: 0 };
  }
  if (cat.includes('electronic')) return { rate: 0.07, minFee };
  if (cat.includes('home')) {
    if (sellingPrice <= 20) return { rate: 0.08, minFee };
    return { rate: 0.15, minFee };
  }
  return { rate: 0.15, minFee };
}

interface SingleDealCalculatorProps {
  customCategories?: Category[];
}

const SingleDealCalculator: React.FC<SingleDealCalculatorProps> = ({ customCategories }) => {
  const [inputs, setInputs] = useState<DealInputs>({
    ...DEFAULT_INPUTS,
    category: customCategories?.[0]?.name || DEFAULT_INPUTS.category,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const parsed = useMemo(() => {
    const buyingPrice = inputs.buyingPrice || 0;
    const sellingPrice = inputs.sellingPrice || 0;
    const fbaFee = inputs.fbaFee || 0;
    const prepCost = inputs.prepCost || 0;
    const storage = inputs.storage || 0;
    const vatRate = inputs.vatRate || 0;
    const ppcRate = inputs.ppcRate || 0;

    if (sellingPrice <= 0) return null;

    let rate = 0.15;
    let minFee = 0.25;
    const selectedCustom = customCategories?.find(c => c.name === inputs.category);
    
    if (selectedCustom) {
      rate = selectedCustom.referralFee / 100;
    } else {
      const g = guessReferralRate(inputs.category, sellingPrice);
      rate = g.rate;
      minFee = g.minFee;
    }

    const referralFee = Math.max(sellingPrice * rate, minFee);
    const vatAmount = sellingPrice * (vatRate / 100);
    const ppcSpend = sellingPrice * (ppcRate / 100);

    const baseCost = buyingPrice + fbaFee + referralFee + prepCost + storage + vatAmount + ppcSpend;
    const advancedFees = inputs.closingFee + inputs.inboundShipping + inputs.placementFee + inputs.lowInventoryFee + inputs.returnsFee + inputs.miscFee;
    
    const totalCost = baseCost + advancedFees;
    const netProfit = sellingPrice - totalCost;

    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    const roi = buyingPrice > 0 ? (netProfit / buyingPrice) * 100 : 0;

    return {
      buyingPrice,
      sellingPrice,
      fbaFee,
      referralFee,
      prepCost,
      storage,
      vatAmount,
      ppcSpend,
      totalCost,
      netProfit,
      margin,
      roi,
      referralRate: rate,
    };
  }, [inputs, customCategories]);

  const status = useMemo(() => {
    if (!parsed) return { label: 'Awaiting values', color: 'slate', icon: TrendingUpDown };
    if (parsed.netProfit > 2) return { label: 'High Potential', color: 'emerald', icon: TrendingUp };
    if (parsed.netProfit < 0) return { label: 'Loss Warning', color: 'rose', icon: TrendingDown };
    return { label: 'Break Even', color: 'amber', icon: TrendingUpDown };
  }, [parsed]);

  const handleChange =
    (field: keyof DealInputs, type: 'text' | 'number' = 'text') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setInputs((prev) => ({
        ...prev,
        [field]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
      }));
    };

  const handleReset = () => {
    setInputs({
      ...DEFAULT_INPUTS,
      category: customCategories?.[0]?.name || DEFAULT_INPUTS.category,
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      <section className="lg:col-span-8 glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-500/10 rounded-2xl border border-slate-500/20">
              <Calculator className="text-slate-900 dark:text-slate-100" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Investment Analysis</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Fine-tune your sourcing parameters with precision.</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium transition-all"
          >
            <RotateCcw size={16} />
            Reset Data
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Product Name"
              icon={Package}
              type="text"
              value={inputs.productName}
              onChange={handleChange('productName')}
              placeholder="Enter product title..."
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart size={12} className="text-slate-900 dark:text-slate-100" />
                Category Selection
              </label>
              <select
                value={inputs.category}
                onChange={handleChange('category')}
                className="w-full dropdown-classic rounded-xl px-4 py-3 text-sm cursor-pointer"
              >
                {customCategories?.map((c) => (
                  <option key={c.id} value={c.name} className="bg-white dark:bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-5 rounded-2xl bg-slate-400/[0.03] dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em]">Purchase & Sales</h3>
              <div className="space-y-4">
                <InputField
                  label="Buying Price"
                  icon={DollarSign}
                  type="number"
                  value={inputs.buyingPrice || ''}
                  onChange={handleChange('buyingPrice', 'number')}
                  placeholder="0.00"
                  suffix="£"
                  step="0.01"
                />
                <InputField
                  label="Target Selling Price"
                  icon={Zap}
                  type="number"
                  value={inputs.sellingPrice || ''}
                  onChange={handleChange('sellingPrice', 'number')}
                  placeholder="0.00"
                  suffix="£"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-6 p-5 rounded-2xl bg-slate-400/[0.03] dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em]">Fees & Overheads</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="FBA Fee"
                  icon={ShieldCheck}
                  type="number"
                  value={inputs.fbaFee || ''}
                  onChange={handleChange('fbaFee', 'number')}
                  placeholder="0.00"
                  suffix="£"
                />
                <InputField
                  label="Prep Cost"
                  icon={Package}
                  type="number"
                  value={inputs.prepCost || ''}
                  onChange={handleChange('prepCost', 'number')}
                  placeholder="0.00"
                  suffix="£"
                />
                <InputField
                  label="Marketing"
                  icon={Percent}
                  type="number"
                  value={inputs.ppcRate}
                  onChange={handleChange('ppcRate', 'number')}
                  suffix="%"
                />
                <InputField
                  label="VAT Rate"
                  icon={Info}
                  type="number"
                  value={inputs.vatRate}
                  onChange={handleChange('vatRate', 'number')}
                  suffix="%"
                />
              </div>
            </div>

            <div className="space-y-6 p-5 rounded-2xl bg-sky-500/[0.02] dark:bg-sky-500/[0.05] border border-sky-500/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em]">Advanced Fee Module</h3>
                <label className="relative inline-flex items-center cursor-pointer group">
                    <input 
                        type="checkbox" 
                        checked={showAdvanced}
                        onChange={(e) => setShowAdvanced(e.target.checked)}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <InputField
                        label="Closing Fee"
                        icon={DollarSign}
                        type="number"
                        value={inputs.closingFee || ''}
                        onChange={handleChange('closingFee', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                      <InputField
                        label="Inbound Ship"
                        icon={Box}
                        type="number"
                        value={inputs.inboundShipping || ''}
                        onChange={handleChange('inboundShipping', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                      <InputField
                        label="Placement"
                        icon={Box}
                        type="number"
                        value={inputs.placementFee || ''}
                        onChange={handleChange('placementFee', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                      <InputField
                        label="Low Inv Fee"
                        icon={AlertCircle}
                        type="number"
                        value={inputs.lowInventoryFee || ''}
                        onChange={handleChange('lowInventoryFee', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                      <InputField
                        label="Returns"
                        icon={RotateCcw}
                        type="number"
                        value={inputs.returnsFee || ''}
                        onChange={handleChange('returnsFee', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                      <InputField
                        label="Misc / Other"
                        icon={Info}
                        type="number"
                        value={inputs.miscFee || ''}
                        onChange={handleChange('miscFee', 'number')}
                        placeholder="0.00"
                        suffix="£"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!showAdvanced && (
                <p className="text-[10px] text-slate-400 italic">Toggle advanced architecture for granular fee infrastructure (Closing, Placement, Low-Inventory, etc).</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10">
            <AlertCircle size={18} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Referral fees are automatically estimated based on your selected category and selling price. 
              Sync with <span className="text-slate-900 dark:text-slate-100 font-medium underline cursor-help">SellerOpsAI Dashboard</span> for live SQLite-backed fee calculation.
            </p>
          </div>
        </div>
      </section>

      <aside className="lg:col-span-4 space-y-6 sticky top-8">
        <motion.div 
          layout
          className={`glass-card rounded-3xl p-7 border-t-2 border-slate-400 relative overflow-hidden`}
        >
          <div className={`absolute -right-4 -top-4 w-24 h-24 bg-slate-500/10 blur-3xl rounded-full`} />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6`}>
              <status.icon size={12} />
              {status.label}
            </span>

            <div className="mb-8">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1 tracking-wide">NET PROFIT / UNIT</p>
              <motion.p 
                key={parsed?.netProfit}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl font-black tracking-tighter transition-colors duration-500 ${parsed && parsed.netProfit < 0 ? 'text-rose-500' : parsed && parsed.netProfit > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}
              >
                {formatMoney(parsed?.netProfit ?? 0)}
              </motion.p>
              {parsed && parsed.netProfit < 0 && (
                <p className="text-xs font-bold text-rose-500 mt-2">INVESTMENT AT RISK</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-500/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Margin</p>
                <p className={`text-xl font-bold ${parsed && parsed.margin < 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {formatPercent(parsed?.margin ?? 0)}
                </p>
              </div>
              <div className="bg-slate-500/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ROI</p>
                <p className={`text-xl font-bold ${parsed && parsed.roi < 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {formatPercent(parsed?.roi ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/50 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Gross Sale Price</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(parsed?.sellingPrice ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Total Unit Cost</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">{formatMoney(parsed?.totalCost ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] bg-slate-500/5 p-3 rounded-xl border border-slate-500/10">
              <span className="text-slate-500 dark:text-slate-400">Referral Fee ({formatPercent((parsed?.referralRate ?? 0) * 100)})</span>
              <span className="text-slate-900 dark:text-white font-bold">{formatMoney(parsed?.referralFee ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">FBA + Prep</span>
              <span className="text-slate-600 dark:text-slate-300">{formatMoney((parsed?.fbaFee ?? 0) + (parsed?.prepCost ?? 0))}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">VAT + PPC</span>
              <span className="text-slate-600 dark:text-slate-300">{formatMoney((parsed?.vatAmount ?? 0) + (parsed?.ppcSpend ?? 0))}</span>
            </div>
          </div>
        </motion.div>

        <div className="glass-card rounded-[2rem] p-6 text-center border-slate-200 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <TrendingUp size={12} className="text-slate-500" />
                Sourcing Strategy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                {parsed && parsed.roi > 30 
                    ? "This deal shows strong ROI potential. Consider scaling volume if inventory is available." 
                    : parsed && parsed.roi > 0 
                    ? "Profitable but tight. Optimize shipping or prep costs to improve yield."
                    : "Caution: Parameters result in a loss. Review buying price or FBA category accuracy."}
            </p>
        </div>
      </aside>

      <div className="lg:col-span-12">
        <AIAnalyzer data={parsed} />
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, type, value, onChange, placeholder, suffix, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
      <Icon size={12} className="text-slate-900 dark:text-slate-100" />
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full glass-input rounded-xl px-4 py-3 text-sm outline-none transition-all"
        {...props}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const ResultRow = ({ label, value, isNegative, isDetail }: any) => (
  <div className={`flex items-center justify-between ${isDetail ? 'opacity-60 text-xs' : 'text-sm font-semibold'}`}>
    <span className="text-slate-500">{label}</span>
    <span className={isNegative ? 'text-rose-500' : 'text-slate-900 dark:text-white'}>{value}</span>
  </div>
);

export default SingleDealCalculator;
