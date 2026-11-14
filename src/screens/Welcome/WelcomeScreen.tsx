import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { useStoreConfigStore, useSettingsStore } from '../../store';
import { Button } from '../../components/common/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, typography, borderRadius } = useTheme();
  const config = useStoreConfigStore((s) => s.config);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const bannerImage =
    config.id === 'fitwear'
      ? 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=1200&q=80';

  const handleEnterApp = async () => {
    await completeOnboarding();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: bannerImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark cinematic gradient overlay */}
        <View style={styles.darkOverlay} />

        <View
          style={[
            styles.contentContainer,
            {
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          {/* Brand header */}
          <View style={styles.brandContainer}>
            <Text
              style={[
                styles.logoText,
                {
                  fontSize: typography.sizes.hero,
                  fontWeight: typography.weights.heavy,
                  letterSpacing: typography.letterSpacings.extraWide,
                },
              ]}
            >
              {config.logoText}
            </Text>
            <Text
              style={[
                styles.logoSubtext,
                {
                  color: colors.accent,
                  fontSize: typography.sizes.caption,
                  fontWeight: typography.weights.bold,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              {config.logoSubtext}
            </Text>
          </View>

          {/* Bottom text & actions */}
          <View style={styles.bottomSection}>
            <View
              style={[
                styles.taglineBadge,
                {
                  borderColor: colors.accent,
                  borderRadius: borderRadius.xs,
                },
              ]}
            >
              <Text style={[styles.taglineBadgeText, { color: colors.accent }]}>
                OFFICIAL MOBILE STORE
              </Text>
            </View>

            <Text
              style={[
                styles.headline,
                {
                  fontSize: 34,
                  fontWeight: typography.weights.heavy,
                  letterSpacing: typography.letterSpacings.wide,
                },
              ]}
            >
              {config.tagline}
            </Text>

            <Text style={styles.subDescription}>
              Elevate your performance with premium sportswear, cutting-edge seamless fabrics, and modern aesthetic silhouettes.
            </Text>

            {/* Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="GET STARTED"
                onPress={handleEnterApp}
                variant="accent"
                size="lg"
              />

              <Button
                title="SKIP TO STORE"
                onPress={handleEnterApp}
                variant="outline"
                size="md"
                style={styles.skipBtn}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  logoSubtext: {
    marginTop: 4,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'flex-start',
  },
  taglineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    marginBottom: 14,
  },
  taglineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headline: {
    color: '#FFFFFF',
    lineHeight: 40,
    marginBottom: 12,
  },
  subDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  skipBtn: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
