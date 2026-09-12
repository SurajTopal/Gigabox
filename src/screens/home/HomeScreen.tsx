import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import Header from '../../components/Header';
import { useProducts } from '../../hooks/useProducts';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { styles } from './HomeScreen.styles';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  discountPercentage: number;
  onNavigate: (id: number) => void;
  onAddToCart: (id: number, title: string, price: number, quantity: number) => void;
}

// Modern product card with image and discount
const ProductCard = React.memo(
  ({ id, title, price, rating, stock, thumbnail, discountPercentage, onNavigate, onAddToCart }: ProductCardProps) => {
    const inStock = stock > 0;
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const discountedPrice = Math.round(price * (1 - discountPercentage / 100));

    // Handle quantity change
    const handleDecrement = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

    const handleIncrement = () => {
      if (quantity < stock) {
        setQuantity(quantity + 1);
      } else {
        Toast.show({
          type: 'info',
          text1: `Max quantity - Only ${stock} available`,
        });
      }
    };

    const handleAddToCart = () => {
      onAddToCart(id, title, price, quantity);
    };

    return (
      <TouchableOpacity style={styles.productCard} activeOpacity={1} onPress={() => onNavigate(id)}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          {!imageError && thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={styles.productImageUrl}
              onError={() => setImageError(true)}
            />
          ) : (
            <Text style={styles.productImageFallback}>📦</Text>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{Math.round(discountPercentage)}%</Text>
            </View>
          )}

          {/* Stock Badge */}
          <View
            style={[
              styles.stockBadge,
              inStock ? styles.stockBadgeGreen : styles.stockBadgeRed,
            ]}>
            <Text style={styles.stockBadgeText}>{inStock ? `${stock}` : 'Out'}</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.cardContent}>
          {/* Title */}
          <Text style={styles.productTitle} numberOfLines={2}>
            {title}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>★★★★☆</Text>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{discountedPrice}</Text>
            {discountPercentage > 0 && (
              <Text style={styles.originalPrice}>₹{Math.round(price)}</Text>
            )}
          </View>

          {/* Quantity & Add to Cart */}
          <View style={styles.cartSection}>
            {/* Quantity Control */}
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
                disabled={quantity <= 1}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={[styles.addToCartBtn, !inStock && styles.addToCartBtnDisabled]}
              onPress={handleAddToCart}
              disabled={!inStock}>
              <Text style={styles.addToCartBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { products, loading, error, reload, loadMore, searchResults, searching, handleSearch } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Navigate to product details
  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetail', { productId });
    },
    [navigation],
  );

  // Add to cart and navigate
  const handleAddToCart = useCallback(
    (id: number, title: string, price: number, quantity: number) => {
      dispatch(
        addToCart({
          id: id.toString(),
          name: title,
          price,
          quantity,
        }),
      );
      navigation.navigate('Cart');
    },
    [dispatch, navigation],
  );

  // Handle search with debounce (500ms)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer - search only after user stops typing
      if (text.trim()) {
        debounceTimer.current = setTimeout(() => {
          handleSearch(text);
        }, 500);
      }
    },
    [handleSearch],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Load more products on scroll end
  const handleLoadMore = useCallback(() => {
    if (!loading) {
      loadMore();
    }
  }, [loading, loadMore]);

  const handleFilterPress = () => {
    console.log('Filter pressed');
    // TODO: Open filter modal/sheet
  };

  // Loading indicator at bottom
  const renderFooter = () => {
    if (!loading || products.length === 0) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  };

  // Empty/error states
  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Gigabox" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ color: '#999' }}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Gigabox" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Text style={{ color: '#dc2626', fontSize: 14 }}>Error: {error}</Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#2563eb',
              borderRadius: 6,
            }}
            onPress={reload}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Gigabox" />

      {/* Search & Filter Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Product list */}
      {searchQuery.trim() ? (
        // Show search results
        searchResults.length > 0 ? (
          <FlashList
            data={searchResults}
            renderItem={({ item }) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                stock={item.stock}
                thumbnail={item.thumbnail}
                discountPercentage={item.discountPercentage}
                onNavigate={handleProductPress}
                onAddToCart={handleAddToCart}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            scrollIndicatorInsets={{ right: 1 }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>No results found</Text>
          </View>
        )
      ) : products.length > 0 ? (
        // Show all products
        <FlashList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              rating={item.rating}
              stock={item.stock}
              thumbnail={item.thumbnail}
              discountPercentage={item.discountPercentage}
              onNavigate={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          scrollIndicatorInsets={{ right: 1 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>No products found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
