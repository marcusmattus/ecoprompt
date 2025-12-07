# 🚀 SpoonAI Quick Reference

## 📦 What's Installed

**16 files** implementing the complete SpoonAI framework from https://github.com/XSpoonAi/spoon-core

## 🎯 Quick Start (3 Steps)

### 1. Add API Keys to `.env`
```bash
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=...
```

### 2. Use Chat Component
```jsx
import { SpoonAIChat } from './components/SpoonAIChat';

function App() {
  return <SpoonAIChat sessionId="demo" />;
}
```

### 3. Start Dev Server
```bash
npm run dev
```

## 📚 Core APIs

### SpoonAI Core
```javascript
import { SpoonAICore } from './spoonai';

const spoon = new SpoonAICore();
await spoon.initialize();

// Chat
const response = await spoon.chat('Hello!');

// Get metrics
const metrics = spoon.getMetrics();
```

### Agents
```javascript
import { AgentType } from './spoonai/types';

// Create agent
const agent = await spoon.agents.createAgent(AgentType.REACT);

// Use agent
const result = await agent.chat('Task here');
```

### Memory
```javascript
// Add message
await spoon.memory.addMessage('session-1', {
  role: 'user',
  content: 'Hello'
});

// Get history
const history = await spoon.memory.getHistory('session-1');
```

### Tools
```javascript
// Register tool
spoon.tools.registerTool('my_tool', {
  description: 'Does X',
  parameters: { input: { type: 'string' } },
  execute: async ({ input }) => result
});

// Execute tool
const result = await spoon.tools.execute('my_tool', { input: 'data' });
```

### Events
```javascript
// Listen to events
spoon.callbacks.on('llm:end', (data) => {
  console.log('Tokens:', data.response.usage.totalTokens);
});
```

## 🎨 Components

### Chat Interface
```jsx
<SpoonAIChat 
  sessionId="user-123"
  config={{ enableMetrics: true }}
/>
```

### Dashboard
```jsx
<SpoonAIDashboard />
```

## 🪝 Hooks

```jsx
import { useSpoonAI, useLLM, useMemory } from './hooks/useSpoonAI';

// Core hook
const { spoonAI, chat, metrics } = useSpoonAI();

// LLM hook
const { generate, response } = useLLM('openai', 'gpt-4');

// Memory hook
const { history, addMessage } = useMemory('session-1');
```

## 📊 Features

✅ 3 LLM Providers (OpenAI, Anthropic, Google)
✅ 5 Agent Types (Chat, ReAct, ToolCalling, RAG, Graph)
✅ Memory Management (Short/Long-term)
✅ Tool System (MCP, NeoFS)
✅ Event Callbacks & Metrics
✅ Graph Workflows
✅ React Components & Hooks
✅ Streaming Support
✅ Caching System

## 📁 File Locations

```
src/spoonai/         # Core framework
src/components/      # UI components
src/hooks/           # React hooks
SPOONAI_*.md         # Documentation
```

## 🔗 Documentation Files

- **`SPOONAI_IMPLEMENTATION_COMPLETE.md`** - Complete summary
- **`SPOONAI_FULL_GUIDE.md`** - Detailed guide with examples
- **`SPOONAI_COMPLETE.md`** - Quick overview

## ⚡ Common Tasks

### Add Custom LLM Provider
```javascript
class MyProvider {
  async chat(messages, options) { /* ... */ }
}
spoon.llm.registerProvider('my-provider', MyProvider);
```

### Create RAG Agent
```javascript
const rag = await spoon.agents.createAgent(AgentType.RAG, {
  retrieval: {
    retrieve: async (query, topK) => documents
  }
});
```

### Build Workflow
```javascript
import { GraphPatterns } from './spoonai/graph/engine';

const workflow = GraphPatterns.createSequentialGraph('process', [
  async (state) => step1(state),
  async (state) => step2(state),
  async (state) => step3(state)
]);
```

### Monitor Events
```javascript
spoon.callbacks.onAny((event, data) => {
  console.log(`[${event}]`, data);
});
```

## 🎯 Next Steps

1. ✅ Dependencies fixed (React 18 compatible)
2. ✅ All SpoonAI components installed
3. 📝 Add API keys to `.env`
4. 🧪 Test chat component
5. 🔧 Customize for your needs
6. 🚀 Deploy

---

**Need help?** Check the full guides in `SPOONAI_FULL_GUIDE.md` and `SPOONAI_IMPLEMENTATION_COMPLETE.md`
