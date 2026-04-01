import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { Search, Home, AlertCircle, Phone, Zap, ZapOff } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { AdFrame } from './AdFrame';

export const PublicTrackingPage = () => {
  const { navigate, theme, dataSaver, setDataSaver } = useAppContext();
  const isDark = theme === 'dark';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhoneFallback, setShowPhoneFallback] = useState(false);

  useEffect(() => {
    trackEvent('Public_Tracking_Page_View', {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedCode = code.trim().toUpperCase();
    
    if (!trimmedCode) {
      setError('Veuillez entrer un code de commande.');
      return;
    }

    if (!/^BEN-\d{8}-\d{4}$/.test(trimmedCode)) {
      setError('Format de code invalide. Exemple: BEN-20260330-0147');
      return;
    }

    // Rate limiting simulation (client-side only for demo)
    const attempts = parseInt(localStorage.getItem('tracking_attempts') || '0');
    const lastAttempt = parseInt(localStorage.getItem('tracking_last_attempt') || '0');
    
    if (attempts >= 5 && Date.now() - lastAttempt < 3600000) {
      setError('Trop de tentatives. Veuillez réessayer plus tard.');
      return;
    }

    localStorage.setItem('tracking_attempts', (attempts + 1).toString());
    localStorage.setItem('tracking_last_attempt', Date.now().toString());

    // In a real app, we would verify the code exists on the server here.
    // For this demo, we'll just navigate to the tracking page.
    window.history.pushState({}, '', `/suivi/${trimmedCode}`);
    navigate('order-tracking', trimmedCode);
  };

  const handlePhoneFallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    const text = encodeURIComponent(`Bonjour, j'ai perdu mon code de commande. Mon numéro est le ${phone}. Pouvez-vous m'aider ?`);
    window.open(`https://wa.me/2290154972991?text=${text}`, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`border-b px-4 py-4 flex items-center justify-between shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <button onClick={() => {
          window.history.pushState({}, '', '/');
          navigate('home');
        }} className={`p-2 -ml-2 rounded-full ${isDark ? 'text-gray-400 hover:text-white active:bg-gray-800' : 'text-gray-500 hover:text-gray-900 active:bg-gray-100'}`}>
          <Home size={20} />
        </button>
        <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>SUIVI DE COMMANDE</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDataSaver(!dataSaver)}
            className={`p-2 rounded-full transition-colors ${dataSaver ? 'text-amber-500 bg-amber-500/10' : (isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}`}
            aria-label={dataSaver ? "Désactiver l'économie de données" : "Activer l'économie de données"}
            title={dataSaver ? "Économie activée" : "Économie désactivée"}
          >
            {dataSaver ? <Zap size={20} /> : <ZapOff size={20} />}
          </button>
          <div className="w-2"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className={`rounded-2xl p-6 shadow-sm border w-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
              <Search size={28} className="text-amber-500" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Où est ma commande ?</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Entrez votre code unique pour suivre l'état de votre livraison en temps réel.</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div>
              <label htmlFor="code" className={`block text-xs font-bold mb-1 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Code de commande</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="BEN-YYYYMMDD-XXXX"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono text-center text-lg tracking-wider ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
              />
            </div>
            
            {error && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${isDark ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50'}`}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm active:scale-[0.98]"
            >
              Suivre ma commande
            </button>
          </form>

          <div className={`mt-6 pt-6 border-t text-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <button 
              onClick={() => setShowPhoneFallback(!showPhoneFallback)}
              className={`text-sm underline underline-offset-4 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Code perdu ou oublié ?
            </button>

            {showPhoneFallback && (
              <form onSubmit={handlePhoneFallback} className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Entrez le numéro utilisé lors de la commande pour recevoir de l'aide via WhatsApp.</p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Numéro de téléphone"
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                  />
                  <button 
                    type="submit"
                    className="bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#128C7E] transition-colors active:scale-95"
                  >
                    <Phone size={16} /> Aide
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="w-full mt-4">
          <AdFrame type="banner" title="Nos Nouveautés" description="Découvrez nos nouvelles créations de la semaine !" />
        </div>
      </main>
    </div>
  );
};
