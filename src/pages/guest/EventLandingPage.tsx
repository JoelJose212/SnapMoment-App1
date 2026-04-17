import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Camera, ArrowRight, Scan, ShieldCheck, Zap } from 'lucide-react-native';
import api from '../../lib/api';

export default function EventLandingPage({ navigation, route }: any) {
  const { token } = route.params || {};
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.post('/api/guest/verify-qr', { token });
        setEvent(res.data);
      } catch (error) {
        console.error('QR verification failed', error);
      }
    };
    fetchEvent();
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="fixed inset-0 bg-primary/5 opacity-30" />
      
      <View className="flex-1 p-8 justify-center">
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-[2.5rem] bg-primary items-center justify-center shadow-2xl shadow-primary/40 mb-6">
            <Camera size={40} color="white" />
          </View>
          <Text className="text-4xl font-black text-white text-center tracking-tighter">SnapMoment</Text>
          <Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Neural Event Intelligence</Text>
        </View>

        <View className="bg-card-dark border border-gray-800 rounded-[3rem] p-8 shadow-2xl mb-10">
          <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Authenticated Event</Text>
          <Text className="text-3xl font-black text-white mb-2">{event?.event_name || 'Loading Protocol...'}</Text>
          <Text className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">
            {event?.event_date || 'Verifying Session...'} • {event?.studio_name || 'Elite Imaging'}
          </Text>

          <View className="space-y-4">
             <View className="flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
                   <Zap size={20} color="#FF6E6C" />
                </View>
                <View>
                   <Text className="text-white font-bold text-sm">Instant Delivery</Text>
                   <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Powered by ArcFace AI</Text>
                </View>
             </View>
             <View className="flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
                   <ShieldCheck size={20} color="#FF6E6C" />
                </View>
                <View>
                   <Text className="text-white font-bold text-sm">Privacy First</Text>
                   <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Encrypted Biometric Map</Text>
                </View>
             </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('OTPVerify', { token })}
          className="bg-primary py-6 rounded-full shadow-2xl shadow-primary/40 flex-row items-center justify-center px-10"
        >
          <Text className="text-white font-black uppercase tracking-[0.2em] text-sm">Get My Photos</Text>
          <ArrowRight size={20} color="white" className="ml-4" />
        </TouchableOpacity>
      </View>

      <View className="items-center py-6">
         <Text className="text-gray-700 text-[9px] font-black uppercase tracking-[0.4em]">Official Guest Portal • Elite Hub v4</Text>
      </View>
    </SafeAreaView>
  );
}
