# SpoonAI Full Integration Guide

## 🎯 Overview

Complete integration of SpoonAI core components into EcoPrompt, providing enterprise-grade AI capabilities with:
- Multi-provider LLM management
- 5 agent architectures
- Memory & context management
- Tool system with MCP support
- NeoFS decentralized storage
- Workflow orchestration
- Real-time metrics & monitoring

## 📦 Installed Components

### Core System (`src/spoonai/`)
- ✅ `core.js` - Central orchestration
- ✅ `types.js` - Type definitions
- ✅ `index.js` - Main exports

### Agents (`src/spoonai/agents/`)
- ✅ Chat Agent - Conversational AI
- ✅ ReAct Agent - Reasoning + Acting
- ✅ Tool Calling Agent - Function calling
- ✅ RAG Agent - Retrieval augmented
- ✅ Graph Agent - Workflow execution

### LLM Providers (`src/spoonai/llm/`)
- ✅ OpenAI (GPT-4, GPT-3.5)
- ✅ Anthropic (Claude 3)
- ✅ Google (Gemini)
- ✅ Caching system
- ✅ Token tracking
- ✅ Streaming support

### Memory System (`src/spoonai/memory/`)
- ✅ Short-term memory
- ✅ Session management
- ✅ Vector store ready
- ✅ Auto-summarization

### Tool System (`src/spoonai/tools/`)
- ✅ Tool manager
- ✅ MCP integration
- ✅ NeoFS integration
- ✅ Built-in tools (calculator, search)
- ✅ Custom tool registration

### Monitoring (`src/spoonai/callbacks/`)
- ✅ Event system
- ✅ Metrics collection
- ✅ Logging callbacks
- ✅ Streaming callbacks

### Workflows (`src/spoonai/graph/`)
- ✅ Graph engine
- ✅ Node execution
- ✅ Conditional branching
- ✅ Sequential patterns
- ✅ Loop patterns

### React Components (`src/components/`)
- ✅ SpoonAIChat - Chat interface
- ✅ SpoonAIDashboard - Metrics dashboard

### React Hooks (`src/hooks/`)
- ✅ useSpoonAI - Core hook
- ✅ useLLM - LLM hook
- ✅ useMemory - Memory hook

## 🚀 Usage Examples

### 1. Basic Chat

```jsx
import { SpoonAIChat } from './components/SpoonAIChat';

function App() {
  return <SpoonAIChat sessionId="user-123" />;
}
```

### 2. Direct API Usage

```javascript
import { SpoonAICore } from './spoonai';

const spoon = new SpoonAICore();
await spoon.initialize();

const response = await spoon.chat('Hello!', {
  provider: 'openai',
  model: 'gpt-4'
});
```

### 3. Custom Agent

```javascript
import { AgentType } from './spoonai/types';

const agent = await spoon.agents.createAgent(AgentType.REACT, {
  maxIterations: 10
});

const result = await agent.chat('Complex task here');
```

### 4. Tool Registration

```javascript
spoon.tools.registerTool('custom_tool', {
  description: 'My custom tool',
  parameters: {
    input: { type: 'string' }
  },
  execute: async ({ input }) => {
    return processInput(input);
  }
});
```

### 5. Memory Management

```javascript
// Add message
await spoon.memory.addMessage('session-1', {
  role: 'user',
  content: 'Remember this'
});

// Get history
const history = await spoon.memory.getHistory('session-1');
```

### 6. Event Monitoring

```javascript
spoon.callbacks.on('llm:start', (data) => {
  console.log('LLM started:', data);
});

spoon.callbacks.on('llm:end', (data) => {
  console.log('Tokens used:', data.response.usage.totalTokens);
});
```

### 7. Workflow Graph

```javascript
import { GraphPatterns } from './spoonai/graph/engine';

const workflow = GraphPatterns.createSequentialGraph('process', [
  async (state) => ({ ...state, step1: 'done' }),
  async (state) => ({ ...state, step2: 'done' }),
  async (state) => ({ ...state, step3: 'done' })
]);

const result = await spoon.graph.execute('process', { input: 'data' });
```

## 🔌 Integration with EcoPrompt

### Neo Wallet + SpoonAI

```javascript
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { NeoFSTools } from './spoonai/tools/manager';

function SpoonAINeo() {
  const { address } = useWallet();
  const { spoonAI } = useSpoonAI();
  
  useEffect(() => {
    if (address && spoonAI) {
      const neoTools = new NeoFSTools(address);
      spoonAI.tools.registerTool('neofs_upload', {
        execute: (file) => neoTools.uploadFile(file)
      });
    }
  }, [address, spoonAI]);
}
```

### Plugin System Integration

```javascript
import { pluginManager } from './lib/pluginSystem';
import { SpoonAICore } from './spoonai';

pluginManager.register('spoonai', {
  name: 'SpoonAI',
  version: '1.0.0',
  initialize: async () => {
    const spoon = new SpoonAICore();
    await spoon.initialize();
    return spoon;
  }
});
```

## 📊 Metrics Dashboard

```jsx
import { SpoonAIDashboard } from './components/SpoonAIDashboard';

function MetricsPage() {
  return (
    <div className="p-6">
      <SpoonAIDashboard />
    </div>
  );
}
```

