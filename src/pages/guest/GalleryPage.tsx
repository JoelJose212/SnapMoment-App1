import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Share } from 'react-native';
import { Download, Share2, Image as ImageIcon, Sparkles, Filter, LayoutGrid } from 'lucide-react-native';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');
const GRID_SPACING = 4;
const COLUMN_WIDTH = (width - (GRID_SPACING * 3)) / 2;

export default function GalleryPage({ route }: any) {
  const { guestEventId } = useAuthStore();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedPhotos = async () => {
      try {
        const res = await api.get(`/api/guest/photos/${guestEventId}`);
        setPhotos(res.data);
      } catch (error) {
        console.error('Failed to fetch matched photos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchedPhotos();
  }, [guestEventId]);

  const handleShare = async (url: string) => {
    try {
      await Share.share({ message: `Check out my photo from SnapMoment: ${url}` });
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="p-6 pb-0">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
               <Sparkles size={14} color="#FF6E6C" fill="#FF6E6C" />
               <Text className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Neural Match Found</Text>
            </View>
            <Text className="text-3xl font-black text-white">Your Moments</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/30">
            <Download size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mb-8">
           <View className="flex-1 bg-card-dark border border-gray-800 rounded-2xl flex-row items-center px-4 py-3">
              <LayoutGrid size={18} color="#9ca3af" />
              <Text className="ml-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Matrix View</Text>
           </View>
           <TouchableOpacity className="w-12 h-12 bg-card-dark border border-gray-800 rounded-2xl items-center justify-center">
              <Filter size={18} color="#9ca3af" />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-[GRID_SPACING]">
        {loading ? (
          <View className="py-20 items-center">
             <Text className="text-primary animate-pulse font-black uppercase tracking-widest text-xs">Querying Vector Map...</Text>
          </View>
        ) : photos.length === 0 ? (
          <View className="py-20 items-center justify-center bg-card-dark/30 border border-dashed border-gray-800 rounded-[3rem] mx-4">
             <ImageIcon size={48} color="#374151" />
             <Text className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs text-center px-10">
               No matching biometric patterns detected in this event
             </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {photos.map((photo: any) => (
              <View 
                key={photo.id} 
                style={{ width: COLUMN_WIDTH, margin: GRID_SPACING / 2 }}
                className="bg-card-dark rounded-3xl overflow-hidden border border-gray-800"
              >
                <Image 
                  source={{ uri: photo.thumbnail_url || photo.s3_url }} 
                  className="w-full aspect-[4/5]"
                  resizeMode="cover"
                />
                <View className="p-3 flex-row items-center justify-between">
                   <View>
                      <Text className="text-primary font-black text-[8px] uppercase tracking-widest">Match</Text>
                      <Text className="text-white font-bold text-[10px]">{Math.round(photo.similarity * 100)}% Confidence</Text>
                   </View>
                   <TouchableOpacity onPress={() => handleShare(photo.s3_url)} className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <Share2 size={14} color="#9ca3af" />
                   </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="py-10 items-center">
           <Text className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.4em]">SnapMoment AI Indexer v4.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
