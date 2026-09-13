import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearCart } from '../../store/slices/cartSlice';
import { addOrder, Order } from '../../store/slices/ordersSlice';
import { getDeliveryCharge, getOrderTotal } from '../../utils/price';
import { styles } from './CheckoutScreen.styles';

interface CheckoutScreenProps {
  navigation: any;
}

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const totalAmount = useAppSelector(state => state.cart.totalAmount);
  // Sum of quantities, not line count: 3 of one product is 3 items, not 1.
  const totalItems = useAppSelector(state => state.cart.totalItems);

  const profile = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const deliveryCharges = getDeliveryCharge(totalAmount);
  const finalTotal = getOrderTotal(totalAmount);

  const handlePlaceOrder = async () => {
    // Checkout stays mounted after ordering, so it's reachable again with an
    // emptied cart — without this it would create a delivery-charge-only order.
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Add items to your cart before ordering.');
      return;
    }

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
        itemsCount: totalItems,
        subtotal: totalAmount,
        deliveryCharges,
        totalAmount: finalTotal,
        status: 'PLACED',
        placedAt: Date.now(),
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
      // Lands on the live tracking screen; the success modal opens over it.
      navigation.navigate('Orders', {
        screen: 'OrderDetail',
        params: { order: newOrder, justPlaced: true },
        // Without this OrderDetail becomes the stack's only screen, leaving
        // nothing for "Back to Orders" to go back to.
        initial: false,
      });
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
        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items ({totalItems})
          </Text>
          <View style={styles.itemsBox}>
            {cartItems.map((item, index) => (
              <View
                key={item.id}
                style={[styles.itemRow, index > 0 && styles.itemRowDivider]}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemMeta}>
                    ₹{Math.round(item.price)} × {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ₹{Math.round(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
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
