import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearCart } from '../../store/slices/cartSlice';
import { addOrder, Order } from '../../store/slices/ordersSlice';
import { styles } from './CheckoutScreen.styles';

interface CheckoutScreenProps {
  navigation: any;
}

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const totalAmount = useAppSelector(state => state.cart.totalAmount);

  const profile = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const deliveryCharges = totalAmount > 99 ? 0 : 40;
  const finalTotal = totalAmount + deliveryCharges;

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate order ID
      const orderId = `ORD-${Date.now()}`;

      // Create order object
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        itemsCount: cartItems.length,
        totalAmount: finalTotal,
        status: 'PLACED',
        items: cartItems,
        customer: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        },
      };

      // Add order to Redux
      dispatch(addOrder(newOrder));

      // Clear cart
      dispatch(clearCart());

      // Navigate to success screen
      navigation.navigate('OrderSuccess', { orderId, totalAmount: finalTotal });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="Checkout" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{cartItems.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>₹{Math.round(totalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>₹{deliveryCharges}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₹{Math.round(finalTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deliver To</Text>
          <View style={styles.deliverToCard}>
            <Text style={styles.deliverToName}>{profile.name}</Text>
            <Text style={styles.deliverToAddress}>{profile.address}</Text>
            <Text style={styles.deliverToPhone}>{profile.phone}</Text>
          </View>
        </View>

        {/* Place Order Button */}
        <View style={styles.buttonSection}>
          <Button
            text="Place Order"
            onPress={handlePlaceOrder}
            loading={loading}
            disabled={loading}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
