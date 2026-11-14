import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { useCartStore, useStoreConfigStore } from '../../store';
import { Header } from '../../components/common/Header';
import { CartItemCard } from '../../components/cart/CartItemCard';
import { CartSummary } from '../../components/cart/CartSummary';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, typography, borderRadius, isDark } = useTheme();
  const config = useStoreConfigStore((s) => s.config);

  const { items, updateQuantity, removeItem, clearCart, getTotals } = useCartStore();
  const totals = getTotals();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(async () => {
      setIsCheckingOut(false);
      setOrderModalVisible(true);
      await clearCart();
    }, 900);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="YOUR BAG" showBack showCart={false} />

      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
          iconName="bag-outline"
          title="YOUR BAG IS EMPTY"
          description="Looks like you haven't added any athletic gear yet. Discover new releases and gym essentials now."
          actionTitle="START SHOPPING"
          onActionPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
        >
          {/* Header count info */}
          <View style={styles.bagInfoRow}>
            <Text
              style={[
                styles.itemCountText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.body,
                },
              ]}
            >
              {totals.itemCount} {totals.itemCount === 1 ? 'ITEM' : 'ITEMS'} IN YOUR BAG
            </Text>

            <Button
              title="CLEAR ALL"
              onPress={clearCart}
              variant="outline"
              size="sm"
              fullWidth={false}
            />
          </View>

          {/* Cart Items List */}
          <View style={styles.itemsList}>
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={(newQty) => updateQuantity(item.id, newQty)}
                onRemove={() => {
                  removeItem(item.id);
                  setToastMessage('Item removed from bag');
                }}
              />
            ))}
          </View>

          {/* Cart Summary & Checkout */}
          <CartSummary
            totals={totals}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
            onContinueShopping={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          />
        </ScrollView>
      )}

      {/* Checkout Success Modal */}
      <Modal visible={orderModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.orderSuccessCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <View
              style={[
                styles.successIconCircle,
                {
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={56} color={colors.accent} />
            </View>

            <Text
              style={[
                styles.orderSuccessTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.h2,
                  fontWeight: typography.weights.heavy,
                },
              ]}
            >
              ORDER CONFIRMED!
            </Text>

            <Text
              style={[
                styles.orderSuccessSubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.body,
                },
              ]}
            >
              Thank you for training with {config.name}. Your order has been placed successfully in prototype mode.
            </Text>

            <View
              style={[
                styles.orderReceiptBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderRadius: borderRadius.xs,
                },
              ]}
            >
              <Text style={[styles.receiptText, { color: colors.textMuted }]}>
                Order ID: #{Math.floor(100000 + Math.random() * 900000)}
              </Text>
              <Text style={[styles.receiptText, { color: colors.textMuted }]}>
                Store Instance: {config.name} ({config.currency})
              </Text>
            </View>

            <Button
              title="RETURN TO STORE"
              onPress={() => {
                setOrderModalVisible(false);
                navigation.navigate('MainTabs', { screen: 'HomeTab' } as any);
              }}
              variant="accent"
              size="lg"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bagInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCountText: {
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  itemsList: {
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  orderSuccessCard: {
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  orderSuccessTitle: {
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  orderSuccessSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  orderReceiptBox: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    gap: 4,
  },
  receiptText: {
    fontSize: 12,
  },
});
