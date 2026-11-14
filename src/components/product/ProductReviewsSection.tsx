import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ReviewsService, ProductReviewsResponse } from '../../services';
import { useTheme } from '../../theme';
import { ErrorMessage } from '../common/ErrorMessage';
import { Badge } from '../common/Badge';

interface ProductReviewsSectionProps {
  productId: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const [simulateFailure, setSimulateFailure] = useState(ReviewsService.getIsSimulatingError());

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProductReviewsResponse, Error>({
    queryKey: ['productReviews', productId, simulateFailure],
    queryFn: () => {
      ReviewsService.setSimulateError(simulateFailure);
      return ReviewsService.getProductReviews(productId);
    },
    retry: 0,
  });

  const toggleSimulation = () => {
    const nextVal = !simulateFailure;
    setSimulateFailure(nextVal);
    ReviewsService.setSimulateError(nextVal);
    refetch();
  };

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View>
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
            CUSTOMER REVIEWS
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.caption,
              },
            ]}
          >
            Verified Buyer Feedback
          </Text>
        </View>

        {/* Demo Simulation Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleSimulation}
          style={[
            styles.simToggleBtn,
            {
              backgroundColor: simulateFailure ? colors.error : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name={simulateFailure ? 'flash-off' : 'flash'}
            size={12}
            color={simulateFailure ? '#FFF' : colors.accent}
          />
          <Text
            style={[
              styles.simToggleText,
              {
                color: simulateFailure ? '#FFF' : colors.text,
                fontSize: 10,
                fontWeight: '700',
              },
            ]}
          >
            {simulateFailure ? 'ERROR ACTIVE' : 'SIMULATE ERROR'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading customer reviews...
          </Text>
        </View>
      )}

      {/* Error / Unavailable State */}
      {isError && (
        <ErrorMessage
          message={error?.message || 'Reviews are temporarily unavailable.'}
          retryTitle="RETRY REVIEWS"
          onRetry={() => {
            // When user hits retry, if simulateFailure is true, let's also allow a clean retry option
            refetch();
          }}
        />
      )}

      {/* Success State */}
      {!isLoading && !isError && data && (
        <View style={styles.reviewsContent}>
          {/* Rating Summary Bar */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <View style={styles.scoreCol}>
              <Text
                style={[
                  styles.averageScore,
                  {
                    color: colors.text,
                    fontSize: 40,
                    fontWeight: typography.weights.heavy,
                  },
                ]}
              >
                {data.summary.averageRating.toFixed(1)}
              </Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(data.summary.averageRating) ? 'star' : 'star-outline'}
                    size={16}
                    color={colors.star}
                  />
                ))}
              </View>
              <Text style={[styles.totalReviewsText, { color: colors.textSecondary }]}>
                Based on {data.summary.totalReviews} reviews
              </Text>
            </View>

            {/* Distribution bars */}
            <View style={styles.distCol}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = (data.summary.ratingDistribution as any)[stars] || 0;
                const pct = data.summary.totalReviews > 0 ? (count / data.summary.totalReviews) * 100 : 0;

                return (
                  <View key={stars} style={styles.distRow}>
                    <Text style={[styles.distStarLabel, { color: colors.textSecondary }]}>
                      {stars}★
                    </Text>
                    <View style={[styles.distBarTrack, { backgroundColor: colors.background }]}>
                      <View
                        style={[
                          styles.distBarFill,
                          {
                            width: `${pct}%`,
                            backgroundColor: colors.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.distCount, { color: colors.textMuted }]}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Individual Reviews */}
          <View style={styles.reviewsList}>
            {data.reviews.map((review) => (
              <View
                key={review.id}
                style={[
                  styles.reviewItem,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.authorRow}>
                    <Text
                      style={[
                        styles.authorName,
                        {
                          color: colors.text,
                          fontSize: typography.sizes.body,
                          fontWeight: typography.weights.bold,
                        },
                      ]}
                    >
                      {review.author}
                    </Text>
                    {review.verifiedBuyer && (
                      <Badge label="VERIFIED BUYER" variant="success" size="sm" />
                    )}
                  </View>
                  <Text style={[styles.reviewDate, { color: colors.textMuted }]}>
                    {review.date}
                  </Text>
                </View>

                {/* Rating & meta */}
                <View style={styles.ratingMetaRow}>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? 'star' : 'star-outline'}
                        size={13}
                        color={colors.star}
                      />
                    ))}
                  </View>
                  {review.sizePurchased && (
                    <Text style={[styles.sizeMeta, { color: colors.textSecondary }]}>
                      Size: {review.sizePurchased} • Fit: {review.fitRating || 'True to size'}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.reviewTitle,
                    {
                      color: colors.text,
                      fontSize: typography.sizes.body,
                      fontWeight: typography.weights.semibold,
                    },
                  ]}
                >
                  {review.title}
                </Text>

                <Text
                  style={[
                    styles.reviewComment,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.sizes.body,
                    },
                  ]}
                >
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    borderTopWidth: 1,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {},
  subtitle: {
    marginTop: 2,
  },
  simToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 4,
  },
  simToggleText: {
    letterSpacing: 0.5,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  reviewsContent: {},
  summaryCard: {
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    minWidth: 110,
  },
  averageScore: {},
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  totalReviewsText: {
    fontSize: 11,
  },
  distCol: {
    flex: 1,
    paddingLeft: 16,
    gap: 4,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distStarLabel: {
    fontSize: 11,
    width: 20,
  },
  distBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
  },
  distCount: {
    fontSize: 10,
    width: 20,
    textAlign: 'right',
  },
  reviewsList: {},
  reviewItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {},
  reviewDate: {
    fontSize: 11,
  },
  ratingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sizeMeta: {
    fontSize: 11,
  },
  reviewTitle: {
    marginBottom: 4,
  },
  reviewComment: {
    lineHeight: 20,
  },
});

