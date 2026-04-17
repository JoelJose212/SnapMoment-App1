import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Camera, Eye, EyeOff, Shield, Globe } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const [role, setRole] = useState<'photographer' | 'admin'>('photographer');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/api/admin/login' : '/api/photographer/login';
      const res = await api.post(endpoint, form);
      
      const { access_token, role: userRole, user_id, full_name, onboarding_step, subscription_active } = res.data;
      setAuth(access_token, userRole, user_id, full_name, onboarding_step, subscription_active);
    } catch (error) {
      console.error('Login failed', error);
      // In a real app, use a toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
          {/* Decorative Aurora Background (Simplified for Native) */}
          <StyledView className="absolute top-0 left-0 right-0 h-96 bg-primary opacity-10 rounded-full -translate-y-48 blur-3xl" />
          
          <View className="flex-1 justify-center py-10">
            <View className="items-center mb-10">
              <View className="w-20 h-20 rounded-3xl bg-primary items-center justify-center shadow-lg shadow-primary/50 mb-4">
                <Camera size={40} color="white" />
              </View>
              <Text className="text-4xl font-bold text-white tracking-tight">SnapMoment</Text>
              <Text className="text-gray-400 font-medium mt-1">Professional Imaging Suite</Text>
            </View>

            {/* Role Selector */}
            <View className="flex-row p-1 bg-card-dark rounded-2xl border border-gray-800 mb-8">
              <TouchableOpacity 
                onPress={() => setRole('photographer')}
                className={`flex-1 flex-row items-center justify-center py-4 rounded-xl ${role === 'photographer' ? 'bg-primary' : ''}`}
              >
                <Camera size={18} color={role === 'photographer' ? 'white' : '#9ca3af'} />
                <Text className={`ml-2 font-bold uppercase tracking-widest text-xs ${role === 'photographer' ? 'text-white' : 'text-gray-400'}`}>Photographer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setRole('admin')}
                className={`flex-1 flex-row items-center justify-center py-4 rounded-xl ${role === 'admin' ? 'bg-primary' : ''}`}
              >
                <Shield size={18} color={role === 'admin' ? 'white' : '#9ca3af'} />
                <Text className={`ml-2 font-bold uppercase tracking-widest text-xs ${role === 'admin' ? 'text-white' : 'text-gray-400'}`}>Admin</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">Terminal ID (Email)</Text>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  placeholder={role === 'admin' ? 'admin@snapmoment.app' : 'studio@example.com'}
                  placeholderTextColor="#4b5563"
                  className="bg-card-dark border border-gray-800 rounded-2xl px-5 py-4 text-white text-lg focus:border-primary"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">Access Key</Text>
                <View className="relative">
                  <TextInput
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    placeholder="••••••••"
                    placeholderTextColor="#4b5563"
                    className="bg-card-dark border border-gray-800 rounded-2xl px-5 py-4 text-white text-lg focus:border-primary"
                    secureTextEntry={!showPw}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -mt-3"
                  >
                    {showPw ? <EyeOff size={24} color="#9ca3af" /> : <Eye size={24} color="#9ca3af" />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="bg-primary py-5 rounded-full mt-6 shadow-xl shadow-primary/30 items-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-black uppercase tracking-widest text-sm">Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Signup Link (Web redirect simulator) */}
            <View className="mt-10 items-center">
              <View className="flex-row items-center mb-6 w-full">
                <View className="flex-1 h-[1px] bg-gray-800" />
                <Text className="mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">New Operators</Text>
                <View className="flex-1 h-[1px] bg-gray-800" />
              </View>
              
              <TouchableOpacity className="flex-row items-center justify-center border-2 border-primary/20 bg-primary/5 py-4 px-8 rounded-2xl w-full">
                <Globe size={18} color="#FF6E6C" />
                <Text className="ml-2 text-primary font-bold">Registration via Website</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="items-center mt-auto py-4">
            <Text className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
              © 2024 SnapMoment • Global Operations
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
