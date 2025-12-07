# SpoonAI Integration for EcoPrompt

## Full-Scale AI Framework Implementation

This document outlines the complete SpoonAI integration into EcoPrompt, providing a production-ready, scalable AI framework with all components from the SpoonAI core repository.

## 📁 Architecture Overview

```
src/spoonai/
├── index.js                 # Main exports
├── core.js                  # SpoonAI Core orchestration
├── types.js                 # Type definitions and interfaces
├── agents/
│   └── manager.js          # Agent system (Chat, ReAct, RAG, Graph)
├── llm/
│   └── manager.js          # LLM providers (OpenAI, Anthropic, Google)
├── memory/
│   └── manager.js          # Short/long-term memory management
├── tools/
│   └── manager.js          # Tool system (MCP, NeoFS, functions)
├── callbacks/
│   └── manager.js          # Event system and monitoring
├── graph/
│   └── engine.js           # Workflow orchestration
└── utils/                   # Utility functions

src/components/
├── SpoonAIChat.jsx         # Chat interface component
└── SpoonAIDashboard.jsx    # Metrics dashboard

src/hooks/
└── useSpoonAI.jsx          # React hooks for SpoonAI
```

## 🚀 Core Components

### 1. **SpoonAI Core** (`core.js`)
Central orchestration system managing all subsystems

### 2. **LLM Manager** (`llm/manager.js`)
Multi-provider LLM integration (OpenAI, Anthropic, Google)

### 3. **Agent Manager** (`agents/manager.js`)
5 agent types: Chat, ReAct, Tool Calling, RAG, Graph

### 4. **Memory Manager** (`memory/manager.js`)
Conversation and context management

### 5. **Tool Manager** (`tools/manager.js`)
Extensible tool system with MCP and NeoFS integration

### 6. **Callback Manager** (`callbacks/manager.js`)
Event-driven monitoring and metrics

### 7. **Graph Engine** (`graph/engine.js`)
Workflow orchestration with conditional logic

## 💡 Quick Start

```javascript
import { SpoonAICore } from './spoonai';

const spoonAI = new SpoonAICore();
await spoonAI.initialize();

const response = await spoonAI.chat('Hello!');
console.log(response.message);
```

## 📊 Complete Feature Set

✅ Multi-provider LLM support (OpenAI, Anthropic, Google)
✅ 5 agent architectures (Chat, ReAct, Tool, RAG, Graph)
✅ Short-term & long-term memory
✅ Tool system with MCP integration
✅ NeoFS decentralized storage
✅ Event callbacks & metrics
✅ Graph-based workflows
✅ React hooks & components
✅ Streaming responses
✅ Token tracking & caching
✅ Error handling & retries
✅ Neo wallet integration
✅ Soft brutalism UI components

## 🔐 Environment Setup

```bash
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=...
```

See `SPOONAI_INTEGRATION.md` for complete documentation.
