import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Users, Search, Filter, Shield, MoreVertical } from 'lucide-react-native';
import api from '../../lib/api';

export default function AdminPhotographers() {
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotographers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/photographers');
      setPhotographers(res.data);
    } catch (error) {
      console.error('Failed to fetch photographers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">User Matrix</Text>
            <Text className="text-3xl font-black text-white">Photographers</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-2xl bg-card-dark border border-gray-800 items-center justify-center shadow-lg">
            <Search size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPhotographers} tintColor="#FF6E6C" />}
        >
          {photographers.length === 0 ? (
            <View className="py-20 items-center justify-center bg-card-dark/30 border border-dashed border-gray-800 rounded-[2.5rem]">
               <Users size={48} color="#374151" />
               <Text className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">No Active Operators</Text>
            </View>
          ) : (
            photographers.map((p: any) => (
              <View 
                key={p.id}
                className="bg-card-dark border border-gray-800 p-6 rounded-[2rem] mb-4"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row gap-4 items-center">
                    <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20">
                      <Shield size={20} color="#FF6E6C" />
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-white mb-1">{p.studio_name}</Text>
                      <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{p.full_name}</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="p-2">
                    <MoreVertical size={20} color="#4b5563" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between pt-4 border-t border-gray-800/50">
                  <View className="bg-white/5 px-3 py-1.5 rounded-full">
                     <Text className="text-gray-400 font-bold text-[8px] uppercase tracking-widest">{p.subscription_plan}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="items-end">
                       <Text className="text-white font-bold text-xs">{p.total_events || 0}</Text>
                       <Text className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Events</Text>
                    </View>
                    <View className="items-end">
                       <Text className="text-white font-bold text-xs">{p.total_photos || 0}</Text>
                       <Text className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Photos</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
