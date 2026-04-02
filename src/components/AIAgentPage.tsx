import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, ArrowLeft, MoreVertical, Sparkles, Trash2, Info, Plus } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const AIAgentPage = () => {
  const { navigate, goBack, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    id: '1',
    text: "Bonjour ! Je suis l'assistant virtuel de La Bouche Fine. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date(),
  };

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('ai_agent_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(formatted);
      } catch (e) {
        setMessages([initialMessage]);
      }
    } else {
      setMessages([initialMessage]);
    }
  }, []);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_agent_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearHistory = () => {
    setConfirmConfig({
      show: true,
      title: 'Supprimer l\'historique',
      message: 'Voulez-vous vraiment supprimer tout l\'historique de cette discussion ? Cette action est irréversible.',
      onConfirm: () => {
        setMessages([initialMessage]);
        localStorage.removeItem('ai_agent_history');
        setShowMenu(false);
        setConfirmConfig(prev => ({ ...prev, show: false }));
        trackEvent('AI_Agent_History_Cleared', {});
      }
    });
  };

  const startNewChat = () => {
    if (messages.length <= 1) {
      setShowMenu(false);
      return;
    }
    setConfirmConfig({
      show: true,
      title: 'Nouvelle discussion',
      message: 'Commencer une nouvelle discussion ? L\'historique actuel sera effacé.',
      onConfirm: () => {
        setMessages([initialMessage]);
        localStorage.removeItem('ai_agent_history');
        setShowMenu(false);
        setConfirmConfig(prev => ({ ...prev, show: false }));
        trackEvent('AI_Agent_New_Chat', {});
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    trackEvent('AI_Agent_Message_Sent', { text: input });

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('commande') || lowerText.includes('acheter')) {
      return "Vous pouvez commander directement sur notre catalogue ou via WhatsApp. Souhaitez-vous que je vous redirige vers le catalogue ?";
    }
    if (lowerText.includes('prix') || lowerText.includes('coûte')) {
      return "Nos prix varient selon le type de gâteau et la personnalisation. Vous pouvez consulter les tarifs sur notre catalogue.";
    }
    if (lowerText.includes('livraison')) {
      return "Nous livrons partout à Cotonou et ses environs. Les délais sont généralement de 24h à 48h.";
    }
    return "C'est noté ! Je transmets votre demande à un agent humain si nécessaire. Avez-vous d'autres questions sur nos gâteaux ?";
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`px-4 py-4 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => goBack()}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
              <Bot size={24} />
            </div>
            <div>
              <div className="font-bold text-sm">Assistant La Bouche Fine</div>
              <div className="flex items-center gap-1 text-[10px] text-green-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                En ligne
              </div>
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} ${showMenu ? 'bg-amber-500/10 text-amber-500' : ''}`}
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}
              >
                <div className="p-1">
                  <button
                    onClick={startNewChat}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Plus size={16} className="text-amber-500" />
                    Nouvelle discussion
                  </button>
                  <button
                    onClick={clearHistory}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Supprimer l'historique
                  </button>
                  <button
                    onClick={() => setShowMenu(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Info size={16} />
                    Aide & Infos
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center mb-6">
          <div className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-500'}`}>
            Aujourd'hui
          </div>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  message.sender === 'bot' 
                    ? (isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-600')
                    : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')
                }`}>
                  {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : (isDark ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100')
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <div className={`text-[10px] mt-1 text-right ${message.sender === 'user' ? 'text-amber-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-2 items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                <Bot size={16} />
              </div>
              <div className={`p-3 rounded-2xl rounded-tl-none flex gap-1 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t pb-safe ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
            isDark ? 'bg-gray-700 border-gray-600 focus-within:border-amber-500' : 'bg-gray-50 border-gray-200 focus-within:border-amber-500'
          }`}>
            <Sparkles size={18} className="text-amber-500 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-2xl transition-all ${
              input.trim() 
                ? 'bg-amber-600 text-white shadow-lg active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-[10px] text-gray-500">
            L'IA peut faire des erreurs. Pour une commande urgente, utilisez WhatsApp.
          </p>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmConfig.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <h3 className="text-lg font-bold mb-2">{confirmConfig.title}</h3>
              <p className={`text-sm mb-6 opacity-70`}>{confirmConfig.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className="flex-1 py-3 rounded-xl font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
