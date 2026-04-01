export const DELIVERY_ZONES: Record<string, Record<string, number>> = {
  'Cotonou': {
    'Haie Vive': 1000,
    'Cadjehoun': 1000,
    'Fidjrossè': 1500,
    'Agla': 1500,
    'Akpakpa': 2000,
    'Sainte Rita': 1000,
    'Gbégamey': 1000,
    'Zongo': 1000,
    'Maroc': 1500,
    'Védoko': 1500,
    'Etoile Rouge': 1000,
  },
  'Abomey-Calavi': {
    'Godomey': 1500,
    'Togoudo': 2000,
    'Zoca': 2500,
    'Arsat': 2500,
    'Bidossessi': 2000,
    'Kpota': 2500,
    'Ouèdo': 3000,
  },
  'Porto-Novo': {
    'Ouando': 3000,
    'Catchi': 3000,
    'Djewé': 3000,
    'Tokpota': 3500,
  }
};

export const CITIES = Object.keys(DELIVERY_ZONES);
