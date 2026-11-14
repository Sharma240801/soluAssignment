import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList, Product, Category } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore } from '../../store';
import { ProductService } from '../../services';
import { Header } from '../../components/common/Header';
import { PromoBanner } from '../../components/home/PromoBanner';
import { CategoryList } from '../../components/home/CategoryList';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { LoyaltyBanner } from '../../components/home/LoyaltyBanner';
import { Toast } from '../../components/common/Toast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const HomeScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch product sections using TanStack Query
  const {
    data: allProducts = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products', config.id],
    queryFn: () => ProductService.getProducts(config.id),
  });

  const featuredProducts = allProducts.filter((p) => p.isFeatured);
  const newArrivals = allProducts.filter((p) => p.isNewArrival || p.isFeatured);
  const bestSellers = allProducts.filter((p) => p.isBestSeller);

  const handleSelectCategory = (category: Category) => {
    navigation.navigate('ProductList', {
      category: category.slug,
      title: `${category.name} Collection`,
    });
  };

  const handleBannerPress = (bannerSlug?: string) => {
    navigation.navigate('ProductList', {
      category: bannerSlug || 'all',
      title: 'Trending Collection',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Main Header with Logo, Search, Cart & Profile */}
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {isLoading ? (
        <LoadingSpinner fullScreen message="Loading catalog..." />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        >
          {/* Main Hero Promotional Banner */}
          {config.banners[0] && (
            <View style={styles.bannerWrapper}>
              <PromoBanner
                banner={config.banners[0]}
                onPress={() => handleBannerPress(config.banners[0].categorySlug)}
              />
            </View>
          )}

          {/* Categories Horizontal Carousel */}
          <CategoryList
            categories={config.categories}
            onSelectCategory={handleSelectCategory}
          />

          {/* Featured Products Section */}
          <FeaturedSection
            title="FEATURED GEAR"
            subtitle="Core essentials for optimal performance"
            products={featuredProducts}
            onViewAll={() =>
              navigation.navigate('ProductList', {
                title: 'Featured Collection',
              })
            }
            onWishlistToggled={(added) =>
              setToastMessage(added ? 'Added to Wishlist' : 'Removed from Wishlist')
            }
          />

          {/* Secondary Store Banner */}
          {config.banners[1] && (
            <View style={styles.bannerWrapper}>
              <PromoBanner
                banner={config.banners[1]}
                onPress={() => handleBannerPress(config.banners[1].categorySlug)}
              />
            </View>
          )}

          {/* New Arrivals Section */}
          <FeaturedSection
            title="NEW ARRIVALS"
            subtitle="Fresh drops straight from design labs"
            products={newArrivals}
            onViewAll={() =>
              navigation.navigate('ProductList', {
                title: 'New Arrivals',
              })
            }
            onWishlistToggled={(added) =>
              setToastMessage(added ? 'Added to Wishlist' : 'Removed from Wishlist')
            }
          />

          {/* Optional Feature Section: Loyalty Banner (Store B) */}
          <LoyaltyBanner />

          {/* Best Sellers Section */}
          <FeaturedSection
            title="BEST SELLERS"
            subtitle="Athlete-approved favorites"
            products={bestSellers}
            onViewAll={() =>
              navigation.navigate('ProductList', {
                title: 'Best Sellers',
              })
            }
            onWishlistToggled={(added) =>
              setToastMessage(added ? 'Added to Wishlist' : 'Removed from Wishlist')
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  bannerWrapper: {
    paddingHorizontal: 16,
  },
});
