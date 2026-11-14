import { NavigatorScreenParams } from '@react-navigation/native';
import { ProductFilterOptions } from './product';

export type MainTabParamList = {
  HomeTab: undefined;
  CollectionsTab: { category?: string; title?: string } | undefined;
  WishlistTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductList: {
    category?: string;
    title?: string;
    filter?: ProductFilterOptions;
  };
  ProductDetails: {
    productId: string;
    productHandle?: string;
    title?: string;
  };
  Search: undefined;
  Cart: undefined;
};

