import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { motion } from 'motion/react';

export const LegalPage = () => {
  const { theme, navigate, goBack, consentAnalytics, setConsentAnalytics } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* 1. En-tête (Header) — Sticky, 60px */}
      <header className={`sticky top-0 z-50 h-[60px] flex items-center px-2 border-b shadow-sm transition-colors ${isDark ? 'bg-gray-900/80 border-gray-800 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
        <button 
          onClick={() => goBack()} 
          className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          aria-label="Retour"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-base font-bold ml-2">Mentions Légales & Confidentialité</h1>
      </header>

      {/* 2. Corps de Page — Scroll vertical, contenu léger */}
      <main className="p-4 max-w-2xl mx-auto space-y-8 text-sm leading-relaxed">
        
        {/* Bloc 1 : Informations Éditeur */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">1. Éditeur de la plateforme</h2>
          <ul className="space-y-2 list-none">
            <li><strong>Dénomination sociale :</strong> La Bouche Fine Sarl</li>
            <li><strong>Siège social :</strong> Quartier Haie Vive, Cotonou, Bénin</li>
            <li><strong>RCCM :</strong> RB/COT/2024-B-1234</li>
            <li><strong>Contact :</strong> 
              <div className="mt-1 flex flex-col gap-1">
                <a href="tel:+22900000000" className="text-amber-600 font-medium">📞 +229 00 00 00 00</a>
                <a href="mailto:contact@labouchefine.bj" className="text-amber-600 font-medium">✉️ contact@labouchefine.bj</a>
              </div>
            </li>
          </ul>
        </section>

        {/* Bloc 2 : Hébergement & Infrastructure */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">2. Hébergement technique</h2>
          <p>
            La plateforme est hébergée par <strong>Cloudflare & Google Cloud</strong>, 
            avec des points de présence en Afrique de l'Ouest pour optimiser la latence.
          </p>
          <p className="italic opacity-70">Infrastructure : Docker sur Ubuntu Linux, base de données PostgreSQL.</p>
        </section>

        {/* Bloc 3 : Protection des Données (RGPD / Loi Béninoise) */}
        <section className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-amber-50/50 border-amber-100'} space-y-4`}>
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">3. Protection des données personnelles</h2>
          
          <div className="space-y-2">
            <h3 className="font-bold">3.1 Données collectées</h3>
            <ul className="space-y-1 list-none">
              <li>✅ <strong>Identité :</strong> Nom, prénom, email, téléphone (pour commandes & comptes)</li>
              <li>✅ <strong>Navigation :</strong> Pages vues, clics, durée de session (via Event_Tracking)</li>
              <li>✅ <strong>Paiement :</strong> Token sécurisé via FedaPay/Kkiapay (aucune donnée bancaire stockée)</li>
              <li>✅ <strong>Contenu utilisateur :</strong> Photos de réalisations (quiz LMS), messages à l'IA Tuteur</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">3.2 Finalités & Base légale</h3>
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={isDark ? 'bg-gray-700' : 'bg-amber-100'}>
                    <th className="border border-gray-400 p-2 text-left">Finalité</th>
                    <th className="border border-gray-400 p-2 text-left">Base légale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-2">Exécution des commandes</td>
                    <td className="border border-gray-400 p-2">Contrat (CGV)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2">Amélioration de l'IA (Logs)</td>
                    <td className="border border-gray-400 p-2">Intérêt légitime + Consentement</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2">Analytics & KPIs (LTV/CAC)</td>
                    <td className="border border-gray-400 p-2">Consentement explicite (toggle)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-bold">3.3 Gestion du consentement</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/10">
              <span className="flex-1 pr-4">J'accepte le tracking analytique pour améliorer l'expérience</span>
              <button 
                onClick={() => setConsentAnalytics(!consentAnalytics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${consentAnalytics ? 'bg-amber-500' : 'bg-gray-400'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${consentAnalytics ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-[10px] opacity-60 italic">Vous pouvez modifier ce choix à tout moment sur cette page ou dans votre profil.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">3.4 Droits des utilisateurs</h3>
            <p>
              Conformément à la loi béninoise n°2017-20, vous disposez d'un droit d'accès, de rectification 
              et de suppression de vos données. Pour l'exercer : 
              <a href="mailto:dpo@labouchefine.bj" className="text-amber-600 font-medium ml-1 underline">dpo@labouchefine.bj</a>
            </p>
          </div>
        </section>

        {/* Bloc 4 : Propriété Intellectuelle & Contenu IA */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">4. Propriété intellectuelle & IA</h2>
          <ul className="space-y-2 list-none">
            <li>📚 <strong>Contenus pédagogiques :</strong> Tous les cours, vidéos et recettes sont protégés par le droit d'auteur. Usage strictement personnel.</li>
            <li>🤖 <strong>Agent IA (Vente/Tuteur) :</strong> 
              <ul className="mt-1 ml-4 list-disc space-y-1 opacity-80">
                <li>Les conversations sont journalisées pour audit et amélioration technique.</li>
                <li>L'IA peut générer des réponses imparfaites : une validation humaine est recommandée pour les conseils critiques.</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Bloc 5 : Cookies & Technologies Similaires */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">5. Cookies & stockage local</h2>
          <p className="font-bold text-amber-600">PWA & Mode Hors-ligne :</p>
          <ul className="space-y-2 list-none">
            <li>🗄️ <strong>LocalStorage :</strong> Sauvegarde du panier et progression des cours (essentiel au fonctionnement sans réseau).</li>
            <li>🍪 <strong>Cookies analytiques :</strong> Google Analytics / Matomo (soumis à votre consentement ci-dessus).</li>
            <li>🔐 <strong>Session Auth :</strong> Token JWT sécurisé pour maintenir votre connexion (durée : 24h).</li>
          </ul>
        </section>

        {/* Bloc 6 : Limitation de Responsabilité & Réseau */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold border-l-4 border-amber-500 pl-3">6. Résilience réseau & limitations</h2>
          <p>
            La plateforme est optimisée pour les connexions 3G/Edge au Bénin. 
            En cas de connexion instable :
          </p>
          <ul className="space-y-2 list-none">
            <li>🔄 Le panier est sauvegardé localement (pas de perte de données).</li>
            <li>📥 Les vidéos peuvent être téléchargées par blocs pour lecture hors-ligne.</li>
            <li>⚠️ Certaines fonctionnalités IA peuvent être limitées sans connexion active.</li>
          </ul>
        </section>

        {/* Bloc 7 : Mise à Jour & Contact */}
        <section className="space-y-4 pt-4">
          <div className="text-xs opacity-60">
            <p><strong>Dernière mise à jour :</strong> <time dateTime="2026-03-30">30 Mars 2026</time></p>
            <p className="mt-1">Nous nous réservons le droit de modifier ces mentions. Toute modification importante sera notifiée via l'application.</p>
          </div>
          
          <div className={`p-5 rounded-2xl border text-center space-y-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-bold">Une question ?</h3>
            <a 
              href="https://wa.me/22900000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              <MessageCircle size={20} />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* 3. Pied de Page (Footer) — Minimaliste */}
      <footer className={`mt-8 p-8 border-t text-center space-y-4 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
        <div className="text-xs opacity-60 space-y-1">
          <p>📍 Cotonou, Bénin</p>
          <div className="flex justify-center space-x-4 font-bold text-amber-600">
            <button onClick={() => navigate('accueil')}>Accueil</button>
            <span>|</span>
            <button onClick={() => navigate('catalog')}>Boutique</button>
          </div>
          <p className="pt-2">© 2026 La Bouche Fine — v4.0 (PWA)</p>
        </div>
      </footer>
    </div>
  );
};
