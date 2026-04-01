import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { motion } from 'motion/react';
import { WhatsAppModal } from './WhatsAppModal';

export const WhatsAppFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFABClick = () => {
    trackEvent('Click', { Target: 'WhatsApp_FAB_Open_Modal' });
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.button
        drag
        dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleFABClick}
        className="fixed bottom-20 right-4 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center cursor-grab active:cursor-grabbing"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle size={28} />
      </motion.button>

      <WhatsAppModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
