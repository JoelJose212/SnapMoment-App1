import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

// Stacks
import AuthNavigator from './AuthNavigator';
import PhotographerNavigator from './PhotographerNavigator';
import AdminNavigator from './AdminNavigator';
import GuestNavigator from './GuestNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, role, guestToken } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        role === 'admin' ? (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="Photographer" component={PhotographerNavigator} />
        )
      ) : guestToken ? (
        <Stack.Screen name="Guest" component={GuestNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
