import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@ecommerce_onboarding_completed';
const RECENT_SEARCHES_KEY = '@ecommerce_recent_searches';

interface SettingsState {
  hasCompletedOnboarding: boolean;
  recentSearches: string[];
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  addRecentSearch: (term: string) => Promise<void>;
  removeRecentSearch: (term: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  hasCompletedOnboarding: false,
  recentSearches: ['Oversized Tee', 'Leggings', 'Hoodie', 'Gym Shorts'],
  isLoaded: false,

  loadSettings: async () => {
    try {
      const [onboardedVal, searchesVal] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(RECENT_SEARCHES_KEY),
      ]);

      set({
        hasCompletedOnboarding: onboardedVal === 'true',
        recentSearches: searchesVal ? JSON.parse(searchesVal) : get().recentSearches,
        isLoaded: true,
      });
    } catch (e) {
      console.error('Failed to load settings:', e);
      set({ isLoaded: true });
    }
  },

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to set onboarding state:', e);
    }
  },

  resetOnboarding: async () => {
    set({ hasCompletedOnboarding: false });
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (e) {
      console.error('Failed to reset onboarding:', e);
    }
  },

  addRecentSearch: async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const { recentSearches } = get();
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 10);
    set({ recentSearches: updated });
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save search:', e);
    }
  },

  removeRecentSearch: async (term: string) => {
    const { recentSearches } = get();
    const updated = recentSearches.filter((s) => s !== term);
    set({ recentSearches: updated });
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete search:', e);
    }
  },

  clearRecentSearches: async () => {
    set({ recentSearches: [] });
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error('Failed to clear searches:', e);
    }
  },
}));

