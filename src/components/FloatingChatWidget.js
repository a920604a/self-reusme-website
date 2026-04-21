import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useColorModeValue } from '@chakra-ui/react';
import useStreamingChat from '../hooks/useStreamingChat';

const SUGGESTED_QUESTIONS = [
  'Tell me about your recent projects',
  'What is your tech stack?',
  'Describe your work experience',
];

function ChatMessage({ message, isStreaming, isLast, projectIds }) {
  const isUser      = message.role === 'user';
  const msgUserBg   = useColorModeValue('linear-gradient(135deg,#007AFF,#34AADC)', 'linear-gradient(135deg,#0A84FF,#409CFF)');
  const msgAiBg     = useColorModeValue('rgba(0,0,0,0.04)', 'rgba(255,255,255,0.06)');
  const msgAiColor  = useColorModeValue('#000000', '#dae2fd');
  const msgAiBorder = useColorModeValue('rgba(60,60,67,0.12)', 'rgba(192,193,255,0.12)');
  const accent      = useColorModeValue('#007AFF', '#0A84FF');
  const labelSecond = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');

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
          background: isUser ? msgUserBg : msgAiBg,
          color: isUser ? '#FFFFFF' : msgAiColor,
          fontSize: '14px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)',
          border: isUser ? 'none' : `1px solid ${msgAiBorder}`,
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
                        background: msgAiBorder,
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
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: accent }}>
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
                  background: accent,
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'cursor-blink 0.8s step-end infinite',
                }}
              />
            )}
            {!message.content && !isStreaming && isLast && (
              <span style={{ color: labelSecond, fontStyle: 'italic' }}>Thinking...</span>
            )}
            {!message.content && isStreaming && isLast && (
              <span style={{ color: labelSecond, fontStyle: 'italic' }}>
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
  const { messages, isStreaming, sendMessage, clearMessages, cancelStreaming } = useStreamingChat();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const bgElevated   = useColorModeValue('#FFFFFF', '#1C1C1E');
  const bgHeader     = useColorModeValue('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.04)');
  const bgInput      = useColorModeValue('rgba(120,120,128,0.1)', 'rgba(255,255,255,0.05)');
  const bgFab        = useColorModeValue('linear-gradient(135deg,#F2F2F7,#FFFFFF)', 'linear-gradient(135deg,#1a1f35,#222a3d)');
  const labelPrimary = useColorModeValue('#000000', '#FFFFFF');
  const labelSecond  = useColorModeValue('rgba(60,60,67,0.6)', 'rgba(235,235,245,0.6)');
  const accent       = useColorModeValue('#007AFF', '#0A84FF');
  const borderColor  = useColorModeValue('rgba(60,60,67,0.2)', 'rgba(192,193,255,0.15)');
  const fabShadow    = useColorModeValue('0 4px 20px rgba(0,0,0,0.12)', '0 4px 20px rgba(192,193,255,0.2)');
  const panelShadow  = useColorModeValue('0 24px 60px rgba(0,0,0,0.15)', '0 24px 60px rgba(0,0,0,0.5)');
  const suggestBg    = useColorModeValue('rgba(0,122,255,0.06)', 'rgba(192,193,255,0.07)');
  const suggestBorder = useColorModeValue('rgba(0,122,255,0.2)', 'rgba(192,193,255,0.15)');
  const inputColor   = useColorModeValue('#000000', '#dae2fd');

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
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(120,120,128,0.3);
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
          border: `1px solid ${borderColor}`,
          background: bgFab,
          boxShadow: fabShadow,
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
              background: bgElevated,
              border: `1px solid ${borderColor}`,
              borderRadius: '16px',
              boxShadow: panelShadow,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: bgHeader,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
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
                <div style={{ color: labelPrimary, fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-headline)' }}>
                  Ask me anything
                </div>
                <div style={{ color: labelSecond, fontSize: '11px', fontFamily: 'var(--font-label)' }}>
                  About Yu-An's portfolio
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {isStreaming && (
                  <button
                    onClick={cancelStreaming}
                    title="Stop generating"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: accent,
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-label)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Stop
                  </button>
                )}
                {messages.length > 0 && !isStreaming && (
                  <button
                    onClick={clearMessages}
                    title="Clear chat"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: labelSecond,
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-label)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = labelSecond)}
                  >
                    Clear
                  </button>
                )}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isStreaming ? '#ffb783' : accent,
                    boxShadow: `0 0 6px ${isStreaming ? '#ffb783' : accent}`,
                    transition: 'all 0.3s',
                  }}
                />
              </div>
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
                  <div style={{ color: labelSecond, fontSize: '13px', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                    Hi! I can answer questions about Yu-An's experience, projects, and skills.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        style={{
                          background: suggestBg,
                          border: `1px solid ${suggestBorder}`,
                          borderRadius: '8px',
                          color: accent,
                          fontSize: '12px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = suggestBorder)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = suggestBg)}
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
                borderTop: `1px solid ${borderColor}`,
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                flexShrink: 0,
                background: bgHeader,
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
                  background: bgInput,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  color: inputColor,
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
                      ? bgInput
                      : `linear-gradient(135deg, ${accent}, ${accent})`,
                  color: isStreaming || !input.trim() ? labelSecond : '#FFFFFF',
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
