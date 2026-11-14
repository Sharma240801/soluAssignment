import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { useTheme } from '../../theme';
import { ProductCard } from '../product/ProductCard';

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onViewAll?: () => void;
  onWishlistToggled?: (added: boolean) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  title,
  subtitle,
  products,
  onViewAll,
  onWishlistToggled,
}) => {
  const { colors, typography } = useTheme();

  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.h3,
                fontWeight: typography.weights.bold,
                letterSpacing: typography.letterSpacings.wide,
              },
            ]}
          >
            {title.toUpperCase()}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.caption,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            style={styles.viewAllBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.viewAllText,
                {
                  color: colors.accent,
                  fontSize: typography.sizes.caption,
                  fontWeight: typography.weights.bold,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              VIEW ALL
            </Text>
            <Ionicons name="arrow-forward" size={13} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scroll List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <ProductCard
              product={item}
              cardWidth={165}
              onWishlistToggled={onWishlistToggled}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  titleCol: {
    flex: 1,
  },
  title: {},
  subtitle: {
    marginTop: 2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  viewAllText: {},
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrapper: {
    width: 165,
  },
});

