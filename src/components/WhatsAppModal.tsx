import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, MessageCircle, Bot } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const { navigate, theme } = useAppContext();
  const isDark = theme === 'dark';

  const handleOption1 = () => {
    trackEvent('Click', { Target: 'WhatsApp_Option_Custom_Order' });
    navigate('custom-order-assistant');
    onClose();
  };

  const handleOption2 = () => {
    trackEvent('Click', { Target: 'WhatsApp_Option_Direct_Order' });
    window.open('https://wa.me/2290154972991?text=Bonjour,%20je%20souhaite%20passer%20une%20commande%20directement%20sur%20WhatsApp.', '_blank');
    onClose();
  };

  const handleOption3 = () => {
    trackEvent('Click', { Target: 'WhatsApp_Option_AI_Agent' });
    navigate('ai-agent');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Comment pouvons-nous vous aider ?</h2>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOption1}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-50 hover:bg-amber-100'}`}
                >
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-white text-amber-600 shadow-sm'}`}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Commande personnalisée</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sur le site avec un agent</div>
                  </div>
                </button>

                <button
                  onClick={handleOption2}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-50 hover:bg-green-100'}`}
                >
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20 text-green-500' : 'bg-white text-green-600 shadow-sm'}`}>
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Commande WhatsApp</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Directement via messagerie</div>
                  </div>
                </button>

                <button
                  onClick={handleOption3}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'}`}
                >
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20 text-blue-500' : 'bg-white text-blue-600 shadow-sm'}`}>
                    <Bot size={24} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Discuter avec un agent</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Agent conversationnel (IA)</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
