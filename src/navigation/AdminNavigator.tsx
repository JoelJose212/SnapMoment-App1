import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Users, CreditCard, MessageSquare, Settings } from 'lucide-react-native';

// Screens
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPhotographers from '../pages/admin/AdminPhotographers';
import AdminInvoices from '../pages/admin/AdminInvoices';
import AdminMessages from '../pages/admin/AdminMessages';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E24',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#FF6E6C',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard} 
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
          title: 'Panel'
        }}
      />
      <Tab.Screen 
        name="Photographers" 
        component={AdminPhotographers} 
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          title: 'Users'
        }}
      />
      <Tab.Screen 
        name="Invoices" 
        component={AdminInvoices} 
        options={{
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
          title: 'Billing'
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={AdminMessages} 
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          title: 'Inbox'
        }}
      />
    </Tab.Navigator>
  );
}
