import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Button from './Button';
import { ORDER_STATUS_LABEL } from '../store/slices/ordersSlice';
import { COLORS } from '../utils/colors';

interface OrderSuccessModalProps {
  visible: boolean;
  orderId: string;
  totalAmount: number;
  onTrackOrder: () => void;
  onContinueShopping: () => void;
}

export default function OrderSuccessModal({
  visible,
  orderId,
  totalAmount,
  onTrackOrder,
  onContinueShopping,
}: OrderSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onTrackOrder}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>✅</Text>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>Your order has been confirmed</Text>

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
              <Text style={[styles.detailValue, styles.statusPill]}>
                {ORDER_STATUS_LABEL.PLACED}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📧 A confirmation email has been sent to your registered email
              address.
            </Text>
          </View>

          <Button
            text="Track Order"
            onPress={onTrackOrder}
            variant="primary"
            size="large"
            fullWidth
          />
          <Button
            text="Continue Shopping"
            onPress={onContinueShopping}
            variant="secondary"
            size="large"
            fullWidth
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: '#dbeafe',
    color: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },
});
