import React, { useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '../../app/axiosInstance';
import styles from './ChatbotWidget.module.css';

type Role = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  createdAt: string;
}

interface ChatbotApiResponse {
  reply?: string;
  message?: string;
  response?: string;
  detail?: string;
  error?: string;
}

const quickPrompts = [
  'Show me today\'s priorities',
  'Summarize my pending tasks',
  'How is lead conversion doing?',
  'What budget metrics should I check?'
];

const endpoint = (import.meta.env.VITE_CHATBOT_ENDPOINT as string | undefined) || '/chatbot/ask/';

const getFallbackResponse = (input: string) => {
  const text = input.toLowerCase();
  if (text.includes('task')) return 'You can open Task Workspace for full details. I can also summarize pending vs completed if backend chat API is configured.';
  if (text.includes('lead')) return 'Lead metrics are available in Lead Workspace and Sales Dashboard. Ask me things like: "show conversion trend".';
  if (text.includes('budget')) return 'Budget insights are in Budget Overview and Budget Dashboard. I can help compare monthly vs quarterly performance.';
  if (text.includes('opportunity')) return 'Opportunity health is tracked in Opportunity Workspace and Sales Dashboard. I can guide next actions by stage.';
  return 'I can help with leads, tasks, opportunities, and budgets. Try asking for a summary.';
};

const nowIso = () => new Date().toISOString();
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'Hi, I am your SalesPie assistant. Ask me about tasks, leads, opportunities, or budgets.',
      createdAt: nowIso(),
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (text: string) => {
    const clean = text.trim();
    if (!clean || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: clean,
      createdAt: nowIso(),
    };

    appendMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        message: clean,
        history: [...messages, userMessage].map((m) => ({ role: m.role, content: m.text })),
        source: 'salespie-web',
      };

      const { data } = await axiosInstance.post<ChatbotApiResponse>(endpoint, payload);
      const reply = data?.reply || data?.message || data?.response || getFallbackResponse(clean);

      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        createdAt: nowIso(),
      });
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.reply ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.error;
      const statusCode = error?.response?.status;
      const fallbackText =
        backendMessage ||
        (statusCode === 401
          ? 'Your session has expired. Please login again to continue chatting.'
          : statusCode === 403
            ? 'The chatbot request was blocked. Please refresh and try again.'
            : getFallbackResponse(clean));

      console.error('Chatbot request failed', error?.response?.data || error);

      appendMessage({
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        createdAt: nowIso(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div>
              <p className={styles.title}>SalesPie Assistant</p>
              <p className={styles.subtitle}>AI chat for your CRM workflows</p>
            </div>
            <button className={styles.iconBtn} onClick={() => setIsOpen(false)} aria-label="Close chat">
              x
            </button>
          </div>

          <div className={styles.quickPrompts}>
            {quickPrompts.map((prompt) => (
              <button key={prompt} className={styles.prompt} onClick={() => sendMessage(prompt)} disabled={isLoading}>
                {prompt}
              </button>
            ))}
          </div>

          <div className={styles.feed} ref={feedRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? styles.userRow : styles.botRow}>
                {msg.role === 'assistant' && <div className={styles.avatarBot}>AI</div>}
                <div className={styles.messageWrap}>
                  <div className={msg.role === 'user' ? styles.userBubble : styles.botBubble}>{msg.text}</div>
                  <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                </div>
                {msg.role === 'user' && <div className={styles.avatarUser}>You</div>}
              </div>
            ))}
            {isLoading && (
              <div className={styles.botRow}>
                <div className={styles.avatarBot}>AI</div>
                <div className={styles.messageWrap}>
                  <div className={styles.botBubble}>
                    <span className={styles.typingDots}>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            className={styles.inputBar}
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about leads, tasks, budget..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn} disabled={!canSend}>
              Send
            </button>
          </form>
        </div>
      )}

      <button className={styles.fab} onClick={() => setIsOpen((prev) => !prev)} aria-label="Open chatbot">
        🤖
      </button>
    </div>
  );
};

export default ChatbotWidget;
