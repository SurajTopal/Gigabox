import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {styles} from './HomeScreen.styles';

export default function HomeScreen() {
  const categories = [
    {id: 1, name: 'Kitchen', icon: '🍳'},
    {id: 2, name: 'Sports', icon: '⚽'},
    {id: 3, name: 'Dry Fruits', icon: '🥜'},
    {id: 4, name: 'Groceries', icon: '🛒'},
  ];

  const products = [
    {id: 1, name: 'Cricket Bat', price: '₹15,840', discount: '28% OFF'},
    {id: 2, name: 'Badminton Set', price: '₹5,999', discount: '15% OFF'},
    {id: 3, name: 'Football', price: '₹2,499', discount: '10% OFF'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.icon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.icon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Delivery Info */}
        <View style={styles.deliveryBanner}>
          <View style={styles.deliveryLeft}>
            <Text style={styles.lightningIcon}>⚡</Text>
            <View>
              <Text style={styles.deliveryTime}>60 minutes</Text>
              <Text style={styles.deliveryArea}>Cantt Area</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {['Kitchen', 'Sports', 'Dry Fruits', 'Upcoming'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTab,
                cat === 'Sports' && styles.categoryTabActive,
              ]}>
              <Text
                style={[
                  styles.categoryTabText,
                  cat === 'Sports' && styles.categoryTabTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Offer Banner */}
        <View style={styles.offerBanner}>
          <View style={styles.offerContent}>
            <Text style={styles.offerDate}>26JAN-10</Text>
            <Text style={styles.offerText}>10% OFF</Text>
            <Text style={styles.offerSmallText}>Republic Offer Live™</Text>
          </View>
          <View style={styles.offerBadge}>
            <Text style={styles.badgeEmoji}>🎉</Text>
            <Text style={styles.badgeText}>SPECIAL</Text>
            <Text style={styles.badgeText}>OFFER</Text>
          </View>
        </View>

        {/* Shop by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by category</Text>
          <TouchableOpacity>
            <Text style={styles.sectionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
        </View>

        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImageContainer}>
              <Text style={styles.productImagePlaceholder}>🏏</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Text style={styles.discount}>{product.discount}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
