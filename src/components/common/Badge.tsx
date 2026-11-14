import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'primary' | 'outline' | 'sale' | 'success';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'accent',
  size = 'sm',
  style,
  textStyle,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'accent':
        return colors.accent;
      case 'sale':
        return colors.badgeBackground;
      case 'success':
        return colors.success;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'accent':
      case 'sale':
        return colors.badgeText;
      case 'success':
        return '#FFFFFF';
      case 'outline':
        return colors.text;
      case 'primary':
      default:
        return colors.secondary;
    }
  };

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: borderRadius.xs,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 2 : 4,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: isSmall ? typography.sizes.tiny : typography.sizes.caption,
            fontWeight: typography.weights.bold,
            letterSpacing: typography.letterSpacings.wide,
          },
          textStyle,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textTransform: 'uppercase',
  },
});

