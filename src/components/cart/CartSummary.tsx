import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartTotals } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore } from '../../store';
import { Button } from '../common/Button';

interface CartSummaryProps {
  totals: CartTotals;
  onCheckout: () => void;
  onContinueShopping?: () => void;
  isCheckingOut?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totals,
  onCheckout,
  onContinueShopping,
  isCheckingOut = false,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  const amountToFreeShipping = Math.max(0, config.shippingThreshold - totals.subtotal);
  const freeShippingPct = Math.min(100, Math.round((totals.subtotal / config.shippingThreshold) * 100));

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
      {/* Free Shipping Progress Indicator */}
      <View style={styles.shippingThresholdContainer}>
        <View style={styles.shippingTextRow}>
          <Ionicons
            name={amountToFreeShipping === 0 ? 'checkmark-circle' : 'airplane-outline'}
            size={16}
            color={amountToFreeShipping === 0 ? colors.success : colors.accent}
          />
          <Text
            style={[
              styles.shippingThresholdText,
              {
                color: colors.text,
                fontSize: typography.sizes.caption,
                fontWeight: typography.weights.semibold,
              },
            ]}
          >
            {amountToFreeShipping === 0
              ? 'YOU UNLOCKED FREE STANDARD SHIPPING!'
              : `ADD ${config.currencySymbol}${amountToFreeShipping.toLocaleString()} MORE FOR FREE SHIPPING`}
          </Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${freeShippingPct}%`,
                backgroundColor: amountToFreeShipping === 0 ? colors.success : colors.accent,
              },
            ]}
          />
        </View>
      </View>

      {/* Breakdown Rows */}
      <View style={styles.breakdownRows}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Subtotal ({totals.itemCount} items)</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {config.currencySymbol}{totals.subtotal.toLocaleString()}
          </Text>
        </View>

        {totals.discount > 0 && (
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.success }]}>Discount Savings</Text>
            <Text style={[styles.value, { color: colors.success, fontWeight: '700' }]}>
              -{config.currencySymbol}{totals.discount.toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Estimated Shipping</Text>
          <Text style={[styles.value, { color: totals.shipping === 0 ? colors.success : colors.text }]}>
            {totals.shipping === 0 ? 'FREE' : `${config.currencySymbol}${totals.shipping.toLocaleString()}`}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Total Row */}
        <View style={styles.totalRow}>
          <View>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: colors.text,
                  fontSize: typography.sizes.bodyLarge,
                  fontWeight: typography.weights.bold,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              TOTAL
            </Text>
            <Text style={[styles.taxInclusive, { color: colors.textMuted }]}>
              Including all taxes
            </Text>
          </View>

          <Text
            style={[
              styles.totalAmount,
              {
                color: colors.text,
                fontSize: typography.sizes.h2,
                fontWeight: typography.weights.heavy,
              },
            ]}
          >
            {config.currencySymbol}{totals.total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Checkout Button */}
      <View style={styles.actionButtons}>
        <Button
          title="PROCEED TO CHECKOUT"
          onPress={onCheckout}
          variant="primary"
          size="lg"
          loading={isCheckingOut}
          icon={<Ionicons name="lock-closed" size={16} color={colors.background} />}
        />

        {onContinueShopping && (
          <Button
            title="CONTINUE SHOPPING"
            onPress={onContinueShopping}
            variant="outline"
            size="md"
            style={styles.continueBtn}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  shippingThresholdContainer: {
    marginBottom: 16,
  },
  shippingTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  shippingThresholdText: {
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  breakdownRows: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {},
  taxInclusive: {
    fontSize: 11,
    marginTop: 2,
  },
  totalAmount: {},
  actionButtons: {
    marginTop: 20,
    gap: 10,
  },
  continueBtn: {
    marginTop: 2,
  },
});

