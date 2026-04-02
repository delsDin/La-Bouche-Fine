import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { ArrowLeft, Phone, Save, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ChangePhonePage = () => {
  const { user, updateUser, navigate, goBack, t, theme } = useAppContext();
  const isDark = theme === 'dark';
  
  const [phone, setPhone] = useState(user?.phone?.replace('+229', '') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = digits.slice(0, 10);
    
    // Format as 01 XX XX XX XX
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 2 === 0) {
        formatted += ' ';
      }
      formatted += limited[i];
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const handleSave = () => {
    const rawPhone = phone.replace(/\s/g, '');
    if (rawPhone.length !== 10) {
      setError('Le numéro doit comporter 10 chiffres (ex: 01 02 03 04 05)');
      return;
    }
    if (!rawPhone.startsWith('01')) {
      setError('Le numéro doit commencer par 01');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateUser({ phone: `+229${rawPhone}` });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => goBack(), 1500);
    }, 800);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button onClick={() => goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('settings.phone')}</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Mise à jour du numéro</h2>
          <p className="text-gray-500 text-sm">Votre numéro est utilisé pour le suivi de vos commandes et les notifications WhatsApp.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Nouveau numéro de téléphone</label>
            <div className="relative flex items-center">
              <div className={`absolute left-4 flex items-center gap-2 text-gray-400`}>
                <Phone size={20} />
                <span className="font-bold border-r pr-2 border-gray-300 dark:border-gray-700">+229</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full pl-28 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'} outline-none transition-all font-mono text-lg tracking-wider`}
                placeholder="01 00 00 00 00"
              />
            </div>
            {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' : 'bg-amber-50 border-amber-100 text-amber-800'} text-xs`}>
            <p className="font-bold mb-1">Note importante :</p>
            <p>Un code de vérification (OTP) sera envoyé à ce nouveau numéro pour confirmer le changement.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || showSuccess}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 ${isSaving || showSuccess ? 'bg-gray-400' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : showSuccess ? (
              <>
                <CheckCircle size={20} />
                Numéro mis à jour !
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer le numéro
              </>
            )}
          </button>
        </div>
      </main>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 p-4 bg-green-500 text-white rounded-xl shadow-lg flex items-center gap-3 z-50"
        >
          <CheckCircle size={24} />
          <p className="font-bold">Changement enregistré avec succès !</p>
        </motion.div>
      )}
    </div>
  );
};
