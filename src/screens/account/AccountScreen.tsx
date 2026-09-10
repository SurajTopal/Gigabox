import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './AccountScreen.styles';
import { useAppDispatch, useAppSelector, logout, setUserProfile } from '../../store';

export default function AccountScreen() {
  const dispatch = useAppDispatch();
  const { name, email, phone, isLoggedIn, addresses } = useAppSelector(state => state.user);

  const menuItems = [
    { id: 1, icon: '👤', label: 'Profile Details', subtitle: `${phone}` },
    {
      id: 2,
      icon: '📍',
      label: 'Addresses',
      subtitle: `${addresses.length} saved addresses`,
    },
    { id: 3, icon: '💳', label: 'Payments', subtitle: 'Saved payment methods' },
    {
      id: 4,
      icon: '🎁',
      label: 'Offers & Rewards',
      subtitle: 'View active promo codes',
    },
    { id: 5, icon: '🆘', label: 'Help & Support', subtitle: '24/7 customer support' },
    {
      id: 6,
      icon: '⚙️',
      label: 'Settings',
      subtitle: 'App preferences & notifications',
    },
  ];

  const handleLogoutToggle = () => {
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {isLoggedIn ? name : 'Logged Out'}
            </Text>
            <Text style={styles.profileEmail}>
              {isLoggedIn ? email : 'Please log in to manage your account'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout / Login Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutToggle}>
          <Text style={styles.logoutText}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
