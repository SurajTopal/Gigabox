import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = false, onBackPress, rightAction }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 50 }} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={{ width: 50 }}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    color: COLORS.accent,
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
});
