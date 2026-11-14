import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../../types';
import { useTheme } from '../../theme';
import { useWishlistStore, useCartStore, useStoreConfigStore } from '../../store';
import { Header } from '../../components/common/Header';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Toast } from '../../components/common/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPACING = 14;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING * 3) / 2;

export const WishlistScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, typography, borderRadius, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleQuickAddToCart = async (product: Product) => {
    // Select first available variant
    const variant = product.variants.find((v) => v.availableForSale) || product.variants[0];
    if (!variant || !variant.availableForSale) {
      setToastMessage('This product is out of stock.');
      return;
    }

    const success = await addItemToCart(product, variant, 1);
    if (success) {
      setToastMessage(`Added ${product.title} (${variant.size}) to bag!`);
    } else {
      setToastMessage('Could not add to bag.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="WISHLIST" />

      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
          actionTitle="BAG"
          onAction={() => navigation.navigate('Cart')}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
          iconName="heart-outline"
          title="YOUR WISHLIST IS EMPTY"
          description="Save performance pieces you love by tapping the heart icon on any product card."
          actionTitle="EXPLORE PRODUCTS"
          onActionPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 30 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerInfoRow}>
              <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
                {items.length} {items.length === 1 ? 'SAVED ITEM' : 'SAVED ITEMS'}
              </Text>
              <TouchableOpacity onPress={clearWishlist}>
                <Text style={[styles.clearBtn, { color: colors.textMuted }]}>CLEAR ALL</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  width: CARD_WIDTH,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    productId: item.id,
                    productHandle: item.handle,
                    title: item.title,
                  })
                }
                style={styles.imageWrapper}
              >
                <ImageWithFallback uri={item.images[0]} style={styles.image} resizeMode="cover" />

                {/* Remove heart button */}
                <TouchableOpacity
                  onPress={() => {
                    removeFromWishlist(item.id);
                    setToastMessage('Removed from Wishlist');
                  }}
                  style={[
                    styles.removeBtn,
                    {
                      backgroundColor: colors.surface,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Ionicons name="close" size={16} color={colors.text} />
                </TouchableOpacity>
              </TouchableOpacity>

              <View style={styles.cardInfo}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.productTitle,
                    {
                      color: colors.text,
                      fontSize: typography.sizes.body,
                      fontWeight: typography.weights.semibold,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.productPrice,
                    {
                      color: colors.text,
                      fontSize: typography.sizes.bodyLarge,
                      fontWeight: typography.weights.bold,
                    },
                  ]}
                >
                  {config.currencySymbol}{item.price.toLocaleString()}
                </Text>

                <Button
                  title="MOVE TO BAG"
                  onPress={() => handleQuickAddToCart(item)}
                  variant="primary"
                  size="sm"
                  style={styles.addToBagBtn}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING,
    paddingTop: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  clearBtn: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.85,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 10,
  },
  productTitle: {
    minHeight: 34,
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    marginBottom: 10,
  },
  addToBagBtn: {
    marginTop: 4,
  },
});
