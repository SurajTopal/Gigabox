import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './OrdersScreen.styles';
import { useAppSelector } from '../../store';

// Status color mapping for visual feedback
const STATUS_COLORS = {
  Delivered: '#10b981',
  'In Transit': '#f59e0b',
  Processing: '#3b82f6',
  Cancelled: '#ef4444',
};

interface OrderItemProps {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: string;
}

const OrderItem = React.memo(({ id, date, itemsCount, totalAmount, status }: OrderItemProps) => (
  <TouchableOpacity style={styles.orderCard}>
    <Text style={styles.orderIcon}>📦</Text>
    <View style={styles.orderInfo}>
      <Text style={styles.orderId}>{id}</Text>
      <Text style={styles.orderMeta}>
        {date} • {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} • ₹{totalAmount}
      </Text>
    </View>
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#999' },
      ]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </TouchableOpacity>
));

OrderItem.displayName = 'OrderItem';

export default function OrdersScreen() {
  const orders = useAppSelector(state => state.orders.orders);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Orders</Text>

        {/* Order list or empty state */}
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderItem
              key={order.id}
              id={order.id}
              date={order.date}
              itemsCount={order.itemsCount}
              totalAmount={order.totalAmount}
              status={order.status}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Start shopping to see your orders here</Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}
