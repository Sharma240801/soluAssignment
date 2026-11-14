import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackUri?: string;
  showLoader?: boolean;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  uri,
  fallbackUri = DEFAULT_FALLBACK,
  showLoader = true,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSource = hasError ? { uri: fallbackUri } : { uri: uri || fallbackUri };

  return (
    <View style={[styles.container, style]}>
      <Image
        {...props}
        source={imageSource}
        style={[StyleSheet.absoluteFill, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && showLoader && (
        <View style={[styles.loaderContainer, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
      {hasError && !fallbackUri && (
        <View style={[styles.fallbackContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="image-outline" size={32} color={colors.textMuted} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  fallbackContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
