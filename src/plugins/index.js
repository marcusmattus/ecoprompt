/**
 * Plugin Registry
 * Central export point for all EcoPrompt plugins
 */

export { OpenAIPlugin } from './OpenAIPlugin';
export { AnthropicPlugin } from './AnthropicPlugin';
export { GooglePlugin } from './GooglePlugin';

// Initialize all plugins
export const initializePlugins = async (pluginManager) => {
  const { OpenAIPlugin } = await import('./OpenAIPlugin');
  const { AnthropicPlugin } = await import('./AnthropicPlugin');
  const { GooglePlugin } = await import('./GooglePlugin');

  pluginManager.register(new OpenAIPlugin());
  pluginManager.register(new AnthropicPlugin());
  pluginManager.register(new GooglePlugin());
  
  console.log('✅ All plugins registered');
  
  return pluginManager;
};
