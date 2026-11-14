import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StoreBanner } from '../../types';
import { useTheme } from '../../theme';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Badge } from '../common/Badge';

interface PromoBannerProps {
  banner: StoreBanner;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PromoBanner: React.FC<PromoBannerProps> = ({
  banner,
  onPress,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.container,
        {
          borderRadius: borderRadius.md,
          borderColor: colors.border,
        },
      ]}
    >
      <ImageWithFallback
        uri={banner.imageUrl}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark overlay for contrast */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        {banner.accentBadge && (
          <Badge
            label={banner.accentBadge}
            variant="accent"
            size="sm"
            style={styles.badge}
          />
        )}

        <Text
          style={[
            styles.title,
            {
              color: '#FFFFFF',
              fontSize: typography.sizes.hero,
              fontWeight: typography.weights.heavy,
              letterSpacing: typography.letterSpacings.wide,
            },
          ]}
        >
          {banner.title}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            styles.subtitle,
            {
              color: 'rgba(255,255,255,0.85)',
              fontSize: typography.sizes.body,
            },
          ]}
        >
          {banner.subtitle}
        </Text>

        <View
          style={[
            styles.ctaButton,
            {
              backgroundColor: colors.accent,
              borderRadius: borderRadius.xs,
            },
          ]}
        >
          <Text
            style={[
              styles.ctaText,
              {
                color: colors.badgeText,
                fontSize: typography.sizes.caption,
                fontWeight: typography.weights.bold,
                letterSpacing: typography.letterSpacings.wide,
              },
            ]}
          >
            {banner.ctaText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'flex-start',
  },
  badge: {
    marginBottom: 10,
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  ctaText: {},
});
