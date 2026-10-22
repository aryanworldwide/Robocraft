import React from 'react';
import ReportButton from '@/components/ReportButton';

export default function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
        isUser
          ? 'bg-cyan-500/20 text-foreground rounded-br-sm'
          : 'glass text-foreground/90 rounded-bl-sm'
      }`}>
        <p className="whitespace-pre-line">{msg.content}</p>
        {msg.suggestion && (
          <p className="text-[10px] text-cyan-400 mt-1">💡 {msg.suggestion}</p>
        )}
        {!isUser && msg.ai !== false && <div className="mt-1 text-right"><ReportButton ai context={{ excerpt: msg.content }} /></div>}
      </div>
    </div>
  );
}
