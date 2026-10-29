import React, { useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import Spinner from '@atlaskit/spinner';
import Lozenge from '@atlaskit/lozenge';
import { Send, MessageSquare, Sparkles, Terminal } from 'lucide-react';
import { sendDeliberationQuestion } from '@/services/auditApi.js';
import type { TechnicalDossier, DeliberationMessage } from '@/types/audit.js';

interface DeliberationChatTabProps {
  dossier: TechnicalDossier;
}

const DEFAULT_PROMPTS = [
  'Kenapa klaim tertentu berstatus TRANSFERABLE?',
  'Apa risiko arsitektur terbesar jika kandidat ini diterima?',
  'Buatkan skenario live coding test 30 menit berbasis repositorinya.',
  'Bagaimana kesiapan kandidat jika menangani insiden production skala besar?',
];

export function DeliberationChatTab({ dossier }: DeliberationChatTabProps) {
  const [messages, setMessages] = useState<DeliberationMessage[]>([
    {
      role: 'assistant',
      content: `Halo! Saya AI Deliberation Partner Anda untuk mengevaluasi ${dossier.candidate.name}. Saya memegang memori penuh terhadap repositori yang diaudit (${dossier.auditedRepos.join(', ') || 'portofolio'}). Silakan tanyakan pembuktian kode spesifik, pertimbangan trade-off arsitektur, atau skenario uji wawancara.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || isLoading) return;

    const userMsg: DeliberationMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await sendDeliberationQuestion(dossier, text);
      const aiMsg: DeliberationMessage = {
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString(),
        anchors: res.anchors,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const errorMsg: DeliberationMessage = {
        role: 'assistant',
        content: `Maaf, terjadi kendala saat berkonsultasi: ${msg}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      {/* Header Info Banner */}
      <div
        style={{
          background: '#F4F5F7',
          border: '1px solid #DFE1E6',
          borderRadius: 6,
          padding: 12,
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={16} color="#0052CC" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#172B4D' }}>
            Ruang Deliberasi AI (Diskusi Interaktif Rekruter & Tech Lead)
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Lozenge appearance="success">GROUNDED MEMORY ACTIVE</Lozenge>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#5E6C84', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Sparkles size={12} /> Saran Pertanyaan Cepat:
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DEFAULT_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              style={{
                background: '#FFFFFF',
                border: '1px solid #C1C7D0',
                borderRadius: 14,
                padding: '4px 10px',
                fontSize: 11,
                color: '#172B4D',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div
        style={{
          border: '1px solid #DFE1E6',
          borderRadius: 6,
          padding: 16,
          minHeight: 280,
          maxHeight: 460,
          overflowY: 'auto',
          background: '#FAFBFC',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 14,
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                backgroundColor: isUser ? '#0052CC' : '#FFFFFF',
                color: isUser ? '#FFFFFF' : '#172B4D',
                border: isUser ? 'none' : '1px solid #EBECF0',
                borderRadius: 8,
                padding: '10px 14px',
                boxShadow: '0 1px 3px rgba(9, 30, 66, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: isUser ? '#B3D4FF' : '#5E6C84' }}>
                  {isUser ? 'Tim Rekruter' : 'TalentTrace Co-Pilot'}
                </span>
                <span style={{ fontSize: 10, color: isUser ? '#B3D4FF' : '#8993A4' }}>{m.timestamp}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.content}</p>

              {m.anchors && m.anchors.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.anchors.map((anchor, aIdx) => (
                    <span
                      key={aIdx}
                      style={{
                        fontSize: 10,
                        background: '#EBECF0',
                        color: '#0052CC',
                        padding: '2px 6px',
                        borderRadius: 3,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Terminal size={10} /> {anchor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Spinner size="small" />
            <span style={{ fontSize: 12, color: '#5E6C84' }}>Co-Pilot sedang menganalisis kode repositori...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan bukti arsitektur kode atau verifikasi keahlian kandidat..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 6,
            border: '1px solid #DFE1E6',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <Button
          appearance="primary"
          onClick={() => handleSend(inputValue)}
          isDisabled={isLoading || !inputValue.trim()}
          iconBefore={<Send size={14} />}
        >
          Kirim
        </Button>
      </div>
    </div>
  );
}
