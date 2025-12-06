/**
 * Plugin Manager UI Component
 * Allows users to install, configure, and manage AI provider plugins
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Settings as SettingsIcon, 
  Key, 
  AlertCircle,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { pluginManager } from '../../lib/pluginSystem';
import { OpenAIPlugin } from '../../plugins/openai';
import { AnthropicPlugin } from '../../plugins/anthropic';
import { GooglePlugin } from '../../plugins/google';

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-[#00E599] text-[#0A0A0F] hover:bg-[#FFD93D]',
    secondary: 'bg-[#0A0A0F] text-white hover:bg-[#B084FF]',
    danger: 'bg-[#FF5252] text-white hover:bg-[#FF5252]/90',
    outline: 'bg-transparent text-[#0A0A0F] border-[#0A0A0F] hover:bg-[#0A0A0F] hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-[16px]',
    md: 'px-6 py-3 text-base rounded-[24px]',
    lg: 'px-8 py-4 text-lg rounded-[32px]'
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

const Input = ({ label, icon: Icon, placeholder, value, onChange, type = 'text', error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && !showPassword ? 'password' : 'text';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-black uppercase tracking-wide text-[#0A0A0F]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0F]">
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className={`
            w-full
            ${Icon ? 'pl-12' : 'pl-4'} ${type === 'password' ? 'pr-12' : 'pr-4'} py-3
            bg-white
            border-4 ${error ? 'border-[#FF5252]' : 'border-[#0A0A0F]'}
            rounded-[20px]
            font-mono text-sm text-[#0A0A0F]
            placeholder:text-[#0A0A0F]/40
            focus:outline-none
            focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
            focus:-translate-y-1 focus:-translate-x-1
            transition-all duration-150
          `}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0F]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-[#FF5252] text-sm font-bold">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

const PluginCard = ({ plugin, onConfigure, onToggle }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await pluginManager.enable(plugin.id, apiKey);
      setShowConfig(false);
      setApiKey('');
      onConfigure();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = () => {
    pluginManager.disable(plugin.id);
    onToggle();
  };

  return (
    <div className="
      bg-white
      border-4 border-[#0A0A0F]
      rounded-[32px]
      shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
      p-6
      transition-all duration-200
    ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="
            w-14 h-14
            bg-[#00E599]
            border-4 border-[#0A0A0F]
            rounded-full
            flex items-center justify-center
            text-2xl
          ">
            {plugin.icon}
          </div>
          <div>
            <h3 className="text-xl font-black uppercase">{plugin.name}</h3>
            <p className="text-sm text-[#0A0A0F]/60 font-medium">v{plugin.version}</p>
          </div>
        </div>

        {plugin.enabled ? (
          <Badge color="bg-[#00E599]" icon={Check}>
            Active
          </Badge>
        ) : (
          <Badge color="bg-[#0A0A0F]/10">
            Inactive
          </Badge>
        )}
      </div>

      <p className="text-sm font-medium mb-4 text-[#0A0A0F]/80">
        {plugin.description}
      </p>

      {!showConfig && (
        <div className="flex gap-3">
          {plugin.enabled ? (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={SettingsIcon}
                onClick={() => setShowConfig(true)}
              >
                Settings
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={X}
                onClick={handleDisable}
              >
                Disable
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setShowConfig(true)}
              className="w-full"
            >
              Configure & Enable
            </Button>
          )}
        </div>
      )}

      {showConfig && (
        <div className="
          mt-4 pt-4
          border-t-4 border-[#0A0A0F]
          space-y-4
          animate-fadeIn
        ">
          <Input
            label="API Key"
            icon={Key}
            type="password"
            placeholder={`Enter your ${plugin.name} API key...`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={error}
          />

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={handleSave}
              disabled={loading || !apiKey.trim()}
              className="flex-1"
            >
              {loading ? 'Validating...' : 'Save & Enable'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => {
                setShowConfig(false);
                setApiKey('');
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="
            p-3
            bg-[#4FFFB0]/20
            border-3 border-[#4FFFB0]
            rounded-[16px]
            text-xs font-medium
          ">
            <div className="font-bold mb-1">🔒 Security Note:</div>
            <p>Your API keys are stored locally in your browser and never sent to our servers. For production use, we recommend storing them on the Neo blockchain via SpoonOS.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const PluginManager = () => {
  const [plugins, setPlugins] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // Register all available plugins
    pluginManager.register(new OpenAIPlugin());
    pluginManager.register(new AnthropicPlugin());
    pluginManager.register(new GooglePlugin());

    // Load saved state
    pluginManager.loadState();

    // Update UI
    refreshPlugins();
  }, []);

  const refreshPlugins = () => {
    const allPlugins = pluginManager.getAll();
    const activePlugins = pluginManager.getActive();
    
    setPlugins(allPlugins);
    setActiveCount(activePlugins.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight flex items-center justify-center gap-3">
          <Zap size={48} strokeWidth={3} />
          Plugin Manager
        </h1>
        <p className="text-lg font-medium text-[#0A0A0F]/70">
          Connect your AI providers and start optimizing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="
          bg-[#00E599]/20
          border-4 border-[#00E599]
          rounded-[24px]
          p-6
          text-center
        ">
          <div className="text-4xl font-black">{activeCount}</div>
          <div className="text-sm font-bold uppercase">Active Plugins</div>
        </div>

        <div className="
          bg-[#FFD93D]/20
          border-4 border-[#FFD93D]
          rounded-[24px]
          p-6
          text-center
        ">
          <div className="text-4xl font-black">{plugins.length}</div>
          <div className="text-sm font-bold uppercase">Available Plugins</div>
        </div>

        <div className="
          bg-[#B084FF]/20
          border-4 border-[#B084FF]
          rounded-[24px]
          p-6
          text-center
        ">
          <div className="text-4xl font-black">∞</div>
          <div className="text-sm font-bold uppercase">Optimizations</div>
        </div>
      </div>

      {/* Plugin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map((plugin) => (
          <PluginCard
            key={plugin.id}
            plugin={plugin}
            onConfigure={refreshPlugins}
            onToggle={refreshPlugins}
          />
        ))}
      </div>

      {/* Help Section */}
      <div className="
        bg-gradient-to-br from-[#B084FF]/10 to-[#FF6BCB]/10
        border-4 border-[#0A0A0F]
        rounded-[32px]
        p-8
      ">
        <h3 className="text-2xl font-black uppercase mb-4">💡 How It Works</h3>
        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-start gap-3">
            <div className="
              w-8 h-8
              bg-[#00E599]
              border-3 border-[#0A0A0F]
              rounded-full
              flex items-center justify-center
              font-black
              flex-shrink-0
            ">
              1
            </div>
            <p><strong>Configure plugins</strong> by adding your API keys from OpenAI, Anthropic, or Google.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="
              w-8 h-8
              bg-[#FFD93D]
              border-3 border-[#0A0A0F]
              rounded-full
              flex items-center justify-center
              font-black
              flex-shrink-0
            ">
              2
            </div>
            <p><strong>Start optimizing</strong> your prompts in the Optimizer tab.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="
              w-8 h-8
              bg-[#4FFFB0]
              border-3 border-[#0A0A0F]
              rounded-full
              flex items-center justify-center
              font-black
              flex-shrink-0
            ">
              3
            </div>
            <p><strong>Track savings</strong> in your dashboard and earn rewards!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
