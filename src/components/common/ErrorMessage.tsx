import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  retryTitle?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Something went wrong. Please check your connection and try again.',
  onRetry,
  retryTitle = 'RETRY',
}) => {
  const { colors, typography, borderRadius } = useTheme();

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
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
      </View>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.sizes.bodyLarge,
            fontWeight: typography.weights.bold,
          },
        ]}
      >
        NOTICE
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: colors.textSecondary,
            fontSize: typography.sizes.body,
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <View style={styles.buttonWrapper}>
          <Button title={retryTitle} onPress={onRetry} variant="outline" size="sm" fullWidth={false} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    borderWidth: 1,
  },
  iconCircle: {
    marginBottom: 8,
  },
  title: {
    letterSpacing: 1,
    marginBottom: 6,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonWrapper: {
    minWidth: 120,
  },
});

