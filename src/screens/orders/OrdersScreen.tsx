import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './OrdersScreen.styles';
import { useAppSelector } from '../../store';

export default function OrdersScreen() {
  const orders = useAppSelector(state => state.orders.orders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'In Transit':
        return '#FF9800';
      case 'Processing':
        return '#2196F3';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Orders</Text>

        {orders.length > 0 ? (
          orders.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardLeft}>
                <Text style={styles.orderIcon}>📦</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderName}>{order.id}</Text>
                <Text style={styles.orderDate}>
                  {order.date} • {order.itemsCount} {order.itemsCount === 1 ? 'Item' : 'Items'} • ₹{order.totalAmount}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Start shopping to see your orders here
            </Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}
