/**
 * Type definitions and interfaces for SpoonAI
 */

export const MessageRole = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
  TOOL: 'tool'
};

export const AgentType = {
  CHAT: 'chat',
  REACT: 'react',
  TOOL_CALLING: 'tool_calling',
  RAG: 'rag',
  GRAPH: 'graph',
  CUSTOM: 'custom'
};

export const LLMProvider = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
  CUSTOM: 'custom'
};

export const MemoryType = {
  SHORT_TERM: 'short_term',
  LONG_TERM: 'long_term',
  BUFFER: 'buffer',
  SUMMARY: 'summary',
  VECTOR: 'vector'
};

export const ToolType = {
  FUNCTION: 'function',
  API: 'api',
  MCP: 'mcp',
  NEOFS: 'neofs',
  CUSTOM: 'custom'
};

export const CallbackEvent = {
  LLM_START: 'llm:start',
  LLM_END: 'llm:end',
  LLM_ERROR: 'llm:error',
  LLM_STREAM: 'llm:stream',
  
  AGENT_START: 'agent:start',
  AGENT_END: 'agent:end',
  AGENT_ERROR: 'agent:error',
  
  TOOL_START: 'tool:start',
  TOOL_END: 'tool:end',
  TOOL_ERROR: 'tool:error',
  
  MEMORY_ADD: 'memory:add',
  MEMORY_RETRIEVE: 'memory:retrieve',
  
  SYSTEM_INIT: 'system:init',
  SYSTEM_SHUTDOWN: 'system:shutdown'
};

export class Message {
  constructor(role, content, metadata = {}) {
    this.role = role;
    this.content = content;
    this.metadata = {
      timestamp: Date.now(),
      ...metadata
    };
  }

  toJSON() {
    return {
      role: this.role,
      content: this.content,
      ...this.metadata
    };
  }
}

export class LLMResponse {
  constructor(content, usage = {}, metadata = {}) {
    this.content = content;
    this.usage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      ...usage
    };
    this.metadata = {
      timestamp: Date.now(),
      ...metadata
    };
  }
}

export class AgentResponse {
  constructor(message, steps = [], metadata = {}) {
    this.message = message;
    this.steps = steps;
    this.metadata = {
      timestamp: Date.now(),
      ...metadata
    };
  }
}
