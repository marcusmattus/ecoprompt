/**
 * Anthropic Plugin for EcoPrompt
 */
import { PluginBase } from '../lib/pluginSystem';

export class AnthropicPlugin extends PluginBase {
  constructor() {
    super({
      id: 'anthropic',
      name: 'Anthropic',
      version: '1.0.0',
      description: 'Claude 3 family models',
      icon: '🧠',
      defaultSettings: {
        model: 'claude-3-sonnet-20240229',
        maxTokens: 2048
      }
    });

    this.models = [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', inputCost: 0.015, outputCost: 0.075, carbonPerToken: 0.00035 },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', inputCost: 0.003, outputCost: 0.015, carbonPerToken: 0.00025 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', inputCost: 0.00025, outputCost: 0.00125, carbonPerToken: 0.00015 }
    ];
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required');
    }
    
    this.enabled = true;
    return { success: true, message: 'Anthropic plugin initialized' };
  }

  async validate() {
    if (!this.apiKey) {
      return { valid: false, error: 'API key is required' };
    }
    
    if (!this.apiKey.startsWith('sk-ant-')) {
      return { valid: false, error: 'Invalid API key format' };
    }
    
    return { valid: true };
  }

  async estimateCost(prompt, modelId = 'claude-3-sonnet-20240229') {
    const model = this.models.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const tokens = this.estimateTokens(prompt);
    const inputCost = (tokens / 1000) * model.inputCost;
    const outputCost = (tokens / 1000) * model.outputCost;
    
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a prompt optimization expert. Reduce this prompt's token count by 40-60% while maintaining its core meaning and intent. Be concise, use directive language, and remove redundancy.

Return your response as JSON:
{
  "optimized": "the optimized prompt",
  "changes": ["list of changes made"],
  "tokensSaved": estimated_number,
  "reasoning": "brief explanation"
}

Original prompt to optimize:
${prompt}`
          }]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      const result = JSON.parse(data.content[0].text);

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
        provider: 'Anthropic',
        model
      };
    } catch (error) {
      throw new Error(`Anthropic optimization failed: ${error.message}`);
    }
  }

  async calculateCarbon(tokens, modelId = 'claude-3-sonnet-20240229') {
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
        treesDayAbsorption: carbonGrams / 48,
        kmDriven: carbonGrams / 120,
        smartphoneCharges: carbonGrams / 8
      }
    };
  }

  estimateTokens(text) {
    // Claude tokenization similar to GPT
    return Math.ceil(text.length / 4);
  }

  getModels() {
    return this.models;
  }
}
