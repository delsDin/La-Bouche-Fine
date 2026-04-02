import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { PRODUCTS } from '../data/products';
import { DELIVERY_ZONES, CITIES } from '../data/locations';
import { Lock, CheckCircle2, MapPin, CreditCard, MessageCircle, ShieldCheck, WifiOff, ChevronRight, Bot } from 'lucide-react';
import { trackEvent } from '../lib/tracking';
import { OptimizedImage } from './OptimizedImage';
import { ProductCustomization, CustomizationData } from './ProductCustomization';
import { LocationPickerModal } from './LocationPickerModal';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export const CheckoutPage = () => {
  const { cartItems, navigate, goBack, networkStatus, dataSaver, clearCart, deliveryCity, deliveryNeighborhood, setDeliveryCity, setDeliveryNeighborhood, theme, t } = useAppContext();
  const isDark = theme === 'dark';
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    landmark: '',
    consent: false,
    coordinates: null as { lat: number; lng: number } | null
  });
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'whatsapp'>('direct');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [hasTrackedAddress, setHasTrackedAddress] = useState(false);
  const [customizations, setCustomizations] = useState<Record<string, CustomizationData>>({});

  const cartProducts = cartItems.map(item => ({
    ...item,
    product: PRODUCTS.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined);

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate dynamic delivery fee
  const deliveryFee = subtotal > 0 && DELIVERY_ZONES[deliveryCity] && DELIVERY_ZONES[deliveryCity][deliveryNeighborhood] 
    ? DELIVERY_ZONES[deliveryCity][deliveryNeighborhood] 
    : 0;
    
  const total = subtotal + deliveryFee;

  // Validation logic
  const isPhoneValid = formData.phone.replace(/\s/g, '').length >= 8;
  const isFormValid = formData.name.length > 2 && isPhoneValid && deliveryNeighborhood && formData.consent;

  useEffect(() => {
    trackEvent('Checkout_Started', { Cart_Value: total, Item_Count: cartItems.length });
    
    // Load saved address
    const savedAddress = localStorage.getItem('checkout_address');
    if (savedAddress) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedAddress), consent: false }));
      } catch (e) {}
    }
    
    // Load saved customizations
    const savedCustomizations = localStorage.getItem('checkout_customizations');
    if (savedCustomizations) {
      try {
        setCustomizations(JSON.parse(savedCustomizations));
      } catch (e) {}
    }
  }, []);

  // Save address on change
  useEffect(() => {
    const { consent, ...addressToSave } = formData;
    localStorage.setItem('checkout_address', JSON.stringify(addressToSave));
    
    if (isFormValid && !hasTrackedAddress) {
      trackEvent('Address_Filled', { City: deliveryCity });
      setHasTrackedAddress(true);
    }
  }, [formData, isFormValid, hasTrackedAddress, deliveryCity]);

  // Save customizations on change
  useEffect(() => {
    localStorage.setItem('checkout_customizations', JSON.stringify(customizations));
  }, [customizations]);

  const handleCustomizationChange = (productId: string, data: CustomizationData) => {
    setCustomizations(prev => ({ ...prev, [productId]: data }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const createOrder = (initialStatus: string = 'confirmed') => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderId = `BEN-${dateStr}-${randomSeq}`;

    const order = {
      id: orderId,
      status: initialStatus,
      date: date.toISOString(),
      total,
      deliveryFee,
      items: cartProducts.map(item => ({
        productId: item.productId,
        name: item.product!.name,
        quantity: item.quantity,
        price: item.price,
        customization: customizations[item.productId]
      })),
      delivery: {
        name: formData.name,
        phone: formData.phone,
        city: deliveryCity,
        neighborhood: deliveryNeighborhood,
        landmark: formData.landmark,
        coordinates: formData.coordinates
      },
      history: [{ status: initialStatus, timestamp: date.toISOString() }],
      whatsappOptIn: true
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));
    
    return orderId;
  };

  const handleDirectPayment = () => {
    if (!isFormValid) return;
    trackEvent('Payment_Method_Selected', { Method: 'Direct_MobileMoney' });
    setIsProcessing(true);
    setPaymentError(false);

    // Simulate API Call
    setTimeout(() => {
      if (networkStatus === 'offline' || Math.random() > 0.8) { // Simulate occasional network failure
        setIsProcessing(false);
        setPaymentError(true);
      } else {
        trackEvent('Payment_Success', { Method: 'Direct_MobileMoney', Total: total });
        const orderId = createOrder();
        clearCart();
        navigate('order-confirmation', orderId);
      }
    }, 2000);
  };

  const handleWhatsAppPayment = () => {
    if (!isFormValid) return;
    trackEvent('Payment_Method_Selected', { Method: 'WhatsApp_Agent' });
    
    const orderId = createOrder('pending');
    let message = `${t('checkout.whatsapp_message_start')} #${orderId}.\n\n`;
    message += `*${t('checkout.whatsapp_products')} :*\n`;
    cartProducts.forEach(item => {
      message += `- ${item.quantity}x ${item.product?.name}\n`;
      const custom = customizations[item.productId];
      if (custom && (custom.text || custom.color || custom.otherDetails || custom.referenceImage)) {
        if (custom.text) message += `  ✍️ ${t('custom.text_label').toUpperCase()} : "${custom.text}"\n`;
        if (custom.color) message += `  🎨 ${t('custom.color_label').toUpperCase()} : ${custom.color === 'Autre' ? custom.otherColor : custom.color}\n`;
        if (custom.otherDetails) message += `  📝 ${t('custom.details_label').toUpperCase()} : "${custom.otherDetails}"\n`;
        if (custom.referenceImage) {
          message += `  📷 ${t('custom.image_label').toUpperCase()} : ${custom.imageUploadStatus === 'success' ? t('custom.image_selected') : t('custom.image_uploading')}\n`;
        }
      }
    });
    message += `\n*${t('checkout.whatsapp_subtotal')} : ${subtotal.toLocaleString('fr-FR')} FCFA*\n`;
    message += `*${t('checkout.whatsapp_delivery')} : ${deliveryFee.toLocaleString('fr-FR')} FCFA*\n`;
    message += `*${t('checkout.whatsapp_total')} : ${total.toLocaleString('fr-FR')} FCFA*\n\n`;
    message += `*${t('checkout.whatsapp_delivery_to')} :*\n`;
    message += `${formData.name} (${formData.phone})\n`;
    message += `${deliveryCity}, ${deliveryNeighborhood}\n`;
    message += `${t('checkout.whatsapp_landmark')} : ${formData.landmark || 'N/A'}\n`;
    if (formData.coordinates) {
      message += `📍 ${t('checkout.whatsapp_gps')} : https://maps.google.com/?q=${formData.coordinates.lat},${formData.coordinates.lng}\n`;
    }
    message += `\n${t('checkout.whatsapp_guide')}`;

    const text = encodeURIComponent(message);
    window.open(`https://wa.me/2290154972991?text=${text}`, '_blank');
    
    // Assume success for WhatsApp handover
    setTimeout(() => {
      clearCart();
      navigate('order-confirmation', orderId);
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p className="mb-4">{t('cart.empty_desc')}</p>
        <button onClick={() => navigate('catalog')} className="text-amber-600 font-bold">{t('cart.view_catalog')}</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* A. En-tête Minimaliste */}
      <header className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-amber-600 flex items-center gap-2 cursor-pointer" onClick={() => goBack()}>
            <ChevronRight size={20} className={`rotate-180 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            Pâtis<span className={isDark ? 'text-white' : 'text-gray-900'}>Bénin</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
            <Lock size={12} /> {t('header.certified') || 'Sécurisé'}
          </div>
        </div>
        {/* Barre de progression */}
        <div className={`max-w-md mx-auto px-4 py-2 border-t flex items-center justify-between text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <span className="text-amber-600">1. {t('checkout.step_cart')}</span>
          <span>→</span>
          <span className="text-amber-600">2. {t('checkout.step_info')}</span>
          <span>→</span>
          <span className={isFormValid ? 'text-amber-600' : ''}>3. {t('checkout.step_payment')}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 flex flex-col gap-6">
        
        {networkStatus === 'offline' && (
          <div className={`border px-4 py-3 rounded-xl flex items-start gap-3 text-sm font-medium shadow-sm transition-colors duration-300 ${isDark ? 'bg-orange-900/20 border-orange-800 text-orange-400' : 'bg-orange-100 border-orange-200 text-orange-800'}`}>
            <WifiOff size={20} className="shrink-0 mt-0.5" />
            <p>{t('checkout.offline_notice')}</p>
          </div>
        )}

        {/* B. Récapitulatif (Lightweight) */}
        <section className={`rounded-2xl p-4 shadow-sm border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`font-bold mb-3 text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('checkout.summary')}</h2>
          <div className="flex flex-col gap-4 mb-4">
            {cartProducts.map(item => (
              <div key={item.productId} className={`flex flex-col border-b pb-4 last:border-0 last:pb-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {!dataSaver && (
                      <div className={`w-8 h-8 rounded shrink-0 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <OptimizedImage src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className={`truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.quantity}x {item.product!.name}</span>
                  </div>
                  <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>{(item.price * item.quantity).toLocaleString('fr-FR')} F</span>
                </div>
                
                {/* Section Personnalisation */}
                <ProductCustomization 
                  productId={item.productId}
                  productName={item.product!.name}
                  dataSaver={dataSaver}
                  networkStatus={networkStatus}
                  allowFullCustomization={item.product!.customizable}
                  data={customizations[item.productId] || {
                    text: '',
                    color: '',
                    otherColor: '',
                    otherDetails: '',
                    referenceImage: null,
                    imageUploadStatus: 'idle',
                    imageConsent: false
                  }}
                  onChange={(data) => handleCustomizationChange(item.productId, data)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder={t('checkout.promo_code')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
            <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isDark ? 'bg-amber-600 text-white active:bg-amber-700' : 'bg-gray-900 text-white active:bg-gray-800'}`}>{t('checkout.apply')}</button>
          </div>

          <div className={`border-t pt-3 flex justify-between items-center text-sm mb-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('checkout.delivery_fee')} ({deliveryCity} - {deliveryNeighborhood})</span>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className={`border-t pt-3 flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('checkout.total')}</span>
            <span className="text-xl font-extrabold text-amber-600">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> {t('checkout.saved_local')}</p>
        </section>

        {/* C. Informations de Livraison */}
        <section className={`rounded-2xl p-4 shadow-sm border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MapPin size={16} className="text-amber-600" /> {t('checkout.delivery')}
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1">{t('checkout.name_label')}</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder={t('checkout.name_placeholder')}
              />
              {formData.name.length > 2 && <CheckCircle2 size={18} className="absolute right-3 top-9 text-green-500" />}
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 mb-1">{t('checkout.phone_label')}</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder={t('checkout.phone_placeholder')}
              />
              {isPhoneValid && <CheckCircle2 size={18} className="absolute right-3 top-9 text-green-500" />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{t('checkout.city')}</label>
                <select 
                  value={deliveryCity} 
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setDeliveryCity(newCity);
                    setDeliveryNeighborhood(Object.keys(DELIVERY_ZONES[newCity])[0]);
                  }}
                  className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 appearance-none transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1">{t('checkout.neighborhood')}</label>
                <select 
                  value={deliveryNeighborhood} 
                  onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 appearance-none transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  {DELIVERY_ZONES[deliveryCity] && Object.keys(DELIVERY_ZONES[deliveryCity]).map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{t('checkout.landmark_label')}</label>
              <input 
                type="text" name="landmark" value={formData.landmark} onChange={handleInputChange}
                className={`w-full border rounded-xl px-4 py-3 min-h-[48px] outline-none focus:border-amber-500 transition-colors duration-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder={t('checkout.landmark_placeholder')}
              />
            </div>

            <button 
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="text-sm font-bold text-amber-600 flex items-center gap-1 py-2 active:opacity-70 w-max"
            >
              <MapPin size={16} /> {formData.coordinates ? t('checkout.map_change') : t('checkout.map_picker')}
            </button>
            {formData.coordinates && (
              <div className="mt-2">
                <div className="text-xs text-green-600 font-medium flex items-center gap-1 mb-2">
                  <CheckCircle2 size={14} /> {t('checkout.gps_saved')}
                </div>
                <div 
                  className={`rounded-xl overflow-hidden border h-32 relative cursor-pointer transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  onClick={() => setIsMapOpen(true)}
                >
                  <MapContainer 
                    key={`${formData.coordinates.lat}-${formData.coordinates.lng}`}
                    center={formData.coordinates} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={formData.coordinates} />
                  </MapContainer>
                  <div className="absolute inset-0 bg-black/5 z-[400] hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-700'}`}>
                      {t('checkout.map_tap')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <label className={`flex items-start gap-3 mt-4 p-3 rounded-xl border transition-colors duration-300 ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <input 
                type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className={`text-xs leading-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('checkout.consent_desc')}
              </span>
            </label>
          </div>
        </section>

        <LocationPickerModal 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          onConfirm={(coords) => setFormData(prev => ({ ...prev, coordinates: coords }))}
          initialLocation={formData.coordinates || undefined}
        />

        {/* D. Module de Paiement Hybride */}
        <section className={`transition-opacity duration-300 ${isFormValid ? 'opacity-100' : 'opacity-70'}`}>
          <h2 className={`font-bold mb-4 text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('checkout.payment')}</h2>
          
          {!isFormValid && (
            <div className={`border px-4 py-3 rounded-xl mb-4 text-sm font-medium transition-colors duration-300 ${isDark ? 'bg-amber-900/20 border-amber-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {t('checkout.fill_required')}
            </div>
          )}

          {paymentError && (
            <div className={`border px-4 py-3 rounded-xl mb-4 text-sm font-medium transition-colors duration-300 ${isDark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {t('checkout.payment_error')}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Option 1: Direct */}
            <div 
              className={`border-2 rounded-2xl p-4 transition-colors duration-300 ${paymentMethod === 'direct' ? (isDark ? 'border-amber-600 bg-gray-800' : 'border-gray-900 bg-white') : (isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50')}`}
              onClick={() => setPaymentMethod('direct')}
            >
              <div className="flex items-center gap-3 mb-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'direct' ? (isDark ? 'border-amber-600' : 'border-gray-900') : (isDark ? 'border-gray-600' : 'border-gray-300')}`}>
                  {paymentMethod === 'direct' && <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-amber-600' : 'bg-gray-900'}`} />}
                </div>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('checkout.direct_payment')}</span>
              </div>
              
              {paymentMethod === 'direct' && (
                <div className="pl-8 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-2">
                    <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">MTN</div>
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">MOOV</div>
                  </div>
                  <button 
                    onClick={handleDirectPayment}
                    disabled={!isFormValid || isProcessing || networkStatus === 'offline'}
                    className={`w-full rounded-xl font-bold text-base flex items-center justify-center gap-2 min-h-[56px] mt-2 transition-colors ${isProcessing || !isFormValid || networkStatus === 'offline' ? (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-500') : (isDark ? 'bg-amber-600 text-white active:bg-amber-700' : 'bg-gray-900 text-white active:bg-gray-800')}`}
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>{t('checkout.pay_now')} {total.toLocaleString('fr-FR')} FCFA</>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                    <ShieldCheck size={12} /> {t('checkout.secure_payment')}
                  </p>
                </div>
              )}
            </div>

            {/* Option 2: WhatsApp */}
            <div 
              className={`border-2 rounded-2xl p-4 transition-colors duration-300 ${paymentMethod === 'whatsapp' || paymentError ? (isDark ? 'border-[#25D366] bg-green-900/10' : 'border-[#25D366] bg-green-50') : (isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50')}`}
              onClick={() => setPaymentMethod('whatsapp')}
            >
              <div className="flex items-center gap-3 mb-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'whatsapp' || paymentError ? 'border-[#25D366]' : (isDark ? 'border-gray-600' : 'border-gray-300')}`}>
                  {(paymentMethod === 'whatsapp' || paymentError) && <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full" />}
                </div>
                <span className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('checkout.order_whatsapp')} <Bot size={16} className="text-[#25D366]" />
                </span>
              </div>
              
              {(paymentMethod === 'whatsapp' || paymentError) && (
                <div className="pl-8 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('checkout.whatsapp_agent_desc')}</p>
                  <button 
                    onClick={handleWhatsAppPayment}
                    disabled={!isFormValid}
                    className="w-full bg-[#25D366] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 min-h-[56px] shadow-md active:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <MessageCircle size={22} />
                    {t('checkout.finalize_whatsapp')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* E. Pied de Page de Confiance */}
      <footer className={`max-w-md mx-auto p-6 text-center border-t mt-8 transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
          <a href="#" className="underline">CGV</a>
          <a href="#" className="underline">{t('footer.privacy')}</a>
        </div>
        <a href="https://wa.me/2290154972991" target="_blank" rel="noreferrer" className="text-sm font-bold text-amber-600 flex items-center justify-center gap-1">
          <MessageCircle size={16} /> {t('checkout.support')}
        </a>
      </footer>
    </div>
  );
};
