/**
 * EcoPrompt Plugin System - Phase 3A
 * Modular architecture for AI provider plugins
 */

// Plugin Base Class
export class PluginBase {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.version = config.version;
    this.description = config.description;
    this.icon = config.icon;
    this.enabled = false;
    this.apiKey = null;
    this.settings = config.defaultSettings || {};
  }

  // Lifecycle methods
  async initialize() {
    throw new Error('Plugin must implement initialize()');
  }

  async validate() {
    throw new Error('Plugin must implement validate()');
  }

  async estimateCost(prompt, model) {
    throw new Error('Plugin must implement estimateCost()');
  }

  async optimize(prompt, options) {
    throw new Error('Plugin must implement optimize()');
  }

  async calculateCarbon(tokens, model) {
    throw new Error('Plugin must implement calculateCarbon()');
  }

  // Configuration
  setApiKey(key) {
    this.apiKey = key;
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  getConfig() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      enabled: this.enabled,
      hasApiKey: !!this.apiKey,
      settings: this.settings
    };
  }
}

// Plugin Manager
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.activePlugins = new Set();
  }

  /**
   * Register a new plugin
   */
  register(plugin) {
    if (!(plugin instanceof PluginBase)) {
      throw new Error('Plugin must extend PluginBase');
    }
    
    this.plugins.set(plugin.id, plugin);
    console.log(`✅ Plugin registered: ${plugin.name}`);
  }

  /**
   * Enable a plugin
   */
  async enable(pluginId, apiKey) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }

    // Set API key
    plugin.setApiKey(apiKey);

    // Validate
    const isValid = await plugin.validate();
    if (!isValid) {
      throw new Error(`Plugin validation failed: ${pluginId}`);
    }

    // Initialize
    await plugin.initialize();
    plugin.enabled = true;
    this.activePlugins.add(pluginId);

    // Save to localStorage
    this.saveState();

    console.log(`✅ Plugin enabled: ${plugin.name}`);
    return true;
  }

  /**
   * Disable a plugin
   */
  disable(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    plugin.enabled = false;
    plugin.apiKey = null;
    this.activePlugins.delete(pluginId);

    // Save to localStorage
    this.saveState();

    console.log(`🛑 Plugin disabled: ${plugin.name}`);
    return true;
  }

  /**
   * Get all plugins
   */
  getAll() {
    return Array.from(this.plugins.values()).map(p => p.getConfig());
  }

  /**
   * Get active plugins
   */
  getActive() {
    return Array.from(this.activePlugins)
      .map(id => this.plugins.get(id))
      .filter(p => p.enabled);
  }

  /**
   * Get plugin by ID
   */
  get(pluginId) {
    return this.plugins.get(pluginId);
  }

  /**
   * Execute optimization across all active plugins
   */
  async optimizePrompt(prompt, options = {}) {
    const activePlugins = this.getActive();
    
    if (activePlugins.length === 0) {
      throw new Error('No active plugins available');
    }

    // Use the first active plugin or specified plugin
    const plugin = options.pluginId 
      ? this.plugins.get(options.pluginId)
      : activePlugins[0];

    if (!plugin || !plugin.enabled) {
      throw new Error('Plugin not available');
    }

    const result = await plugin.optimize(prompt, options);
    
    // Calculate savings
    const originalCost = await plugin.estimateCost(prompt, options.model);
    const optimizedCost = await plugin.estimateCost(result.optimized, options.model);
    const carbon = await plugin.calculateCarbon(result.tokensSaved, options.model);

    return {
      ...result,
      provider: plugin.name,
      savings: {
        tokens: result.tokensSaved,
        cost: originalCost - optimizedCost,
        carbon: carbon,
        percentage: Math.round((result.tokensSaved / this.estimateTokens(prompt)) * 100)
      }
    };
  }

  /**
   * Get pricing from all active plugins
   */
  async getAllPricing() {
    const activePlugins = this.getActive();
    const pricing = await Promise.all(
      activePlugins.map(async (plugin) => ({
        provider: plugin.name,
        models: await plugin.getPricing()
      }))
    );
    return pricing;
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    const state = {
      plugins: Array.from(this.plugins.entries()).map(([id, plugin]) => ({
        id,
        enabled: plugin.enabled,
        settings: plugin.settings,
        // Don't save API keys in localStorage (security)
      }))
    };
    localStorage.setItem('ecoprompt_plugins', JSON.stringify(state));
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    const saved = localStorage.getItem('ecoprompt_plugins');
    if (!saved) return;

    try {
      const state = JSON.parse(saved);
      state.plugins.forEach(savedPlugin => {
        const plugin = this.plugins.get(savedPlugin.id);
        if (plugin) {
          plugin.enabled = savedPlugin.enabled;
          plugin.settings = savedPlugin.settings;
          if (savedPlugin.enabled) {
            this.activePlugins.add(savedPlugin.id);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load plugin state:', error);
    }
  }

  /**
   * Utility: Estimate token count
   */
  estimateTokens(text) {
    // Simple estimation: ~4 chars per token
    return Math.ceil(text.length / 4);
  }
}

// Create singleton instance
export const pluginManager = new PluginManager();

// Export types
export const PluginStatus = {
  INSTALLED: 'installed',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  ERROR: 'error'
};
