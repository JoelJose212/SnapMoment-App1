import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { CalendarDays, Plus, Search, Filter } from 'lucide-react-native';
import api from '../../lib/api';

export default function PhotographerEvents({ navigation }: any) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Elite Hub</Text>
            <Text className="text-3xl font-black text-white">My Events</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/30">
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card-dark border border-gray-800 rounded-2xl flex-row items-center px-4 py-3">
            <Search size={18} color="#9ca3af" />
            <Text className="ml-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Search Intelligence</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-card-dark border border-gray-800 rounded-2xl items-center justify-center">
            <Filter size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEvents} tintColor="#FF6E6C" />}
        >
          {events.length === 0 ? (
            <View className="py-20 items-center justify-center bg-card-dark/30 border border-dashed border-gray-800 rounded-[2.5rem]">
               <CalendarDays size={48} color="#374151" />
               <Text className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">No Active Operations</Text>
               <TouchableOpacity className="mt-6 px-8 py-3 bg-primary/10 rounded-xl border border-primary/20">
                  <Text className="text-primary font-black uppercase tracking-widest text-[10px]">Initialize First Event</Text>
               </TouchableOpacity>
            </View>
          ) : (
            events.map((event: any) => (
              <TouchableOpacity 
                key={event.id}
                className="bg-card-dark border border-gray-800 p-6 rounded-[2rem] mb-4"
                onPress={() => navigation.navigate('EventDetail', { id: event.id })}
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-xl font-bold text-white mb-1">{event.event_name}</Text>
                    <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest">{event.event_type} • {event.event_date}</Text>
                  </View>
                  <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <Text className="text-primary font-black text-[8px] uppercase tracking-widest">{event.status}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center justify-between pt-4 border-t border-gray-800/50">
                  <View className="flex-row gap-4">
                    <View>
                       <Text className="text-white font-bold text-sm">{event.photo_count || 0}</Text>
                       <Text className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Photos</Text>
                    </View>
                    <View>
                       <Text className="text-white font-bold text-sm">{event.guest_count || 0}</Text>
                       <Text className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Guests</Text>
                    </View>
                  </View>
                  <View className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center">
                    <Plus size={14} color="#9ca3af" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
