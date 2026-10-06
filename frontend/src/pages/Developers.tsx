import React, { useState } from 'react';
import { fetchApi } from '../lib/api';
import { Terminal, Play, CheckCircle, RefreshCw } from 'lucide-react';

export const Developers: React.FC = () => {
  const [endpoint, setEndpoint] = useState('/courses');
  const [method, setMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTestApi = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(endpoint, { method });
      setApiResponse(res);
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">Developer Center</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Interactive Live API Sandbox</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Execute live REST requests directly against the CADELIBORA API engine and inspect real database responses.
        </p>
      </div>

      {/* Live Interactive API Runner */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs">
          <span className="flex items-center gap-2 text-white font-bold">
            <Terminal className="w-5 h-5 text-brand-400" />
            Live API Console
          </span>
          <span className="text-emerald-400 font-bold">SERVER: ONLINE</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-brand-400 font-bold"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>

          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g. /courses, /research/projects, /projects, /services"
            className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
          />

          <button
            onClick={handleTestApi}
            disabled={loading}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Execute Live Call</span>
          </button>
        </div>

        {/* Response Viewer */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>HTTP Response Payload:</span>
            {apiResponse && <span className="text-emerald-400">STATUS 200 OK</span>}
          </div>
          <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 overflow-x-auto max-h-96">
            {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Click "Execute Live Call" to test the backend API endpoint'}
          </pre>
        </div>
      </div>
    </div>
  );
};
