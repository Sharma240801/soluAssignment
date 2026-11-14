import { StoreConfig } from '../../types';
import { URBANFIT_CATEGORIES } from '../../data/collections/categories';

export const URBANFIT_CONFIG: StoreConfig = {
  id: 'urbanfit',
  name: 'UrbanFit',
  tagline: 'EFFORTLESS ATHLEISURE & STREETWEAR',
  logoText: 'URBANFIT',
  logoSubtext: 'STUDIO & STREET',
  currency: 'INR',
  currencySymbol: '₹',
  theme: {
    primary: '#E8DCCB', // Warm Beige
    secondary: '#FFFFFF',
    accent: '#D96C91', // Chic Dusty Rose Pink
    background: '#FAF6F0', // Soft creamy canvas
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#222222',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E8DFD5',
    divider: '#F0ECE4',
    error: '#D32F2F',
    success: '#2E7D32',
    star: '#F59E0B',
    badgeBackground: '#D96C91',
    badgeText: '#FFFFFF',
  },
  features: {
    reviews: false,
    loyalty: true, // Store B optional feature enabled!
    wishlist: true,
    sizeGuide: true,
    relatedProducts: true,
  },
  loyalty: {
    programName: 'Urban Club Rewards',
    pointsRate: 1, // 1 point per 10 INR
    welcomePoints: 200,
    tiers: [
      { name: 'Silver Member', pointsRequired: 0, perks: ['5% back in points', 'Early access to sales'] },
      { name: 'Gold VIP', pointsRequired: 1000, perks: ['10% back in points', 'Free express shipping', 'Exclusive drops'] },
      { name: 'Platinum Elite', pointsRequired: 2500, perks: ['15% back in points', 'Personal stylist advice', 'Birthday gift'] },
    ],
  },
  banners: [
    {
      id: 'uf-banner-1',
      title: 'THE SERENE COLLECTION',
      subtitle: 'Buttery soft lounge sets made for studio, street & stillness.',
      ctaText: 'DISCOVER SERENE',
      imageUrl: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=1200&q=80',
      categorySlug: 'women',
      accentBadge: 'NEW RELEASE',
    },
    {
      id: 'uf-banner-2',
      title: 'DOWNTOWN RELAXED',
      subtitle: 'Heavyweight organic cottons cut in loose minimalist profiles.',
      ctaText: 'SHOP STREETWEAR',
      imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80',
      categorySlug: 'men',
      accentBadge: 'STUDIO EDIT',
    },
  ],
  categories: URBANFIT_CATEGORIES,
  supportEmail: 'hello@urbanfit.co',
  shippingThreshold: 1499, // Free shipping on orders over ₹1,499
  standardShippingFee: 99,
};

