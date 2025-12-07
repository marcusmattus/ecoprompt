/**
 * Agent Manager - Handles different agent types (Chat, ReAct, RAG, Graph)
 */

import { AgentType, CallbackEvent } from '../types';

export class AgentManager {
  constructor({ llm, memory, tools, callbacks }) {
    this.llm = llm;
    this.memory = memory;
    this.tools = tools;
    this.callbacks = callbacks;
    this.agents = new Map();
    this.defaultAgent = null;
  }

  async initialize() {
    // Create default chat agent
    const chatAgent = new ChatAgent({
      llm: this.llm,
      memory: this.memory,
      callbacks: this.callbacks
    });
    
    await this.registerAgent('default', chatAgent);
    this.defaultAgent = 'default';
  }

  async registerAgent(name, agent) {
    await agent.initialize();
    this.agents.set(name, agent);
  }

  async createAgent(type, config = {}) {
    let agent;
    
    switch (type) {
      case AgentType.CHAT:
        agent = new ChatAgent({
          llm: this.llm,
          memory: this.memory,
          callbacks: this.callbacks,
          ...config
        });
        break;
        
      case AgentType.REACT:
        agent = new ReActAgent({
          llm: this.llm,
          memory: this.memory,
          tools: this.tools,
          callbacks: this.callbacks,
          ...config
        });
        break;
        
      case AgentType.TOOL_CALLING:
        agent = new ToolCallingAgent({
          llm: this.llm,
          memory: this.memory,
          tools: this.tools,
          callbacks: this.callbacks,
          ...config
        });
        break;
        
      case AgentType.RAG:
        agent = new RAGAgent({
          llm: this.llm,
          memory: this.memory,
          retrieval: config.retrieval,
          callbacks: this.callbacks,
          ...config
        });
        break;
        
      case AgentType.GRAPH:
        agent = new GraphAgent({
          llm: this.llm,
          memory: this.memory,
          tools: this.tools,
          graph: config.graph,
          callbacks: this.callbacks,
          ...config
        });
        break;
        
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
    
    return agent;
  }

  async getDefault() {
    return this.agents.get(this.defaultAgent);
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  getMetrics() {
    const metrics = {};
    for (const [name, agent] of this.agents.entries()) {
      metrics[name] = agent.getMetrics();
    }
    return metrics;
  }

  async shutdown() {
    for (const agent of this.agents.values()) {
      await agent.shutdown();
    }
  }
}

// Base Agent Class
class BaseAgent {
  constructor({ llm, memory, callbacks, config = {} }) {
    this.llm = llm;
    this.memory = memory;
    this.callbacks = callbacks;
    this.config = config;
    this.metrics = {
      totalChats: 0,
      totalTokens: 0,
      errors: 0
    };
  }

  async initialize() {}

  async chat(message, options = {}) {
    throw new Error('Not implemented');
  }

  async stream(message, options = {}) {
    throw new Error('Not implemented');
  }

  getMetrics() {
    return { ...this.metrics };
  }

  async shutdown() {}
}

// Chat Agent - Simple conversational agent
class ChatAgent extends BaseAgent {
  async chat(message, options = {}) {
    await this.callbacks.emit(CallbackEvent.AGENT_START, {
      agent: 'chat',
      message
    });

    try {
      // Get conversation history
      const history = await this.memory.getHistory(options.sessionId);
      
      // Add user message
      await this.memory.addMessage(options.sessionId, {
        role: 'user',
        content: message
      });

      // Build messages for LLM
      const messages = [
        { role: 'system', content: options.systemPrompt || 'You are a helpful AI assistant.' },
        ...history,
        { role: 'user', content: message }
      ];

      // Get LLM response
      const response = await this.llm.chat(messages, options);

      // Store assistant response
      await this.memory.addMessage(options.sessionId, {
        role: 'assistant',
        content: response.content
      });

      this.metrics.totalChats++;
      this.metrics.totalTokens += response.usage.totalTokens;

      await this.callbacks.emit(CallbackEvent.AGENT_END, {
        agent: 'chat',
        response: response.content
      });

      return {
        message: response.content,
        usage: response.usage,
        metadata: response.metadata
      };
    } catch (error) {
      this.metrics.errors++;
      await this.callbacks.emit(CallbackEvent.AGENT_ERROR, {
        agent: 'chat',
        error
      });
      throw error;
    }
  }

  async stream(message, options = {}) {
    // Similar to chat but with streaming
    const history = await this.memory.getHistory(options.sessionId);
    
    const messages = [
      { role: 'system', content: options.systemPrompt || 'You are a helpful AI assistant.' },
      ...history,
      { role: 'user', content: message }
    ];

    return this.llm.stream(messages, options);
  }
}

// ReAct Agent - Reasoning and Acting agent
class ReActAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.tools = config.tools;
    this.maxIterations = config.maxIterations || 10;
  }

