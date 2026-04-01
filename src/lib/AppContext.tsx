import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from './tracking';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'order-tracking' | 'public-tracking' | 'courses' | 'signup' | 'dashboard' | 'login';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface AppContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, price: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  dataSaver: boolean;
  setDataSaver: (val: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  networkStatus: 'online' | 'offline' | 'slow';
  currentPage: Page;
  currentProductId: string | null;
  currentOrderId: string | null;
  navigate: (page: Page, id?: string) => void;
  deliveryCity: string;
  setDeliveryCity: (city: string) => void;
  deliveryNeighborhood: string;
  setDeliveryNeighborhood: (neighborhood: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [dataSaver, setDataSaver] = useState(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>('light');
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [deliveryCity, setDeliveryCityState] = useState<string>('Cotonou');
  const [deliveryNeighborhood, setDeliveryNeighborhoodState] = useState<string>('Haie Vive');

  const setDeliveryCity = (city: string) => {
    setDeliveryCityState(city);
    localStorage.setItem('deliveryCity', city);
  };

  const setDeliveryNeighborhood = (neighborhood: string) => {
    setDeliveryNeighborhoodState(neighborhood);
    localStorage.setItem('deliveryNeighborhood', neighborhood);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Parse URL for public tracking
    const path = window.location.pathname;
    if (path.startsWith('/suivi/')) {
      const id = path.split('/suivi/')[1];
      if (id) {
        setCurrentPage('order-tracking');
        setCurrentOrderId(id);
      }
    } else if (path === '/suivi') {
      setCurrentPage('public-tracking');
    }

    // Restauration du cache local
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur de parsing du panier", e);
      }
    }

    const savedDataSaver = localStorage.getItem('dataSaver');
    if (savedDataSaver) setDataSaver(savedDataSaver === 'true');

    const savedCity = localStorage.getItem('deliveryCity');
    if (savedCity) setDeliveryCityState(savedCity);

    const savedNeighborhood = localStorage.getItem('deliveryNeighborhood');
    if (savedNeighborhood) setDeliveryNeighborhoodState(savedNeighborhood);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setThemeState(savedTheme);

    // Gestion du statut réseau
    const updateStatus = () => {
      if (!navigator.onLine) {
        setNetworkStatus('offline');
        return;
      }
      const conn = (navigator as any).connection;
      if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
        setNetworkStatus('slow');
      } else {
        setNetworkStatus('online');
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateStatus);
    }
    updateStatus();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  // Tracking de la vue de page à chaque changement
  useEffect(() => {
    trackEvent('Page_View', {
      Source_Channel: 'Direct',
      Connection_Type: (navigator as any).connection?.effectiveType || 'unknown',
      Page: currentPage,
      Product_ID: currentProductId
    });
  }, [currentPage, currentProductId]);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart_items', JSON.stringify(items));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const addToCart = (productId: string, price: number) => {
    const existingItem = cartItems.find(item => item.productId === productId);
    let newItems;
    if (existingItem) {
      newItems = cartItems.map(item => 
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...cartItems, { productId, quantity: 1, price }];
    }
    
    saveCart(newItems);
    
    // Feedback Haptique
    if (navigator.vibrate) navigator.vibrate(50);
    
    trackEvent('AddToCart', { Product_ID: productId, Price: price });

    if (!navigator.onLine) {
      trackEvent('Offline_Action_Queued', { Action: 'AddToCart', Product_ID: productId });
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newItems = cartItems.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCart(newItems);
    trackEvent('UpdateQuantity', { Product_ID: productId, Delta: delta });
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter(item => item.productId !== productId);
    saveCart(newItems);
    trackEvent('RemoveFromCart', { Product_ID: productId });
  };

  const clearCart = () => {
    saveCart([]);
    trackEvent('ClearCart', {});
  };

  const toggleDataSaver = (val: boolean) => {
    setDataSaver(val);
    localStorage.setItem('dataSaver', val.toString());
  };

  const handleNavigate = (page: Page, id?: string) => {
    setCurrentPage(page);
    if (page === 'product' && id) {
      setCurrentProductId(id);
    } else if ((page === 'order-confirmation' || page === 'order-tracking') && id) {
      setCurrentOrderId(id);
    } else {
      if (page !== 'product') setCurrentProductId(null);
      if (page !== 'order-confirmation' && page !== 'order-tracking') setCurrentOrderId(null);
    }
  };

  return (
    <AppContext.Provider value={{ 
      cartItems, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, 
      dataSaver, setDataSaver: toggleDataSaver, theme, setTheme, networkStatus, 
      currentPage, currentProductId, currentOrderId, navigate: handleNavigate,
      deliveryCity, setDeliveryCity, deliveryNeighborhood, setDeliveryNeighborhood
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
