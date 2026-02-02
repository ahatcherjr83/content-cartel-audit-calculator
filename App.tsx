import { useState, useMemo } from 'react';
import { Calculator, Flame, TrendingDown, Check, X, AlertTriangle, Zap, Shield, Radio } from 'lucide-react';

// Types
interface CalculatorState {
  monthlySpend: number;
  monthlyRevenue: number;
  hoursPerWeek: number;
  distribution: 'local' | 'regional' | 'national';
}

interface CalculationResult {
  currentBurn: number;
  currentROI: number;
  timeCost: number;
  newRevenue: number;
  breakEven: string;
  monthlyLoss: number;
}

// Constants
const HOURLY_RATE = 25;
const CARTEL_INVESTMENT = 1500;
const TIME_RETURNED = 30;

const DISTRIBUTION_REVENUE = {
  local: 800,
  regional: 1500,
  national: 2400,
};

function App() {
  // State
  const [values, setValues] = useState<CalculatorState>({
    monthlySpend: 350,
    monthlyRevenue: 500,
    hoursPerWeek: 10,
    distribution: 'local',
  });

  const [isCalculated, setIsCalculated] = useState(false);

  // Calculations
  const results = useMemo<CalculationResult>(() => {
    const timeCost = values.hoursPerWeek * 4.33 * HOURLY_RATE; // 4.33 weeks per month average
    const currentBurn = values.monthlySpend + timeCost;
    const currentROI = currentBurn > 0 ? (values.monthlyRevenue / currentBurn) * 100 : 0;
    const newRevenue = DISTRIBUTION_REVENUE[values.distribution];
    const totalNewRevenue = values.monthlyRevenue + newRevenue;
    const netGain = totalNewRevenue - CARTEL_INVESTMENT;
    const monthlyLoss = currentBurn - values.monthlyRevenue;
    
    // Break-even calculation
    let breakEven: string;
    if (netGain <= 0) {
      breakEven = '6';
    } else if (currentROI >= 100) {
      breakEven = 'Immediate';
    } else {
      const months = Math.ceil(CARTEL_INVESTMENT / netGain);
      breakEven = months > 6 ? '6' : months.toString();
    }

    return {
      currentBurn,
      currentROI,
      timeCost,
      newRevenue,
      breakEven,
      monthlyLoss,
    };
  }, [values]);

  // Handlers
  const handleSliderChange = (field: keyof CalculatorState, value: number) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleDistributionChange = (distribution: 'local' | 'regional' | 'national') => {
    setValues(prev => ({ ...prev, distribution }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-cartel-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-cartel-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6 text-cartel-gold" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  THE LIVE AUDIT
                </h1>
              </div>
              <p className="text-cartel-gold text-sm mt-1 tracking-wide">
                Calculate the true cost of remaining a 'Local Artist'
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-cartel-gold animate-pulse rounded-full" />
              LIVE CALCULATOR
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calculator Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="border border-cartel-lightgray p-6">
              <h2 className="text-sm text-gray-400 mb-6 uppercase tracking-wider">
                Input Parameters
              </h2>

              {/* Monthly Content Spend */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Monthly Content Spend</label>
                  <span className="text-cartel-gold font-bold">{formatCurrency(values.monthlySpend)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={values.monthlySpend}
                  onChange={(e) => handleSliderChange('monthlySpend', Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>Photographers / Videographers / Editors</span>
                  <span>$5,000</span>
                </div>
              </div>

              {/* Monthly Music Revenue */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Monthly Music Revenue</label>
                  <span className="text-cartel-gold font-bold">{formatCurrency(values.monthlyRevenue)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={values.monthlyRevenue}
                  onChange={(e) => handleSliderChange('monthlyRevenue', Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>Streams / Merch / Shows</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Hours per Week */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm">Hours/Week on Admin</label>
                  <span className="text-cartel-gold font-bold">{values.hoursPerWeek} hrs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={values.hoursPerWeek}
                  onChange={(e) => handleSliderChange('hoursPerWeek', Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>Posting / Managing / Emails</span>
                  <span>40</span>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <label className="text-sm mb-3 block">Current Distribution</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="distribution"
                      checked={values.distribution === 'local'}
                      onChange={() => handleDistributionChange('local')}
                    />
                    <span className="text-sm group-hover:text-cartel-gold transition-colors">
                      Local Circuit Only (Vegas scene)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="distribution"
                      checked={values.distribution === 'regional'}
                      onChange={() => handleDistributionChange('regional')}
                    />
                    <span className="text-sm group-hover:text-cartel-gold transition-colors">
                      Regional (Southwest)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="distribution"
                      checked={values.distribution === 'national'}
                      onChange={() => handleDistributionChange('national')}
                    />
                    <span className="text-sm group-hover:text-cartel-gold transition-colors">
                      Spraying nationally (no system)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={() => setIsCalculated(true)}
              className="w-full bg-cartel-gold text-black font-bold py-4 px-6 hover:bg-white transition-colors uppercase tracking-wider"
            >
              {isCalculated ? 'RECALCULATE' : 'CALCULATE'}
            </button>
          </div>

          {/* Real-Time Results */}
          <div className="space-y-4">
            <div className="border border-cartel-lightgray p-6">
              <h2 className="text-sm text-gray-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Current Burn Analysis
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-cartel-gray">
                  <span className="text-sm text-gray-400">Content Spend</span>
                  <span className="font-bold">{formatCurrency(values.monthlySpend)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-cartel-gray">
                  <span className="text-sm text-gray-400">Time Cost ({values.hoursPerWeek}hrs × ${HOURLY_RATE}/hr)</span>
                  <span className="font-bold">{formatCurrency(results.timeCost)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-cartel-gold">
                  <span className="text-sm font-bold">TRUE MONTHLY BURN</span>
                  <span className="font-bold text-cartel-red text-lg">{formatCurrency(results.currentBurn)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-400">Current Revenue</span>
                  <span className="font-bold">{formatCurrency(values.monthlyRevenue)}</span>
                </div>
              </div>
            </div>

            {/* ROI Display */}
            <div className={`border p-6 ${results.currentROI < 100 ? 'border-cartel-red' : 'border-cartel-gold'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-wider">Current ROI</span>
                <span className={`text-3xl font-bold ${results.currentROI < 100 ? 'text-cartel-red' : 'text-cartel-gold'}`}>
                  {results.currentROI.toFixed(0)}%
                </span>
              </div>
              {results.currentROI < 100 && (
                <div className="flex items-center gap-2 mt-3 text-cartel-red text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>Operating at a loss</span>
                </div>
              )}
            </div>

            {/* The Cartel Alternative */}
            <div className="border-2 border-cartel-gold p-6 shadow-gold">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-cartel-gold" />
                <h2 className="text-sm uppercase tracking-wider text-cartel-gold">
                  The Cartel Alternative
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Investment</span>
                  <span className="font-bold text-cartel-gold">{formatCurrency(CARTEL_INVESTMENT)}/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Time Returned</span>
                  <span className="font-bold text-cartel-gold">{TIME_RETURNED} hours/week</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">New Revenue Streams</span>
                  <span className="font-bold text-cartel-gold">+{formatCurrency(results.newRevenue)}/month</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-cartel-gold/30">
                  <span className="text-sm font-bold">Break-Even Point</span>
                  <span className="font-bold text-cartel-gold text-lg">
                    {results.breakEven === 'Immediate' ? 'Immediate' : `Month ${results.breakEven}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Display */}
        {isCalculated && (
          <div className="border-2 border-cartel-red p-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cartel-red" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Financial Autopsy Results</h2>
            </div>

            <div className="space-y-4 text-lg">
              <p>
                You are currently burning{' '}
                <span className="text-cartel-red font-bold">{formatCurrency(results.currentBurn)}</span>
                {' '}/month to earn{' '}
                <span className="font-bold">{formatCurrency(values.monthlyRevenue)}</span>.
              </p>
              
              {results.monthlyLoss > 0 && (
                <p className="text-cartel-red">
                  You lose{' '}
                  <span className="font-bold">{formatCurrency(results.monthlyLoss)}</span>
                  {' '}every 30 days.
                </p>
              )}

              <div className="border-t border-cartel-lightgray pt-4 mt-4">
                <p className="text-cartel-gold">
                  The Cartel Audit flips the burn:
                </p>
                <p className="mt-2">
                  Invest{' '}
                  <span className="text-cartel-gold font-bold">{formatCurrency(CARTEL_INVESTMENT)}</span>
                  {' '}→ Own the infrastructure → Break even at{' '}
                  <span className="text-cartel-gold font-bold">
                    {results.breakEven === 'Immediate' ? 'Immediate' : `Month ${results.breakEven}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Visual Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* The $350 Receipt */}
          <div className="border border-gray-700 opacity-60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500">The $350 Receipt</h3>
              <X className="w-5 h-5 text-gray-600" />
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-400">One music video (1080p, 1 location)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-400">Delivered via WeTransfer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-400">Posted to IG → 300 views</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-400">File sits on hard drive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-400">Tagged #LasVegasMusic</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-gray-500 text-sm">Result: Money gone. No pipeline.</p>
              <p className="text-gray-600 text-sm mt-2 line-through">Asset Value: $0</p>
            </div>
          </div>

          {/* The $1,500 Asset */}
          <div className="border-2 border-cartel-gold p-6 shadow-gold relative">
            <div className="absolute -top-3 right-4 bg-cartel-gold text-black text-xs font-bold px-2 py-1 flex items-center gap-1">
              <Radio className="w-3 h-3" />
              LIVE
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase tracking-wider text-cartel-gold">The $1,500 Asset</h3>
              <Check className="w-5 h-5 text-cartel-gold" />
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cartel-gold mt-0.5 flex-shrink-0" />
                <span>The Wireless: Formal (3-camera, 18-min documentary)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cartel-gold mt-0.5 flex-shrink-0" />
                <span>Asset Archive: 60 short-form pieces (VA cuts)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cartel-gold mt-0.5 flex-shrink-0" />
                <span>Tastemaker Distribution List (Cartel network access)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cartel-gold mt-0.5 flex-shrink-0" />
                <span>Even Biz Integration (monetized player)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cartel-gold mt-0.5 flex-shrink-0" />
                <span className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Certification Badge (CC Verified status)
                </span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-cartel-gold/30">
              <p className="text-cartel-gold text-sm">Result: $1,500 working in 12 places simultaneously</p>
              <p className="text-cartel-gold text-sm mt-2 font-bold">Asset Value: Appreciating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 border-t border-cartel-lightgray">
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cartel-gold text-black font-bold py-4 px-12 hover:bg-white transition-colors uppercase tracking-wider text-lg"
          >
            Book The Audit
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Limited slots available. No obligation consultation.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cartel-lightgray py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-cartel-gold text-sm tracking-wider">
            All Money In. No Money Out.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
