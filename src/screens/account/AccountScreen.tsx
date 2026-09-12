import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useAppSelector } from '../../store';
import { styles } from './AccountScreen.styles';

interface AccountScreenProps {
  navigation: any;
}

export default function AccountScreen({ navigation }: AccountScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Suraj Topal',
    email: 'suraj@b4igodev.com',
    phone: '+91 98765 43210',
    address: 'Bangalore, Karnataka',
  });

  const orders = useAppSelector(state => state.orders.orders);
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      Alert.alert('Error', 'Name and Email are required');
      return;
    }
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          Alert.alert('Logged out', 'You have been logged out successfully');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="My Account" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{Math.round(totalSpent)}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⭐ 4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Edit Profile Section */}
        {isEditing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={profileData.name}
                onChangeText={value => handleInputChange('name', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={profileData.email}
                onChangeText={value => handleInputChange('email', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
                value={profileData.phone}
                onChangeText={value => handleInputChange('phone', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textAreaInput]}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                value={profileData.address}
                onChangeText={value => handleInputChange('address', value)}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonGroup}>
              <Button
                text="Save Changes"
                onPress={handleSaveProfile}
                variant="primary"
                fullWidth
              />
              <Button
                text="Cancel"
                onPress={() => setIsEditing(false)}
                variant="secondary"
                fullWidth
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        ) : (
          <>
            {/* Profile Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Details</Text>
              <View style={styles.detailBox}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{profileData.phone}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{profileData.email}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{profileData.address}</Text>
                </View>
              </View>
            </View>

            {/* Quick Links */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Links</Text>
              <TouchableOpacity
                style={styles.linkBox}
                onPress={() => navigation.navigate('Orders')}>
                <Text style={styles.linkIcon}>📦</Text>
                <View style={styles.linkInfo}>
                  <Text style={styles.linkTitle}>Your Orders</Text>
                  <Text style={styles.linkSubtitle}>View order history</Text>
                </View>
                <Text style={styles.linkArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.linkBox, styles.linkBoxMargin]}
                onPress={() => Alert.alert('Coming Soon', 'Wishlist feature coming soon!')}>
                <Text style={styles.linkIcon}>❤️</Text>
                <View style={styles.linkInfo}>
                  <Text style={styles.linkTitle}>Wishlist</Text>
                  <Text style={styles.linkSubtitle}>Saved items</Text>
                </View>
                <Text style={styles.linkArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.linkBox, styles.linkBoxMargin]}
                onPress={() => Alert.alert('Coming Soon', 'Reviews feature coming soon!')}>
                <Text style={styles.linkIcon}>⭐</Text>
                <View style={styles.linkInfo}>
                  <Text style={styles.linkTitle}>My Reviews</Text>
                  <Text style={styles.linkSubtitle}>Rated products</Text>
                </View>
                <Text style={styles.linkArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => Alert.alert('Info', 'Notifications enabled')}>
                <Text style={styles.settingLabel}>🔔 Push Notifications</Text>
                <Text style={styles.settingToggle}>On</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.settingRow, styles.settingRowBorder]}
                onPress={() => Alert.alert('Info', 'Dark mode disabled')}>
                <Text style={styles.settingLabel}>🌙 Dark Mode</Text>
                <Text style={styles.settingToggle}>Off</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.section}>
              <Button
                text="Logout"
                onPress={handleLogout}
                variant="danger"
                size="large"
                fullWidth
              />
            </View>

            {/* App Info */}
            <View style={styles.appInfo}>
              <Text style={styles.appInfoText}>Gigabox Mini v1.0.0</Text>
              <Text style={styles.appInfoSubtext}>© 2026 Gigabox. All rights reserved.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
