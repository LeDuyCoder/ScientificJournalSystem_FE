import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared/components/Chatbot/ChatbotWidget.jsx
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import chatbotApi from '../../services/chatbotApi';
import './ChatbotWidget.css';
const numberLikeColumns = new Set(['publication_year', 'citation_count', 'value_float', 'year']);
function getProjectIdFromUrl() {
  const match = window.location.pathname.match(/\/projects\/(\d+)/);
  return match?.[1] ? Number(match[1]) : null;
}
function renderMarkdownLite(text) {
  if (!text) return null;
  return text.split('\n').map((line, lineIndex) => {
    const fragments = line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
    });
    return <span key={`line-${lineIndex}`}>
        {fragments}
        {lineIndex < text.split('\n').length - 1 && <br />}
      </span>;
  });
}
export default function ChatbotWidget() {
  const {
    t
  } = useTranslation();
  const suggestedPrompts = [t("common.timGiupToiTopCacBaiBaoTrongDuA"), t("common.danhSachTapChiQ1Nam2024"), t("common.baiBaoNaoCoLuotTrichDanCaoNhat")];
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [projectId, setProjectId] = useState(() => getProjectIdFromUrl() || 12);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([{
    id: crypto.randomUUID(),
    role: 'assistant',
    answer: t("common.xinChaoToiLaAiResearchAssistan"),
    table: null
  }]);
  const scrollAnchorRef = useRef(null);
  const hasTable = useMemo(() => messages.some(item => item.table?.data?.length), [messages]);
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    });
  };
  useEffect(() => {
    const pId = getProjectIdFromUrl();
    if (pId) {
      setProjectId(pId);
    }
  }, [location]);
  const sendMessage = async (text = message) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      answer: cleanText,
      table: null
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    scrollToBottom();
    try {
      const data = await chatbotApi.sendMessage({
        project_id: Number(projectId),
        message: cleanText
      });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        answer: data?.answer || t("common.toiDaNhanPhanHoiNhungChuaCoNoi"),
        table: data?.table || null
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        answer: t("common.xinLoiToiChuaTheKetNoiToiApiCh"),
        table: null,
        isError: true
      }]);
      console.error('ChatbotWidget error:', error);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };
  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  return <section className={`rp-chatbot ${isOpen ? 'is-open' : ''}`} aria-live="polite">
      {isOpen && <div className="rp-chatbot__panel" role="dialog" aria-label="AI Research Assistant">
          <header className="rp-chatbot__header">
            <div className="rp-chatbot__identity">
              <div className="rp-chatbot__avatar">AI</div>
              <div>
                <p className="rp-chatbot__eyebrow">ResearchPulse RAG</p>
                <h2>AI Research Assistant</h2>
              </div>
            </div>
            <button id="chatbot-close-button" className="rp-chatbot__icon-btn" type="button" onClick={() => setIsOpen(false)} aria-label="Đóng chatbot">{t("common.key")}</button>
          </header>

          <div className="rp-chatbot__project-bar">
            <label htmlFor="chatbot-project-id">Project ID</label>
            <input id="chatbot-project-id" type="number" min="1" value={projectId} onChange={event => setProjectId(event.target.value)} aria-label="Project ID cho chatbot" />
          </div>

          <div className="rp-chatbot__messages">
            {messages.map(item => <article key={item.id} className={`rp-chatbot__message rp-chatbot__message--${item.role} ${item.isError ? 'is-error' : ''}`}>
                <div className="rp-chatbot__bubble">{renderMarkdownLite(item.answer)}</div>

                {item.table && <div className="rp-chatbot__table-card">
                    <div className="rp-chatbot__table-head">
                      <span>{t("common.bangDuLieu")}</span>
                      <small>{item.table.data?.length || 0}{t("common.dong")}</small>
                    </div>
                    <div className="rp-chatbot__table-wrap">
                      <table>
                        <thead>
                          <tr>
                            {item.table.columns?.map(column => <th key={column.key}>{column.label}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {item.table.data?.map((row, rowIndex) => <tr key={row.article_id || row.journal_id || `row-${rowIndex}`}>
                              {item.table.columns?.map(column => <td key={`${rowIndex}-${column.key}`} className={numberLikeColumns.has(column.key) ? 'is-number' : ''}>
                                  {row[column.key] ?? '—'}
                                </td>)}
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>}
              </article>)}

            {isLoading && <div className="rp-chatbot__typing" aria-label="AI đang trả lời">
                <span />
                <span />
                <span />
              </div>}
            <div ref={scrollAnchorRef} />
          </div>

          {!hasTable && <div className="rp-chatbot__suggestions" aria-label="Gợi ý câu hỏi">
              {suggestedPrompts.map(prompt => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={isLoading}>
                  {prompt}
                </button>)}
            </div>}

          <form className="rp-chatbot__composer" onSubmit={event => {
        event.preventDefault();
        sendMessage();
      }}>
            <textarea id="chatbot-message-input" value={message} onChange={event => setMessage(event.target.value)} onKeyDown={handleKeyDown} placeholder={t("common.nhapCauHoiVeBaiBaoTapChiQ1q2")} rows="2" />
            <button id="chatbot-send-button" type="submit" disabled={isLoading || !message.trim()}>{t("common.gui")}</button>
          </form>
        </div>}

      <button id="chatbot-toggle-button" className="rp-chatbot__launcher" type="button" onClick={() => setIsOpen(current => !current)} aria-label={isOpen ? t("common.thuNhoChatbot") : t("common.moChatbotAi")}>
        <span className="rp-chatbot__pulse" />
        <span className="rp-chatbot__launcher-icon">✦</span>
        <span className="rp-chatbot__launcher-text">AI Chat</span>
      </button>
    </section>;
}