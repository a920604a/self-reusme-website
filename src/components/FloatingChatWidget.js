import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import useStreamingChat from '../hooks/useStreamingChat';

const SUGGESTED_QUESTIONS = [
  'Tell me about your recent projects',
  'What is your tech stack?',
  'Describe your work experience',
];

function ChatMessage({ message, isStreaming, isLast, projectIds }) {
  const isUser = message.role === 'user';

  // Highlight project section if assistant mentions a known project id
  useEffect(() => {
    if (isUser || isStreaming || !isLast || !message.content) return;
    const lower = message.content.toLowerCase();
    for (const id of projectIds) {
      if (lower.includes(id.toLowerCase())) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('rag-glow');
          setTimeout(() => el.classList.remove('rag-glow'), 3000);
          break;
        }
      }
    }
  }, [isStreaming, isLast, message.content, isUser, projectIds]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '10px 14px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #8083ff, #c0c1ff)'
            : 'rgba(255,255,255,0.06)',
          color: isUser ? '#0b1326' : '#dae2fd',
          fontSize: '14px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)',
          border: isUser ? 'none' : '1px solid rgba(192,193,255,0.12)',
          wordBreak: 'break-word',
        }}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ inline, className, children, ...props }) {
                  return inline ? (
                    <code
                      style={{
                        background: 'rgba(192,193,255,0.15)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                a({ href, children }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#5de6ff' }}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
            {isStreaming && isLast && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '14px',
                  background: '#c0c1ff',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'cursor-blink 0.8s step-end infinite',
                }}
              />
            )}
            {!message.content && !isStreaming && isLast && (
              <span style={{ color: '#908fa0', fontStyle: 'italic' }}>Thinking...</span>
            )}
            {!message.content && isStreaming && isLast && (
              <span style={{ color: '#908fa0', fontStyle: 'italic' }}>
                Thinking
                <span style={{ animation: 'cursor-blink 1s infinite' }}>...</span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FloatingChatWidget({ projectIds = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage } = useStreamingChat();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .rag-glow {
          box-shadow: 0 0 0 3px rgba(192, 193, 255, 0.6), 0 0 24px rgba(192, 193, 255, 0.3) !important;
          transition: box-shadow 0.3s ease !important;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(192,193,255,0.2);
          border-radius: 4px;
        }
      `}</style>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1px solid rgba(192,193,255,0.25)',
          background: 'linear-gradient(135deg, #1a1f35, #222a3d)',
          boxShadow: '0 4px 20px rgba(192,193,255,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        }}
        aria-label="Open AI assistant"
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '88px',
              right: '24px',
              zIndex: 9998,
              width: 'min(380px, calc(100vw - 32px))',
              maxHeight: 'min(560px, calc(100vh - 120px))',
              display: 'flex',
              flexDirection: 'column',
              background: '#131b2e',
              border: '1px solid rgba(192,193,255,0.15)',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(192,193,255,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(192,193,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(192,193,255,0.04)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8083ff, #c0c1ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ color: '#dae2fd', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-headline)' }}>
                  Ask me anything
                </div>
                <div style={{ color: '#908fa0', fontSize: '11px', fontFamily: 'var(--font-label)' }}>
                  About Yu-An's portfolio
                </div>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isStreaming ? '#ffb783' : '#5de6ff',
                  boxShadow: `0 0 6px ${isStreaming ? '#ffb783' : '#5de6ff'}`,
                  transition: 'all 0.3s',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Messages */}
            <div
              className="chat-messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                minHeight: 0,
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>👋</div>
                  <div style={{ color: '#c7c4d7', fontSize: '13px', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                    Hi! I can answer questions about Yu-An's experience, projects, and skills.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        style={{
                          background: 'rgba(192,193,255,0.07)',
                          border: '1px solid rgba(192,193,255,0.15)',
                          borderRadius: '8px',
                          color: '#c0c1ff',
                          fontSize: '12px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192,193,255,0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(192,193,255,0.07)')}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isStreaming={isStreaming}
                  isLast={i === messages.length - 1}
                  projectIds={projectIds}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '12px',
                borderTop: '1px solid rgba(192,193,255,0.1)',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                flexShrink: 0,
                background: 'rgba(192,193,255,0.02)',
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question... (Enter to send)"
                rows={1}
                disabled={isStreaming}
                style={{
                  flex: 1,
                  resize: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(192,193,255,0.15)',
                  borderRadius: '10px',
                  color: '#dae2fd',
                  padding: '9px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  lineHeight: '1.5',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  opacity: isStreaming ? 0.6 : 1,
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background:
                    isStreaming || !input.trim()
                      ? 'rgba(192,193,255,0.15)'
                      : 'linear-gradient(135deg, #8083ff, #c0c1ff)',
                  color: isStreaming || !input.trim() ? '#908fa0' : '#0b1326',
                  cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChatWidget;
