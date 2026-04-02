/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './lib/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BestSellers } from './components/BestSellers';
import { LMSSection } from './components/LMSSection';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { Footer } from './components/Footer';
import { Catalog } from './components/Catalog';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { BottomNav } from './components/BottomNav';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { PublicTrackingPage } from './components/PublicTrackingPage';
import { CoursesPage } from './components/CoursesPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { AdFrame } from './components/AdFrame';
import { AIAgentPage } from './components/AIAgentPage';
import { AITutorPage } from './components/AITutorPage';
import { CustomOrderAssistantPage } from './components/CustomOrderAssistantPage';
import { DashboardPage } from './components/DashboardPage';
import { CoursePlayerPage } from './components/CoursePlayerPage';
import { QuizPage } from './components/QuizPage';
import { ReadingPage } from './components/ReadingPage';
import { OfflinePackPage } from './components/OfflinePack/OfflinePackPage';
import { ProfilePage } from './components/ProfilePage';
import { EditProfilePage } from './components/EditProfilePage';
import { ChangePhonePage } from './components/ChangePhonePage';
import { ChangePasswordPage } from './components/ChangePasswordPage';
import { InProgressCoursesPage } from './components/InProgressCoursesPage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { LegalPage } from './components/LegalPage';
import { NotFoundPage } from './components/NotFoundPage';
import { motion } from 'motion/react';

const MainContent = () => {
  const { currentPage, theme, navigate } = useAppContext();
  const isDark = theme === 'dark';
  
  if (currentPage === 'custom-order-assistant') {
    return <CustomOrderAssistantPage />;
  }

  if (currentPage === 'ai-agent') {
    return <AIAgentPage />;
  }

  if (currentPage === 'ai-tutor') {
    return <AITutorPage />;
  }

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (currentPage === 'home' || currentPage === 'dashboard') {
    return <DashboardPage />;
  }

  if (currentPage === 'accueil') {
    return (
      <>
        <Header />
        <Hero />
        <div className="px-4 max-w-md mx-auto">
          <AdFrame type="banner" />
        </div>
        <BestSellers />
        <div className="px-4 max-w-md mx-auto">
          <AdFrame type="banner" title="Livraison Express" description="Commandez avant 10h et soyez livré le jour même !" imageUrl="https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&q=80&w=600" />
        </div>
        <LMSSection />
        <Footer />
      </>
    );
  }

  if (currentPage === 'signup') {
    return <SignupPage />;
  }

  if (currentPage === 'checkout') {
    return <CheckoutPage />;
  }

  if (currentPage === 'order-confirmation') {
    return <OrderConfirmationPage />;
  }

  if (currentPage === 'order-tracking') {
    return <OrderTrackingPage />;
  }

  if (currentPage === 'public-tracking') {
    return <PublicTrackingPage />;
  }

  if (currentPage === 'cart') {
    return <CartPage />;
  }

  if (currentPage === 'product') {
    return <ProductPage />;
  }
  
  if (currentPage === 'catalog') {
    return (
      <>
        <Header />
        <div className="px-4 max-w-md mx-auto">
          <AdFrame type="banner" title="Formation Pâtisserie" description="Apprenez à faire vos propres gâteaux avec nos cours en ligne !" />
        </div>
        <Catalog />
      </>
    );
  }

  if (currentPage === 'courses') {
    return <CoursesPage />;
  }

  if (currentPage === 'course-player') {
    return <CoursePlayerPage />;
  }

  if (currentPage === 'quiz') {
    return <QuizPage />;
  }

  if (currentPage === 'reading') {
    return <ReadingPage />;
  }

  if (currentPage === 'offline-pack') {
    return <OfflinePackPage />;
  }

  if (currentPage === 'profile') {
    return <ProfilePage />;
  }

  if (currentPage === 'edit-profile') {
    return <EditProfilePage />;
  }

  if (currentPage === 'change-phone') {
    return <ChangePhonePage />;
  }

  if (currentPage === 'change-password') {
    return <ChangePasswordPage />;
  }

  if (currentPage === 'in-progress-courses') {
    return <InProgressCoursesPage />;
  }

  if (currentPage === 'subscription') {
    return <SubscriptionPage />;
  }

  if (currentPage === 'legal') {
    return <LegalPage />;
  }

  if (currentPage === 'not-found') {
    return <NotFoundPage />;
  }
  
  return <NotFoundPage />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { theme, currentPage, networkStatus } = useAppContext();
  const isDark = theme === 'dark';
  const [showOnlineBanner, setShowOnlineBanner] = React.useState(false);

  React.useEffect(() => {
    if (networkStatus === 'online') {
      setShowOnlineBanner(true);
      const timer = setTimeout(() => setShowOnlineBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [networkStatus]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-amber-200 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {showOnlineBanner && (
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-green-500 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center shadow-lg"
        >
          Connexion rétablie
        </motion.div>
      )}
      <main>
        <MainContent />
      </main>
      {currentPage !== 'ai-agent' && currentPage !== 'ai-tutor' && currentPage !== 'custom-order-assistant' && currentPage !== 'course-player' && currentPage !== 'quiz' && currentPage !== 'reading' && currentPage !== 'offline-pack' && currentPage !== 'edit-profile' && currentPage !== 'change-phone' && currentPage !== 'change-password' && currentPage !== 'in-progress-courses' && currentPage !== 'subscription' && currentPage !== 'legal' && currentPage !== 'not-found' && currentPage !== 'login' && currentPage !== 'signup' && (
        <>
          <BottomNav />
          <WhatsAppFAB />
        </>
      )}
    </div>
  );
}
