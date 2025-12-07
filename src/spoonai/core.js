/**
 * SpoonAI Core - Central orchestration system
 */

import { LLMManager } from './llm/manager';
import { AgentManager } from './agents/manager';
import { MemoryManager } from './memory/manager';
import { ToolManager } from './tools/manager';
import { CallbackManager } from './callbacks/manager';
import { GraphEngine } from './graph/engine';

export class SpoonAICore {
  constructor(config = {}) {
    this.config = {
      enableMetrics: true,
      enableCaching: true,
      enableCallbacks: true,
      ...config
    };

    // Initialize managers
    this.callbacks = new CallbackManager();
    this.llm = new LLMManager(this.callbacks);
    this.memory = new MemoryManager();
    this.tools = new ToolManager();
    this.agents = new AgentManager({
      llm: this.llm,
      memory: this.memory,
      tools: this.tools,
      callbacks: this.callbacks
    });
    this.graph = new GraphEngine();

    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    await this.callbacks.emit('system:init:start');
    
    try {
      await this.llm.initialize();
      await this.memory.initialize();
      await this.tools.initialize();
      await this.agents.initialize();
      await this.graph.initialize();
      
      this.initialized = true;
      await this.callbacks.emit('system:init:complete');
    } catch (error) {
      await this.callbacks.emit('system:init:error', error);
      throw error;
    }
  }

  async chat(message, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const agent = options.agent || await this.agents.getDefault();
    return agent.chat(message, options);
  }

  async stream(message, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const agent = options.agent || await this.agents.getDefault();
    return agent.stream(message, options);
  }

  getMetrics() {
    return {
      llm: this.llm.getMetrics(),
      memory: this.memory.getMetrics(),
      agents: this.agents.getMetrics(),
      tools: this.tools.getMetrics()
    };
  }

  async shutdown() {
    await this.callbacks.emit('system:shutdown:start');
    
    await this.agents.shutdown();
    await this.graph.shutdown();
    await this.memory.shutdown();
    await this.llm.shutdown();
    
    this.initialized = false;
    await this.callbacks.emit('system:shutdown:complete');
  }
}
