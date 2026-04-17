import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarDays, BarChart2, UserCheck, User } from 'lucide-react-native';

// Screens
import PhotographerEvents from '../pages/photographer/PhotographerEvents';
import PhotographerAnalytics from '../pages/photographer/PhotographerAnalytics';
import VIPMonitor from '../pages/photographer/VIPMonitor';
import PhotographerProfile from '../pages/photographer/PhotographerProfile';
import PhotographerUpload from '../pages/photographer/PhotographerUpload';
import PhotographerQR from '../pages/photographer/PhotographerQR';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsList" component={PhotographerEvents} />
      <Stack.Screen name="EventUpload" component={PhotographerUpload} />
      <Stack.Screen name="EventQR" component={PhotographerQR} />
    </Stack.Navigator>
  );
}

export default function PhotographerNavigator() {
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
        name="EventsTab" 
        component={EventsStack} 
        options={{
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
          title: 'Events'
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={PhotographerAnalytics} 
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          title: 'Stats'
        }}
      />
      <Tab.Screen 
        name="VIPs" 
        component={VIPMonitor} 
        options={{
          tabBarIcon: ({ color, size }) => <UserCheck size={size} color={color} />,
          title: 'VIPs'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PhotographerProfile} 
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}
