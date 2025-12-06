import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Zap, 
  Leaf, 
  Shield, 
  TrendingUp,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Activity
} from 'lucide-react';
import useSpoonAI, { AGENT_TYPES } from '../hooks/useSpoonAI';

const BaseCard = ({ children, className = '', color = 'bg-white' }) => (
  <div className={`
    ${color}
    border-4 border-[#0A0A0F]
    rounded-[32px]
    shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
    p-6
    transition-all duration-200
    ${className}
  `}>
    {children}
  </div>
);

const Button = ({ children, icon: Icon, variant = 'primary', onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-[#00E599] hover:bg-[#FFD93D]',
    secondary: 'bg-[#4FFFB0] hover:bg-[#B084FF]',
    danger: 'bg-[#FF5252] hover:bg-[#FF5252]/80'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        text-[#0A0A0F]
        border-4 border-[#0A0A0F]
        rounded-[24px]
        px-6 py-3
        font-bold uppercase
        shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
        active:translate-x-[2px] active:translate-y-[2px]
        active:shadow-none
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {Icon && <Icon size={20} strokeWidth={3} />}
      {children}
    </button>
  );
};

export default function SpoonAIIntegration() {
  const { 
    agents, 
    loading, 
    error,
    initializeAgent,
    optimizePrompt,
    trackCarbon,
    executeWithFallback 
  } = useSpoonAI();

  const [activeAgents, setActiveAgents] = useState([]);
  const [testPrompt, setTestPrompt] = useState('');
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [agentStatus, setAgentStatus] = useState({});

  useEffect(() => {
    // Initialize default agents
    const initAgents = async () => {
      try {
        await initializeAgent(AGENT_TYPES.PROMPT_OPTIMIZER);
        await initializeAgent(AGENT_TYPES.CARBON_TRACKER);
        await initializeAgent(AGENT_TYPES.BLOCKCHAIN);
      } catch (err) {
        console.error('Failed to initialize agents:', err);
      }
    };
    initAgents();
  }, []);

  useEffect(() => {
    setActiveAgents(Object.keys(agents));
    const status = {};
    Object.entries(agents).forEach(([key, agent]) => {
      status[key] = agent.status;
    });
    setAgentStatus(status);
  }, [agents]);

  const handleOptimize = async () => {
    if (!testPrompt) return;
    
    try {
      const result = await optimizePrompt(testPrompt, {
        targetReduction: 40,
        preserveQuality: true
      });
      setOptimizationResult(result);
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  };

  const handleTrackCarbon = async () => {
    try {
      const operations = [
        { type: 'prompt_optimization', tokens: 1500, provider: 'openai' },
        { type: 'blockchain_tx', tokens: 800, provider: 'neo' },
        { type: 'data_analysis', tokens: 2000, provider: 'anthropic' }
      ];
      const result = await trackCarbon(operations);
      setCarbonData(result);
    } catch (err) {
      console.error('Carbon tracking failed:', err);
    }
  };

  const handleMultiProvider = async () => {
    try {
      const result = await executeWithFallback(
        'Optimize this AI workflow',
        ['openai', 'anthropic', 'google']
      );
      console.log('Multi-provider result:', result);
    } catch (err) {
      console.error('Multi-provider execution failed:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-5xl font-black uppercase tracking-tight flex items-center justify-center gap-4">
          <Sparkles size={48} strokeWidth={3} className="text-[#00E599]" />
          SpoonAI Integration
        </h1>
        <p className="text-xl font-bold text-[#0A0A0F]/70">
          Advanced AI Agent System with Multi-Provider Support
        </p>
      </div>

      {/* Agent Status */}
      <BaseCard>
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <Bot strokeWidth={3} /> Active Agents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              type: AGENT_TYPES.PROMPT_OPTIMIZER, 
              name: 'Prompt Optimizer', 
              icon: '🎯', 
              color: '#00E599',
              description: 'Optimizes prompts and reduces tokens'
            },
            { 
              type: AGENT_TYPES.CARBON_TRACKER, 
              name: 'Carbon Tracker', 
              icon: '🌱', 
              color: '#4FFFB0',
              description: 'Tracks CO2 emissions'
            },
            { 
              type: AGENT_TYPES.BLOCKCHAIN, 
              name: 'Blockchain Agent', 
              icon: '⛓️', 
              color: '#B084FF',
              description: 'Handles Neo blockchain ops'
            }
          ].map((agent) => (
            <div
              key={agent.type}
              className={`
                p-4 border-4 border-[#0A0A0F] rounded-[20px]
                ${agentStatus[agent.type] === 'ready' ? 'bg-white' : 'bg-gray-100'}
                transition-all duration-200
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-12 h-12 rounded-full border-3 border-[#0A0A0F] flex items-center justify-center text-2xl"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <div className="font-black text-sm">{agent.name}</div>
                  <div className="text-xs text-[#0A0A0F]/60">{agent.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {agentStatus[agent.type] === 'ready' ? (
                  <>
                    <Check size={16} className="text-[#00E599]" strokeWidth={3} />
                    <span className="text-xs font-bold text-[#00E599]">READY</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="text-[#FFD93D] animate-spin" strokeWidth={3} />
                    <span className="text-xs font-bold text-[#FFD93D]">INITIALIZING</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Prompt Optimization Test */}
      <BaseCard>
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <Zap strokeWidth={3} /> Prompt Optimization Demo
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black uppercase mb-2">Test Prompt</label>
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter a prompt to optimize..."
              className="w-full p-4 border-4 border-[#0A0A0F] rounded-[20px] font-mono text-sm resize-none focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]"
              rows={4}
            />
          </div>

          <Button onClick={handleOptimize} disabled={loading || !testPrompt} icon={Zap}>
            {loading ? 'Optimizing...' : 'Optimize with SpoonAI'}
          </Button>

          {optimizationResult && (
            <div className="mt-6 p-4 bg-[#00E599]/10 border-3 border-[#00E599] rounded-[20px]">
              <div className="font-black mb-3">📊 Optimization Results:</div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Tokens Saved', value: optimizationResult.savings.tokens },
                  { label: 'Reduction', value: `${optimizationResult.savings.percentage}%` },
                  { label: 'Cost Saved', value: `$${optimizationResult.savings.cost}` },
                  { label: 'CO2 Reduced', value: `${optimizationResult.savings.carbon}kg` }
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-white border-3 border-[#0A0A0F] rounded-[16px]">
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-xs font-bold text-[#0A0A0F]/60">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-bold text-[#0A0A0F]/60 mb-1">Optimized:</div>
                  <div className="p-3 bg-white border-2 border-[#0A0A0F] rounded-[12px] font-mono text-sm">
                    {optimizationResult.optimized}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </BaseCard>

      {/* Carbon Tracking */}
      <BaseCard>
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <Leaf strokeWidth={3} /> Carbon Footprint Tracking
        </h2>

        <Button onClick={handleTrackCarbon} disabled={loading} icon={Activity} variant="secondary">
          Track Carbon Emissions
        </Button>

        {carbonData && (
          <div className="mt-6 p-4 bg-[#4FFFB0]/10 border-3 border-[#4FFFB0] rounded-[20px]">
            <div className="flex items-center justify-between mb-4">
              <div className="font-black">Total Carbon Footprint:</div>
              <div className="text-3xl font-black">{carbonData.total} {carbonData.unit}</div>
            </div>

            <div className="space-y-2">
              {carbonData.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border-2 border-[#0A0A0F] rounded-[12px]">
                  <div>
                    <div className="font-bold text-sm">{item.operation}</div>
                    <div className="text-xs text-[#0A0A0F]/60">{item.tokens} tokens · {item.provider}</div>
                  </div>
                  <div className="font-black">{item.carbon} kg CO2</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </BaseCard>

      {/* Multi-Provider Fallback */}
      <BaseCard>
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
          <Shield strokeWidth={3} /> Multi-Provider Fallback
        </h2>

        <p className="mb-4 text-sm font-medium text-[#0A0A0F]/70">
          SpoonAI automatically tries multiple AI providers (OpenAI → Anthropic → Google) if one fails.
        </p>

        <Button onClick={handleMultiProvider} disabled={loading} icon={TrendingUp}>
          Test Multi-Provider Execution
        </Button>
      </BaseCard>

      {/* Features */}
      <BaseCard className="bg-[#FFD93D]/10">
        <h2 className="text-2xl font-black uppercase mb-6">🎨 SpoonAI Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🤖', title: 'Multi-Agent System', desc: 'Specialized agents for different tasks' },
            { icon: '🔄', title: 'Auto Fallback', desc: 'Automatic provider switching on failure' },
            { icon: '⛓️', title: 'Blockchain Integration', desc: 'Neo N3 blockchain operations' },
            { icon: '📊', title: 'Real-time Analytics', desc: 'Track usage, costs, and savings' },
            { icon: '🌱', title: 'Carbon Tracking', desc: 'Monitor environmental impact' },
            { icon: '🔐', title: 'Secure Execution', desc: 'MCP-based secure tool calling' }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white border-3 border-[#0A0A0F] rounded-[16px]">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <div className="font-black text-sm">{feature.title}</div>
                <div className="text-xs text-[#0A0A0F]/60">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {error && (
        <div className="p-4 bg-[#FF5252]/10 border-3 border-[#FF5252] rounded-[20px] flex items-start gap-3">
          <AlertCircle size={24} strokeWidth={3} className="text-[#FF5252] flex-shrink-0" />
          <div>
            <div className="font-black text-[#FF5252]">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
