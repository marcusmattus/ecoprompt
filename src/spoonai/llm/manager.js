/**
 * LLM Manager - Handles multiple LLM providers with caching and monitoring
 */

import { LLMProvider, LLMResponse, CallbackEvent } from '../types';

export class LLMManager {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.providers = new Map();
    this.cache = new Map();
    this.metrics = {
      totalCalls: 0,
      totalTokens: 0,
      cacheHits: 0,
      errors: 0
    };
  }

  async initialize() {
    // Initialize default providers
    await this.registerProvider(LLMProvider.OPENAI, OpenAIProvider);
    await this.registerProvider(LLMProvider.ANTHROPIC, AnthropicProvider);
    await this.registerProvider(LLMProvider.GOOGLE, GoogleProvider);
  }

  async registerProvider(name, providerClass) {
    const provider = new providerClass();
    await provider.initialize();
    this.providers.set(name, provider);
  }

  async chat(messages, options = {}) {
    const {
      provider = LLMProvider.OPENAI,
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 2000,
      stream = false,
      useCache = true
    } = options;

    // Check cache
    if (useCache) {
      const cacheKey = this.getCacheKey(messages, options);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        return cached;
      }
    }

    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`);
    }

    await this.callbacks.emit(CallbackEvent.LLM_START, {
      provider,
      model,
      messages
    });

    try {
      this.metrics.totalCalls++;
      
      const response = await providerInstance.chat(messages, {
        model,
        temperature,
        maxTokens,
        stream
      });

      this.metrics.totalTokens += response.usage.totalTokens;

      await this.callbacks.emit(CallbackEvent.LLM_END, {
        provider,
        model,
        response
      });

      // Cache response
      if (useCache && !stream) {
        const cacheKey = this.getCacheKey(messages, options);
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      this.metrics.errors++;
      await this.callbacks.emit(CallbackEvent.LLM_ERROR, {
        provider,
        model,
        error
      });
      throw error;
    }
  }

  async stream(messages, options = {}) {
    return this.chat(messages, { ...options, stream: true });
  }

  getCacheKey(messages, options) {
    return JSON.stringify({
      messages,
      provider: options.provider,
      model: options.model,
      temperature: options.temperature
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  async shutdown() {
    this.cache.clear();
    for (const provider of this.providers.values()) {
      await provider.shutdown();
    }
  }
}

// Provider base class
class BaseProvider {
  async initialize() {}
  async chat(messages, options) {
    throw new Error('Not implemented');
  }
  async shutdown() {}
}

// OpenAI Provider
class OpenAIProvider extends BaseProvider {
  async chat(messages, options) {
    const { model, temperature, maxTokens } = options;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature,
          max_tokens: maxTokens
        })
      });

      const data = await response.json();
      
      return new LLMResponse(
        data.choices[0].message.content,
        {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        },
        { model, provider: 'openai' }
      );
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

// Anthropic Provider
class AnthropicProvider extends BaseProvider {
  async chat(messages, options) {
    const { model, temperature, maxTokens } = options;
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages: messages.filter(m => m.role !== 'system').map(m => ({
            role: m.role,
            content: m.content
          })),
          system: messages.find(m => m.role === 'system')?.content || '',
          temperature,
          max_tokens: maxTokens
        })
      });

      const data = await response.json();
      
      return new LLMResponse(
        data.content[0].text,
        {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens
        },
        { model, provider: 'anthropic' }
      );
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}

// Google Provider
class GoogleProvider extends BaseProvider {
  async chat(messages, options) {
    const { model, temperature, maxTokens } = options;
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens
            }
          })
        }
      );

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      
      return new LLMResponse(
        content,
        {
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0
        },
        { model, provider: 'google' }
      );
    } catch (error) {
      throw new Error(`Google API error: ${error.message}`);
    }
  }
}
