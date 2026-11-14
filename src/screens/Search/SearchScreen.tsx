import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList, Product } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore, useSettingsStore } from '../../store';
import { ProductService } from '../../services';
import { Header } from '../../components/common/Header';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Toast } from '../../components/common/Toast';

const POPULAR_SEARCHES = [
  'Oversized T-Shirt',
  'Seamless Leggings',
  'Training Hoodie',
  'Gym Shorts',
  'Tank Top',
  'Wrist Wraps',
];

export const SearchScreen: React.FC = () => {
  const { colors, typography, borderRadius, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useSettingsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch all products for active store
  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['searchProducts', config.id],
    queryFn: () => ProductService.getProducts(config.id),
  });

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return allProducts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchDesc || matchTags;
    });
  }, [allProducts, searchQuery]);

  const handleSearchSubmit = (term: string) => {
    if (!term.trim()) return;
    setSearchQuery(term);
    addRecentSearch(term);
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="SEARCH" showBack showSearch={false} />

      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* Search Input Bar */}
      <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xs,
            },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder={`Search ${config.name} apparel, styles & gear...`}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearchSubmit(searchQuery)}
            returnKeyType="search"
            autoFocus
            style={[styles.input, { color: colors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {!isSearching ? (
        <ScrollView style={styles.idleContainer} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: typography.sizes.body,
                      fontWeight: typography.weights.bold,
                      letterSpacing: typography.letterSpacings.wide,
                    },
                  ]}
                >
                  RECENT SEARCHES
                </Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>CLEAR</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.chipsContainer}>
                {recentSearches.map((term) => (
                  <TouchableOpacity
                    key={term}
                    onPress={() => handleSearchSubmit(term)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderRadius: borderRadius.xs,
                      },
                    ]}
                  >
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.chipText, { color: colors.text }]}>{term}</Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="close" size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.body,
                  fontWeight: typography.weights.bold,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              POPULAR SEARCHES
            </Text>

            <View style={styles.chipsContainer}>
              {POPULAR_SEARCHES.map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => handleSearchSubmit(term)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: borderRadius.xs,
                    },
                  ]}
                >
                  <Ionicons name="trending-up-outline" size={14} color={colors.accent} />
                  <Text style={[styles.chipText, { color: colors.text }]}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'} FOR "{searchQuery.toUpperCase()}"
            </Text>
          </View>

          <ProductGrid
            products={searchResults}
            emptyTitle="NO PRODUCTS FOUND"
            emptyDescription={`We couldn't find anything matching "${searchQuery}". Check the spelling or search for categories like "t-shirts" or "shorts".`}
            onWishlistToggled={(added) =>
              setToastMessage(added ? 'Added to Wishlist' : 'Removed from Wishlist')
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  idleContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {},
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
