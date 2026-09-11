import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useProducts } from '../../hooks/useProducts';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { styles } from './ProductDetailScreen.styles';

interface ProductDetailScreenProps {
  route: any;
  navigation: any;
}

export default function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { productId } = route.params;
  const { selectedProduct, loading, error, loadProductDetails } = useProducts();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductDetails(productId);
  }, [productId, loadProductDetails]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(
        addToCart({
          id: selectedProduct.id.toString(),
          name: selectedProduct.title,
          price: selectedProduct.price,
          quantity,
        }),
      );
      navigation.navigate('Cart');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const product = selectedProduct;
  const discountedPrice = Math.round(product.price * (1 - product.discountPercentage / 100));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.productImage}
            onError={() => {}}
          />
          {product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{Math.round(product.discountPercentage)}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Title */}
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Rating & Stock */}
          <View style={styles.metaRow}>
            <Text style={styles.rating}>★★★★☆ {product.rating.toFixed(1)}</Text>
            <Text style={[styles.stock, product.stock > 0 ? styles.stockGreen : styles.stockRed]}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
            {product.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>₹{Math.round(product.price)}</Text>
            )}
          </View>

          {/* Description */}
          <Text style={styles.descriptionLabel}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stock:</Text>
              <Text style={styles.detailValue}>{product.stock} units</Text>
            </View>
          </View>

          {/* Quantity Control */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (quantity < product.stock) {
                  setQuantity(quantity + 1);
                } else {
                  Toast.show({
                    type: 'info',
                    text1: `Max quantity - Only ${product.stock} available`,
                  });
                }
              }}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartButton, !product.stock && styles.buttonDisabled]}
            disabled={!product.stock}
            onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <>
              <Text style={styles.reviewsLabel}>Customer Reviews</Text>
              {product.reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                    <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
