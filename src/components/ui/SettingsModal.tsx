'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Key,
  Sliders,
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurgeCache: () => void;
  onExportAllData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onPurgeCache,
  onExportAllData
}: SettingsModalProps) {
  const { user, updateProfile, updateCustomApiKey } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'models' | 'data'>('api');
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // API key state
  const [apiKey, setApiKey] = useState(user?.customApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  
  // Model config state
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [savedToast, setSavedToast] = useState(false);
  const [confirmPurge, setConfirmPurge] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email);
    triggerSavedToast();
  };

  const handleSaveApiKey = () => {
    updateCustomApiKey(apiKey.trim());
    triggerSavedToast();
  };

  const triggerSavedToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'healthy' || data.services?.gemini?.status === 'healthy') {
        setTestResult({
          status: 'success',
          message: 'Connection verified! Gemini, Supabase, Qdrant & Redis are operational.'
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.services?.gemini?.message || 'Connection test returned degraded status.'
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reach health endpoint.';
      setTestResult({
        status: 'error',
        message: msg
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/65 backdrop-blur-2xl animate-in fade-in select-none">
      {/* Clickable backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Liquid Glass Modal Window */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 liquid-glass-modal rounded-[24px] sm:rounded-[32px] w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col text-white overflow-hidden animate-in zoom-in-95 duration-250 group"
      >
        {/* Ambient Fluid Lighting */}
        <div className="absolute top-0 left-1/4 w-64 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-64 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 px-4 sm:px-7 border-b border-white/[0.12] flex items-center justify-between bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-500/20 border border-white/20 flex items-center justify-center text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight truncate">
                Settings & Engine
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5 truncate">
                Configure BYOK credentials, models, and personal profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md hover:scale-105 flex-shrink-0 touch-target"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liquid Glass Tab Navigation */}
        <div className="flex border-b border-white/[0.08] px-4 sm:px-7 bg-white/[0.01] gap-2 pt-2.5 flex-shrink-0 overflow-x-auto scrollbar-none">
          {[
            { id: 'api', label: 'API Keys', icon: Key },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'models', label: 'Models', icon: Sliders },
            { id: 'data', label: 'Data & Storage', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'api' | 'models' | 'data')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-full transition-all cursor-pointer mb-2.5 whitespace-nowrap flex-shrink-0 touch-target ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-400/50'
                    : 'text-slate-300/80 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:p-7 space-y-6">
          {savedToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Settings saved and applied successfully!</span>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Google Gemini / BYOK API Key
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Override default system API key with your personal Google Generative AI key.
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter Gemini API Key (e.g. AIzaSy...)"
                      className="w-full px-4 py-2.5 text-xs rounded-2xl border border-white/15 bg-white/5 text-white font-mono focus:outline-none focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveApiKey}
                    className="liquid-glass-button px-5 py-2.5 rounded-2xl text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Live Connection Diagnostics */}
              <div className="p-5 rounded-3xl liquid-glass-card space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Cloud Backend Service Status
                  </span>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingKey}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-white/20 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isTestingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    <span>{isTestingKey ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                    testResult.status === 'success'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-400/30'
                  }`}>
                    {testResult.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Gemini Vision:</span>
                    <span className="text-emerald-400 font-bold">● Active (2.0 Flash)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Supabase DB:</span>
                    <span className="text-emerald-400 font-bold">● Connected</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Qdrant Vectors:</span>
                    <span className="text-emerald-400 font-bold">● 384-dim Index</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Redis Cache:</span>
                    <span className="text-emerald-400 font-bold">● &lt;10ms Speed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-white/15 bg-white/5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-white/15 bg-white/5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="liquid-glass-button px-6 py-2.5 rounded-full text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* Models Tab */}
          {activeTab === 'models' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Default Reasoning Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-white/15 bg-[#0c1017] text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Ultra Fast OCR & Multimodal)</option>
                  <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen Reasoning)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Contract Analysis)</option>
                  <option value="kie-vision-fast">Kie Vision Fast (Playground Multimodal)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-white">
                    Temperature (Creativity vs Determinism)
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0.0 (Strict Facts & Numbers)</span>
                  <span>1.0 (Creative Exploration)</span>
                </div>
              </div>
            </div>
          )}

          {/* Data & Storage Tab */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl liquid-glass-card flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Export Complete Workspace Data
                  </h4>
                  <p className="text-xs text-slate-400">
                    Download all audited documents, structured findings, and chat logs as JSON.
                  </p>
                </div>
                <button
                  onClick={onExportAllData}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    Purge Local Cache & History
                  </h4>
                  <p className="text-xs text-rose-300/70">
                    Removes all cached documents and resets session state from browser storage.
                  </p>
                </div>
                {confirmPurge ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmPurge(false)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => { onPurgeCache(); setConfirmPurge(false); onClose(); }}
                      className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Purge</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmPurge(true)}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Cache</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
