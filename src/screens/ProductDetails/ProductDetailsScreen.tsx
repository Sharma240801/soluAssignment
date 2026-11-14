import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList, Product, ProductVariant } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore, useCartStore, useWishlistStore } from '../../store';
import { ProductService, CartService } from '../../services';
import { Header } from '../../components/common/Header';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { VariantSelector } from '../../components/product/VariantSelector';
import { SizeGuideModal } from '../../components/product/SizeGuideModal';
import { ProductReviewsSection } from '../../components/product/ProductReviewsSection';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { Toast } from '../../components/common/Toast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors, typography, borderRadius, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const productId = route.params?.productId;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ['productDetail', config.id, productId],
    queryFn: () => ProductService.getProductById(config.id, productId),
    enabled: !!productId,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['relatedProducts', config.id, productId, product?.category],
    queryFn: () =>
      product
        ? ProductService.getRelatedProducts(config.id, product.id, product.category)
        : Promise.resolve([]),
    enabled: !!product,
  });

  // Initialize first available variant
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      const defaultVariant =
        product.variants.find((v) => v.availableForSale) || product.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  if (isLoading || !product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header showBack />
        <LoadingSpinner fullScreen message="Loading product details..." />
      </View>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeComparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice;

  const discountPercent = activeComparePrice
    ? Math.round(((activeComparePrice - activePrice) / activeComparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setToastMessage('Please select a size and color.');
      return;
    }

    const validation = CartService.validateVariantAddition(selectedVariant, 0, quantity);
    if (!validation.valid) {
      setToastMessage(validation.message || 'Cannot add this item to cart.');
      return;
    }

    setIsAddingToCart(true);
    const success = await addItemToCart(product, selectedVariant, quantity);
    setIsAddingToCart(false);

    if (success) {
      setToastMessage(`Added ${quantity}x ${product.title} (${selectedVariant.size}) to cart!`);
    } else {
      setToastMessage('Could not add item to cart.');
    }
  };

  const handleWishlistToggle = async () => {
    const added = await toggleWishlist(product);
    setToastMessage(added ? 'Saved to Wishlist' : 'Removed from Wishlist');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showBack />

      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
          actionTitle="VIEW CART"
          onAction={() => navigation.navigate('Cart')}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 }, // Space for sticky bottom bar
        ]}
      >
        {/* Large Product Image Gallery */}
        <View style={styles.galleryContainer}>
          <ImageWithFallback
            uri={product.images[selectedImageIndex] || product.images[0]}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Wishlist Button floating over gallery */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleWishlistToggle}
            style={[
              styles.galleryWishlistBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorited ? colors.error : colors.text}
            />
          </TouchableOpacity>

          {/* Badges */}
          <View style={styles.galleryBadgeCol}>
            {discountPercent > 0 && (
              <Badge label={`SAVE ${discountPercent}%`} variant="sale" size="md" />
            )}
            {product.isBestSeller && (
              <Badge label="BEST SELLER" variant="accent" size="sm" style={{ marginTop: 6 }} />
            )}
          </View>
        </View>

        {/* Thumbnail Selector */}
        {product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsRow}
          >
            {product.images.map((img, idx) => {
              const isSelected = selectedImageIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => setSelectedImageIndex(idx)}
                  style={[
                    styles.thumbnailWrapper,
                    {
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderRadius: borderRadius.xs,
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <ImageWithFallback uri={img} style={styles.thumbnailImage} resizeMode="cover" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Product Information */}
        <View style={styles.infoContainer}>
          {/* Category & Rating */}
          <View style={styles.metaRow}>
            <Text style={[styles.categoryTag, { color: colors.textSecondary }]}>
              {product.category.toUpperCase()} • ATHLETIC PERFORMANCE
            </Text>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color={colors.star} />
              <Text
                style={[
                  styles.ratingScore,
                  {
                    color: colors.text,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                {product.rating}
              </Text>
              <Text style={[styles.ratingCount, { color: colors.textMuted }]}>
                ({product.reviewCount})
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.h1,
                fontWeight: typography.weights.heavy,
                letterSpacing: typography.letterSpacings.normal,
              },
            ]}
          >
            {product.title}
          </Text>

          {/* Price display with variant-reactive update */}
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.currentPrice,
                {
                  color: colors.text,
                  fontSize: 26,
                  fontWeight: typography.weights.heavy,
                },
              ]}
            >
              {config.currencySymbol}
              {activePrice.toLocaleString()}
            </Text>

            {activeComparePrice && (
              <Text
                style={[
                  styles.comparePrice,
                  {
                    color: colors.textMuted,
                    fontSize: typography.sizes.bodyLarge,
                  },
                ]}
              >
                {config.currencySymbol}
                {activeComparePrice.toLocaleString()}
              </Text>
            )}

            {discountPercent > 0 && (
              <Badge label={`${discountPercent}% OFF`} variant="sale" size="sm" />
            )}
          </View>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.body,
              },
            ]}
          >
            {product.description}
          </Text>

          {/* Variant Selector (Colors, Sizes, Stock) */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            onOpenSizeGuide={() => setSizeGuideVisible(true)}
          />

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text
              style={[
                styles.quantityLabel,
                {
                  color: colors.text,
                  fontSize: typography.sizes.body,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              QUANTITY
            </Text>

            <View
              style={[
                styles.quantityStepper,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.xs,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>

              <Text
                style={[
                  styles.quantityText,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.body,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setQuantity(
                    Math.min(selectedVariant?.inventoryQuantity || 10, quantity + 1)
                  )
                }
                style={styles.quantityBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Reviews Section (Controlled by config / service) */}
          {config.features.reviews && (
            <ProductReviewsSection productId={product.id} />
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <FeaturedSection
              title="WEAR IT WITH"
              subtitle="Complete the athletic look"
              products={relatedProducts}
            />
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Add-to-Cart Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          },
        ]}
      >
        <View style={styles.stickyPriceCol}>
          <Text style={[styles.stickyLabel, { color: colors.textMuted }]}>
            {selectedVariant ? `${selectedVariant.size} • ${selectedVariant.color}` : 'TOTAL'}
          </Text>
          <Text
            style={[
              styles.stickyTotal,
              {
                color: colors.text,
                fontSize: typography.sizes.h3,
                fontWeight: typography.weights.heavy,
              },
            ]}
          >
            {config.currencySymbol}
            {(activePrice * quantity).toLocaleString()}
          </Text>
        </View>

        <View style={styles.stickyButtonWrapper}>
          <Button
            title={
              selectedVariant && !selectedVariant.availableForSale
                ? 'OUT OF STOCK'
                : 'ADD TO BAG'
            }
            onPress={handleAddToCart}
            variant="accent"
            size="lg"
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            loading={isAddingToCart}
            icon={<Ionicons name="bag-handle" size={18} color={colors.badgeText} />}
          />
        </View>
      </View>

      {/* Size Guide Modal */}
      <SizeGuideModal
        visible={sizeGuideVisible}
        onClose={() => setSizeGuideVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  galleryContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 1.15,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  galleryWishlistBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  galleryBadgeCol: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  thumbnailsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  thumbnailWrapper: {
    width: 64,
    height: 64,
    borderWidth: 2,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: 12,
  },
  ratingCount: {
    fontSize: 11,
  },
  title: {
    lineHeight: 30,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 16,
  },
  currentPrice: {},
  comparePrice: {
    textDecorationLine: 'line-through',
  },
  description: {
    lineHeight: 22,
    marginBottom: 16,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  quantityLabel: {
    letterSpacing: 0.8,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  quantityBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    paddingHorizontal: 12,
    minWidth: 32,
    textAlign: 'center',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  stickyPriceCol: {
    marginRight: 16,
  },
  stickyLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  stickyTotal: {},
  stickyButtonWrapper: {
    flex: 1,
  },
});
