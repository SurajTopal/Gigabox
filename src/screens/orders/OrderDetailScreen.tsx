import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import MapView from '../../components/MapView';
import { GOOGLE_MAPS_API_KEY } from '../../config/apiConfig';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateOrderStatus } from '../../store/slices/ordersSlice';
import { styles } from './OrderDetailScreen.styles';

interface OrderDetailScreenProps {
  route: any;
  navigation: any;
}

const STORE = {
  lat: 13.041468,
  lng: 77.611759,
  label: 'Top N Top Salon',
};

const DELIVERY = {
  lat: 13.0378463,
  lng: 77.6158119,
  label: 'Indian Luxury PG',
};

const STATUS_TIMELINE = [
  { status: 'Processing', icon: '📋', time: '2 hours ago' },
  { status: 'Packed', icon: '📦', time: 'Will be soon' },
  { status: 'In Transit', icon: '🚚', time: 'Will be soon' },
  { status: 'Delivered', icon: '✅', time: 'Will be soon' },
];

export default function OrderDetailScreen({ route, navigation }: OrderDetailScreenProps) {
  const { order: orderParam } = route.params;
  const dispatch = useAppDispatch();
  // route.params holds a snapshot taken at navigation time, so the live row is
  // read from the store to pick up the status change on arrival.
  const order =
    useAppSelector(state => state.orders.orders.find(o => o.id === orderParam.id)) ??
    orderParam;
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const getCurrentStatusIndex = () => {
    switch (order.status) {
      case 'Processing':
        return 0;
      case 'In Transit':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const canCancelOrder = order.status !== 'Delivered' && order.status !== 'Cancelled';

  const handleCancelOrder = () => {
    setShowCancelDialog(false);
    // TODO: Dispatch cancelOrder action to Redux
    navigation.goBack();
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === 'disableScroll') {
        setScrollEnabled(false);
      } else if (message.action === 'enableScroll') {
        setScrollEnabled(true);
      } else if (message.action === 'delivered') {
        dispatch(updateOrderStatus({ id: order.id, status: 'Delivered' }));
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/${STORE.lat},${STORE.lng}/${DELIVERY.lat},${DELIVERY.lng}`;
    Linking.openURL(url).catch(err =>
      console.log('Error opening Google Maps:', err),
    );
  };

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="Order Details" showBack onBackPress={() => navigation.goBack()} />

      {/* Map Section - Fixed at Top */}
      <View style={styles.mapSection}>
        <View style={styles.mapHeader}>
          <Text style={styles.sectionTitle}>📍 Delivery Route</Text>
          <Button
            text="Open Maps"
            onPress={openGoogleMaps}
            variant="outline"
            size="small"
            fullWidth={false}
          />
        </View>
        <MapView
          storeLat={STORE.lat}
          storeLng={STORE.lng}
          deliveryLat={DELIVERY.lat}
          deliveryLng={DELIVERY.lng}
          storeAddress={STORE.label}
          deliveryAddress={DELIVERY.label}
          height={250}
          apiKey={GOOGLE_MAPS_API_KEY}
          onMessage={handleWebViewMessage}
        />
      </View>

      {/* Scrollable Order Details Section */}
      <ScrollView
        style={styles.detailsSection}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, styles[`status_${order.status}`]]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        {/* Status Progress Bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentStatusIndex + 1) / STATUS_TIMELINE.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.statusLabels}>
              {STATUS_TIMELINE.map((step, index) => (
                <View key={index} style={styles.statusLabel}>
                  <Text
                    style={[
                      styles.statusLabelText,
                      index <= currentStatusIndex && styles.statusLabelActive,
                    ]}>
                    {step.icon}
                  </Text>
                  <Text
                    style={[
                      styles.statusLabelName,
                      index <= currentStatusIndex && styles.statusLabelNameActive,
                    ]}>
                    {step.status}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Estimated Delivery */}
        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>📅 Estimated Delivery</Text>
            <Text style={styles.deliveryDate}>Sep 14, 2026</Text>
          </View>
        )}


        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{order.customer?.name || 'N/A'}</Text>

            <Text style={[styles.detailLabel, { marginTop: 12 }]}>Phone</Text>
            <Text style={styles.detailValue}>{order.customer?.phone || 'N/A'}</Text>

            <Text style={[styles.detailLabel, { marginTop: 12 }]}>Address</Text>
            <Text style={styles.detailValue}>{order.customer?.address || 'N/A'}</Text>

            <Text style={[styles.detailLabel, { marginTop: 12 }]}>Email</Text>
            <Text style={styles.detailValue}>{order.customer?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, index: number) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>₹{Math.round(item.price)}</Text>
                </View>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityLabel}>Qty: {item.quantity}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noItems}>No items in this order</Text>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ₹{Math.round(order.totalAmount * 0.9)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                ₹{Math.round(order.totalAmount * 0.1)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₹{Math.round(order.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {canCancelOrder && (
            <Button
              text="Cancel Order"
              onPress={() => setShowCancelDialog(true)}
              variant="danger"
              size="large"
              fullWidth
            />
          )}
          <Button
            text="Back to Orders"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="large"
            fullWidth
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Cancel Order?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </Text>
            <View style={styles.dialogButtons}>
              <Button
                text="No, Keep It"
                onPress={() => setShowCancelDialog(false)}
                variant="secondary"
                size="medium"
                fullWidth
              />
              <Button
                text="Yes, Cancel"
                onPress={handleCancelOrder}
                variant="danger"
                size="medium"
                fullWidth
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
