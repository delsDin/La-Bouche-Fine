import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import logo from '../data/boucheFine.png';

export const SignupPage = () => {
  const { navigate, goBack, networkStatus, theme, t } = useAppContext();
  const isDark = theme === 'dark';
  
  // Form state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptTracking, setAcceptTracking] = useState(true);
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    trackEvent('Signup_View', { Source_Channel: 'Direct' });
    
    const savedPhone = localStorage.getItem('signup_phone');
    if (savedPhone) setPhone(savedPhone);
    
    const savedTerms = localStorage.getItem('signup_terms');
    if (savedTerms) setAcceptTerms(savedTerms === 'true');
    
    const savedTracking = localStorage.getItem('signup_tracking');
    if (savedTracking) setAcceptTracking(savedTracking === 'true');
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('signup_phone', phone);
    localStorage.setItem('signup_terms', acceptTerms.toString());
    localStorage.setItem('signup_tracking', acceptTracking.toString());
  }, [phone, acceptTerms, acceptTracking]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      trackEvent('Signup_Start', {});
    }
    setter(e.target.value);
    setError(''); // Clear error on typing
  };

  const validatePhone = (p: string) => {
    // Format: 01 XX XX XX XX (10 digits starting with 01)
    const cleaned = p.replace(/\s+/g, '');
    return /^01\d{8}$/.test(cleaned);
  };

  const isFormValid = () => {
    return (
      phone.length === 10 &&
      phone.startsWith('01') &&
      password.length >= 6 &&
      password === confirmPassword &&
      acceptTerms
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      setError('Le numéro doit être au format 01 XX XX XX XX (10 chiffres).');
      trackEvent('Signup_Error', { Error_Code: 'invalid_phone' });
      return;
    }
    
    if (password.length < 6) {
      const msg = 'Le mot de passe doit contenir au moins 6 caractères.';
      setError(msg);
      window.alert(msg);
      trackEvent('Signup_Error', { Error_Code: 'password_too_short' });
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Les mots de passe ne correspondent pas.';
      setError(msg);
      window.alert(msg);
      trackEvent('Signup_Error', { Error_Code: 'password_mismatch' });
      return;
    }

    if (networkStatus === 'offline') {
      setError('Connexion interrompue. Vos données sont sauvegardées localement.');
      trackEvent('Signup_Error', { Error_Code: 'network_offline' });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      trackEvent('Signup_Complete', { 
        OptIn_Tracking: acceptTracking 
      });
      
      // Trigger lifecycle event
      trackEvent('Subscription_Lifecycle', { Event: 'Start_Date', Status: 'Free' });
      
      // Clear local storage
      localStorage.removeItem('signup_phone');
      localStorage.removeItem('signup_terms');
      localStorage.removeItem('signup_tracking');
      
      // Navigate to home
      navigate('home');
      
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      trackEvent('Signup_Error', { Error_Code: 'api_error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Zone 1: Header Minimaliste */}
      <header className={`sticky top-0 z-30 px-4 py-3 flex items-center border-b transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <button 
          onClick={() => goBack()}
          className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="Retour"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 flex items-center justify-center pr-8 gap-2">
          <img 
            src={logo} 
            alt="La Bouche Fine Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-xl text-amber-600 tracking-tight">La Bouche Fine</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        {/* Zone 2: Proposition de Valeur */}
        <div className="mb-8 text-center">
          <p className="text-amber-600 font-medium text-sm mb-2">Akwaba / Kuabo ! 👋</p>
          <h1 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('signup.title')}</h1>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('signup.subtitle')}
          </p>
        </div>

        {/* Zone 3 & 4: Formulaire & Consentement */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-5 mb-8">
            {/* Phone */}
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {t('login.phone')}
              </label>
              <div className="flex items-center">
                <div className={`border border-r-0 rounded-l-xl px-3 py-3.5 font-bold transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                  +229
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="01 XX XX XX XX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    setError('');
                  }}
                  className={`flex-1 px-4 py-3.5 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base pr-12 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {t('signup.confirm_password')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base pr-12 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 border rounded-xl flex items-start space-x-3 transition-colors duration-300 ${isDark ? 'bg-red-900/20 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className={`text-sm font-medium leading-tight ${isDark ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          {/* Zone 4: Conformité */}
          <div className="space-y-4 mb-8">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={`peer appearance-none w-5 h-5 border-2 rounded-md checked:bg-amber-600 checked:border-amber-600 transition-colors ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}
                  required
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={`text-sm leading-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                J'accepte les <button type="button" className="text-amber-600 font-medium underline">Conditions Générales</button> et la <button type="button" className="text-amber-600 font-medium underline">Politique de Confidentialité</button> (Loi Béninoise).
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTracking}
                  onChange={(e) => setAcceptTracking(e.target.checked)}
                  className={`peer appearance-none w-5 h-5 border-2 rounded-md checked:bg-amber-600 checked:border-amber-600 transition-colors ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={`text-sm leading-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                J'accepte que mes actions soient analysées pour améliorer le service.
              </span>
            </label>
          </div>

          {/* Zone 5: Actions Principales */}
          <div className="mt-auto space-y-4">
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center min-h-[56px] transition-all active:scale-[0.98] ${isFormValid() && !isLoading ? 'bg-amber-600 text-white active:bg-amber-700' : (isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-300 text-gray-500')}`}
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : networkStatus === 'offline' && error ? (
                "Réessayer"
              ) : (
                t('signup.submit')
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className={`flex-grow border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OU</span>
              <div className={`flex-grow border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}></div>
            </div>

            <button
              type="button"
              className="w-full bg-[#25D366] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 min-h-[56px] transition-all active:scale-[0.98]"
            >
              <MessageCircle size={24} className="fill-current" />
              <span>Continuer avec WhatsApp</span>
            </button>
          </div>
        </form>

        {/* Zone 6: Footer */}
        <footer className="mt-8 text-center">
          <button onClick={() => navigate('login')} className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
            {t('signup.already_account')} <span className="text-amber-600 underline">{t('login.submit')}</span>
          </button>
          <p className="text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} La Bouche Fine. Tous droits réservés.
          </p>
        </footer>
      </main>
    </div>
  );
};