  async chat(message, options = {}) {
    await this.callbacks.emit(CallbackEvent.AGENT_START, {
      agent: 'react',
      message
    });

    const steps = [];
    let iteration = 0;
    let finalAnswer = null;

    try {
      while (iteration < this.maxIterations && !finalAnswer) {
        // Get available tools
        const toolDescriptions = await this.tools.getDescriptions();
        
        // Build ReAct prompt
        const prompt = this.buildReActPrompt(message, steps, toolDescriptions);
        
        // Get LLM response
        const response = await this.llm.chat([
          { role: 'system', content: 'You are a ReAct agent. Use the tools available to answer questions.' },
          { role: 'user', content: prompt }
        ], options);

        // Parse response
        const parsed = this.parseReActResponse(response.content);
        
        if (parsed.action) {
          // Execute tool
          const toolResult = await this.tools.execute(parsed.action, parsed.actionInput);
          steps.push({
            thought: parsed.thought,
            action: parsed.action,
            actionInput: parsed.actionInput,
            observation: toolResult
          });
        } else if (parsed.finalAnswer) {
          finalAnswer = parsed.finalAnswer;
        }

        iteration++;
      }

      this.metrics.totalChats++;

      await this.callbacks.emit(CallbackEvent.AGENT_END, {
        agent: 'react',
        response: finalAnswer,
        steps
      });

      return {
        message: finalAnswer,
        steps,
        iterations: iteration
      };
    } catch (error) {
      this.metrics.errors++;
      await this.callbacks.emit(CallbackEvent.AGENT_ERROR, {
        agent: 'react',
        error
      });
      throw error;
    }
  }

  buildReActPrompt(question, steps, toolDescriptions) {
    let prompt = `Question: ${question}\n\n`;
    prompt += `Available tools:\n${toolDescriptions}\n\n`;
    prompt += `Use the following format:\n`;
    prompt += `Thought: [your reasoning]\n`;
    prompt += `Action: [tool name]\n`;
    prompt += `Action Input: [input for tool]\n`;
    prompt += `Observation: [result from tool]\n`;
    prompt += `... (repeat as needed)\n`;
    prompt += `Final Answer: [your final answer]\n\n`;

    for (const step of steps) {
      prompt += `Thought: ${step.thought}\n`;
      prompt += `Action: ${step.action}\n`;
      prompt += `Action Input: ${step.actionInput}\n`;
      prompt += `Observation: ${step.observation}\n`;
    }

    return prompt;
  }

  parseReActResponse(response) {
    const lines = response.split('\n');
    const parsed = {
      thought: '',
      action: '',
      actionInput: '',
      finalAnswer: ''
    };

    for (const line of lines) {
      if (line.startsWith('Thought:')) {
        parsed.thought = line.replace('Thought:', '').trim();
      } else if (line.startsWith('Action:')) {
        parsed.action = line.replace('Action:', '').trim();
      } else if (line.startsWith('Action Input:')) {
        parsed.actionInput = line.replace('Action Input:', '').trim();
      } else if (line.startsWith('Final Answer:')) {
        parsed.finalAnswer = line.replace('Final Answer:', '').trim();
      }
    }

    return parsed;
  }
}

// Tool Calling Agent
class ToolCallingAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.tools = config.tools;
  }

  async chat(message, options = {}) {
    // Implementation for function calling / tool use
    const tools = await this.tools.getAll();
    
    const response = await this.llm.chat([
      { role: 'system', content: 'You are a helpful assistant with access to tools.' },
      { role: 'user', content: message }
    ], {
      ...options,
      tools,
      tool_choice: 'auto'
    });

    return response;
  }
}

// RAG Agent
class RAGAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.retrieval = config.retrieval;
  }

  async chat(message, options = {}) {
    // Retrieve relevant context
    const context = await this.retrieval.retrieve(message, options.topK || 5);
    
    // Build augmented prompt
    const augmentedPrompt = `Context:\n${context.join('\n\n')}\n\nQuestion: ${message}`;
    
    const response = await this.llm.chat([
      { role: 'system', content: 'You are a helpful assistant. Use the provided context to answer questions.' },
      { role: 'user', content: augmentedPrompt }
    ], options);

    return response;
  }
}

// Graph Agent
class GraphAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.graph = config.graph;
  }

  async chat(message, options = {}) {
    // Execute graph workflow
    const result = await this.graph.execute(message, options);
    return result;
  }
}
