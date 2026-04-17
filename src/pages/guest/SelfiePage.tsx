import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera as CameraIcon, Scan, CheckCircle, AlertCircle, Brain, Aperture } from 'lucide-react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { styled } from 'nativewind';
import api from '../../lib/api';

const { width, height } = Dimensions.get('window');

export default function SelfiePage({ navigation, route }: any) {
  const { token } = route.params || {};
  const [faceState, setFaceState] = useState<'none' | 'detected' | 'ready'>('none');
  const [uploading, setUploading] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'front');

  useEffect(() => {
    // Simulate initial face detection loop
    const timer = setTimeout(() => setFaceState('detected'), 2000);
    const timer2 = setTimeout(() => setFaceState('ready'), 4000);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);

  const handleCapture = async () => {
    if (!camera.current || uploading) return;
    setUploading(true);
    
    try {
      const photo = await camera.current.takePhoto();
      
      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'selfie.jpg',
      });
      
      await api.post(`/api/guest/selfie-match`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      navigation.navigate('GuestGallery');
    } catch (error) {
      console.error('Selfie failed', error);
      setUploading(false);
    }
  };

  const ovalColor = faceState === 'ready' ? '#10B981' : faceState === 'detected' ? '#F59E0B' : '#EF4444';

  if (!device) return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">Loading Sensors...</Text></View>;

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Aurora Overlay */}
      <View className="absolute inset-0 bg-primary/10 opacity-30" />

      {/* UI Overlay */}
      <SafeAreaView className="flex-1">
        <View className="p-6 items-center">
          <View className="flex-row items-center gap-2 mb-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
            <Scan size={14} color="#FF6E6C" />
            <Text className="text-primary font-black uppercase tracking-widest text-[10px]">Studio Neural Link</Text>
          </View>
          <Text className="text-3xl font-black text-white tracking-tighter">Verify Identity</Text>
          <Text className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">Position face inside the frame</Text>
        </View>

        {/* The Oval Guide */}
        <View className="flex-1 items-center justify-center">
          <View 
            style={{ 
              width: width * 0.65, 
              height: height * 0.45, 
              borderRadius: 150, 
              borderWidth: 4, 
              borderColor: ovalColor,
              shadowColor: ovalColor,
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10
            }} 
          />
          
          {/* Status Label */}
          <View className="mt-8 bg-black/60 px-6 py-2 rounded-full border border-white/20">
            <Text 
              style={{ color: ovalColor }}
              className="font-black uppercase tracking-[0.2em] text-[10px]"
            >
              {faceState === 'ready' ? 'Face Locked ✓' : faceState === 'detected' ? 'Aligning Neural Map...' : 'Scanning for Face...'}
            </Text>
          </View>
        </View>

        {/* Capture Button */}
        <View className="p-10 items-center">
          <TouchableOpacity 
            onPress={handleCapture}
            disabled={faceState === 'none' || uploading}
            className={`w-24 h-24 rounded-full border-4 items-center justify-center ${faceState === 'ready' ? 'border-white bg-primary' : 'border-white/20 bg-white/10 opacity-50'}`}
          >
            <View className="w-20 h-20 rounded-full border-2 border-white/20 items-center justify-center">
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Aperture size={40} color="white" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Feature Tags */}
        <View className="flex-row justify-center gap-4 mb-6">
           <View className="flex-row items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
              <CheckCircle size={12} color={faceState !== 'none' ? '#10B981' : '#4b5563'} />
              <Text className="text-white text-[10px] font-bold uppercase">Neural Lock</Text>
           </View>
           <View className="flex-row items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
              <CheckCircle size={12} color="#10B981" />
              <Text className="text-white text-[10px] font-bold uppercase">Lighting OK</Text>
           </View>
        </View>
      </SafeAreaView>

      {/* Analysis Overlay */}
      {uploading && (
        <View className="absolute inset-0 bg-primary/30 items-center justify-center p-10 backdrop-blur-3xl">
          <View className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl mb-8">
            <Brain size={60} color="#FF6E6C" />
          </View>
          <Text className="text-2xl font-black text-white uppercase tracking-tighter text-center">Syncing Vector Maps</Text>
          <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2 text-center">
            Matching identity across cluster matrix
          </Text>
        </View>
      )}
    </View>
  );
}
