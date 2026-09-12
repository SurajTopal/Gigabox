import { StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
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
  processingStatus: {
    backgroundColor: '#dbeafe',
    color: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
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
    marginBottom: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  viewOrdersBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewOrdersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
