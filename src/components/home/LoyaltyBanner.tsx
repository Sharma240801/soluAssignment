import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStoreConfigStore } from '../../store';
import { useTheme } from '../../theme';
import { Badge } from '../common/Badge';

export const LoyaltyBanner: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  // If this store does not have loyalty enabled in configuration, do not render
  if (!config.features.loyalty || !config.loyalty) {
    return null;
  }

  const { programName, welcomePoints, tiers } = config.loyalty;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Badge label="EXCLUSIVE FEATURE" variant="accent" size="sm" />
          <Text
            style={[
              styles.programName,
              {
                color: colors.text,
                fontSize: typography.sizes.bodyLarge,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {programName.toUpperCase()}
          </Text>
        </View>

        <View style={[styles.pointsBadge, { backgroundColor: colors.background, borderColor: colors.accent }]}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text
            style={[
              styles.pointsText,
              {
                color: colors.text,
                fontSize: typography.sizes.caption,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {welcomePoints} PTS
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontSize: typography.sizes.body,
          },
        ]}
      >
        Earn 1 point for every {config.currencySymbol}10 spent. Redeem points for exclusive discounts and early release drops.
      </Text>

      {/* Tier Perks */}
      <View style={[styles.tiersContainer, { backgroundColor: colors.background, borderRadius: borderRadius.sm }]}>
        {tiers.map((tier, idx) => (
          <View
            key={tier.name}
            style={[
              styles.tierCol,
              idx < tiers.length - 1 && { borderRightWidth: 1, borderRightColor: colors.border },
            ]}
          >
            <Text style={[styles.tierName, { color: colors.accent, fontWeight: '700' }]}>
              {tier.name}
            </Text>
            <Text style={[styles.tierPoints, { color: colors.textMuted }]}>
              {tier.pointsRequired > 0 ? `${tier.pointsRequired}+ pts` : 'Entry'}
            </Text>
            <Text numberOfLines={2} style={[styles.tierPerk, { color: colors.textSecondary }]}>
              {tier.perks[0]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 18,
    padding: 16,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'column',
    gap: 4,
  },
  programName: {
    letterSpacing: 0.8,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 12,
  },
  pointsText: {},
  description: {
    lineHeight: 20,
    marginBottom: 14,
  },
  tiersContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tierCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tierName: {
    fontSize: 11,
    textAlign: 'center',
  },
  tierPoints: {
    fontSize: 10,
    marginTop: 2,
  },
  tierPerk: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
});

