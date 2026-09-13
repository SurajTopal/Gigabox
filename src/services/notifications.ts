import notifee, {
  AndroidImportance,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import {
  PACKED_AT_MS,
  OUT_FOR_DELIVERY_AT_MS,
  DELIVERED_AT_MS,
} from '../store/slices/ordersSlice';

const CHANNEL_ID = 'order-updates';

// Android holds these in its own alarm system, so they still fire once the app
// is closed. Ids are derived from the order so they can be cancelled later.
const STAGES = [
  { key: 'PACKED', at: PACKED_AT_MS, title: 'Order packed', body: 'Your order is packed and ready to go.' },
  { key: 'OUT', at: OUT_FOR_DELIVERY_AT_MS, title: 'Out for delivery', body: 'Your order is on the way to your address.' },
  { key: 'DELIVERED', at: DELIVERED_AT_MS, title: 'Delivered', body: 'Your order has been delivered. Enjoy!' },
];

export async function initNotifications() {
  try {
    await notifee.requestPermission();
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Order updates',
      importance: AndroidImportance.HIGH,
    });
  } catch (e) {
    console.warn('Notification setup failed', e);
  }
}

export async function scheduleOrderNotifications(
  orderId: string,
  placedAt: number,
) {
  for (const stage of STAGES) {
    const fireAt = placedAt + stage.at;
    // Skip stages already in the past — scheduling those throws.
    if (fireAt <= Date.now()) continue;

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: fireAt,
    };

    try {
      await notifee.createTriggerNotification(
        {
          id: `${orderId}-${stage.key}`,
          title: stage.title,
          body: stage.body,
          android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
        },
        trigger,
      );
    } catch (e) {
      console.warn('Could not schedule ' + stage.key, e);
    }
  }
}

export async function cancelOrderNotifications(orderId: string) {
  for (const stage of STAGES) {
    try {
      await notifee.cancelNotification(`${orderId}-${stage.key}`);
    } catch {
      // Nothing scheduled for this stage.
    }
  }
}
