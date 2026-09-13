import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/colors';

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  text,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && { width: '100%' },
    (disabled || loading) && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={getIndicatorColor(variant)} size="small" />
      ) : (
        <Text style={textStyles}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

function getIndicatorColor(variant: string): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return 'white';
    case 'secondary':
    case 'outline':
      return COLORS.primary;
    default:
      return 'white';
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // Variants
  button_primary: {
    backgroundColor: COLORS.primary,
  },
  button_secondary: {
    backgroundColor: '#e5e7eb',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  button_danger: {
    backgroundColor: '#ef4444',
  },

  // Sizes
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: 'white',
    fontSize: 14,
  },
  text_secondary: {
    color: COLORS.text,
    fontSize: 14,
  },
  text_outline: {
    color: COLORS.primary,
    fontSize: 14,
  },
  text_danger: {
    color: 'white',
    fontSize: 14,
  },

  // Text sizes
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
});
