import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'bag-outline',
  title,
  description,
  actionTitle,
  onActionPress,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <Ionicons name={iconName} size={48} color={colors.textSecondary} />
      </View>
      <Text
        style={[
          styles.title,
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
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.body,
            },
          ]}
        >
          {description}
        </Text>
      )}
      {actionTitle && onActionPress && (
        <View style={styles.actionWrapper}>
          <Button title={actionTitle} onPress={onActionPress} variant="primary" size="md" fullWidth={false} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  iconContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 24,
  },
  actionWrapper: {
    minWidth: 180,
  },
});

