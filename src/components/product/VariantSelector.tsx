import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductVariant } from '../../types';
import { useTheme } from '../../theme';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
  onOpenSizeGuide?: () => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  onOpenSizeGuide,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  // Extract unique colors and sizes
  const colorsList = Array.from(new Set(variants.map((v) => v.color)));
  const sizesList = Array.from(new Set(variants.map((v) => v.size)));

  const activeColor = selectedVariant?.color || colorsList[0];
  const activeSize = selectedVariant?.size || sizesList[0];

  const handleColorChange = (color: string) => {
    // Find matching variant with this color and current size, or fallback to first variant with this color
    const match =
      variants.find((v) => v.color === color && v.size === activeSize) ||
      variants.find((v) => v.color === color);
    if (match) {
      onSelectVariant(match);
    }
  };

  const handleSizeChange = (size: string) => {
    const match =
      variants.find((v) => v.size === size && v.color === activeColor) ||
      variants.find((v) => v.size === size);
    if (match) {
      onSelectVariant(match);
    }
  };

  return (
    <View style={styles.container}>
      {/* Color Section */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.bold,
            },
          ]}
        >
          COLOR:{' '}
          <Text
            style={{
              color: colors.textSecondary,
              fontWeight: typography.weights.regular,
            }}
          >
            {activeColor}
          </Text>
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
        {colorsList.map((color) => {
          const isSelected = color === activeColor;
          const hasStock = variants.some((v) => v.color === color && v.availableForSale);

          return (
            <TouchableOpacity
              key={color}
              activeOpacity={0.8}
              onPress={() => handleColorChange(color)}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? colors.text : colors.surface,
                  borderColor: isSelected ? colors.text : colors.border,
                  borderRadius: borderRadius.xs,
                  opacity: hasStock ? 1 : 0.4,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected ? colors.background : colors.text,
                    fontSize: typography.sizes.caption,
                    fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
                  },
                ]}
              >
                {color.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Size Section */}
      <View style={[styles.sectionHeader, { marginTop: 18 }]}>
        <View style={styles.sizeTitleRow}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            SELECT SIZE:{' '}
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: typography.weights.regular,
              }}
            >
              {activeSize}
            </Text>
          </Text>
        </View>

        {onOpenSizeGuide && (
          <TouchableOpacity onPress={onOpenSizeGuide} style={styles.sizeGuideBtn}>
            <Ionicons name="resize-outline" size={14} color={colors.accent} />
            <Text
              style={[
                styles.sizeGuideText,
                {
                  color: colors.accent,
                  fontSize: typography.sizes.caption,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              SIZE GUIDE
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
        {sizesList.map((size) => {
          const isSelected = size === activeSize;
          const variantForSize = variants.find(
            (v) => v.size === size && v.color === activeColor
          );
          const isAvailable = variantForSize ? variantForSize.availableForSale : false;

          return (
            <TouchableOpacity
              key={size}
              activeOpacity={0.8}
              disabled={!isAvailable}
              onPress={() => handleSizeChange(size)}
              style={[
                styles.sizeBox,
                {
                  backgroundColor: isSelected ? colors.text : colors.surface,
                  borderColor: isSelected ? colors.text : colors.border,
                  borderRadius: borderRadius.xs,
                  opacity: isAvailable ? 1 : 0.35,
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  {
                    color: isSelected ? colors.background : colors.text,
                    fontSize: typography.sizes.body,
                    fontWeight: typography.weights.bold,
                    textDecorationLine: !isAvailable ? 'line-through' : 'none',
                  },
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Stock Availability Indicator */}
      {selectedVariant && (
        <View style={styles.stockStatusRow}>
          <View
            style={[
              styles.stockDot,
              {
                backgroundColor: selectedVariant.availableForSale
                  ? selectedVariant.inventoryQuantity <= 5
                    ? '#FFA000'
                    : colors.success
                  : colors.error,
              },
            ]}
          />
          <Text
            style={[
              styles.stockText,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.caption,
              },
            ]}
          >
            {selectedVariant.availableForSale
              ? selectedVariant.inventoryQuantity <= 5
                ? `Low Stock: Only ${selectedVariant.inventoryQuantity} left!`
                : 'In Stock & Ready to Ship'
              : 'Out of Stock - Restocking Soon'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    letterSpacing: 0.8,
  },
  sizeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeGuideText: {
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    minWidth: 70,
    alignItems: 'center',
  },
  pillText: {
    letterSpacing: 0.5,
  },
  sizeBox: {
    width: 50,
    height: 46,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {},
  stockStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    letterSpacing: 0.3,
  },
});

