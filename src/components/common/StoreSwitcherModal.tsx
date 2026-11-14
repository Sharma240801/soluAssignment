import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStoreConfigStore, useCartStore, useWishlistStore } from '../../store';
import { STORE_CONFIGS } from '../../config/stores';
import { StoreId } from '../../types';
import { useTheme } from '../../theme';
import { Badge } from './Badge';

interface StoreSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export const StoreSwitcherModal: React.FC<StoreSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const { activeStoreId, switchStore } = useStoreConfigStore();
  const loadCart = useCartStore((s) => s.loadCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  const handleSelectStore = async (storeId: StoreId) => {
    if (storeId === activeStoreId) {
      onClose();
      return;
    }
    await switchStore(storeId);
    await Promise.all([loadCart(storeId), loadWishlist(storeId)]);
    onClose();
  };

  const storeList = Object.values(STORE_CONFIGS);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.h3,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                SWITCH STORE INSTANCE
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
                Multi-Store Single Codebase Engine
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Store Options */}
          <View style={styles.list}>
            {storeList.map((store) => {
              const isSelected = store.id === activeStoreId;

              return (
                <TouchableOpacity
                  key={store.id}
                  activeOpacity={0.85}
                  onPress={() => handleSelectStore(store.id)}
                  style={[
                    styles.storeCard,
                    {
                      backgroundColor: isSelected ? colors.card : colors.background,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <View style={styles.storeCardTop}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.storeName,
                          {
                            color: colors.text,
                            fontSize: typography.sizes.bodyLarge,
                            fontWeight: typography.weights.bold,
                          },
                        ]}
                      >
                        {store.name.toUpperCase()}
                      </Text>
                      {isSelected && (
                        <Badge label="ACTIVE" variant="accent" size="sm" style={styles.activeBadge} />
                      )}
                    </View>
                    <View style={styles.colorSwatches}>
                      <View style={[styles.swatch, { backgroundColor: store.theme.primary }]} />
                      <View style={[styles.swatch, { backgroundColor: store.theme.accent }]} />
                      <View style={[styles.swatch, { backgroundColor: store.theme.background }]} />
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.tagline,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.sizes.body,
                      },
                    ]}
                  >
                    {store.tagline}
                  </Text>

                  {/* Feature highlights */}
                  <View style={styles.featureRow}>
                    <Text
                      style={[
                        styles.featureText,
                        {
                          color: colors.textMuted,
                          fontSize: typography.sizes.caption,
                        },
                      ]}
                    >
                      Theme: {store.id === 'fitwear' ? 'Dark Monolith' : 'Beige Minimalist'} •{' '}
                      Feature: {store.features.reviews ? '⭐ Product Reviews' : '🎁 Loyalty Rewards'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text
            style={[
              styles.footerHint,
              {
                color: colors.textMuted,
                fontSize: typography.sizes.tiny,
              },
            ]}
          >
            Switching store dynamically updates branding, color scheme, product catalog, and active feature sets across all screens.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    gap: 12,
  },
  storeCard: {
    padding: 16,
    borderWidth: 1.5,
  },
  storeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    letterSpacing: 1.2,
  },
  activeBadge: {
    marginLeft: 8,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: 4,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagline: {
    lineHeight: 18,
    marginBottom: 8,
  },
  featureRow: {
    marginTop: 4,
  },
  featureText: {
    letterSpacing: 0.3,
  },
  footerHint: {
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 14,
  },
});

