import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useStoreConfigStore,
  useCartStore,
  useWishlistStore,
  useSettingsStore,
} from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LoadingSpinner } from './src/components/common/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const initializeStore = useStoreConfigStore((s) => s.initializeStore);
  const activeStoreId = useStoreConfigStore((s) => s.activeStoreId);
  const config = useStoreConfigStore((s) => s.config);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          initializeStore(),
          loadSettings(),
        ]);
        await Promise.all([
          loadCart(activeStoreId),
          loadWishlist(activeStoreId),
        ]);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.splash, { backgroundColor: '#0B0B0B' }]}>
        <LoadingSpinner size="large" message="Loading Gymwear Experience..." />
      </View>
    );
  }

  const isDark = config.id === 'fitwear';

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
