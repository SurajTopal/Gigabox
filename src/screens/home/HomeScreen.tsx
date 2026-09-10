import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { styles } from './HomeScreen.styles';
import { useAppDispatch, useAppSelector, addToCart } from '../../store';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const totalCartItems = useAppSelector(state => state.cart.totalItems);
  const addresses = useAppSelector(state => state.user.addresses);
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  const [activeTab, setActiveTab] = useState('Sports');

  const categories = [
    { id: 1, name: 'Kitchen', icon: '🍳' },
    { id: 2, name: 'Sports', icon: '⚽' },
    { id: 3, name: 'Dry Fruits', icon: '🥜' },
    { id: 4, name: 'Groceries', icon: '🛒' },
  ];

  const products = [
    { id: '1', name: 'Cricket Bat Pro', price: 15840, rawPrice: '₹15,840', discount: '28% OFF', icon: '🏏' },
    { id: '2', name: 'Badminton Set', price: 5999, rawPrice: '₹5,999', discount: '15% OFF', icon: '🏸' },
    { id: '3', name: 'Football', price: 2499, rawPrice: '₹2,499', discount: '10% OFF', icon: '⚽' },
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }),
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.icon}>🛒</Text>
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
              </View>
            )}
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
              <Text style={styles.deliveryArea}>
                {defaultAddress ? defaultAddress.fullAddress : 'Select Location'}
              </Text>
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
              onPress={() => setActiveTab(cat)}
              style={[
                styles.categoryTab,
                cat === activeTab && styles.categoryTabActive,
              ]}>
              <Text
                style={[
                  styles.categoryTabText,
                  cat === activeTab && styles.categoryTabTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Offer Banner */}
        <View style={styles.offerBanner}>
          <View style={styles.offerContent}>
            <Text style={styles.offerDate}>SPECIAL PROMO</Text>
            <Text style={styles.offerText}>10% OFF</Text>
            <Text style={styles.offerSmallText}>Gigabox Special Live™</Text>
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
              <Text style={styles.productImagePlaceholder}>{product.icon}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.rawPrice}</Text>
              <Text style={styles.discount}>{product.discount}</Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(product)}>
                <Text style={styles.addToCartText}>+ Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
