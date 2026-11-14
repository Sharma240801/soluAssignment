import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { useWishlistStore, useStoreConfigStore } from '../../store';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  cardWidth?: number;
  onWishlistToggled?: (added: boolean) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - 16 * 3) / 2; // 2 column spacing

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cardWidth = DEFAULT_CARD_WIDTH,
  onWishlistToggled,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const currencySymbol = useStoreConfigStore((s) => s.config.currencySymbol);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isFavorited = isInWishlist(product.id);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handlePress = () => {
    navigation.navigate('ProductDetails', {
      productId: product.id,
      productHandle: product.handle,
      title: product.title,
    });
  };

  const handleWishlistPress = async () => {
    const added = await toggleWishlist(product);
    if (onWishlistToggled) {
      onWishlistToggled(added);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[
        styles.container,
        {
          width: cardWidth,
          backgroundColor: colors.card,
          borderRadius: borderRadius.sm,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Product Image & Badges */}
      <View style={[styles.imageContainer, { borderRadius: borderRadius.sm }]}>
        <ImageWithFallback
          uri={product.images[0]}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={handleWishlistPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.wishlistBtn,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorited ? colors.error : colors.text}
          />
        </TouchableOpacity>

        {/* Discount or New Badge */}
        <View style={styles.badgeTopLeft}>
          {discountPercent > 0 ? (
            <Badge label={`-${discountPercent}%`} variant="sale" size="sm" />
          ) : product.isNewArrival ? (
            <Badge label="NEW" variant="accent" size="sm" />
          ) : null}
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.semibold,
            },
          ]}
        >
          {product.title}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              {
                color: colors.text,
                fontSize: typography.sizes.bodyLarge,
                fontWeight: typography.weights.heavy,
              },
            ]}
          >
            {currencySymbol}
            {product.price.toLocaleString()}
          </Text>

          {product.compareAtPrice && (
            <Text
              style={[
                styles.compareAtPrice,
                {
                  color: colors.textMuted,
                  fontSize: typography.sizes.caption,
                },
              ]}
            >
              {currencySymbol}
              {product.compareAtPrice.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Category & Rating */}
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.category,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.tiny,
              },
            ]}
          >
            {product.category.toUpperCase()}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={colors.star} />
            <Text
              style={[
                styles.ratingText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.tiny,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              {product.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  price: {},
  compareAtPrice: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {},
});

