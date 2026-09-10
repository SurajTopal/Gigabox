import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {styles} from './SettingsScreen.styles';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const settingsItems = [
    {id: 1, icon: '🔔', label: 'Notifications', type: 'toggle'},
    {id: 2, icon: '🌙', label: 'Dark Mode', type: 'toggle'},
    {id: 3, icon: '🌐', label: 'Language', subtitle: 'English'},
    {id: 4, icon: '📄', label: 'About', subtitle: 'v1.0.0'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {settingsItems.map((item) => (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                )}
              </View>
            </View>
            {item.type === 'toggle' && item.id === 1 && (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{false: '#ccc', true: '#FFD700'}}
                thumbColor={notificationsEnabled ? '#000000' : '#f4f3f4'}
              />
            )}
            {item.type === 'toggle' && item.id === 2 && (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{false: '#ccc', true: '#FFD700'}}
                thumbColor={darkMode ? '#000000' : '#f4f3f4'}
              />
            )}
            {item.type !== 'toggle' && (
              <Text style={styles.arrow}>›</Text>
            )}
          </View>
        ))}

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, {marginTop: 24, color: '#FF6B6B'}]}>
          Danger Zone
        </Text>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Clear Cache</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
