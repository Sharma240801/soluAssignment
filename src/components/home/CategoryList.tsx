import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Category } from '../../types';
import { useTheme } from '../../theme';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (category: Category) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontSize: typography.sizes.h3,
              fontWeight: typography.weights.bold,
              letterSpacing: typography.letterSpacings.wide,
            },
          ]}
        >
          CATEGORIES
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(cat)}
              style={styles.categoryItem}
            >
              <View
                style={[
                  styles.imageWrapper,
                  {
                    borderColor: isSelected ? colors.accent : colors.border,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <ImageWithFallback
                  uri={cat.image}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.categoryName,
                  {
                    color: isSelected ? colors.accent : colors.text,
                    fontSize: typography.sizes.caption,
                    fontWeight: isSelected ? typography.weights.bold : typography.weights.semibold,
                    letterSpacing: typography.letterSpacings.normal,
                  },
                ]}
              >
                {cat.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {},
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  imageWrapper: {
    width: 76,
    height: 76,
    overflow: 'hidden',
    borderWidth: 2,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    textAlign: 'center',
  },
});

