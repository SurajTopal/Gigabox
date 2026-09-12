import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapSection: {
    height: 320,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  status_PLACED: {
    backgroundColor: '#fef3c7',
  },
  status_PACKED: {
    backgroundColor: '#fde68a',
  },
  status_OUT_FOR_DELIVERY: {
    backgroundColor: '#dbeafe',
  },
  status_DELIVERED: {
    backgroundColor: '#d1fae5',
  },
  status_CANCELLED: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Status progress
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: -6,
    marginBottom: 14,
  },
  statusCard: {
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusCardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  statusCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusCardDescription: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 18,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 4,
  },
  trackLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#e5e7eb',
  },
  trackDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackDotPending: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  trackCheck: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },

  // Delivery Info
  deliveryInfo: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  deliveryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },

  // Detail Box
  detailBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Item Card
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemQuantity: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  noItems: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Summary
  summaryBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Action Buttons
  actionButtons: {
    marginVertical: 24,
  },

  // Dialog
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  dialogMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  dialogButtons: {
    marginTop: 20,
  },
});
