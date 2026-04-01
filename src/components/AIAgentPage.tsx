import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, ArrowLeft, MoreVertical, Sparkles } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const AIAgentPage = () => {
  const { navigate, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant virtuel de La Bouche Fine. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            onClick={() => navigate('home')}
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
        <button className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <MoreVertical size={20} />
        </button>
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
                  {message.text}
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
    </div>
  );
};
