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
import { CustomOrderAssistantPage } from './components/CustomOrderAssistantPage';

const MainContent = () => {
  const { currentPage } = useAppContext();
  
  if (currentPage === 'custom-order-assistant') {
    return <CustomOrderAssistantPage />;
  }

  if (currentPage === 'ai-agent') {
    return <AIAgentPage />;
  }

  if (currentPage === 'login') {
    return <LoginPage />;
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
      <WhatsAppFAB />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { theme, currentPage } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-amber-200 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <main>
        <MainContent />
      </main>
      {currentPage !== 'ai-agent' && currentPage !== 'custom-order-assistant' && <BottomNav />}
    </div>
  );
}
