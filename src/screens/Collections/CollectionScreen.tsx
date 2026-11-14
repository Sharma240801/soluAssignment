import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList, Product, ProductSortOption } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore } from '../../store';
import { ProductService } from '../../services';
import { Header } from '../../components/common/Header';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';

type CollectionRouteProp = RouteProp<RootStackParamList, 'ProductList'>;

export const CollectionScreen: React.FC = () => {
  const route = useRoute<CollectionRouteProp>();
  const initialCategory = route.params?.category;
  const initialTitle = route.params?.title || 'All Products';

  const { colors, typography, borderRadius, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<ProductSortOption>('featured');

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch products using TanStack Query
  const {
    data: products = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['collectionProducts', config.id],
    queryFn: () => ProductService.getProducts(config.id),
  });

  // Client-side filtering & sorting for instantaneous reactive response
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === cat ||
          p.tags.some((t) => t.toLowerCase() === cat)
      );
    }

    // Size filter
    if (selectedSize && selectedSize !== 'all') {
      result = result.filter((p) =>
        p.variants.some((v) => v.size.toUpperCase() === selectedSize && v.availableForSale)
      );
    }

    // Price range
    if (selectedPriceRange === 'under-1500') {
      result = result.filter((p) => p.price < 1500);
    } else if (selectedPriceRange === '1500-2500') {
      result = result.filter((p) => p.price >= 1500 && p.price <= 2500);
    } else if (selectedPriceRange === 'above-2500') {
      result = result.filter((p) => p.price > 2500);
    }

    // In stock
    if (inStockOnly) {
      result = result.filter((p) => p.availableForSale);
    }

    // Search query within collection
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'best-selling':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSize,
    selectedPriceRange,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedPriceRange('all');
    setInStockOnly(false);
  };

  const sortOptions: { label: string; value: ProductSortOption }[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Best Selling', value: 'best-selling' },
  ];

  const sizeOptions = ['all', 'XS', 'S', 'M', 'L', 'XL'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Header title={initialTitle} showBack />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* Search Input within collection */}
      <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xs,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search within this collection..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Controls: Filter & Sort */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={[
              styles.controlBtn,
              {
                backgroundColor: activeFilterCount > 0 ? colors.text : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="filter-outline"
              size={15}
              color={activeFilterCount > 0 ? colors.background : colors.text}
            />
            <Text
              style={[
                styles.controlBtnText,
                {
                  color: activeFilterCount > 0 ? colors.background : colors.text,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              FILTER {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortModalVisible(true)}
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="swap-vertical-outline" size={15} color={colors.text} />
            <Text style={[styles.controlBtnText, { color: colors.text, fontWeight: typography.weights.bold }]}>
              SORT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subheader info: Product count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
        </Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={[styles.clearText, { color: colors.accent, fontWeight: '700' }]}>
              CLEAR FILTERS
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Products Grid */}
      {isLoading ? (
        <LoadingSpinner fullScreen message="Loading collection..." />
      ) : (
        <ProductGrid
          products={filteredProducts}
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
          emptyTitle="NO MATCHING PRODUCTS"
          emptyDescription="We could not find any products matching your selected filters. Try resetting your search."
          onWishlistToggled={(added) =>
            setToastMessage(added ? 'Added to Wishlist' : 'Removed from Wishlist')
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>FILTERS</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Category Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>CATEGORY</Text>
              <View style={styles.chipsRow}>
                <TouchableOpacity
                  onPress={() => setSelectedCategory('all')}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedCategory === 'all' ? colors.text : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selectedCategory === 'all' ? colors.background : colors.text }]}>
                    All
                  </Text>
                </TouchableOpacity>

                {config.categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.slug)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedCategory === cat.slug ? colors.text : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selectedCategory === cat.slug ? colors.background : colors.text },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Size Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text, marginTop: 18 }]}>SIZE</Text>
              <View style={styles.chipsRow}>
                {sizeOptions.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSelectedSize(s)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedSize === s ? colors.text : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: selectedSize === s ? colors.background : colors.text }]}>
                      {s.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text, marginTop: 18 }]}>PRICE RANGE</Text>
              <View style={styles.chipsRow}>
                {[
                  { label: 'All', value: 'all' },
                  { label: `Under ${config.currencySymbol}1,500`, value: 'under-1500' },
                  { label: `${config.currencySymbol}1,500 - ${config.currencySymbol}2,500`, value: '1500-2500' },
                  { label: `Above ${config.currencySymbol}2,500`, value: 'above-2500' },
                ].map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    onPress={() => setSelectedPriceRange(p.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedPriceRange === p.value ? colors.text : colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selectedPriceRange === p.value ? colors.background : colors.text },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Availability Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text, marginTop: 18 }]}>AVAILABILITY</Text>
              <TouchableOpacity
                onPress={() => setInStockOnly(!inStockOnly)}
                style={[
                  styles.checkboxRow,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={inStockOnly ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={inStockOnly ? colors.accent : colors.textMuted}
                />
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>In Stock Only</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Button
                title="RESET"
                onPress={resetFilters}
                variant="outline"
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                title="APPLY FILTERS"
                onPress={() => setFilterModalVisible(false)}
                variant="primary"
                size="md"
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModalVisible} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={[styles.sortModalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text, marginBottom: 12 }]}>SORT BY</Text>
            {sortOptions.map((opt) => {
              const isSelected = sortBy === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    setSortBy(opt.value);
                    setSortModalVisible(false);
                  }}
                  style={[
                    styles.sortOptionRow,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      {
                        color: isSelected ? colors.accent : colors.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color={colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderWidth: 1,
  },
  controlBtnText: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalBody: {
    padding: 16,
  },
  filterGroupTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  sortModalContent: {
    margin: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sortOptionText: {
    fontSize: 14,
  },
});
