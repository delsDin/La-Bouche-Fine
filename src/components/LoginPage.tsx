import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun, MessageCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { trackEvent } from '../lib/tracking';
import logo from '../data/boucheFine.png';

export const LoginPage = () => {
  const { theme, setTheme, navigate, goBack, networkStatus, login, t } = useAppContext();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ identifier: boolean | null; password: boolean | null }>({
    identifier: null,
    password: null,
  });

  useEffect(() => {
    trackEvent('View_Login', { 
      Source_Channel: 'Organic', 
      Device_Type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop' 
    });
  }, []);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setIdentifier(value);
    // Real-time validation: 10 digits starting with 01
    const isPhone = /^01\d{8}$/.test(value);
    setValidation(prev => ({ ...prev, identifier: value.length > 0 ? isPhone : null }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setValidation(prev => ({ ...prev, password: value.length >= 6 }));
  };

  const handleInputClick = (fieldName: string) => {
    trackEvent('Click_Input', { Field_Name: fieldName });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Veuillez accepter la politique de confidentialité.");
      return;
    }

    if (!/^01\d{8}$/.test(identifier)) {
      setError("Le numéro doit être au format 01 XX XX XX XX.");
      return;
    }

    if (password.length < 6) {
      const msg = "Le mot de passe doit contenir au moins 6 caractères.";
      setError(msg);
      window.alert(msg);
      return;
    }

    trackEvent('Click_Login', { Timestamp: new Date().toISOString() });

    if (networkStatus === 'offline') {
      setError("Connexion requise. Vérifiez votre réseau.");
      trackEvent('Login_Fail', { Error_Code: 'Offline' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success/fail
      if (password === 'password123') {
        trackEvent('Login_Success', { User_ID: 'user_123', Subscription_Status: 'Free' });
        login('Élève', 'free');
        navigate('home');
      } else if (password === 'premium123') {
        trackEvent('Login_Success', { User_ID: 'user_456', Subscription_Status: 'Premium' });
        login('Élève Premium', 'premium');
        navigate('home');
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      trackEvent('Login_Fail', { Error_Code: 'Invalid_Credentials' });
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* A. Header */}
      <header className="h-[15vh] flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <button onClick={() => goBack()} className="p-2 -ml-2 rounded-full hover:bg-gray-100/10">
            <ArrowLeft size={24} />
          </button>
          <img 
            src={logo} 
            alt="La Bouche Fine Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">La Bouche Fine</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pâtisserie & Formation</p>
          </div>
        </div>
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-800 text-amber-400 hover:bg-gray-700' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* B. Zone de Formulaire */}
      <main className="flex-1 flex flex-col px-6 py-4 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('login.title')}</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Identifiant */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium px-1">{t('login.phone')}</label>
            <div className="flex items-center">
              <div className={`border-2 border-r-0 rounded-l-xl px-3 h-12 flex items-center font-bold ${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                +229
              </div>
              <input
                type="tel"
                inputMode="tel"
                value={identifier}
                onChange={handleIdentifierChange}
                onClick={() => handleInputClick('Identifier')}
                placeholder="01 XX XX XX XX"
                className={`flex-1 h-12 px-4 rounded-r-xl border-2 transition-all outline-none ${
                  isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'
                } ${validation.identifier === false ? 'border-red-500' : validation.identifier === true ? 'border-green-500' : ''}`}
              />
            </div>
          </div>

          {/* Mot de Passe */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium">{t('login.password')}</label>
              <button 
                type="button"
                className="text-xs text-amber-500 font-medium"
                onClick={() => window.open('https://wa.me/2290154972991?text=J%27ai%20oublié%20mon%20mot%20de%20passe', '_blank')}
              >
                {t('login.forgot')}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onClick={() => handleInputClick('Password')}
                placeholder="••••••••"
                className={`w-full h-12 px-4 pr-12 rounded-xl border-2 transition-all outline-none ${
                  isDark ? 'bg-gray-800 border-gray-700 focus:border-amber-500' : 'bg-white border-gray-200 focus:border-amber-500'
                } ${validation.password === false ? 'border-red-500' : validation.password === true ? 'border-green-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Consent Checkbox moved before CTA */}
          <label className="flex items-start space-x-3 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                trackEvent('Consent_Given', { Bool: e.target.checked });
              }}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className={`text-xs leading-tight ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              J'accepte la politique de confidentialité et le tracking analytique pour améliorer mon expérience.
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={!identifier || !password || isLoading || (networkStatus === 'offline')}
            className={`w-full h-12 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 ${
              !identifier || !password || isLoading || (networkStatus === 'offline')
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : t('login.submit')}
          </button>
        </form>

        {/* C. Alternatives */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className="text-xs font-bold text-gray-500">OU</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          <button
            onClick={() => window.open('https://wa.me/2290154972991', '_blank')}
            className={`w-full h-12 rounded-xl font-bold flex items-center justify-center space-x-2 border-2 transition-all active:scale-95 ${
              isDark ? 'border-gray-800 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageCircle size={20} className="text-green-500" />
            <span>Se connecter avec WhatsApp</span>
          </button>

          <p className="text-center text-sm">
            {t('login.no_account')}{' '}
            <button 
              onClick={() => navigate('signup')}
              className="text-amber-500 font-bold hover:underline"
            >
              {t('login.signup')}
            </button>
          </p>
        </div>
      </main>

      {/* D. Footer */}
      <footer className="h-[10vh] px-6 flex flex-col justify-center space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>Mentions Légales</button>
            <button className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>Confidentialité</button>
          </div>
          <span className={`text-[10px] font-bold ${isDark ? 'text-gray-800' : 'text-gray-300'}`}>v2.0</span>
        </div>
      </footer>
    </div>
  );
};
