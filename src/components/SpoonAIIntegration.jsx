import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles,
  AlertCircle,
  Check,
  Zap
} from 'lucide-react';
import { useSpoonAI } from '../hooks/useSpoonAI';

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
  const { spoonAI, loading, error, chat, metrics, updateMetrics } = useSpoonAI();
  const [testPrompt, setTestPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <BaseCard>
          <div className="text-center space-y-4 py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#00E599] border-t-transparent"></div>
            <p className="text-xl font-bold text-[#00E599]">Initializing SpoonAI...</p>
          </div>
        </BaseCard>
      </div>
    );
  }

  // Setup instructions if no API keys
  if (error || !spoonAI) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tight flex items-center justify-center gap-4">
            <Sparkles size={48} strokeWidth={3} className="text-[#FFD93D]" />
            SpoonAI Integration
          </h1>
        </div>

        <BaseCard color="bg-gradient-to-br from-[#FFD93D]/20 to-[#FF6BCB]/20">
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD93D] rounded-full border-4 border-[#0A0A0F]">
              <AlertCircle size={40} strokeWidth={3} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-[#0A0A0F]">Setup Required</h3>
              <p className="text-lg text-[#0A0A0F]/70 max-w-md mx-auto">
                Add your API keys to enable SpoonAI features
              </p>
            </div>

            <div className="bg-[#0A0A0F] text-[#00E599] p-6 rounded-2xl text-left font-mono text-sm max-w-lg mx-auto space-y-2">
              <div># Add to .env file:</div>
              <div>VITE_OPENAI_API_KEY=sk-...</div>
              <div>VITE_ANTHROPIC_API_KEY=sk-ant-...</div>
              <div>VITE_GOOGLE_API_KEY=...</div>
            </div>

            <div className="flex gap-4 justify-center">
              <BaseCard color="bg-[#00E599]/20" className="p-4">
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-[#00E599]" strokeWidth={3} />
                  <span className="font-bold">Multi-Provider Support</span>
                </div>
              </BaseCard>
              <BaseCard color="bg-[#4FFFB0]/20" className="p-4">
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-[#4FFFB0]" strokeWidth={3} />
                  <span className="font-bold">5 Agent Types</span>
                </div>
              </BaseCard>
            </div>

            <p className="text-sm text-[#0A0A0F]/60">
              See <code className="bg-[#0A0A0F] text-[#00E599] px-2 py-1 rounded">SPOONAI_QUICK_REF.md</code> for setup instructions
            </p>
          </div>
        </BaseCard>
      </div>
    );
  }

  // Main interface when SpoonAI is ready
  const handleTest = async () => {
    if (!testPrompt.trim()) return;
    
    setIsProcessing(true);
    setResult(null);
    
    try {
      const response = await chat(testPrompt, {
        provider: 'openai',
        model: 'gpt-4'
      });
      setResult(response);
      updateMetrics();
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tight flex items-center justify-center gap-4">
          <Sparkles size={48} strokeWidth={3} className="text-[#00E599]" />
          SpoonAI Integration
        </h1>
        <p className="text-xl font-bold text-[#0A0A0F]/70">
          Multi-Provider AI System Active
        </p>
      </div>

      {/* Status Card */}
      <BaseCard color="bg-gradient-to-br from-[#00E599]/10 to-[#4FFFB0]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00E599] rounded-full border-4 border-[#0A0A0F] flex items-center justify-center">
              <Bot size={24} strokeWidth={3} />
            </div>
            <div>
              <div className="font-black text-xl">SpoonAI Status</div>
              <div className="text-sm text-[#0A0A0F]/60">Ready and operational</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#00E599] px-4 py-2 rounded-full border-4 border-[#0A0A0F]">
            <div className="w-3 h-3 bg-[#0A0A0F] rounded-full animate-pulse"></div>
            <span className="font-bold uppercase text-sm">Online</span>
          </div>
        </div>
      </BaseCard>

      {/* Test Interface */}
      <BaseCard>
        <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
          <Zap strokeWidth={3} className="text-[#FFD93D]" /> Test Chat
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter your message..."
            className="w-full p-4 border-4 border-[#0A0A0F] rounded-xl font-mono bg-white focus:outline-none focus:ring-4 focus:ring-[#00E599]"
            rows={4}
          />
          
          <Button 
            icon={Zap} 
            onClick={handleTest}
            disabled={!testPrompt.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Send Message'}
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-[#0A0A0F] text-[#00E599] rounded-xl font-mono text-sm">
            {result.error ? (
              <div className="text-[#FF5252]">Error: {result.error}</div>
            ) : (
              <div>
                <div className="font-bold mb-2">Response:</div>
                <div className="whitespace-pre-wrap">{result.message || JSON.stringify(result, null, 2)}</div>
              </div>
            )}
          </div>
        )}
      </BaseCard>

      {/* Metrics */}
      {metrics && (
        <BaseCard color="bg-gradient-to-br from-[#B084FF]/10 to-[#FF6BCB]/10">
          <h3 className="text-xl font-black uppercase mb-4">Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-[#0A0A0F]/60">Total Calls</div>
              <div className="text-2xl font-black">{metrics.llm?.totalCalls || 0}</div>
            </div>
            <div>
              <div className="text-sm text-[#0A0A0F]/60">Tokens Used</div>
              <div className="text-2xl font-black">{metrics.llm?.totalTokens || 0}</div>
            </div>
            <div>
              <div className="text-sm text-[#0A0A0F]/60">Cache Hits</div>
              <div className="text-2xl font-black">{metrics.llm?.cacheHits || 0}</div>
            </div>
          </div>
        </BaseCard>
      )}
    </div>
  );
}
