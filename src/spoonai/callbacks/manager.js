/**
 * Callback Manager - Event system for monitoring and hooks
 */

import { CallbackEvent } from '../types';

export class CallbackManager {
  constructor() {
    this.listeners = new Map();
    this.globalListeners = [];
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  onAny(callback) {
    this.globalListeners.push(callback);
    
    return () => {
      const index = this.globalListeners.indexOf(callback);
      if (index > -1) {
        this.globalListeners.splice(index, 1);
      }
    };
  }

  async emit(event, data) {
    // Call specific event listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      for (const callback of callbacks) {
        try {
          await callback(data);
        } catch (error) {
          console.error(`Error in callback for ${event}:`, error);
        }
      }
    }

    // Call global listeners
    for (const callback of this.globalListeners) {
      try {
        await callback(event, data);
      } catch (error) {
        console.error(`Error in global callback:`, error);
      }
    }
  }

  clear() {
    this.listeners.clear();
    this.globalListeners = [];
  }
}

// Built-in callbacks
export class StreamingCallback {
  constructor(onChunk) {
    this.onChunk = onChunk;
  }

  async handleLLMStream(data) {
    if (this.onChunk) {
      await this.onChunk(data);
    }
  }
}

export class MetricsCallback {
  constructor() {
    this.metrics = {
      llmCalls: 0,
      toolCalls: 0,
      totalTokens: 0,
      totalTime: 0
    };
  }

  async handleLLMEnd(data) {
    this.metrics.llmCalls++;
    this.metrics.totalTokens += data.response?.usage?.totalTokens || 0;
  }

  async handleToolEnd(data) {
    this.metrics.toolCalls++;
    this.metrics.totalTime += data.duration || 0;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      llmCalls: 0,
      toolCalls: 0,
      totalTokens: 0,
      totalTime: 0
    };
  }
}

export class LoggingCallback {
  constructor(level = 'info') {
    this.level = level;
  }

  async handleAny(event, data) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${event}:`, data);
  }
}
