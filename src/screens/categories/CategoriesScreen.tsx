import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './CategoriesScreen.styles';

export default function CategoriesScreen() {
  const categories = [
    {id: 1, name: 'Kitchen', icon: '🍳', count: '1,234 items'},
    {id: 2, name: 'Sports', icon: '⚽', count: '856 items'},
    {id: 3, name: 'Dry Fruits', icon: '🥜', count: '432 items'},
    {id: 4, name: 'Groceries', icon: '🛒', count: '2,145 items'},
    {id: 5, name: 'Electronics', icon: '📱', count: '678 items'},
    {id: 6, name: 'Fashion', icon: '👕', count: '1,567 items'},
    {id: 7, name: 'Home & Living', icon: '🏠', count: '923 items'},
    {id: 8, name: 'Books', icon: '📚', count: '541 items'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>

        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
