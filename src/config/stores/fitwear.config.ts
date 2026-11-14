import { StoreConfig } from '../../types';
import { FITWEAR_CATEGORIES } from '../../data/collections/categories';

export const FITWEAR_CONFIG: StoreConfig = {
  id: 'fitwear',
  name: 'FitWear',
  tagline: 'TRAIN HARD. LIVE STRONG.',
  logoText: 'FITWEAR',
  logoSubtext: 'PERFORMANCE ATHLETICS',
  currency: 'INR',
  currencySymbol: '₹',
  theme: {
    primary: '#111111',
    secondary: '#FFFFFF',
    accent: '#D6FF00', // Gymshark signature electric volt lime
    background: '#0B0B0B',
    surface: '#181818',
    card: '#202020',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#666666',
    border: '#2C2C2C',
    divider: '#1F1F1F',
    error: '#FF4444',
    success: '#00E676',
    star: '#FFD700',
    badgeBackground: '#D6FF00',
    badgeText: '#111111',
  },
  features: {
    reviews: true, // Store A optional feature enabled!
    loyalty: false,
    wishlist: true,
    sizeGuide: true,
    relatedProducts: true,
  },
  banners: [
    {
      id: 'fw-banner-1',
      title: 'APEX DROP 2026',
      subtitle: 'Engineered for ruthless gym sessions and maximal PRs.',
      ctaText: 'EXPLORE APEX',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      categorySlug: 'men',
      accentBadge: 'NEW SEASON',
    },
    {
      id: 'fw-banner-2',
      title: 'SCULPT & SEAMLESS',
      subtitle: 'Zero distraction, 100% squat-proof compression sets.',
      ctaText: 'SHOP WOMEN',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      categorySlug: 'women',
      accentBadge: 'POPULAR',
    },
  ],
  categories: FITWEAR_CATEGORIES,
  supportEmail: 'support@fitwear.com',
  shippingThreshold: 1999, // Free shipping on orders over ₹1,999
  standardShippingFee: 149,
};

