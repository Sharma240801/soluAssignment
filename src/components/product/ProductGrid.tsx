import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '../../theme';

interface ProductGridProps {
  products: Product[];
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onWishlistToggled?: (added: boolean) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPACING = 14;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING * 3) / 2;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  ListHeaderComponent,
  refreshing = false,
  onRefresh,
  emptyTitle = 'No Products Found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  onWishlistToggled,
}) => {
  const { colors } = useTheme();

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent ?? undefined}
      ListEmptyComponent={
        <EmptyState
          iconName="shirt-outline"
          title={emptyTitle}
          description={emptyDescription}
        />
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          cardWidth={CARD_WIDTH}
          onWishlistToggled={onWishlistToggled}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
