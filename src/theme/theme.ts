import { StoreTheme } from '../types';

export const typography = {
  fontFamilies: {
    heading: 'System',
    body: 'System',
  },
  sizes: {
    hero: 32,
    h1: 26,
    h2: 22,
    h3: 18,
    bodyLarge: 16,
    body: 14,
    caption: 12,
    tiny: 10,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '900' as const,
  },
  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 1.2,
    extraWide: 2.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export interface AppTheme {
  colors: StoreTheme;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  isDark: boolean;
}

