/**
 * OpenAI Plugin for EcoPrompt
 */
import { PluginBase } from '../lib/pluginSystem';

export class OpenAIPlugin extends PluginBase {
  constructor() {
    super({
      id: 'openai',
      name: 'OpenAI',
      version: '1.0.0',
      description: 'GPT-4, GPT-3.5-turbo, and other OpenAI models',
      icon: '🤖',
      defaultSettings: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2048
      }
    });

    this.models = [
      { id: 'gpt-4', name: 'GPT-4', inputCost: 0.03, outputCost: 0.06, carbonPerToken: 0.0003 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', inputCost: 0.01, outputCost: 0.03, carbonPerToken: 0.00025 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', inputCost: 0.0005, outputCost: 0.0015, carbonPerToken: 0.0001 }
    ];
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    // Test API key validity
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid API key');
      }
      
      this.enabled = true;
      return { success: true, message: 'OpenAI plugin initialized' };
    } catch (error) {
      throw new Error(`Failed to initialize OpenAI: ${error.message}`);
    }
  }

  async validate() {
    if (!this.apiKey) {
      return { valid: false, error: 'API key is required' };
    }
    
    if (!this.apiKey.startsWith('sk-')) {
      return { valid: false, error: 'Invalid API key format' };
    }
    
    return { valid: true };
  }

  async estimateCost(prompt, modelId = 'gpt-3.5-turbo') {
    const model = this.models.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const tokens = this.estimateTokens(prompt);
    const inputCost = (tokens / 1000) * model.inputCost;
    const outputCost = (tokens / 1000) * model.outputCost; // Assume similar output length
    
    return {
      model: model.name,
      inputTokens: tokens,
      outputTokens: tokens,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
      currency: 'USD'
    };
  }

  async optimize(prompt, options = {}) {
    if (!this.enabled || !this.apiKey) {
      throw new Error('Plugin not initialized');
    }

    const model = options.model || this.settings.model;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `You are a prompt optimization expert. Reduce token count by 40-60% while maintaining meaning. Be concise, directive, and clear. Return JSON: {"optimized": "...", "changes": ["..."], "tokensSaved": number, "reasoning": "..."}`
            },
            {
              role: 'user',
              content: `Optimize this prompt:\n\n${prompt}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      const originalTokens = this.estimateTokens(prompt);
      const optimizedTokens = this.estimateTokens(result.optimized);
      
      return {
        original: prompt,
        optimized: result.optimized,
        changes: result.changes || [],
        reasoning: result.reasoning || '',
        originalTokens,
        optimizedTokens,
        tokensSaved: originalTokens - optimizedTokens,
        percentageSaved: Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100),
        provider: 'OpenAI',
        model
      };
    } catch (error) {
      throw new Error(`OpenAI optimization failed: ${error.message}`);
    }
  }

  async calculateCarbon(tokens, modelId = 'gpt-3.5-turbo') {
    const model = this.models.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const carbonGrams = tokens * model.carbonPerToken * 1000;
    
    return {
      model: model.name,
      tokens,
      carbonGrams,
      carbonKg: carbonGrams / 1000,
      equivalents: {
        treesDayAbsorption: carbonGrams / 48, // Average tree absorbs 48g CO2/day
        kmDriven: carbonGrams / 120, // Average car emits 120g CO2/km
        smartphoneCharges: carbonGrams / 8 // Phone charge ~8g CO2
      }
    };
  }

  estimateTokens(text) {
    // More accurate token estimation for OpenAI
    // Average: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  getModels() {
    return this.models;
  }
}
