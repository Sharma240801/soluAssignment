import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useSettingsStore } from '../store';
import { WelcomeScreen } from '../screens/Welcome/WelcomeScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { CollectionScreen } from '../screens/Collections/CollectionScreen';
import { ProductDetailsScreen } from '../screens/ProductDetails/ProductDetailsScreen';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { CartScreen } from '../screens/Cart/CartScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);

  return (
    <Stack.Navigator
      initialRouteName={hasCompletedOnboarding ? 'MainTabs' : 'Welcome'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ProductList" component={CollectionScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

