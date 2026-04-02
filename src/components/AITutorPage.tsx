import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, User, ArrowLeft, MoreVertical, Sparkles, 
  Camera, Image as ImageIcon, X, Loader2, Info,
  ChefHat, BookOpen, HelpCircle, Lightbulb, Trash2, Plus, Lock
} from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  image?: string;
}

const QUICK_ACTIONS = [
  { id: 'q1', text: "Pourquoi mon gâteau est plat ?", icon: <HelpCircle size={14} /> },
  { id: 'q2', text: "Recette de génoise inratable", icon: <BookOpen size={14} /> },
  { id: 'q3', text: "Comment remplacer le beurre ?", icon: <Lightbulb size={14} /> },
  { id: 'q4', text: "Astuce pour un glaçage brillant", icon: <Sparkles size={14} /> },
];

export const AITutorPage = () => {
  const { navigate, goBack, theme, user, t } = useAppContext();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPremium = user?.subscription === 'premium';

  const initialMessage: Message = {
    id: '1',
    text: `Bonjour ${user?.name || ''} ! Je suis votre Tuteur IA spécialisé en pâtisserie. Je suis là pour vous accompagner dans votre apprentissage et répondre à toutes vos questions techniques. Comment puis-je vous aider aujourd'hui ?`,
    sender: 'bot',
    timestamp: new Date(),
  };

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('ai_tutor_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string timestamps back to Date objects
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
      localStorage.setItem('ai_tutor_history', JSON.stringify(messages));
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
        localStorage.removeItem('ai_tutor_history');
        setShowMenu(false);
        setConfirmConfig(prev => ({ ...prev, show: false }));
        trackEvent('AI_Tutor_History_Cleared', {});
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
        localStorage.removeItem('ai_tutor_history');
        setShowMenu(false);
        setConfirmConfig(prev => ({ ...prev, show: false }));
        trackEvent('AI_Tutor_New_Chat', {});
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const callGemini = async (prompt: string, base64Image?: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `Tu es un Tuteur Expert en Pâtisserie pour l'application "La Bouche Fine" au Bénin. 
      Ton ton est encourageant, pédagogique et professionnel. 
      Tu aides les élèves à comprendre les techniques de pâtisserie (génoise, crème au beurre, macarons, etc.).
      Tu peux aussi analyser des photos de leurs réalisations pour leur donner des conseils d'amélioration.
      Réponds en français, avec parfois quelques expressions béninoises chaleureuses (Akwaba, Kuabo, etc.) si approprié.
      Si l'utilisateur pose une question hors sujet (politique, sport, etc.), redirige-le poliment vers la pâtisserie.`;

      let response;
      if (base64Image) {
        const imagePart = {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1],
          },
        };
        const textPart = { text: prompt };
        response = await ai.models.generateContent({
          model,
          contents: { parts: [imagePart, textPart] },
          config: { systemInstruction }
        });
      } else {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { systemInstruction }
        });
      }

      return response.text || "Désolé, je n'ai pas pu générer de réponse. Réessayez !";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Oups ! J'ai un petit problème technique. Vérifiez votre connexion internet et réessayez.";
    }
  };

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsTyping(true);
    trackEvent('AI_Tutor_Message_Sent', { hasImage: !!currentImage });

    const botResponseText = await callGemini(messageText, currentImage || undefined);

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  if (!isPremium) {
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
                <div className="font-bold text-sm">Tuteur IA Pâtisserie</div>
                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                  <Sparkles size={10} />
                  Premium
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Paywall Content */}
        <div className="flex-1 flex flex-center justify-center p-6 text-center">
          <div className="max-w-sm w-full flex flex-col items-center justify-center">
            <div className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
              <Lock size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Accès Premium Requis</h2>
            <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Le Tuteur IA Pâtisserie est une fonctionnalité exclusive réservée aux membres Premium. 
              Profitez d'un accompagnement personnalisé 24h/24 pour perfectionner vos techniques.
            </p>
            
            <div className={`w-full p-5 rounded-2xl mb-8 text-left ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Inclus dans Premium :
              </h4>
              <ul className="space-y-2 text-xs opacity-80">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500" />
                  Réponses instantanées à vos questions techniques
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500" />
                  Analyse de vos photos de réalisations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500" />
                  Conseils personnalisés pour chaque recette
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500" />
                  Astuces de chefs béninois renommés
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('subscription')}
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-600/20 active:scale-95 transition-all mb-4"
            >
              Devenir Premium
            </button>
            
            <button
              onClick={() => navigate('home')}
              className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <ChefHat size={24} />
            </div>
            <div>
              <div className="font-bold text-sm">Tuteur IA Pâtisserie</div>
              <div className="flex items-center gap-1 text-[10px] text-green-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Expert disponible
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
        {messages.length === 1 && (
          <div className="space-y-4 mb-8">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
              <div className="flex items-center gap-2 mb-2 text-amber-600">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Comment m'utiliser ?</span>
              </div>
              <ul className="text-xs space-y-2 opacity-80">
                <li>• Posez des questions sur les techniques de base.</li>
                <li>• Demandez des conseils pour rattraper une pâte.</li>
                <li>• Envoyez une photo de votre gâteau pour une analyse.</li>
                <li>• Apprenez les secrets des chefs béninois.</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSend(action.text)}
                  className={`p-3 rounded-xl border text-left text-[11px] font-medium flex flex-col gap-2 transition-all active:scale-95 ${
                    isDark ? 'bg-gray-800 border-gray-700 hover:border-amber-500/50' : 'bg-white border-gray-100 hover:border-amber-500/50 shadow-sm'
                  }`}
                >
                  <div className="text-amber-500">{action.icon}</div>
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        )}

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
                  {message.sender === 'bot' ? <ChefHat size={16} /> : <User size={16} />}
                </div>
                <div className="flex flex-col gap-1">
                  {message.image && (
                    <div className="rounded-2xl overflow-hidden mb-1 border border-gray-200 dark:border-gray-700">
                      <img src={message.image} alt="Upload" className="max-w-full h-40 object-cover" />
                    </div>
                  )}
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
                <ChefHat size={16} />
              </div>
              <div className={`p-3 rounded-2xl rounded-tl-none flex gap-1 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
              </div>
              <span className="text-[10px] text-gray-500 font-medium italic">Le Chef réfléchit...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t pb-safe ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-amber-500" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-gray-700 text-gray-400 hover:text-amber-500' : 'bg-gray-100 text-gray-500 hover:text-amber-600'}`}
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            className="hidden" 
            accept="image/*" 
          />
          
          <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
            isDark ? 'bg-gray-700 border-gray-600 focus-within:border-amber-500' : 'bg-gray-50 border-gray-200 focus-within:border-amber-500'
          }`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isTyping}
            className={`p-3 rounded-2xl transition-all ${
              (input.trim() || selectedImage) && !isTyping
                ? 'bg-amber-600 text-white shadow-lg active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
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
