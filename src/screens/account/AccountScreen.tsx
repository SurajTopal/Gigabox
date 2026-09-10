import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './AccountScreen.styles';
import { useAppDispatch, useAppSelector, logout, setUserProfile } from '../../store';

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle: string;
}

const MenuItem = React.memo(({ icon, label, subtitle }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <View style={styles.menuContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
));

MenuItem.displayName = 'MenuItem';

export default function AccountScreen() {
  const dispatch = useAppDispatch();
  const { name, email, phone, isLoggedIn, addresses } = useAppSelector(state => state.user);

  // Account menu options
  const menuItems = useMemo(
    () => [
      { id: 1, icon: '👤', label: 'Profile Details', subtitle: phone || 'Add phone' },
      { id: 2, icon: '📍', label: 'Addresses', subtitle: `${addresses.length} saved` },
      { id: 3, icon: '💳', label: 'Payments', subtitle: 'Manage methods' },
      { id: 4, icon: '🎁', label: 'Offers & Rewards', subtitle: 'Active promo codes' },
      { id: 5, icon: '🆘', label: 'Help & Support', subtitle: '24/7 support' },
      { id: 6, icon: '⚙️', label: 'Settings', subtitle: 'Preferences' },
    ],
    [phone, addresses.length],
  );

  // Toggle login/logout
  const handleAuthToggle = useCallback(() => {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      dispatch(
        setUserProfile({
          name: 'Suraj Topal',
          email: 'suraj@example.com',
          phone: '+91 9876543210',
          isLoggedIn: true,
        }),
      );
    }
  }, [dispatch, isLoggedIn]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{isLoggedIn ? name : 'Not Logged In'}</Text>
            <Text style={styles.profileEmail}>
              {isLoggedIn ? email : 'Login to manage your account'}
            </Text>
          </View>
        </View>

        {/* Account menu section */}
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            subtitle={item.subtitle}
          />
        ))}

        {/* Login/Logout button */}
        <TouchableOpacity style={styles.authButton} onPress={handleAuthToggle}>
          <Text style={styles.authText}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
