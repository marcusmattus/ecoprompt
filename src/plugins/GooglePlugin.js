/**
 * Google AI Plugin for EcoPrompt
 */
import { PluginBase } from '../lib/pluginSystem';

export class GooglePlugin extends PluginBase {
  constructor() {
    super({
      id: 'google',
      name: 'Google AI',
      version: '1.0.0',
      description: 'Gemini Pro and other Google AI models',
      icon: '🔷',
      defaultSettings: {
        model: 'gemini-pro',
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    });

    this.models = [
      { id: 'gemini-pro', name: 'Gemini Pro', inputCost: 0.00025, outputCost: 0.0005, carbonPerToken: 0.00015 },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', inputCost: 0.00025, outputCost: 0.0005, carbonPerToken: 0.00015 },
      { id: 'gemini-ultra', name: 'Gemini Ultra', inputCost: 0.01, outputCost: 0.02, carbonPerToken: 0.0003 }
    ];
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('Google AI API key is required');
    }
    
    this.enabled = true;
    return { success: true, message: 'Google AI plugin initialized' };
  }

  async validate() {
    if (!this.apiKey) {
      return { valid: false, error: 'API key is required' };
    }
    
    if (this.apiKey.length < 30) {
      return { valid: false, error: 'Invalid API key format' };
    }
    
    return { valid: true };
  }

  async estimateCost(prompt, modelId = 'gemini-pro') {
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a prompt optimization expert. Your task is to reduce this prompt's token count by 40-60% while maintaining its core meaning and effectiveness.

Guidelines:
- Use concise, directive language
- Remove redundancy and filler words
- Maintain key instructions and context
- Be specific and clear

Return ONLY a JSON object with this structure:
{
  "optimized": "your optimized prompt here",
  "changes": ["change 1", "change 2", "..."],
  "tokensSaved": estimated_number,
  "reasoning": "brief explanation of your approach"
}

Original prompt to optimize:
${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse optimization result');
      }
      
      const result = JSON.parse(jsonMatch[0]);

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
        provider: 'Google AI',
        model
      };
    } catch (error) {
      throw new Error(`Google AI optimization failed: ${error.message}`);
    }
  }

  async calculateCarbon(tokens, modelId = 'gemini-pro') {
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
    // Gemini tokenization
    return Math.ceil(text.length / 4);
  }

  getModels() {
    return this.models;
  }
}
