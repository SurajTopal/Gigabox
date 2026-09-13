import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import MapView from '../../components/MapView';
import OrderSuccessModal from '../../components/OrderSuccessModal';
import { GOOGLE_MAPS_API_KEY } from '../../config/apiConfig';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateOrderStatus,
  Order,
  OrderStatus,
  ORDER_STATUS_LABEL,
} from '../../store/slices/ordersSlice';
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

const STATUS_TIMELINE: {
  status: OrderStatus;
  icon: string;
  color: string;
  tint: string;
  description: string;
}[] = [
  {
    status: 'PLACED',
    icon: '📋',
    color: '#2F6BFF',
    tint: '#EAF2FE',
    description: 'Your order has been successfully placed.',
  },
  {
    status: 'PACKED',
    icon: '📦',
    color: '#F5871F',
    tint: '#FDF1E3',
    description: 'Your order is being packed at our warehouse.',
  },
  {
    status: 'OUT_FOR_DELIVERY',
    icon: '🛵',
    color: '#8B5CF6',
    tint: '#EEEBFB',
    description: 'Your order is on the way to your address.',
  },
  {
    status: 'DELIVERED',
    icon: '✅',
    color: '#1DA65A',
    tint: '#E7F6EC',
    description: 'Your order has been delivered successfully.',
  },
];

export default function OrderDetailScreen({ route, navigation }: OrderDetailScreenProps) {
  const { order: orderParam, justPlaced } = route.params;
  const dispatch = useAppDispatch();
  // route.params holds a snapshot taken at navigation time, so the live row is
  // read from the store to pick up the status change on arrival.
  const order: Order =
    useAppSelector(state => state.orders.orders.find(o => o.id === orderParam.id)) ??
    orderParam;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // navigate() reuses an already-mounted OrderDetail and merges params, so this
  // can't be a useState initialiser — that only runs for the first order.
  useEffect(() => {
    if (justPlaced) {
      setShowSuccess(true);
    }
  }, [justPlaced, orderParam.id]);

  const getCurrentStatusIndex = () =>
    Math.max(
      STATUS_TIMELINE.findIndex(step => step.status === order.status),
      0,
    );

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === 'disableScroll') {
        setScrollEnabled(false);
      } else if (message.action === 'enableScroll') {
        setScrollEnabled(true);
      } else if (message.action === 'delivered') {
        dispatch(updateOrderStatus({ id: order.id, status: 'DELIVERED' }));
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
  const currentStep = STATUS_TIMELINE[currentStatusIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="Order Details" />

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
          phase={
            order.status === 'DELIVERED'
              ? 'delivered'
              : order.status === 'OUT_FOR_DELIVERY'
              ? 'moving'
              : 'waiting'
          }
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
            <Text style={styles.statusText}>
              {ORDER_STATUS_LABEL[order.status]}
            </Text>
          </View>
        </View>

        {/* Status Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <Text style={styles.sectionSubtitle}>
            Track your order from placement to delivery.
          </Text>

          <View style={[styles.statusCard, { backgroundColor: currentStep.tint }]}>
            <Text style={styles.statusCardIcon}>{currentStep.icon}</Text>
            <Text style={[styles.statusCardTitle, { color: currentStep.color }]}>
              {ORDER_STATUS_LABEL[currentStep.status]}
            </Text>
            <Text style={styles.statusCardDescription}>
              {currentStep.description}
            </Text>
          </View>

          <View style={styles.track}>
            {STATUS_TIMELINE.map((step, index) => {
              const reached = index <= currentStatusIndex;
              return (
                <React.Fragment key={step.status}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.trackLine,
                        reached && { backgroundColor: step.color },
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.trackDot,
                      reached
                        ? { backgroundColor: step.color }
                        : styles.trackDotPending,
                    ]}>
                    {reached && <Text style={styles.trackCheck}>✓</Text>}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Estimated Delivery */}
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
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
                ₹{Math.round(order.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                ₹{Math.round(order.deliveryCharges)}
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
          <Button
            text="Back to Orders"
            onPress={() => navigation.navigate('OrdersMain')}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>

      <OrderSuccessModal
        visible={showSuccess}
        orderId={order.id}
        totalAmount={order.totalAmount}
        onTrackOrder={() => setShowSuccess(false)}
        onContinueShopping={() => {
          setShowSuccess(false);
          navigation.navigate('Home', { screen: 'HomeMain' });
        }}
      />
    </SafeAreaView>
  );
}