Displays:
- LLM call counts
- Token usage
- Cache hit rates
- Agent performance
- Tool execution stats
- Error rates

## 🔐 Environment Variables

Create `.env` file:

```bash
# Required for LLM providers
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=...

# Optional
VITE_OPENROUTER_API_KEY=...
VITE_DEEPSEEK_API_KEY=...
```

## 📁 File Structure

```
ecoprompt/
├── src/
│   ├── spoonai/              # SpoonAI core
│   │   ├── index.js
│   │   ├── core.js
│   │   ├── types.js
│   │   ├── agents/
│   │   │   └── manager.js
│   │   ├── llm/
│   │   │   └── manager.js
│   │   ├── memory/
│   │   │   └── manager.js
│   │   ├── tools/
│   │   │   └── manager.js
│   │   ├── callbacks/
│   │   │   └── manager.js
│   │   └── graph/
│   │       └── engine.js
│   ├── components/
│   │   ├── SpoonAIChat.jsx
│   │   └── SpoonAIDashboard.jsx
│   └── hooks/
│       └── useSpoonAI.jsx
├── SPOONAI_COMPLETE.md       # This file
└── package.json
```

## 🎨 UI Components

### SpoonAIChat Features:
- Real-time messaging
- Message history
- Token display
- Session management
- Soft brutalism design
- Responsive layout

### SpoonAIDashboard Features:
- Live metrics
- Token tracking
- Agent stats
- Tool usage
- Error monitoring
- Cache analytics

## 🔄 Advanced Patterns

### Multi-Agent Coordination

```javascript
const supervisor = await spoonAI.agents.createAgent(AgentType.GRAPH);
const analyst = await spoonAI.agents.createAgent(AgentType.TOOL_CALLING);
const writer = await spoonAI.agents.createAgent(AgentType.CHAT);

// Supervisor coordinates other agents
```

### RAG Implementation

```javascript
const ragAgent = await spoonAI.agents.createAgent(AgentType.RAG, {
  retrieval: {
    retrieve: async (query, topK) => {
      // Your vector search
      return documents;
    }
  }
});
```

### Streaming Chat

```javascript
const stream = await spoonAI.stream('Tell me a story', {
  onChunk: (chunk) => {
    console.log(chunk.content);
  }
});
```

## 🛠️ Customization

### Add Custom LLM Provider

```javascript
class CustomProvider {
  async chat(messages, options) {
    // Your implementation
  }
}

spoonAI.llm.registerProvider('custom', CustomProvider);
```

### Add Custom Agent Type

```javascript
class CustomAgent {
  async chat(message, options) {
    // Your agent logic
  }
}

spoonAI.agents.registerAgent('my-agent', new CustomAgent());
```

### Add Custom Tool

```javascript
spoonAI.tools.registerTool('my-tool', {
  type: 'function',
  description: 'Does something',
  parameters: {
    input: { type: 'string' }
  },
  execute: async ({ input }) => {
    return result;
  }
});
```

## 📈 Performance Tips

1. **Enable Caching**: Reduce redundant LLM calls
2. **Use Streaming**: Better UX for long responses
3. **Session Cleanup**: Clear old sessions regularly
4. **Token Optimization**: Monitor and optimize prompts
5. **Tool Batching**: Batch tool calls when possible

## 🐛 Debugging

### Enable Logging

```javascript
import { LoggingCallback } from './spoonai/callbacks/manager';

const logger = new LoggingCallback('debug');
spoonAI.callbacks.onAny((event, data) => logger.handleAny(event, data));
```

### Check Metrics

```javascript
const metrics = spoonAI.getMetrics();
console.log('Total tokens:', metrics.llm.totalTokens);
console.log('Cache hits:', metrics.llm.cacheHits);
console.log('Error rate:', metrics.llm.errors / metrics.llm.totalCalls);
```

## 🔒 Security

- API keys in environment variables only
- No hardcoded credentials
- Session isolation
- Input validation
- Error sanitization

## 🚀 Deployment

```bash
# Build for production
npm run build

# Environment variables on Vercel
# Add all VITE_*_API_KEY variables
```

## 📚 Additional Resources

- SpoonAI Core: https://github.com/XSpoonAi/spoon-core
- OpenAI API: https://platform.openai.com/docs
- Anthropic API: https://docs.anthropic.com
- Google AI: https://ai.google.dev

## ✅ Checklist

- [x] Core system installed
- [x] All 5 agent types
- [x] 3 LLM providers
- [x] Memory management
- [x] Tool system
- [x] MCP integration
- [x] NeoFS integration
- [x] Event callbacks
- [x] Graph workflows
- [x] React components
- [x] React hooks
- [x] UI dashboard
- [x] Documentation

## 🎯 Next Steps

1. Add API keys to `.env`
2. Test chat component
3. Create custom agents
4. Add domain-specific tools
5. Monitor metrics
6. Optimize performance
7. Deploy to production

---

**Full SpoonAI integration complete! 🎉**
All components from https://github.com/XSpoonAi/spoon-core are now available in EcoPrompt.
