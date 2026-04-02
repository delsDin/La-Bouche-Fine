export const trackEvent = (eventType: string, attributes: Record<string, any>) => {
  const consent = localStorage.getItem('user_consent_analytics');
  if (consent === 'false' && eventType !== 'Consent_Update') {
    return;
  }
  
  console.log(`[Event Tracking] ${eventType}`, attributes);
  // En production, ceci ferait un appel API vers PostgreSQL
  // fetch('/api/track', { method: 'POST', body: JSON.stringify({ eventType, attributes }) });
};
