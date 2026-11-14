import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore, useSettingsStore, useCartStore, useWishlistStore } from '../../store';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StoreSwitcherModal } from '../../components/common/StoreSwitcherModal';
import { Toast } from '../../components/common/Toast';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, typography, borderRadius, isDark } = useTheme();
  const { config, activeStoreId, switchStore } = useStoreConfigStore();
  const { resetOnboarding } = useSettingsStore();
  const loadCart = useCartStore((s) => s.loadCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleToOtherStore = async () => {
    const nextStoreId = activeStoreId === 'fitwear' ? 'urbanfit' : 'fitwear';
    await switchStore(nextStoreId);
    await Promise.all([loadCart(nextStoreId), loadWishlist(nextStoreId)]);
    setToastMessage(`Switched store instance to ${nextStoreId === 'fitwear' ? 'FitWear' : 'UrbanFit'}!`);
  };

  const menuSections = [
    {
      title: 'ORDERS & SAVED',
      items: [
        {
          icon: 'receipt-outline' as const,
          label: 'My Orders (3)',
          sublabel: 'Track recent shipments & returns',
          onPress: () => setToastMessage('Showing orders demo'),
        },
        {
          icon: 'heart-outline' as const,
          label: 'My Wishlist',
          sublabel: 'View saved sportswear items',
          onPress: () => navigation.navigate('MainTabs', { screen: 'WishlistTab' } as any),
        },
        {
          icon: 'location-outline' as const,
          label: 'Delivery Addresses',
          sublabel: '2 saved addresses',
          onPress: () => setToastMessage('Address management demo'),
        },
      ],
    },
    {
      title: 'APP & SETTINGS',
      items: [
        {
          icon: 'swap-horizontal' as const,
          label: 'Switch Store Configuration',
          sublabel: `Current: ${config.name} (${activeStoreId === 'fitwear' ? 'Dark Monolith' : 'Beige Minimalist'})`,
          onPress: () => setStoreModalVisible(true),
          highlight: true,
        },
        {
          icon: 'refresh-outline' as const,
          label: 'Restart Welcome Onboarding',
          sublabel: 'Reset tutorial flag and show Welcome screen',
          onPress: async () => {
            await resetOnboarding();
            navigation.replace('Welcome');
          },
        },
        {
          icon: 'chatbubble-ellipses-outline' as const,
          label: 'Customer Support',
          sublabel: config.supportEmail,
          onPress: () => setToastMessage(`Contact support at: ${config.supportEmail}`),
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="PROFILE" />

      {toastMessage && (
        <Toast
          visible={!!toastMessage}
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* User Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: colors.accent,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                {
                  color: colors.badgeText,
                  fontSize: typography.sizes.h2,
                  fontWeight: typography.weights.heavy,
                },
              ]}
            >
              AS
            </Text>
          </View>

          <View style={styles.userInfoCol}>
            <View style={styles.userNameRow}>
              <Text
                style={[
                  styles.userName,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.h3,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                Alex Sterling
              </Text>
              <Badge label="VIP ATHLETE" variant="accent" size="sm" />
            </View>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              alex.sterling@gymathlete.com
            </Text>
            <Text style={[styles.userStore, { color: colors.textMuted }]}>
              Active Store: {config.name} • Currency: {config.currency}
            </Text>
          </View>
        </View>

        {/* Multi-Store Showcase Feature Banner */}
        <View
          style={[
            styles.multiStoreCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.accent,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <View style={styles.storeCardHeader}>
            <View>
              <Text
                style={[
                  styles.multiStoreTitle,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.bodyLarge,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                MULTI-STORE ARCHITECTURE
              </Text>
              <Text style={[styles.multiStoreDesc, { color: colors.textSecondary }]}>
                Switch store to transform entire branding, color palette, catalog and features.
              </Text>
            </View>
          </View>

          {/* Configuration Inspector Matrix */}
          <View
            style={[
              styles.configMatrix,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: borderRadius.xs,
              },
            ]}
          >
            <View style={styles.matrixRow}>
              <Text style={[styles.matrixKey, { color: colors.textMuted }]}>ACTIVE INSTANCE:</Text>
              <Text style={[styles.matrixVal, { color: colors.accent, fontWeight: '700' }]}>
                {config.name.toUpperCase()} ({activeStoreId})
              </Text>
            </View>
            <View style={styles.matrixRow}>
              <Text style={[styles.matrixKey, { color: colors.textMuted }]}>THEME PALETTE:</Text>
              <View style={styles.swatchRow}>
                <View style={[styles.miniSwatch, { backgroundColor: colors.primary }]} />
                <View style={[styles.miniSwatch, { backgroundColor: colors.accent }]} />
                <View style={[styles.miniSwatch, { backgroundColor: colors.background }]} />
                <Text style={[styles.matrixVal, { color: colors.text }]}>
                  {activeStoreId === 'fitwear' ? 'Black & Volt (#D6FF00)' : 'Beige & Rose (#D96C91)'}
                </Text>
              </View>
            </View>
            <View style={styles.matrixRow}>
              <Text style={[styles.matrixKey, { color: colors.textMuted }]}>OPTIONAL FEATURES:</Text>
              <Text style={[styles.matrixVal, { color: colors.text }]}>
                {config.features.reviews ? '⭐ Product Reviews ENABLED' : '🎁 Loyalty Program ENABLED'}
              </Text>
            </View>
          </View>

          <Button
            title={`SWITCH TO ${activeStoreId === 'fitwear' ? 'URBANFIT' : 'FITWEAR'}`}
            onPress={toggleToOtherStore}
            variant="accent"
            size="md"
            icon={<Ionicons name="swap-horizontal" size={16} color={colors.badgeText} />}
          />
        </View>

        {/* Menu Groups */}
        {menuSections.map((sec) => (
          <View key={sec.title} style={styles.menuGroup}>
            <Text
              style={[
                styles.menuGroupTitle,
                {
                  color: colors.textMuted,
                  fontSize: typography.sizes.tiny,
                  fontWeight: typography.weights.bold,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              {sec.title}
            </Text>

            <View
              style={[
                styles.menuGroupCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              {sec.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.8}
                  onPress={item.onPress}
                  style={[
                    styles.menuItem,
                    idx < sec.items.length - 1 && [styles.menuItemBorder, { borderBottomColor: colors.border }],
                  ]}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      {
                        backgroundColor: colors.background,
                        borderRadius: borderRadius.xs,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={(item as any).highlight ? colors.accent : colors.text}
                    />
                  </View>

                  <View style={styles.menuItemTextCol}>
                    <Text
                      style={[
                        styles.menuItemLabel,
                        {
                          color: colors.text,
                          fontSize: typography.sizes.body,
                          fontWeight: typography.weights.semibold,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.sublabel && (
                      <Text style={[styles.menuItemSublabel, { color: colors.textSecondary }]}>
                        {item.sublabel}
                      </Text>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text
          style={[
            styles.appVersionText,
            {
              color: colors.textMuted,
              fontSize: typography.sizes.tiny,
            },
          ]}
        >
          {config.name} Mobile v1.0.0 • React Native Expo Multi-Store Architecture
        </Text>
      </ScrollView>

      <StoreSwitcherModal
        visible={storeModalVisible}
        onClose={() => setStoreModalVisible(false)}
      />
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {},
  userInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {},
  userEmail: {
    fontSize: 13,
  },
  userStore: {
    fontSize: 11,
    marginTop: 4,
  },
  multiStoreCard: {
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  storeCardHeader: {
    marginBottom: 12,
  },
  multiStoreTitle: {
    letterSpacing: 1,
    marginBottom: 4,
  },
  multiStoreDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  configMatrix: {
    padding: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixKey: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  matrixVal: {
    fontSize: 11,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  menuGroup: {
    marginBottom: 20,
  },
  menuGroupTitle: {
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroupCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTextCol: {
    flex: 1,
  },
  menuItemLabel: {},
  menuItemSublabel: {
    fontSize: 11,
    marginTop: 2,
  },
  appVersionText: {
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.5,
  },
});
