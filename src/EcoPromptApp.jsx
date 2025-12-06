import React, { useState, useEffect, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import NeoWalletButton, { NeoWalletInfoCard } from './NeoWalletButton';
import NeoTransactionTest from './NeoTransactionTest';
import ProfileSetup from './components/ProfileSetup';
import { PluginManager } from './components/plugin-manager/PluginManager';
import NodeUniverse from './NodeUniverse';
import { 
  BarChart, 
  Activity, 
  Zap, 
  Leaf, 
  DollarSign, 
  Search, 
  Menu, 
  X, 
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Sparkles,
  Globe,
  Wallet,
  User,
  Settings as SettingsIcon,
  Puzzle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * ECOPROMPT - SOFT BRUTALISM DESIGN SYSTEM
 * Implements the "Soft Brutalism" aesthetic:
 * - Bold Colors (#00E599, #FFD93D, #FF6BCB)
 * - Thick Borders (4px solid #0A0A0F)
 * - Rounded Corners (xl to 3xl)
 * - Hard Shadows
 */

// --- DATA MOCKS ---

const CHART_DATA = [
  { time: '00:00', tokens: 4000 },
  { time: '04:00', tokens: 3000 },
  { time: '08:00', tokens: 12000 },
  { time: '12:00', tokens: 18500 },
  { time: '16:00', tokens: 15000 },
  { time: '20:00', tokens: 9000 },
  { time: '23:59', tokens: 5000 },
];

const RECENT_ACTIVITY = [
  { id: 1, action: "Optimized marketing copy", save: "450 tokens", time: "2m ago", type: "success" },
  { id: 2, action: "Code refactor prompt", save: "1.2k tokens", time: "1h ago", type: "success" },
  { id: 3, action: "Daily report generation", save: "890 tokens", time: "3h ago", type: "success" },
];

// --- CORE COMPONENTS ---

const BaseCard = ({ children, color = 'bg-white', className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`
      ${color}
      border-4 border-[#0A0A0F]
      rounded-[32px]
      shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
      p-6
      hover:translate-x-[-2px] hover:translate-y-[-2px]
      hover:shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]
      transition-all duration-200
      cursor-pointer
      ${className}
    `}
  >
    {children}
  </div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  onClick,
  className = '',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-[#00E599] text-[#0A0A0F] hover:bg-[#FFD93D]',
    secondary: 'bg-[#0A0A0F] text-white hover:bg-[#B084FF]',
    danger: 'bg-[#FF5252] text-white hover:bg-[#FF5252]/90',
    outline: 'bg-transparent text-[#0A0A0F] border-[#0A0A0F] hover:bg-[#0A0A0F] hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-[16px]',
    md: 'px-6 py-3 text-base rounded-[24px]',
    lg: 'px-8 py-4 text-lg rounded-[32px]',
    xl: 'px-10 py-5 text-xl rounded-[48px]'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        border-4 border-[#0A0A0F]
        font-bold
        shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
        active:translate-x-[2px] active:translate-y-[2px]
        active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150
        flex items-center justify-center gap-2
        uppercase tracking-wide
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} strokeWidth={3} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'bg-[#00E599]', icon: Icon }) => (
  <span className={`
    inline-flex items-center gap-1.5
    ${color}
    border-2 border-[#0A0A0F]
    px-3 py-1 text-xs sm:text-sm rounded-[16px]
    font-bold text-[#0A0A0F]
    uppercase tracking-wide
    shadow-[2px_2px_0px_0px_rgba(10,10,15,1)]
  `}>
    {Icon && <Icon size={12} strokeWidth={3} />}
    {children}
  </span>
);

const Input = ({ label, icon: Icon, placeholder, value, onChange, className }) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <label className="block text-sm font-black uppercase tracking-wide text-[#0A0A0F]">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0F]">
          <Icon size={24} strokeWidth={2.5} />
        </div>
      )}
      <input
        value={value}
        onChange={onChange}
        className={`
          w-full
          ${Icon ? 'pl-14' : 'pl-6'} pr-6 py-4
          bg-white
          border-4 border-[#0A0A0F]
          rounded-[20px]
          font-bold text-lg text-[#0A0A0F]
          placeholder:text-[#0A0A0F]/40
          focus:outline-none
          focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
          focus:-translate-y-1 focus:-translate-x-1
          transition-all duration-150
        `}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const ProgressBar = ({ value, max = 100, label, color = 'bg-[#00E599]' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-bold text-xs uppercase tracking-wide text-[#0A0A0F]">
          {label}
        </span>
        <span className="font-black text-sm">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="relative h-6 bg-white border-4 border-[#0A0A0F] rounded-full overflow-hidden">
        <div 
          className={`absolute inset-y-0 left-0 ${color} border-r-4 border-[#0A0A0F] transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          {/* Stripe Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
              backgroundSize: '10px 10px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- WIDGETS ---

const EcoScoreGauge = ({ score }) => {
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="#0A0A0F"
            strokeOpacity="0.1"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
          <circle
            stroke="#00E599"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#0A0A0F]">{score}</span>
          <span className="text-xs font-bold uppercase text-[#0A0A0F]/60">Score</span>
        </div>
      </div>
      <div className="mt-4 px-4 py-2 bg-[#FFD93D] border-4 border-[#0A0A0F] rounded-full font-bold text-sm shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]">
        EXCELLENT
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }) => (
  <BaseCard color={`bg-[${color}]/10`}>
    <div className="flex items-start justify-between">
      <div className={`
        w-14 h-14 
        ${color} 
        rounded-full 
        flex items-center justify-center
        border-4 border-[#0A0A0F]
        shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
      `}>
        <span className="text-2xl">{icon}</span>
      </div>
      {trend && (
        <div className={`
          px-2 py-1 
          bg-white
          rounded-xl
          border-2 border-[#0A0A0F]
          font-black text-xs
          flex items-center gap-1
        `}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-3xl font-black text-[#0A0A0F] mt-1">
        {value}
      </div>
    </div>
  </BaseCard>
);

// --- VIEWS ---

const DashboardView = () => (
  <div className="space-y-6 animate-fadeIn">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon="💰" 
        label="Est. Savings" 
        value="$452.30" 
        trend={12} 
        color="bg-[#FFD93D]" 
      />
      <StatCard 
        icon="🌱" 
        label="Carbon Saved" 
        value="12.5kg" 
        trend={8} 
        color="bg-[#00E599]" 
      />
      <StatCard 
        icon="⚡" 
        label="Requests" 
        value="14.2k" 
        trend={-3} 
        color="bg-[#4FFFB0]" 
      />
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart Column */}
      <div className="lg:col-span-2 space-y-6">
        <BaseCard className="h-full min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
              <Activity strokeWidth={3} /> Token Usage
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">24H</Button>
              <Button size="sm" variant="outline">7D</Button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E599" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00E599" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  stroke="#0A0A0F" 
                  strokeWidth={2}
                  tick={{fill: '#0A0A0F', fontWeight: 700, fontSize: 12}}
                />
                <YAxis 
                  stroke="#0A0A0F" 
                  strokeWidth={2}
                  tick={{fill: '#0A0A0F', fontWeight: 700, fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FEFEFE',
                    border: '4px solid #0A0A0F',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    boxShadow: '4px 4px 0px #0A0A0F'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#00E599" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTokens)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BaseCard>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <BaseCard>
          <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
            <Leaf strokeWidth={3} /> Eco Score
          </h3>
          <EcoScoreGauge score={92} />
          <div className="mt-6 space-y-4">
            <ProgressBar label="Efficiency" value={92} color="bg-[#00E599]" />
            <ProgressBar label="Cache Hit Rate" value={68} color="bg-[#FFD93D]" />
          </div>
        </BaseCard>

        <BaseCard className="bg-[#B084FF]/10">
          <h3 className="text-xl font-black uppercase mb-4">Recent Wins</h3>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="bg-white border-3 border-[#0A0A0F] rounded-2xl p-3 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-500">{item.time}</div>
                  <div className="font-bold text-sm leading-tight">{item.action}</div>
                </div>
                <div className="bg-[#00E599] px-2 py-1 rounded-lg border-2 border-[#0A0A0F] text-xs font-black">
                  -{item.save}
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
);

const OptimizerView = () => {
  const [prompt, setPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [availablePlugins, setAvailablePlugins] = useState([]);

  // Load available plugins
  useEffect(() => {
    import('./lib/pluginSystem').then(({ pluginManager }) => {
      const active = pluginManager.getActive();
      setAvailablePlugins(active);
      if (active.length > 0) {
        setSelectedPlugin(active[0].id);
      }
    });
  }, []);

  const handleOptimize = async () => {
    if (!prompt) return;
    
    setIsOptimizing(true);
    setError(null);
    setResult(null);

    try {
      const { pluginManager } = await import('./lib/pluginSystem');
      
      // Check if any plugins are active
      const activePlugins = pluginManager.getActive();
      if (activePlugins.length === 0) {
        throw new Error('No active plugins. Please configure a plugin in the Plugins tab.');
      }

      // Optimize using the plugin
      const optimizationResult = await pluginManager.optimizePrompt(prompt, {
        pluginId: selectedPlugin,
        model: 'gpt-4'
      });

      setResult({
        original: prompt,
        optimized: optimizationResult.optimized,
        changes: optimizationResult.changes || [],
        improvements: optimizationResult.improvements || [],
        savings: {
          tokens: optimizationResult.savings.tokens,
          money: optimizationResult.savings.cost.toFixed(4),
          co2: optimizationResult.savings.carbon.toFixed(2),
          percentage: optimizationResult.savings.percentage
        },
        provider: optimizationResult.provider
      });
    } catch (err) {
      console.error('Optimization error:', err);
      setError(err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
          Prompt Optimizer
        </h1>
        <p className="text-lg font-medium text-gray-600">
          Trim the fat. Save the planet. Reduce costs.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#B084FF]/20 to-[#FF6BCB]/20 p-1 border-4 border-[#0A0A0F] rounded-[48px] shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]">
        <div className="bg-white rounded-[44px] p-6 md:p-8 space-y-6">
          
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                <Sparkles size={16} /> Input Prompt
              </label>
              <span className="text-xs font-bold text-gray-400">{prompt.length} chars</span>
            </div>
           
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your verbose, token-wasting prompt here..."
              className="w-full h-40 p-4 bg-[#F5F5F5] border-4 border-[#0A0A0F] rounded-[24px] font-mono text-sm resize-none focus:outline-none focus:bg-white focus:shadow-[8px_8px_0px_0px_rgba(10,10,15,1)] transition-all"
            />
          </div>

          {/* Plugin Selection */}
          {availablePlugins.length > 0 && (
            <div>
              <label className="block text-sm font-black uppercase tracking-wide mb-3">
                AI Provider
              </label>
              <div className="flex gap-3">
                {availablePlugins.map((plugin) => (
                  <button
                    key={plugin.id}
                    onClick={() => setSelectedPlugin(plugin.id)}
                    className={`
                      px-4 py-2
                      border-4 border-[#0A0A0F]
                      rounded-[16px]
                      font-bold text-sm
                      transition-all
                      ${selectedPlugin === plugin.id
                        ? 'bg-[#00E599] shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]'
                        : 'bg-white hover:bg-[#F5F5F5]'
                      }
                    `}
                  >
                    {plugin.icon} {plugin.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button 
              size="xl" 
              onClick={handleOptimize} 
              disabled={isOptimizing || !prompt}
              className="w-full md:w-auto min-w-[200px]"
            >
              {isOptimizing ? (
                <span className="animate-pulse">Optimizing...</span>
              ) : (
                <>
                  <Zap strokeWidth={3} /> Optimize Now
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-[#FF5252]/20 border-4 border-[#FF5252] rounded-[24px] p-4 flex items-center gap-3">
              <X size={24} strokeWidth={3} className="text-[#FF5252]" />
              <div>
                <div className="font-black text-sm">Error</div>
                <div className="text-sm font-medium">{error}</div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 animate-slideUp">
              <div className="bg-[#00E599]/20 border-4 border-[#00E599] rounded-[32px] p-6 space-y-6">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase text-[#0A0A0F]">
                    ✨ Optimized Result
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={Copy}>Copy</Button>
                  </div>
                </div>

                <div className="bg-white border-4 border-[#0A0A0F] rounded-[20px] p-4 font-mono text-sm">
                  {result.optimized}
                </div>

                {/* Savings Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Tokens Saved", val: `${result.savings.tokens}%`, color: "bg-[#B084FF]" },
                    { label: "Cost Saved", val: `$${result.savings.money}`, color: "bg-[#FFD93D]" },
                    { label: "CO₂ Reduced", val: `${result.savings.co2}g`, color: "bg-[#4FFFB0]" }
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.color} border-3 border-[#0A0A0F] rounded-[16px] p-3 text-center shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]`}>
                      <div className="text-2xl font-black text-[#0A0A0F]">{stat.val}</div>
                      <div className="text-[10px] sm:text-xs font-bold uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- LAYOUT ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'optimizer', label: 'Optimizer', icon: Zap },
    { id: 'plugins', label: 'Plugins', icon: Puzzle },
    { id: 'universe', label: 'Node Universe', icon: Globe },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-72 bg-[#FEFEFE] border-r-4 border-[#0A0A0F]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="p-8 border-b-4 border-[#0A0A0F] bg-[#00E599]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0A0A0F] rounded-full border-4 border-white flex items-center justify-center text-2xl animate-bounce-slow">
              🌍
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#0A0A0F]">
                EcoPrompt
              </h1>
              <p className="text-xs font-bold text-[#0A0A0F]">Soft Brutalism v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-4
                rounded-[20px] font-bold text-lg transition-all duration-200
                border-4
                ${activeTab === item.id 
                  ? 'bg-[#0A0A0F] text-[#00E599] border-[#0A0A0F] shadow-[6px_6px_0px_0px_#00E599] translate-x-1' 
                  : 'bg-white text-[#0A0A0F] border-transparent hover:border-[#0A0A0F] hover:bg-[#F5F5F5] hover:shadow-[4px_4px_0px_0px_#0A0A0F]'
                }
              `}
            >
              <item.icon strokeWidth={3} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Wallet Connect */}
        <div className="p-6 border-t-4 border-[#0A0A0F]">
          <NeoWalletButton className="w-full" />
        </div>

        {/* User Profile */}
        <div className="p-6 border-t-4 border-[#0A0A0F] bg-[#FFD93D]/20">
          <div className="flex items-center gap-3 bg-white border-3 border-[#0A0A0F] p-3 rounded-[20px] shadow-[4px_4px_0px_0px_#0A0A0F]">
            <div className="w-10 h-10 rounded-full bg-[#B084FF] border-2 border-[#0A0A0F] flex items-center justify-center font-black">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm truncate">Jane Saver</div>
              <div className="text-xs font-bold text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function EcoPromptApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FEFEFE] font-sans text-[#0A0A0F] overflow-hidden selection:bg-[#FF6BCB] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Space Grotesk', sans-serif;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b-4 border-[#0A0A0F] bg-[#00E599]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0A0A0F] rounded-full flex items-center justify-center text-lg">🌍</div>
            <span className="font-black uppercase">EcoPrompt</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white border-2 border-[#0A0A0F] rounded-lg active:translate-y-1"
          >
            <Menu strokeWidth={3} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(#0A0A0F_1px,transparent_1px)] [background-size:16px_16px]">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'optimizer' && <OptimizerView />}
          
          {/* 3D Node Universe */}
          {activeTab === 'universe' && (
            <div className="h-[calc(100vh-120px)] w-full">
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-32 h-32 bg-[#0A0A0F] rounded-full border-4 border-[#00E599] flex items-center justify-center shadow-[12px_12px_0px_0px_#00E599] animate-pulse">
                        <Globe size={64} className="text-[#00E599] animate-spin" />
                      </div>
                      <h2 className="text-4xl font-black uppercase bg-white px-4 py-2 border-4 border-[#0A0A0F] inline-block shadow-[8px_8px_0px_0px_#0A0A0F]">
                        Loading Universe
                      </h2>
                      <p className="max-w-md font-bold bg-white p-4 border-4 border-[#0A0A0F] rounded-xl">
                        Rendering 3D visualization...
                      </p>
                    </div>
                  }
                >
                  <NodeUniverse />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
          
          {/* Plugin Manager */}
          {activeTab === 'plugins' && <PluginManager />}
          
          {/* Wallet View */}
          {activeTab === 'wallet' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                  Neo Wallet
                </h1>
                <p className="text-lg font-medium text-gray-600">
                  Manage your Neo wallet and sign transactions
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wallet Info Card */}
                <div>
                  <NeoWalletInfoCard />
                </div>

                {/* Actions & Features */}
                <div className="space-y-6">
                  <BaseCard className="bg-[#00E599]/10">
                    <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                      <Zap strokeWidth={3} /> Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button variant="primary" size="md" className="w-full justify-center">
                        <DollarSign strokeWidth={3} />
                        Send GAS
                      </Button>
                      <Button variant="secondary" size="md" className="w-full justify-center">
                        <ArrowRight strokeWidth={3} />
                        Send NEO
                      </Button>
                      <Button variant="outline" size="md" className="w-full justify-center">
                        <Activity strokeWidth={3} />
                        Transaction History
                      </Button>
                    </div>
                  </BaseCard>

                  <BaseCard className="bg-[#FFD93D]/10">
                    <h3 className="text-xl font-black uppercase mb-4">
                      Network
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">Current:</span>
                        <span className="px-3 py-1 bg-[#FFD93D] border-2 border-[#0A0A0F] rounded-full text-xs font-black">
                          TESTNET
                        </span>
                      </div>
                      <p className="text-xs text-[#0A0A0F]/60">
                        Using Neo N3 TestNet for testing
                      </p>
                    </div>
                  </BaseCard>

                  <BaseCard className="bg-[#B084FF]/10">
                    <h3 className="text-xl font-black uppercase mb-4">
                      🎉 Benefits
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-[#00E599] font-black">✓</span>
                        <span className="font-medium">Sign transactions securely</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00E599] font-black">✓</span>
                        <span className="font-medium">Track optimization rewards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00E599] font-black">✓</span>
                        <span className="font-medium">Earn tokens for efficiency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#00E599] font-black">✓</span>
                        <span className="font-medium">Participate in governance</span>
                      </li>
                    </ul>
                  </BaseCard>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile View */}
          {activeTab === 'profile' && <ProfileSetup />}
          
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Wallet Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NeoWalletInfoCard />
                <NeoTransactionTest />
              </div>

              {/* Settings Form */}
              <BaseCard>
                <h2 className="text-2xl font-black uppercase mb-6">App Settings</h2>
                <div className="space-y-4">
                  <Input label="OpenAI API Key" placeholder="sk-..." type="password" />
                  <Input label="Max Token Limit" placeholder="2048" />
                  <div className="flex justify-end pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </BaseCard>

              {/* Network Info */}
              <BaseCard className="bg-[#4FFFB0]/10">
                <h3 className="text-xl font-black uppercase mb-4">Network Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-[#0A0A0F]/60 mb-1">Network</div>
                    <div className="font-black">Neo N3 MainNet</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0A0F]/60 mb-1">Chain ID</div>
                    <div className="font-black font-mono">860833102</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0A0F]/60 mb-1">RPC Endpoint</div>
                    <div className="font-black text-xs font-mono break-all">
                      mainnet1.neo.coz.io
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0A0F]/60 mb-1">Explorer</div>
                    <a 
                      href="https://explorer.onegate.space" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-black text-[#00E599] hover:text-[#FFD93D] transition-colors"
                    >
                      OneGate →
                    </a>
                  </div>
                </div>
              </BaseCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
