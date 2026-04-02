import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { ArrowLeft, Lock, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const ChangePasswordPage = () => {
  const { navigate, goBack, t, theme } = useAppContext();
  const isDark = theme === 'dark';
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => goBack(), 1500);
    }, 1000);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 px-4 py-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button onClick={() => goBack()} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('settings.password')}</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Sécurité du compte</h2>
          <p className="text-gray-500 text-sm">Protégez votre compte avec un mot de passe fort.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Mot de passe actuel</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'} outline-none transition-all`}
                placeholder="••••••••"
              />
              <button 
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 opacity-50 my-4" />

          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Nouveau mot de passe</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'} outline-none transition-all`}
                placeholder="Nouveau mot de passe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-70">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'} outline-none transition-all`}
                placeholder="Confirmer"
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-xs mt-2">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || showSuccess || !newPassword || newPassword !== confirmPassword}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 ${isSaving || showSuccess || !newPassword || newPassword !== confirmPassword ? 'bg-gray-400' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : showSuccess ? (
              <>
                <CheckCircle size={20} />
                Mot de passe mis à jour !
              </>
            ) : (
              <>
                <Save size={20} />
                Mettre à jour le mot de passe
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
          <p className="font-bold">Mot de passe changé avec succès !</p>
        </motion.div>
      )}
    </div>
  );
};
