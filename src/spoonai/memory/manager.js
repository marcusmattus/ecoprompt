/**
 * Memory Manager - Short-term and long-term memory management
 */

import { MemoryType, CallbackEvent } from '../types';

export class MemoryManager {
  constructor() {
    this.sessions = new Map();
    this.longTerm = new Map();
    this.metrics = {
      totalMessages: 0,
      totalSessions: 0,
      cacheSize: 0
    };
  }

  async initialize() {
    // Initialize storage backends
    this.shortTerm = new ShortTermMemory();
    this.vectorStore = null; // Can be initialized with vector DB
  }

  async addMessage(sessionId, message) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
      this.metrics.totalSessions++;
    }

    const session = this.sessions.get(sessionId);
    session.push({
      ...message,
      timestamp: Date.now()
    });

    this.metrics.totalMessages++;
    this.metrics.cacheSize = this.calculateCacheSize();

    return message;
  }

  async getHistory(sessionId, options = {}) {
    const {
      limit = 50,
      includeSystem = false
    } = options;

    if (!this.sessions.has(sessionId)) {
      return [];
    }

    let messages = this.sessions.get(sessionId);

    if (!includeSystem) {
      messages = messages.filter(m => m.role !== 'system');
    }

    return messages.slice(-limit);
  }

  async summarize(sessionId, options = {}) {
    const history = await this.getHistory(sessionId, { limit: options.limit || 100 });
    
    if (history.length === 0) {
      return null;
    }

    // Create summary (would use LLM in production)
    return {
      sessionId,
      messageCount: history.length,
      summary: 'Conversation summary',
      timestamp: Date.now()
    };
  }

  async clearSession(sessionId) {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      this.metrics.totalSessions--;
      this.metrics.cacheSize = this.calculateCacheSize();
    }
  }

  async clearAll() {
    this.sessions.clear();
    this.metrics.totalSessions = 0;
    this.metrics.totalMessages = 0;
    this.metrics.cacheSize = 0;
  }

  calculateCacheSize() {
    let size = 0;
    for (const session of this.sessions.values()) {
      size += JSON.stringify(session).length;
    }
    return size;
  }

  getMetrics() {
    return {
      ...this.metrics,
      activeSessions: this.sessions.size
    };
  }

  async shutdown() {
    // Persist important sessions before shutdown
    this.sessions.clear();
  }
}

class ShortTermMemory {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.buffer = [];
  }

  add(message) {
    this.buffer.push(message);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  get(limit = 10) {
    return this.buffer.slice(-limit);
  }

  clear() {
    this.buffer = [];
  }
}

// Vector Memory for semantic search (placeholder)
class VectorMemory {
  constructor() {
    this.vectors = [];
  }

  async add(text, embedding) {
    this.vectors.push({ text, embedding });
  }

  async search(query, topK = 5) {
    // Implement semantic search
    return [];
  }
}
