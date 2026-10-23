import React, { useState } from 'react';
import { backend } from '@/api/client';
import { Sparkles, Loader2, Bot, Wand2 } from 'lucide-react';
import { sanitizeCode } from '@/lib/buildsheet/sanitizeCode';

const EXAMPLES = [
  'I want to build a Bluetooth controlled car',
  'I want to build a Smart Dustbin',
  'I want to build an Automatic Plant Watering System',
  'I want to build a Line Follower Robot',
  'I want to build a Home Automation System',
];

export default function AIProjectGenerator({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('');
  // A blank 25-second wait feels broken, so the elapsed count keeps running
  // even after the named stages run out.
  const [secs, setSecs] = useState(0);

  const stages = [
    '🤖 Analyzing your idea...',
    '📦 Selecting components...',
    '🔌 Designing wiring...',
    '💻 Writing Arduino code...',
    '📖 Creating build guide...',
    '✨ Finalizing project...',
  ];

  const generate = async (text) => {
    const idea = (text || prompt).trim();
    if (!idea || loading) return;
    setLoading(true);
    setError(null);
    setStage(0);

    setSecs(0);
    const stageInterval = setInterval(() => {
      setStage(s => Math.min(s + 1, stages.length - 1));
    }, 1500);
    const secsInterval = setInterval(() => setSecs(s => s + 1), 1000);

    try {
      const res = await backend.integrations.Core.InvokeLLM({
        user_input: idea,
        prompt: `You are an expert robotics project generator for Indian school students (classes 9-11). A student described: "${idea}".
Generate a COMPLETE robotics project. Use simple, friendly English that school students can understand.

Return a JSON object with EXACTLY these fields:
- name: short catchy project name (max 40 chars)
- overview: 2-3 sentence description in simple language
- difficulty: "Beginner", "Intermediate", or "Advanced"
- estimatedTime: e.g. "2-3 hours"
- estimatedCost: e.g. "₹500-800"
- components: array of required component names (strings)
- tools: array of required tools (strings)
- controller: "Arduino Uno" or "ESP32" (use ESP32 only if WiFi/IoT is needed)
- pinConnections: array of {controllerPin, component, componentPin, wireColor}. Map EVERY wire. controllerPin = Arduino pin (e.g. "D13", "D9", "5V", "GND", "A0"). component = component name. componentPin = component pin (e.g. "Anode", "VCC", "GND", "TRIG", "ECHO", "IN1", "ENA"). wireColor = "red" (power), "black" (ground), "blue" (digital), "green" (analog), "orange" (PWM), "yellow" (signal/data).
- buildSteps: array of {title, description} objects (6-10 steps, each description 1-2 sentences)
- arduinoCode: complete working Arduino C++ code (PURE text, NO HTML, NO markdown, NO CSS). Include comments.
- esp32Code: ESP32 version of the code if applicable, or empty string ""
- codeExplanation: line-by-line explanation in simple English
- testingInstructions: how to test the project (2-4 sentences)
- troubleshooting: common issues and fixes (3-5 bullet points)
- realWorldApplications: where this technology is used in real life (2-3 sentences)
- futureImprovements: possible upgrades (2-3 bullet points)`,
        response_json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            overview: { type: 'string' },
            difficulty: { type: 'string' },
            estimatedTime: { type: 'string' },
            estimatedCost: { type: 'string' },
            components: { type: 'array', items: { type: 'string' } },
            tools: { type: 'array', items: { type: 'string' } },
            controller: { type: 'string' },
            pinConnections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  controllerPin: { type: 'string' },
                  component: { type: 'string' },
                  componentPin: { type: 'string' },
                  wireColor: { type: 'string' },
                },
              },
            },
            buildSteps: {
              type: 'array',
              items: {
                type: 'object',
                properties: { title: { type: 'string' }, description: { type: 'string' } },
              },
            },
            arduinoCode: { type: 'string' },
            esp32Code: { type: 'string' },
            codeExplanation: { type: 'string' },
            testingInstructions: { type: 'string' },
            troubleshooting: { type: 'string' },
            realWorldApplications: { type: 'string' },
            futureImprovements: { type: 'string' },
          },
        },
      });

      const pinConnections = (res.pinConnections || []).map(p => ({
        ...p,
        color: { red: '#DC2626', black: '#171717', blue: '#2563EB', green: '#16A34A', orange: '#EA580C', yellow: '#CA8A04', purple: '#A78BFA' }[p.wireColor] || '#64748B',
      }));

      onGenerate({
        ...res,
        arduinoCode: sanitizeCode(res.arduinoCode || ''),
        esp32Code: sanitizeCode(res.esp32Code || ''),
        pinConnections,
        userPrompt: idea,
      });
    } catch (err) {
      setError('Could not generate project. Please try again with a different description.');
    } finally {
      clearInterval(stageInterval); clearInterval(secsInterval);
      setLoading(false);
      setStage('');
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-5 mb-6 animate-slide-up relative overflow-hidden"
      style={{ border: '1px solid rgba(0,210,255,0.2)' }}>
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #00D2FF, transparent)' }} />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center animate-pulse-glow">
            <Wand2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm gradient-text">Build with AI</h2>
            <p className="text-[10px] text-muted-foreground">Describe your dream robot — AI builds the full project!</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-cyan-400 animate-pulse">{stages[stage]}</p>
            <div className="w-40 h-1 mx-auto mt-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${Math.min(95, secs * 4)}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {secs}s · usually 20-30 seconds{secs > 35 ? ' · nearly there, writing the code takes longest' : ''}
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); } }}
                placeholder="💬 Describe the robot you want to build..."
                rows={2}
                className="w-full glass rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-muted-foreground/60"
              />
            </div>

            <button
              onClick={() => generate()}
              disabled={!prompt.trim()}
              className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:neon-glow transition-all"
            >
              <Sparkles className="w-4 h-4" /> Generate Project
            </button>

            {error && <p className="text-[10px] text-red-400 mt-2 text-center">{error}</p>}

            <div className="mt-3">
              <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
                <Bot className="w-3 h-3" /> Try these examples:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => { setPrompt(ex); }}
                    className="text-[10px] glass px-2.5 py-1.5 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                    {ex.replace('I want to build a ', '')}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}