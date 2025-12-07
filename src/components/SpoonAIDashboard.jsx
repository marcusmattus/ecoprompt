/**
 * SpoonAI Dashboard Component - Metrics and Monitoring
 */

import React, { useState, useEffect } from 'react';
import { useSpoonAI } from '../hooks/useSpoonAI';
import { Activity, Cpu, Database, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export function SpoonAIDashboard() {
  const { spoonAI, metrics: rawMetrics, updateMetrics, loading } = useSpoonAI();
  const [metrics, setMetrics] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    if (!spoonAI) return;

    const interval = setInterval(() => {
      updateMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [spoonAI, refreshInterval, updateMetrics]);

  useEffect(() => {
    if (rawMetrics) {
      setMetrics(rawMetrics);
    }
  }, [rawMetrics]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse text-[#00FF41]">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono font-bold text-[#00FF41]">
          SpoonAI Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <Activity className="text-[#00FF41] animate-pulse" size={20} />
          <span className="font-mono text-sm text-[#00FF41]/60">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LLM Metrics */}
        <MetricCard
          title="LLM Calls"
          value={metrics?.llm?.totalCalls || 0}
          icon={<Cpu size={24} />}
          color="text-[#00FF41]"
          bgColor="bg-[#00FF41]/10"
        />

        <MetricCard
          title="Total Tokens"
          value={metrics?.llm?.totalTokens || 0}
          icon={<Zap size={24} />}
          color="text-[#FF00FF]"
          bgColor="bg-[#FF00FF]/10"
        />

        <MetricCard
          title="Cache Hits"
          value={metrics?.llm?.cacheHits || 0}
          icon={<Database size={24} />}
          color="text-[#00FFFF]"
          bgColor="bg-[#00FFFF]/10"
        />

        <MetricCard
          title="Errors"
          value={metrics?.llm?.errors || 0}
          icon={<AlertCircle size={24} />}
          color="text-[#FF0080]"
          bgColor="bg-[#FF0080]/10"
        />
      </div>

      {/* Memory Stats */}
      {metrics?.memory && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#00FF41]/20 p-6">
          <h3 className="font-mono text-lg text-[#00FF41] mb-4 flex items-center gap-2">
            <Database size={20} />
            Memory Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatItem label="Total Messages" value={metrics.memory.totalMessages} />
            <StatItem label="Active Sessions" value={metrics.memory.activeSessions} />
            <StatItem
              label="Cache Size"
              value={`${(metrics.memory.cacheSize / 1024).toFixed(2)} KB`}
            />
          </div>
        </div>
      )}

      {/* Agent Stats */}
      {metrics?.agents && Object.keys(metrics.agents).length > 0 && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#00FF41]/20 p-6">
          <h3 className="font-mono text-lg text-[#00FF41] mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Agent Performance
          </h3>
          <div className="space-y-2">
            {Object.entries(metrics.agents).map(([name, agentMetrics]) => (
              <div
                key={name}
                className="flex justify-between items-center p-3 bg-[#0A0A0A] rounded"
              >
                <span className="font-mono text-[#00FF41]">{name}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#00FF41]/60">
                    Chats: {agentMetrics.totalChats || 0}
                  </span>
                  <span className="text-[#FF00FF]/60">
                    Tokens: {agentMetrics.totalTokens || 0}
                  </span>
                  <span className="text-[#FF0080]/60">
                    Errors: {agentMetrics.errors || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Stats */}
      {metrics?.tools && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#00FF41]/20 p-6">
          <h3 className="font-mono text-lg text-[#00FF41] mb-4 flex items-center gap-2">
            <Zap size={20} />
            Tool Usage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatItem label="Total Calls" value={metrics.tools.totalCalls} />
            <StatItem label="Errors" value={metrics.tools.errors} />
            <StatItem
              label="Success Rate"
              value={
                metrics.tools.totalCalls > 0
                  ? `${(
                      ((metrics.tools.totalCalls - metrics.tools.errors) /
                        metrics.tools.totalCalls) *
                      100
                    ).toFixed(1)}%`
                  : '0%'
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-lg border border-[#00FF41]/20 p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-sm text-[#00FF41]/60">{title}</span>
        <div className={color}>{icon}</div>
      </div>
      <div className={`font-mono text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-xs text-[#00FF41]/60">{label}</span>
      <span className="font-mono text-lg text-[#00FF41]">{value}</span>
    </div>
  );
}
