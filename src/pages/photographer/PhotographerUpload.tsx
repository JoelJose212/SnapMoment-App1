import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { 
  Upload, 
  Terminal, 
  Camera, 
  Trash2, 
  Brain, 
  FolderSync, 
  Play, 
  Scan, 
  Image as ImageIcon 
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { addToQueue, startSync, getQueue } from '../../lib/queue';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 64) / 2;

export default function PhotographerUpload({ route, navigation }: any) {
  const { id: eventId } = route.params || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncingCount, setSyncingCount] = useState(0);
  const [photos, setPhotos] = useState<any[]>([]);

  // Simulate local neural scan logic (as in Capacitor version)
  const processFiles = async (assets: any[]) => {
    setIsProcessing(true);
    for (const asset of assets) {
      // simulate vectors (as in Capacitor version)
      const mockVectors = [new Array(512).fill(0).map(() => Math.random())];
      await addToQueue({
        uri: asset.uri,
        eventId,
        vectors: mockVectors,
        fileName: asset.fileName || `IMG_${Date.now()}.jpg`,
      });
    }
    setIsProcessing(false);
    startSync(setSyncingCount);
  };

  const handlePickPhotos = () => {
    launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0, // 0 means multiple
    }, (response) => {
      if (response.assets) {
        processFiles(response.assets);
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="p-6">
        <View className="mb-10">
          <View className="flex-row items-center gap-2 mb-2">
            <Terminal size={14} color="#FF6E6C" />
            <Text className="text-primary font-black uppercase tracking-widest text-[10px]">Elite Protocol Ingestion</Text>
          </View>
          <Text className="text-4xl font-black text-white">Upload Photos</Text>
          <Text className="text-gray-500 font-medium mt-1">Neural Scan & Persistent Queue</Text>
        </View>

        {/* Sync Status Hub */}
        <View className="flex-row gap-4 mb-10">
          <TouchableOpacity 
            className={`flex-1 flex-row items-center p-5 rounded-[2rem] border-2 ${syncingCount > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card-dark border-gray-800'}`}
          >
            <View className={`w-10 h-10 rounded-2xl items-center justify-center ${syncingCount > 0 ? 'bg-emerald-500' : 'bg-gray-800'}`}>
              <FolderSync size={20} color="white" />
            </View>
            <View className="ml-3">
              <Text className="text-white font-black uppercase tracking-widest text-[10px]">Neural Sync</Text>
              <Text className={`text-[10px] font-bold ${syncingCount > 0 ? 'text-emerald-500' : 'text-gray-600'}`}>
                {syncingCount > 0 ? `${syncingCount} Items Pending` : 'All Synced'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upload Trigger */}
        <TouchableOpacity 
          onPress={handlePickPhotos}
          className="border-2 border-dashed border-gray-800 rounded-[3rem] py-16 items-center justify-center mb-10 bg-card-dark/20"
        >
          <View className="w-20 h-20 rounded-3xl bg-gray-800 items-center justify-center mb-6">
            <Scan size={32} color="#FF6E6C" />
          </View>
          <Text className="text-white font-black uppercase tracking-widest text-lg">Initiate Ingestion</Text>
          <Text className="text-gray-600 font-bold uppercase tracking-widest text-[8px] mt-2 italic">Face recognition protocols active</Text>
        </TouchableOpacity>

        {/* Sync Grid (Simplified for UI demo) */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white font-black uppercase tracking-widest text-lg">Sync Grid</Text>
          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Live Feed</Text>
        </View>

        {photos.length === 0 ? (
          <View className="py-20 items-center justify-center rounded-[3rem] border border-dashed border-gray-800 opacity-50">
             <ImageIcon size={48} color="#374151" />
             <Text className="text-gray-600 font-black uppercase tracking-widest text-[10px] mt-4">Awaiting Frames...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {/* Grid Items would go here */}
          </View>
        )}
      </ScrollView>

      {/* Ingestion Overlay */}
      {isProcessing && (
        <View className="absolute inset-0 bg-dark-bg/90 items-center justify-center p-10">
          <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center mb-8">
            <Brain size={60} color="#FF6E6C" />
            <View className="absolute inset-0 rounded-full border-4 border-primary/30 scale-110" />
          </View>
          <Text className="text-2xl font-black text-white uppercase tracking-tighter">Neural Scan Pipeline</Text>
          <Text className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Extracting face vectors...</Text>
          
          <View className="w-full h-2 bg-gray-800 rounded-full mt-10 overflow-hidden">
             <ActivityIndicator color="#FF6E6C" className="absolute left-0" />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
