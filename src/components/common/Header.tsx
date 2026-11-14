import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { useStoreConfigStore, useCartStore } from '../../store';
import { RootStackParamList } from '../../types';
import { StoreSwitcherModal } from './StoreSwitcherModal';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showProfile?: boolean;
  showStoreSwitcher?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSearch = true,
  showCart = true,
  showProfile = true,
  showStoreSwitcher = true,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const config = useStoreConfigStore((s) => s.config);
  const itemCount = useCartStore((s) => s.getItemCount());
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [storeModalVisible, setStoreModalVisible] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: insets.top > 0 ? insets.top : Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* Left section: Back button or Store Logo */}
          <View style={styles.leftSection}>
            {showBack ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setStoreModalVisible(true)}
                activeOpacity={0.8}
                style={styles.brandRow}
              >
                <Text
                  style={[
                    styles.logoText,
                    {
                      color: colors.text,
                      fontSize: typography.sizes.h2,
                      fontWeight: typography.weights.heavy,
                      letterSpacing: typography.letterSpacings.extraWide,
                    },
                  ]}
                >
                  {config.logoText}
                </Text>
                {showStoreSwitcher && (
                  <View
                    style={[
                      styles.storePill,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons name="swap-horizontal" size={12} color={colors.accent} />
                    <Text
                      style={[
                        styles.storePillText,
                        {
                          color: colors.accent,
                          fontSize: typography.sizes.tiny,
                          fontWeight: typography.weights.bold,
                        },
                      ]}
                    >
                      SWITCH
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {title && (
              <Text
                numberOfLines={1}
                style={[
                  styles.titleText,
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
            )}
          </View>

          {/* Right section: Icons */}
          {!title &&
            <View style={styles.rightSection}>
              {rightAction}

              {showSearch && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Search')}
                  style={styles.iconButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="search-outline" size={22} color={colors.text} />
                </TouchableOpacity>
              )}

              {showProfile && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' } as any)}
                  style={styles.iconButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="person-outline" size={22} color={colors.text} />
                </TouchableOpacity>
              )}

              {showCart && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={[styles.iconButton, styles.cartBtn]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="bag-outline" size={22} color={colors.text} />
                  {itemCount > 0 && (
                    <View
                      style={[
                        styles.cartBadge,
                        {
                          backgroundColor: colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cartBadgeText,
                          {
                            color: colors.badgeText,
                            fontSize: 10,
                            fontWeight: '800',
                          },
                        ]}
                      >
                        {itemCount > 99 ? '99+' : itemCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          }

        </View>
      </View>

      <StoreSwitcherModal
        visible={storeModalVisible}
        onClose={() => setStoreModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerContent: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    textTransform: 'uppercase',
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    gap: 3,
  },
  storePillText: {
    letterSpacing: 0.5,
  },
  titleText: {
    marginLeft: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {},
});

