import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {styles} from './SearchScreen.styles';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  const recentSearches = ['Cricket Bat', 'Basketball', 'Kitchen Utensils'];
  const suggestedProducts = [
    {id: 1, name: 'Cricket Bat Pro', price: '₹15,840'},
    {id: 2, name: 'Sports Shoes', price: '₹4,999'},
    {id: 3, name: 'Kitchen Set', price: '₹8,999'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="What are you looking for?"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!searchText && (
          <>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity key={index} style={styles.searchItem}>
                <Text style={styles.searchItemIcon}>🕐</Text>
                <Text style={styles.searchItemText}>{search}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, {marginTop: 24}]}>
              Suggested Products
            </Text>
            {suggestedProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Text style={styles.productImageEmoji}>📦</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {searchText && (
          <>
            <Text style={styles.searchResultsTitle}>
              Results for "{searchText}"
            </Text>
            <View style={styles.noResults}>
              <Text style={styles.noResultsIcon}>🔍</Text>
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          </>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
