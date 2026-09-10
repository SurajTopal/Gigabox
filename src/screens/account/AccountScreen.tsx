import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './AccountScreen.styles';

export default function AccountScreen() {
  const menuItems = [
    {id: 1, icon: '👤', label: 'Profile', subtitle: 'View and edit your profile'},
    {
      id: 2,
      icon: '📍',
      label: 'Addresses',
      subtitle: 'Manage delivery addresses',
    },
    {id: 3, icon: '💳', label: 'Payments', subtitle: 'Payment methods'},
    {
      id: 4,
      icon: '🎁',
      label: 'Offers & Rewards',
      subtitle: 'View active offers',
    },
    {id: 5, icon: '🆘', label: 'Help & Support', subtitle: 'Contact support'},
    {
      id: 6,
      icon: '⚙️',
      label: 'Settings',
      subtitle: 'App preferences',
    },
  ];

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
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>user@gigabox.com</Text>
          </View>
        </View>

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
