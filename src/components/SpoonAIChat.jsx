/**
 * SpoonAI Chat Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSpoonAI, useMemory } from '../hooks/useSpoonAI';
import { MessageSquare, Send, Loader, Sparkles, Trash2 } from 'lucide-react';

export function SpoonAIChat({ sessionId = 'default', config = {} }) {
  const { chat, loading: spoonLoading, metrics, updateMetrics } = useSpoonAI(config);
  const { history, addMessage, clearHistory } = useMemory(sessionId);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);

    try {
      await addMessage('user', userMessage);
      const response = await chat(userMessage, { sessionId });
      await addMessage('assistant', response.message);
      updateMetrics();
    } catch (error) {
      console.error('Chat error:', error);
      await addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (spoonLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin" size={32} />
        <span className="ml-3">Initializing SpoonAI...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] rounded-lg border border-[#00FF41]/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00FF41]/20">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#00FF41]" size={20} />
          <h3 className="font-mono text-[#00FF41]">SpoonAI Chat</h3>
        </div>
        <button
          onClick={clearHistory}
          className="p-2 hover:bg-[#00FF41]/10 rounded transition-colors"
          title="Clear chat"
        >
          <Trash2 size={18} className="text-[#00FF41]/60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#00FF41]/40">
            <MessageSquare size={48} className="mb-4" />
            <p className="font-mono">Start a conversation with SpoonAI</p>
          </div>
        ) : (
          history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#00FF41]/10 text-[#00FF41]'
                    : 'bg-[#FF00FF]/10 text-[#FF00FF]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-[#FF00FF]/10 text-[#FF00FF] p-3 rounded-lg">
              <Loader className="animate-spin" size={16} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#00FF41]/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 bg-[#0A0A0A] border border-[#00FF41]/20 rounded px-4 py-2 
                     text-[#00FF41] placeholder-[#00FF41]/40 font-mono
                     focus:outline-none focus:border-[#00FF41]
                     disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-4 py-2 bg-[#00FF41] text-black rounded font-mono font-bold
                     hover:bg-[#00FF41]/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* Metrics */}
      {metrics && (
        <div className="px-4 pb-2 text-xs font-mono text-[#00FF41]/60 flex gap-4">
          <span>Tokens: {metrics.llm?.totalTokens || 0}</span>
          <span>Calls: {metrics.llm?.totalCalls || 0}</span>
          <span>Cache Hits: {metrics.llm?.cacheHits || 0}</span>
        </div>
      )}
    </div>
  );
}
