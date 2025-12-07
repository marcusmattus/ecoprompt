/**
 * Tool Manager - Manages tools, MCP integration, and function calling
 */

import { ToolType, CallbackEvent } from '../types';

export class ToolManager {
  constructor() {
    this.tools = new Map();
    this.mcpTools = new Map();
    this.metrics = {
      totalCalls: 0,
      errors: 0
    };
  }

  async initialize() {
    // Register built-in tools
    await this.registerBuiltInTools();
  }

  async registerBuiltInTools() {
    // Calculator tool
    this.registerTool('calculator', {
      type: ToolType.FUNCTION,
      description: 'Perform mathematical calculations',
      parameters: {
        expression: { type: 'string', description: 'Mathematical expression to evaluate' }
      },
      execute: async ({ expression }) => {
        try {
          // Safe math evaluation using Function constructor
          // Only allows basic math operations
          const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
          if (sanitized !== expression) {
            return 'Error: Invalid characters in expression';
          }
          // eslint-disable-next-line no-new-func
          const result = new Function(`return ${sanitized}`)();
          return result;
        } catch (error) {
          return `Error: ${error.message}`;
        }
      }
    });

    // Web search tool (placeholder)
    this.registerTool('web_search', {
      type: ToolType.API,
      description: 'Search the web for information',
      parameters: {
        query: { type: 'string', description: 'Search query' }
      },
      execute: async ({ query }) => {
        return `Search results for: ${query}`;
      }
    });
  }

  registerTool(name, tool) {
    this.tools.set(name, {
      name,
      ...tool,
      metrics: {
        calls: 0,
        errors: 0,
        totalTime: 0
      }
    });
  }

  async execute(toolName, input) {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    await this.callbacks?.emit(CallbackEvent.TOOL_START, {
      tool: toolName,
      input
    });

    const startTime = Date.now();
    
    try {
      const result = await tool.execute(input);
      
      const duration = Date.now() - startTime;
      tool.metrics.calls++;
      tool.metrics.totalTime += duration;
      this.metrics.totalCalls++;

      await this.callbacks?.emit(CallbackEvent.TOOL_END, {
        tool: toolName,
        result,
        duration
      });

      return result;
    } catch (error) {
      tool.metrics.errors++;
      this.metrics.errors++;

      await this.callbacks?.emit(CallbackEvent.TOOL_ERROR, {
        tool: toolName,
        error
      });

      throw error;
    }
  }

  async getDescriptions() {
    const descriptions = [];
    
    for (const [name, tool] of this.tools.entries()) {
      descriptions.push(`${name}: ${tool.description}`);
    }

    return descriptions.join('\n');
  }

  async getAll() {
    const tools = [];
    
    for (const [name, tool] of this.tools.entries()) {
      tools.push({
        type: 'function',
        function: {
          name,
          description: tool.description,
          parameters: {
            type: 'object',
            properties: tool.parameters,
            required: Object.keys(tool.parameters)
          }
        }
      });
    }

    return tools;
  }

  getTool(name) {
    return this.tools.get(name);
  }

  getMetrics() {
    const toolMetrics = {};
    for (const [name, tool] of this.tools.entries()) {
      toolMetrics[name] = { ...tool.metrics };
    }
    return {
      ...this.metrics,
      tools: toolMetrics
    };
  }

  async shutdown() {
    this.tools.clear();
    this.mcpTools.clear();
  }
}

// MCP Tool Integration
export class MCPToolManager {
  constructor() {
    this.servers = new Map();
  }

  async connectServer(name, config) {
    // Connect to MCP server
    const server = new MCPServer(config);
    await server.connect();
    this.servers.set(name, server);
    return server.getTools();
  }

  async disconnectServer(name) {
    const server = this.servers.get(name);
    if (server) {
      await server.disconnect();
      this.servers.delete(name);
    }
  }
}

class MCPServer {
  constructor(config) {
    this.config = config;
    this.connected = false;
  }

  async connect() {
    // Implement MCP connection
    this.connected = true;
  }

  async disconnect() {
    this.connected = false;
  }

  async getTools() {
    // Fetch available tools from MCP server
    return [];
  }

  async callTool(name, args) {
    // Execute MCP tool
    return null;
  }
}

// NeoFS Tool Integration
export class NeoFSTools {
  constructor(walletAddress) {
    this.walletAddress = walletAddress;
  }

  async uploadFile(file, metadata = {}) {
    // Upload to NeoFS
    return {
      objectId: 'neo-object-id',
      containerId: 'neo-container-id',
      size: file.size,
      timestamp: Date.now()
    };
  }

  async downloadFile(objectId) {
    // Download from NeoFS
    return null;
  }

  async listObjects(containerId) {
    // List objects in container
    return [];
  }
}
