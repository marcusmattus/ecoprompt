/**
 * OpenAI Plugin for EcoPrompt
 * Provides prompt optimization using GPT-4
 */

import { PluginBase } from '../lib/pluginSystem';

export class OpenAIPlugin extends PluginBase {
  constructor() {
    super({
      id: 'openai',
      name: 'OpenAI',
      version: '1.0.0',
      description: 'GPT-4 powered prompt optimization',
      icon: '🤖',
      defaultSettings: {
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1000
      }
    });

    this.baseURL = 'https://api.openai.com/v1';
    this.pricing = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    };
  }

  async initialize() {
    console.log('🤖 OpenAI plugin initialized');
    return true;
  }

  async validate() {
    if (!this.apiKey || !this.apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key');
    }

    try {
      // Test API key
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('API key validation failed');
      }

      return true;
    } catch (error) {
      console.error('OpenAI validation failed:', error);
      return false;
    }
  }

  async estimateCost(prompt, model = 'gpt-4') {
    const tokens = this.estimateTokens(prompt);
    const pricing = this.pricing[model] || this.pricing['gpt-4'];
    // Assume 50/50 split input/output
    return (tokens / 1000) * pricing.input + (tokens / 1000) * pricing.output;
  }

  async optimize(prompt, options = {}) {
    const model = options.model || this.settings.model;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
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
              content: `You are an expert prompt engineer. Optimize the user's prompt to:
1. Reduce token count by 40-60%
2. Maintain all semantic meaning and intent
3. Use clear, directive language
4. Remove redundancy and filler words
5. Make it more effective for AI models

Return a JSON object with:
{
  "optimized": "the optimized prompt",
  "changes": ["list of changes made"],
  "tokensSaved": estimated_tokens_saved,
  "improvements": ["list of improvements"]
}`
            },
            {
              role: 'user',
              content: `Optimize this prompt:\n\n${prompt}`
            }
          ],
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Optimization failed');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        optimized: result.optimized,
        changes: result.changes,
        improvements: result.improvements,
        tokensSaved: result.tokensSaved || this.calculateTokensSaved(prompt, result.optimized),
        usage: data.usage
      };
    } catch (error) {
      console.error('OpenAI optimization error:', error);
      throw error;
    }
  }

  async calculateCarbon(tokens, model = 'gpt-4') {
    // Carbon coefficients (grams CO2 per 1000 tokens)
    const carbonCoefficients = {
      'gpt-4': 50,
      'gpt-4-turbo': 30,
      'gpt-3.5-turbo': 10
    };

    const coefficient = carbonCoefficients[model] || carbonCoefficients['gpt-4'];
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
    // More accurate estimation for GPT models: ~4 chars per token
    return Math.ceil(text.length / 4);
  }
}
