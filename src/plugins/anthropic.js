/**
 * Anthropic Claude Plugin for EcoPrompt
 */

import { PluginBase } from '../lib/pluginSystem';

export class AnthropicPlugin extends PluginBase {
  constructor() {
    super({
      id: 'anthropic',
      name: 'Anthropic Claude',
      version: '1.0.0',
      description: 'Claude 3 powered prompt optimization',
      icon: '🧠',
      defaultSettings: {
        model: 'claude-3-sonnet-20240229',
        temperature: 0.3,
        maxTokens: 1000
      }
    });

    this.baseURL = 'https://api.anthropic.com/v1';
    this.pricing = {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 }
    };
  }

  async initialize() {
    console.log('🧠 Anthropic plugin initialized');
    return true;
  }

  async validate() {
    if (!this.apiKey || !this.apiKey.startsWith('sk-ant-')) {
      throw new Error('Invalid Anthropic API key');
    }

    // Anthropic doesn't have a simple validation endpoint
    // We'll validate on first use
    return true;
  }

  async estimateCost(prompt, model = 'claude-3-sonnet-20240229') {
    const tokens = this.estimateTokens(prompt);
    const pricing = this.pricing[model] || this.pricing['claude-3-sonnet-20240229'];
    return (tokens / 1000) * pricing.input + (tokens / 1000) * pricing.output;
  }

  async optimize(prompt, options = {}) {
    const model = options.model || this.settings.model;

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: this.settings.maxTokens,
          temperature: this.settings.temperature,
          system: `You are an expert prompt engineer. Optimize the user's prompt to reduce tokens while maintaining effectiveness. Return JSON with: {"optimized": "...", "changes": [...], "tokensSaved": number}`,
          messages: [
            {
              role: 'user',
              content: `Optimize this prompt:\n\n${prompt}`
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Optimization failed');
      }

      const data = await response.json();
      const result = JSON.parse(data.content[0].text);

      return {
        optimized: result.optimized,
        changes: result.changes || [],
        improvements: result.improvements || [],
        tokensSaved: result.tokensSaved || this.calculateTokensSaved(prompt, result.optimized),
        usage: data.usage
      };
    } catch (error) {
      console.error('Anthropic optimization error:', error);
      throw error;
    }
  }

  async calculateCarbon(tokens, model) {
    const carbonCoefficients = {
      'claude-3-opus-20240229': 40,
      'claude-3-sonnet-20240229': 25,
      'claude-3-haiku-20240307': 8
    };
    const coefficient = carbonCoefficients[model] || 25;
    return (tokens / 1000) * coefficient;
  }

  async getPricing() {
    return Object.entries(this.pricing).map(([model, prices]) => ({
      model,
      inputPer1K: prices.input,
      outputPer1K: prices.output,
      currency: 'USD'
    }));
  }

  calculateTokensSaved(original, optimized) {
    return this.estimateTokens(original) - this.estimateTokens(optimized);
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
}
