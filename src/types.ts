export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  customization?: any;
}

export interface Order {
  id: string; // BEN-YYYYMMDD-XXXX
  status: 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  date: string;
  total: number;
  deliveryFee: number;
  items: OrderItem[];
  delivery: {
    name: string;
    phone: string;
    city: string;
    neighborhood: string;
    landmark: string;
    coordinates?: { lat: number; lng: number } | null;
  };
  history: { status: string; timestamp: string }[];
  whatsappOptIn: boolean;
}
