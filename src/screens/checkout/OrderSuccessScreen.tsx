import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { styles } from './OrderSuccessScreen.styles';

interface OrderSuccessScreenProps {
  route: any;
  navigation: any;
}

export default function OrderSuccessScreen({ route, navigation }: OrderSuccessScreenProps) {
  const { orderId, totalAmount } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('HomeMain');
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.successIcon}>✅</Text>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>Your order has been confirmed</Text>

        {/* Order Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.detailValue}>₹{Math.round(totalAmount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.processingStatus]}>Processing</Text>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📧 A confirmation email has been sent to your registered email address.
          </Text>
          <Text style={styles.infoText}>
            🚚 You can track your order status in the Orders section.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          text="View Orders"
          onPress={handleViewOrders}
          variant="primary"
          size="large"
          fullWidth
        />

        <Button
          text="Continue Shopping"
          onPress={handleContinueShopping}
          variant="secondary"
          size="large"
          fullWidth
          style={{ marginTop: 12 }}
        />
      </View>
    </SafeAreaView>
  );
}
