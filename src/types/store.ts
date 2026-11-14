import { Category } from './product';

export interface StoreTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  error: string;
  success: string;
  star: string;
  badgeBackground: string;
  badgeText: string;
}

export interface StoreFeatures {
  reviews: boolean;
  loyalty: boolean;
  wishlist: boolean;
  sizeGuide: boolean;
  relatedProducts: boolean;
}

export interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  categorySlug?: string;
  accentBadge?: string;
}

export interface LoyaltyTier {
  name: string;
  pointsRequired: number;
  perks: string[];
}

export interface StoreLoyaltyConfig {
  programName: string;
  pointsRate: number; // e.g. 1 point per 10 INR spent
  welcomePoints: number;
  tiers: LoyaltyTier[];
}

export type StoreId = 'fitwear' | 'urbanfit';

export interface StoreConfig {
  id: StoreId;
  name: string;
  tagline: string;
  logoText: string;
  logoSubtext: string;
  currency: string;
  currencySymbol: string;
  theme: StoreTheme;
  features: StoreFeatures;
  banners: StoreBanner[];
  categories: Category[];
  loyalty?: StoreLoyaltyConfig;
  supportEmail: string;
  shippingThreshold: number; // free shipping above this amount
  standardShippingFee: number;
}

