import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react-native';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function OTPPage({ navigation, route }: any) {
  const { token } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { setGuestAuth } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const res = await api.post('/api/guest/verify-otp', { otp, token });
      setGuestAuth(res.data.guest_token, res.data.event_id);
      navigation.navigate('SelfieCapture', { token });
    } catch (error) {
      console.error('OTP Verification failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 p-8 justify-center"
      >
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20 mb-6">
            <ShieldCheck size={32} color="#FF6E6C" />
          </View>
          <Text className="text-3xl font-black text-white text-center tracking-tighter">Secure Access</Text>
          <Text className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2 text-center px-4">
            A termination key has been sent to your terminal
          </Text>
        </View>

        <View className="bg-card-dark border border-gray-800 rounded-[2.5rem] p-8 mb-8">
          <View className="flex-row items-center gap-3 mb-6">
            <MessageSquare size={16} color="#FF6E6C" />
            <Text className="text-gray-400 font-black uppercase tracking-widest text-[10px]">6-Digit Verification</Text>
          </View>

          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="000 000"
            placeholderTextColor="#374151"
            keyboardType="number-pad"
            maxLength={6}
            className="text-center text-4xl font-black text-white tracking-[0.5em] py-4 bg-white/5 rounded-2xl border border-white/5"
          />

          <View className="flex-row justify-between items-center mt-6">
            <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Resend Window</Text>
            <Text className="text-primary font-black tabular-nums">{timer}s</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleVerify}
          disabled={otp.length < 6 || loading}
          className={`py-6 rounded-full flex-row items-center justify-center ${otp.length === 6 ? 'bg-primary shadow-2xl shadow-primary/40' : 'bg-gray-800 opacity-50'}`}
        >
          <Text className="text-white font-black uppercase tracking-[0.2em] text-sm">
            {loading ? 'Decrypting...' : 'Verify Identity'}
          </Text>
          <ArrowRight size={20} color="white" className="ml-4" />
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={timer > 0}
          className="mt-8 items-center"
        >
          <Text className={`font-black uppercase tracking-widest text-[10px] ${timer > 0 ? 'text-gray-800' : 'text-primary'}`}>
            Resend Protocol
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
