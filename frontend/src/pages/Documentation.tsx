import React, { useState } from 'react';
import { BookOpen, Terminal, Code, Cpu, Shield, Server, ArrowRight } from 'lucide-react';

export const Documentation: React.FC = () => {
  const [activeDoc, setActiveTab] = useState('getting-started');

  const docsMap: { [key: string]: { title: string; content: string } } = {
    'getting-started': {
      title: '1. Getting Started with CADELIBORA',
      content: `Welcome to the official CADELIBORA ecosystem documentation.

CADELIBORA provides REST APIs, TypeScript SDKs, and Neural AI hooks.
Base API URL: configured by the deployment environment

Authentication Header:
Authorization: Bearer <JWT_TOKEN>`,
    },
    'architecture': {
      title: '2. System & Monorepo Architecture',
      content: `CADELIBORA Monorepo Structure:

CADELIBORA/
├── frontend/   # Vite + React + TypeScript + Tailwind CSS + Framer Motion
└── backend/    # Node.js + TypeScript + Express + Prisma ORM + PostgreSQL

The frontend communicates with backend via REST endpoints with Zod validation.`,
    },
    'api-reference': {
      title: '3. Core REST API Endpoints',
      content: `Core API Specification:

GET /api/courses - List all academy courses
GET /api/research/projects - List research initiatives
POST /api/ai/chat - Process prompt with ANR-X AI model
GET /api/community/posts - Community discussions
POST /api/auth/login - Authenticate user`,
    },
    'security': {
      title: '4. Zero-Trust Security & RBAC',
      content: `Role-Based Access Control (RBAC):
- SUPER_ADMIN, ADMIN: Master console access & CMS management
- RESEARCHER: Publish research papers & projects
- INSTRUCTOR: Course authoring & student assessments
- STUDENT: Enrolls in courses & earns certificates`,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Developer Documentation</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">System Architecture & API Docs</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Complete reference manuals, architecture guides, and API documentation for CADELIBORA engineers and fellows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2 font-mono text-xs">
          {[
            { id: 'getting-started', label: '1. Getting Started' },
            { id: 'architecture', label: '2. System Architecture' },
            { id: 'api-reference', label: '3. API Reference' },
            { id: 'security', label: '4. Security & RBAC' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveTab(d.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                activeDoc === d.id ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-3 p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-2xl font-bold text-white">{docsMap[activeDoc]?.title}</h3>
          <pre className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
            {docsMap[activeDoc]?.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
