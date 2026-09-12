import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { styles } from './OrdersScreen.styles';
import { useAppSelector } from '../../store';

interface OrdersScreenProps {
  navigation: any;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return '#fef3c7';
    case 'In Transit':
      return '#dbeafe';
    case 'Delivered':
      return '#d1fae5';
    case 'Cancelled':
      return '#fee2e2';
    default:
      return '#f3f4f6';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Processing':
      return '📋';
    case 'In Transit':
      return '🚚';
    case 'Delivered':
      return '✅';
    case 'Cancelled':
      return '❌';
    default:
      return '📦';
  }
};

const OrderCard = React.memo(({ order, onPress }: any) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={styles.orderDate}>{order.date}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
        <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
        <Text style={styles.statusText}>{order.status}</Text>
      </View>
    </View>

    <View style={styles.cardBody}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Items: {order.itemsCount}</Text>
        <Text style={styles.infoValue}>₹{Math.round(order.totalAmount)}</Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <Text style={styles.viewDetails}>View Details →</Text>
    </View>
  </TouchableOpacity>
));

OrderCard.displayName = 'OrderCard';

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const orders = useAppSelector(state => state.orders.orders);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title="My Orders" />

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyMessage}>Start shopping to place your first order</Text>
          <View style={{ width: '60%', marginTop: 20 }}>
            <Button
              text="Start Shopping"
              onPress={() => navigation.navigate('Home')}
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
