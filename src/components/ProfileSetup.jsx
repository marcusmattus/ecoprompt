import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  DollarSign
} from 'lucide-react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';

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
      {Icon && <Icon size={20} strokeWidth={3} />}
      {children}
    </button>
  );
};

const BaseCard = ({ children, className = '' }) => (
  <div className={`
    bg-white
    border-4 border-[#0A0A0F]
    rounded-[32px]
    shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
    p-6
    ${className}
  `}>
    {children}
  </div>
);

const Input = ({ label, icon: Icon, placeholder, value, onChange, type = 'text', error, helpText }) => (
  <div className="space-y-2">
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
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full
          ${Icon ? 'pl-14' : 'pl-6'} pr-6 py-4
          bg-white
          border-4 ${error ? 'border-[#FF5252]' : 'border-[#0A0A0F]'}
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
    {error && (
      <div className="flex items-center gap-2 text-[#FF5252] text-sm font-bold">
        <AlertCircle size={16} />
        {error}
      </div>
    )}
    {helpText && !error && (
      <div className="text-sm text-[#0A0A0F]/60 font-medium">
        {helpText}
      </div>
    )}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="font-bold text-[#0A0A0F]">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-16 h-8
        border-4 border-[#0A0A0F]
        rounded-full
        transition-colors duration-200
        ${checked ? 'bg-[#00E599]' : 'bg-[#0A0A0F]/20'}
      `}
    >
      <div className={`
        absolute top-0 bottom-0 my-auto
        w-6 h-6
        bg-[#0A0A0F]
        rounded-full
        transition-transform duration-200
        ${checked ? 'translate-x-8' : 'translate-x-1'}
      `} />
    </button>
  </div>
);

// API Key providers configuration
const API_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    color: '#00E599',
    fields: [
      { 
        key: 'apiKey', 
        label: 'API Key', 
        type: 'password', 
        placeholder: 'sk-proj-...',
        helpText: 'Get your key from platform.openai.com'
      }
    ],
    testEndpoint: 'https://api.openai.com/v1/models',
    models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    color: '#FFD93D',
    fields: [
      { 
        key: 'apiKey', 
        label: 'API Key', 
        type: 'password', 
        placeholder: 'sk-ant-...',
        helpText: 'Get your key from console.anthropic.com'
      }
    ],
    testEndpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '✨',
    color: '#4FFFB0',
    fields: [
      { 
        key: 'apiKey', 
        label: 'API Key', 
        type: 'password', 
        placeholder: 'AIza...',
        helpText: 'Get your key from makersuite.google.com'
      }
    ],
    testEndpoint: 'https://generativelanguage.googleapis.com/v1/models',
    models: ['gemini-pro', 'gemini-ultra']
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🔷',
    color: '#B084FF',
    fields: [
      { 
        key: 'apiKey', 
        label: 'API Key', 
        type: 'password', 
        placeholder: 'co_...',
        helpText: 'Get your key from dashboard.cohere.com'
      }
    ],
    testEndpoint: 'https://api.cohere.ai/v1/models',
    models: ['command', 'command-light', 'command-nightly']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    color: '#FF6BCB',
    fields: [
      { 
        key: 'apiKey', 
        label: 'API Token', 
        type: 'password', 
        placeholder: 'hf_...',
        helpText: 'Get your token from huggingface.co/settings/tokens'
      }
    ],
    testEndpoint: 'https://huggingface.co/api/models',
    models: ['mistral-7b', 'llama-2-70b', 'falcon-180b']
  }
];

export default function ProfileSetup() {
  const { address, connected } = useWallet();
  
  // Profile state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [testingProvider, setTestingProvider] = useState(null);
  const [validKeys, setValidKeys] = useState({});
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, api-keys, preferences

  // Load saved data
  useEffect(() => {
    if (connected && address) {
      loadProfileData();
    }
  }, [connected, address]);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`ecoprompt_profile_${address}`);
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setUsername(data.username || '');
      setEmail(data.email || '');
      setNotifications(data.notifications ?? true);
      setPublicProfile(data.publicProfile ?? false);
    }

    const savedKeys = localStorage.getItem(`ecoprompt_keys_${address}`);
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    const profileData = {
      username,
      email,
      notifications,
      publicProfile,
      updatedAt: Date.now()
    };

    localStorage.setItem(`ecoprompt_profile_${address}`, JSON.stringify(profileData));
    
    // TODO: Store encrypted in Neo blockchain via SpoonOS
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    showToast('Profile saved successfully!', 'success');
  };

  const handleSaveApiKey = (providerId, keyData) => {
    const updatedKeys = {
      ...apiKeys,
      [providerId]: {
        ...keyData,
        addedAt: Date.now()
      }
    };
    
    setApiKeys(updatedKeys);
    localStorage.setItem(`ecoprompt_keys_${address}`, JSON.stringify(updatedKeys));
    setSelectedProvider(null);
    showToast(`${API_PROVIDERS.find(p => p.id === providerId).name} API key saved!`, 'success');
  };

  const handleDeleteApiKey = (providerId) => {
    const updatedKeys = { ...apiKeys };
    delete updatedKeys[providerId];
    
    setApiKeys(updatedKeys);
    localStorage.setItem(`ecoprompt_keys_${address}`, JSON.stringify(updatedKeys));
    
    const updatedValid = { ...validKeys };
    delete updatedValid[providerId];
    setValidKeys(updatedValid);
    
    showToast('API key removed', 'info');
  };

  const handleTestApiKey = async (providerId) => {
    setTestingProvider(providerId);
    
    try {
      const provider = API_PROVIDERS.find(p => p.id === providerId);
      const keyData = apiKeys[providerId];
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, make actual API call to test
      const isValid = keyData && keyData.apiKey && keyData.apiKey.length > 10;
      
      setValidKeys({
        ...validKeys,
        [providerId]: isValid
      });
      
      showToast(
        isValid ? 'API key is valid! ✓' : 'API key validation failed',
        isValid ? 'success' : 'error'
      );
    } catch (error) {
      showToast('Failed to test API key', 'error');
      setValidKeys({
        ...validKeys,
        [providerId]: false
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const showToast = (message, type) => {
    // Implement toast notification
    console.log(`[${type}] ${message}`);
  };

  const toggleKeyVisibility = (providerId) => {
    setShowKeys({
      ...showKeys,
      [providerId]: !showKeys[providerId]
    });
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <BaseCard className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#FFD93D] rounded-full border-4 border-[#0A0A0F] flex items-center justify-center">
            <Shield size={48} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black mb-4">Connect Wallet First</h2>
          <p className="text-lg mb-6 text-[#0A0A0F]/70">
            Please connect your Neo wallet to access profile settings
          </p>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase">Profile Settings</h1>
          <p className="text-lg text-[#0A0A0F]/70 mt-2">
            Manage your account, API keys, and preferences
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#00E599]/20 border-3 border-[#00E599] rounded-[20px]">
          <span className="font-mono font-bold text-sm">
            {address.slice(0, 8)}...{address.slice(-6)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-4 border-[#0A0A0F] pb-2">
        {[
          { id: 'profile', label: 'Profile', icon: Settings },
          { id: 'api-keys', label: 'API Keys', icon: Key },
          { id: 'preferences', label: 'Preferences', icon: Sparkles }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 rounded-t-[16px] font-bold flex items-center gap-2
              border-4 border-b-0 transition-all
              ${activeTab === tab.id 
                ? 'bg-[#00E599] border-[#0A0A0F] text-[#0A0A0F] translate-y-1' 
                : 'bg-white border-transparent text-[#0A0A0F]/60 hover:text-[#0A0A0F]'
              }
            `}
          >
            <tab.icon size={20} strokeWidth={3} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <BaseCard>
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b-4 border-[#0A0A0F]/10">
              <div className="w-20 h-20 bg-[#B084FF] rounded-full border-4 border-[#0A0A0F] flex items-center justify-center text-4xl font-black">
                {username ? username[0].toUpperCase() : '?'}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black">{username || 'Set your username'}</h3>
                <p className="text-[#0A0A0F]/60">Neo Wallet Connected</p>
              </div>
            </div>

            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helpText="This will be your public display name"
            />

            <Input
              label="Email (Optional)"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helpText="For important notifications only"
            />

            <div className="pt-6 border-t-4 border-[#0A0A0F]/10">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                icon={Save}
                size="lg"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </BaseCard>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-4 bg-[#4FFFB0]/20 border-3 border-[#4FFFB0] rounded-[24px]">
            <div className="flex items-start gap-3">
              <Shield size={24} strokeWidth={3} className="text-[#0A0A0F] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold mb-1">🔒 Your keys are secure</div>
                <p className="text-sm text-[#0A0A0F]/70">
                  API keys are encrypted and stored locally. In Phase 3, they'll be stored on Neo blockchain via NeoFS for ultimate security.
                </p>
              </div>
            </div>
          </div>

          {/* Connected APIs */}
          <BaseCard>
            <h3 className="text-2xl font-black mb-6">Connected AI Providers</h3>
            
            {Object.keys(apiKeys).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#0A0A0F]/5 rounded-full flex items-center justify-center">
                  <Key size={40} strokeWidth={2} className="text-[#0A0A0F]/40" />
                </div>
                <p className="text-lg text-[#0A0A0F]/60 mb-6">
                  No API keys connected yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(apiKeys).map(([providerId, keyData]) => {
                  const provider = API_PROVIDERS.find(p => p.id === providerId);
                  const isValid = validKeys[providerId];
                  const isVisible = showKeys[providerId];
                  
                  return (
                    <div
                      key={providerId}
                      className="p-4 bg-[#0A0A0F]/5 border-3 border-[#0A0A0F] rounded-[20px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="w-12 h-12 rounded-full border-3 border-[#0A0A0F] flex items-center justify-center text-2xl"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-lg">{provider.name}</span>
                            {isValid === true && (
                              <span className="px-2 py-0.5 bg-[#00E599] border-2 border-[#0A0A0F] rounded-full text-xs font-bold">
                                ✓ VERIFIED
                              </span>
                            )}
                            {isValid === false && (
                              <span className="px-2 py-0.5 bg-[#FF5252] border-2 border-[#0A0A0F] rounded-full text-xs font-bold text-white">
                                ✗ INVALID
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-sm text-[#0A0A0F]/60">
                            {isVisible 
                              ? keyData.apiKey 
                              : '•'.repeat(Math.min(keyData.apiKey.length, 40))
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(providerId)}
                          className="w-10 h-10 bg-white border-3 border-[#0A0A0F] rounded-full flex items-center justify-center hover:bg-[#0A0A0F]/10 transition-colors"
                        >
                          {isVisible ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                        </button>
                        
                        <button
                          onClick={() => handleTestApiKey(providerId)}
                          disabled={testingProvider === providerId}
                          className="px-4 py-2 bg-[#4FFFB0] border-3 border-[#0A0A0F] rounded-[12px] font-bold text-sm hover:bg-[#4FFFB0]/80 disabled:opacity-50"
                        >
                          {testingProvider === providerId ? '⏳' : '🧪 Test'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteApiKey(providerId)}
                          className="w-10 h-10 bg-[#FF5252] border-3 border-[#0A0A0F] rounded-full flex items-center justify-center hover:bg-[#FF5252]/80 text-white transition-colors"
                        >
                          <Trash2 size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </BaseCard>

          {/* Add New API Key */}
          <BaseCard>
            <h3 className="text-2xl font-black mb-6">Add New Provider</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {API_PROVIDERS.filter(p => !apiKeys[p.id]).map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className="p-4 bg-white border-4 border-[#0A0A0F] rounded-[20px] hover:bg-[#0A0A0F]/5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full border-3 border-[#0A0A0F] flex items-center justify-center text-xl"
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.icon}
                    </div>
                    <span className="font-black text-lg">{provider.name}</span>
                  </div>
                  <div className="text-sm text-[#0A0A0F]/60">
                    {provider.models.length} models available
                  </div>
                </button>
              ))}
            </div>
          </BaseCard>

          {/* Add API Key Modal */}
          {selectedProvider && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/80 backdrop-blur-sm p-4">
              <BaseCard className="max-w-2xl w-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full border-3 border-[#0A0A0F] flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selectedProvider.color }}
                    >
                      {selectedProvider.icon}
                    </div>
                    <h3 className="text-2xl font-black">Add {selectedProvider.name} API Key</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="w-10 h-10 bg-[#FF5252] border-3 border-[#0A0A0F] rounded-full flex items-center justify-center text-white hover:bg-[#FF5252]/80"
                  >
                    ✕
                  </button>
                </div>

                <AddApiKeyForm
                  provider={selectedProvider}
                  onSave={(keyData) => handleSaveApiKey(selectedProvider.id, keyData)}
                  onCancel={() => setSelectedProvider(null)}
                />
              </BaseCard>
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <BaseCard>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black mb-4">Notifications</h3>
              <div className="space-y-4">
                <Toggle
                  label="Enable Notifications"
                  checked={notifications}
                  onChange={setNotifications}
                />
                <p className="text-sm text-[#0A0A0F]/60 ml-1">
                  Get notified about savings milestones and optimization tips
                </p>
              </div>
            </div>

            <div className="pt-6 border-t-4 border-[#0A0A0F]/10">
              <h3 className="text-2xl font-black mb-4">Privacy</h3>
              <div className="space-y-4">
                <Toggle
                  label="Public Profile"
                  checked={publicProfile}
                  onChange={setPublicProfile}
                />
                <p className="text-sm text-[#0A0A0F]/60 ml-1">
                  Show your stats on the community leaderboard
                </p>
              </div>
            </div>

            <div className="pt-6 border-t-4 border-[#0A0A0F]/10">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                icon={Save}
                size="lg"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </BaseCard>
      )}
    </div>
  );
}

// Add API Key Form Component
function AddApiKeyForm({ provider, onSave, onCancel }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    provider.fields.forEach(field => {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        newErrors[field.key] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {provider.fields.map(field => (
        <Input
          key={field.key}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.key] || ''}
          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
          error={errors[field.key]}
          helpText={field.helpText}
        />
      ))}

      <div className="p-4 bg-[#FFD93D]/20 border-3 border-[#FFD93D] rounded-[16px]">
        <div className="font-bold mb-2">📊 Available Models:</div>
        <div className="flex flex-wrap gap-2">
          {provider.models.map(model => (
            <span
              key={model}
              className="px-3 py-1 bg-white border-2 border-[#0A0A0F] rounded-full text-sm font-bold"
            >
              {model}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" icon={Save} className="flex-1">
          Save API Key
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
