import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import EventLandingPage from '../pages/guest/EventLandingPage';
import OTPPage from '../pages/guest/OTPPage';
import SelfiePage from '../pages/guest/SelfiePage';
import GalleryPage from '../pages/guest/GalleryPage';

const Stack = createNativeStackNavigator();

export default function GuestNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventLanding" component={EventLandingPage} />
      <Stack.Screen name="OTPVerify" component={OTPPage} />
      <Stack.Screen name="SelfieCapture" component={SelfiePage} />
      <Stack.Screen name="GuestGallery" component={GalleryPage} />
    </Stack.Navigator>
  );
}
