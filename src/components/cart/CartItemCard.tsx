import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore } from '../../store';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const currencySymbol = useStoreConfigStore((s) => s.config.currencySymbol);

  const canIncrease = item.quantity < item.maxInventory;
  const canDecrease = item.quantity > 1;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.sm,
        },
      ]}
    >
      {/* Product Image */}
      <View style={[styles.imageWrapper, { borderRadius: borderRadius.xs }]}>
        <ImageWithFallback uri={item.image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Details */}
      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {item.title}
          </Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Variant Info */}
        <Text
          style={[
            styles.variantText,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.caption,
            },
          ]}
        >
          Size: {item.size} • Color: {item.color}
        </Text>

        {/* Price & Quantity Stepper */}
        <View style={styles.bottomRow}>
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
              {(item.price * item.quantity).toLocaleString()}
            </Text>
            {item.quantity > 1 && (
              <Text style={[styles.unitPrice, { color: colors.textMuted }]}>
                ({currencySymbol}{item.price.toLocaleString()} each)
              </Text>
            )}
          </View>

          {/* Quantity Stepper */}
          <View
            style={[
              styles.stepper,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.xs,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity - 1)}
              style={styles.stepperBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons
                name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                size={14}
                color={item.quantity === 1 ? colors.error : colors.text}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.stepperCount,
                {
                  color: colors.text,
                  fontSize: typography.sizes.caption,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.quantity + 1)}
              disabled={!canIncrease}
              style={[styles.stepperBtn, !canIncrease && { opacity: 0.3 }]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="add" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  imageWrapper: {
    width: 80,
    height: 96,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  variantText: {
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'column',
  },
  price: {},
  unitPrice: {
    fontSize: 10,
    marginTop: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCount: {
    paddingHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
});

