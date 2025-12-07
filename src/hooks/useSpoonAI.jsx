/**
 * React Hook for SpoonAI Integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SpoonAICore } from '../spoonai';

export function useSpoonAI(config = {}) {
  const [spoonAI, setSpoonAI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const initSpoonAI = async () => {
      try {
        setLoading(true);
        const instance = new SpoonAICore(config);
        await instance.initialize();
        instanceRef.current = instance;
        setSpoonAI(instance);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Failed to initialize SpoonAI:', err);
      } finally {
        setLoading(false);
      }
    };

    initSpoonAI();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.shutdown();
      }
    };
  }, []);

  const chat = useCallback(async (message, options = {}) => {
    if (!spoonAI) throw new Error('SpoonAI not initialized');
    return await spoonAI.chat(message, options);
  }, [spoonAI]);

  const stream = useCallback(async (message, options = {}) => {
    if (!spoonAI) throw new Error('SpoonAI not initialized');
    return await spoonAI.stream(message, options);
  }, [spoonAI]);

  const updateMetrics = useCallback(() => {
    if (spoonAI) {
      setMetrics(spoonAI.getMetrics());
    }
  }, [spoonAI]);

  return {
    spoonAI,
    loading,
    error,
    metrics,
    chat,
    stream,
    updateMetrics
  };
}

export function useLLM(provider = 'openai', model = 'gpt-4') {
  const { spoonAI, loading } = useSpoonAI();
  const [response, setResponse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (prompt, options = {}) => {
    if (!spoonAI) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await spoonAI.llm.chat([
        { role: 'user', content: prompt }
      ], {
        provider,
        model,
        ...options
      });
      
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [spoonAI, provider, model]);

  return {
    generate,
    response,
    isGenerating,
    loading,
    error
  };
}

export function useMemory(sessionId = 'default') {
  const { spoonAI, loading } = useSpoonAI();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const addMessage = useCallback(async (role, content) => {
    if (!spoonAI) return;

    try {
      await spoonAI.memory.addMessage(sessionId, { role, content });
      const updated = await spoonAI.memory.getHistory(sessionId);
      setHistory(updated);
    } catch (err) {
      setError(err);
    }
  }, [spoonAI, sessionId]);

  const getHistory = useCallback(async (options = {}) => {
    if (!spoonAI) return [];

    try {
      const messages = await spoonAI.memory.getHistory(sessionId, options);
      setHistory(messages);
      return messages;
    } catch (err) {
      setError(err);
      return [];
    }
  }, [spoonAI, sessionId]);

  const clearHistory = useCallback(async () => {
    if (!spoonAI) return;

    try {
      await spoonAI.memory.clearSession(sessionId);
      setHistory([]);
    } catch (err) {
      setError(err);
    }
  }, [spoonAI, sessionId]);

  useEffect(() => {
    if (spoonAI) {
      getHistory();
    }
  }, [spoonAI, getHistory]);

  return {
    history,
    addMessage,
    getHistory,
    clearHistory,
    loading,
    error
  };
}
