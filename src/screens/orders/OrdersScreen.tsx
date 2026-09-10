import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './OrdersScreen.styles';

export default function OrdersScreen() {
  const orders = [
    {id: 1, name: 'Cricket Bat Pro', status: 'Delivered', date: 'Jan 10, 2025'},
    {id: 2, name: 'Basketball Set', status: 'In Transit', date: 'Jan 12, 2025'},
    {id: 3, name: 'Kitchen Utensils', status: 'Processing', date: 'Jan 15, 2025'},
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'In Transit':
        return '#FF9800';
      case 'Processing':
        return '#2196F3';
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
          orders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardLeft}>
                <Text style={styles.orderIcon}>📦</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderName}>{order.name}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(order.status)},
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
