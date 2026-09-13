import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useAppSelector, useAppDispatch } from '../../store';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { getDeliveryCharge, getOrderTotal } from '../../utils/price';
import { styles } from './CartScreen.styles';

interface CartScreenProps {
  navigation: any;
}

const CartItem = React.memo(
  ({ id, name, price, quantity, onRemove, onUpdateQuantity }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.itemPrice}>₹{Math.round(price)}</Text>
      </View>

      <View style={styles.quantitySection}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(id, quantity + 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(id)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  ),
);

CartItem.displayName = 'CartItem';

export default function CartScreen({ navigation }: CartScreenProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const totalAmount = useAppSelector(state => state.cart.totalAmount);

  const deliveryCharges = getDeliveryCharge(totalAmount);
  const orderTotal = getOrderTotal(totalAmount);

  const handleRemove = useCallback(
    (itemId: number) => {
      dispatch(removeFromCart(itemId));
    },
    [dispatch],
  );

  const handleUpdateQuantity = useCallback(
    (itemId: number, newQuantity: number) => {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    },
    [dispatch],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* A tab root has nothing beneath it, so no back arrow. */}
      <Header title="My Cart" />

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <CartItem
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.cartListContainer}
          />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>₹{Math.round(totalAmount)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges :</Text>
              <Text style={styles.summaryValue}>₹{deliveryCharges}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₹{Math.round(orderTotal)}</Text>
            </View>

            <Button
              text="Proceed to Checkout"
              onPress={() => navigation.navigate('Checkout')}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <View style={{ width: '70%' }}>
            <Button
              text="Continue Shopping"
              onPress={() => navigation.navigate('Home', { screen: 'HomeMain' })}
              variant="primary"
              size="medium"
              fullWidth
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
