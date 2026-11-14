import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
  actionTitle?: string;
  onAction?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  onDismiss,
  actionTitle,
  onAction,
  duration = 2500,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'info':
        return 'information-circle';
      case 'success':
      default:
        return 'checkmark-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return colors.error;
      case 'info':
        return colors.accent;
      case 'success':
      default:
        return colors.accent;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          transform: [{ translateY }],
          opacity,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <Ionicons name={getIconName()} size={20} color={getIconColor()} style={styles.icon} />
        <Text
          numberOfLines={2}
          style={[
            styles.message,
            {
              color: colors.text,
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.medium,
            },
          ]}
        >
          {message}
        </Text>
        {actionTitle && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
            <Text
              style={[
                styles.actionText,
                {
                  color: colors.accent,
                  fontSize: typography.sizes.caption,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              {actionTitle.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
  },
  actionBtn: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    letterSpacing: 1,
  },
});

