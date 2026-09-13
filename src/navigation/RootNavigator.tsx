import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/productDetail/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orderDetail/OrderDetailScreen';
import AccountScreen from '../screens/account/AccountScreen';
import {COLORS} from '../utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_BAR_HEIGHT = 70;

// Home Stack with ProductDetailScreen and CartScreen
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

// Orders Stack with OrderDetailScreen
function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrdersMain" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();

  // BottomTabBar treats a numeric height as the total and adds insets.bottom as
  // padding itself, so only the height needs the inset added here.
  const tabBarStyle = [
    styles.tabBar,
    {height: TAB_BAR_HEIGHT + insets.bottom},
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24, color}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24, color}}>📦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24, color}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.primary,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    marginTop: 4,
  },
});
