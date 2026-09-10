import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useProducts } from '../../hooks/useProducts';
import { styles } from './SearchScreen.styles';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchInput = React.memo(({ value, onChangeText, onClear }: SearchInputProps) => (
  <View style={styles.searchInputContainer}>
    <Text style={styles.searchIconLeft}>🔍</Text>
    <TextInput
      style={styles.searchInput}
      placeholder="Search products..."
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear} style={styles.clearButton}>
        <Text style={styles.clearIcon}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
));

SearchInput.displayName = 'SearchInput';

interface ProductListItemProps {
  id: number;
  title: string;
  price: number;
  discount: number;
  category: string;
}

const ProductListItem = React.memo(({ title, price, discount, category }: ProductListItemProps) => (
  <TouchableOpacity style={styles.resultItem}>
    <View style={styles.resultImage}>
      <Text style={{ fontSize: 32 }}>📦</Text>
    </View>
    <View style={styles.resultInfo}>
      <Text style={styles.resultTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.resultCategory}>{category}</Text>
      <View style={styles.resultFooter}>
        <Text style={styles.resultPrice}>₹{Math.round(price)}</Text>
        {discount > 0 && <Text style={styles.resultDiscount}>{discount}% OFF</Text>}
      </View>
    </View>
  </TouchableOpacity>
));

ProductListItem.displayName = 'ProductListItem';

export default function SearchScreen() {
  const { searchResults, searching, error, handleSearch } = useProducts();
  const [localQuery, setLocalQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback((text: string) => {
    setLocalQuery(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(text);
    }, 500);
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    handleSearch('');
  }, [handleSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const renderEmpty = useMemo(() => {
    if (!localQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Search for products</Text>
          <Text style={styles.emptySubtext}>Type to find items from our catalog</Text>
        </View>
      );
    }

    if (searching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>Please try again</Text>
        </View>
      );
    }

    if (localQuery.trim() && !searching && searchResults.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsIcon}>😢</Text>
          <Text style={styles.noResultsText}>No products found</Text>
          <Text style={styles.noResultsSubtext}>Try a different search term</Text>
        </View>
      );
    }

    return null;
  }, [localQuery, searching, error, searchResults.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <SearchInput
        value={localQuery}
        onChangeText={handleInputChange}
        onClear={handleClear}
      />

      {searchResults.length > 0 && !searching ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <ProductListItem
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              discount={item.discountPercentage || 0}
              category={item.category}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        renderEmpty
      )}

      {searching && searchResults.length > 0 && (
        <View style={styles.searchingOverlay}>
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}
    </View>
  );
}
