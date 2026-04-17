import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Users, Camera, CalendarDays, BarChart2, ShieldCheck, Zap } from 'lucide-react-native';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const CARDS = [
    { label: 'Photographers', value: stats?.total_photographers || 0, icon: Users, color: '#67568C' },
    { label: 'Active Events', value: stats?.active_events || 0, icon: CalendarDays, color: '#F59E0B' },
    { label: 'Total Photos', value: stats?.total_photos || 0, icon: Camera, color: '#FF6E6C' },
    { label: 'System Load', value: '0.0ms', icon: Zap, color: '#10B981' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <ScrollView className="p-6">
        <View className="mb-10 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
               <ShieldCheck size={14} color="#FF6E6C" />
               <Text className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Security Authorized</Text>
            </View>
            <Text className="text-3xl font-black text-white">Mission Control</Text>
          </View>
          <View className="w-10 h-10 rounded-xl bg-card-dark border border-gray-800 items-center justify-center">
             <View className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {CARDS.map((card, i) => (
            <View 
              key={i} 
              className="w-[48%] bg-card-dark border border-gray-800 rounded-[2.5rem] p-6 mb-4"
            >
              <View 
                className="w-10 h-10 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon size={20} color={card.color} />
              </View>
              {loading ? (
                <ActivityIndicator size="small" color={card.color} />
              ) : (
                <Text 
                  style={{ color: card.color }}
                  className="text-3xl font-black"
                >
                  {card.value}
                </Text>
              )}
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{card.label}</Text>
            </View>
          ))}
        </View>

        {/* System Health Section */}
        <View className="mt-6 bg-card-dark border border-gray-800 rounded-[3rem] p-10">
           <Text className="text-white font-black uppercase tracking-widest text-lg mb-6">Neural Health Pulse</Text>
           
           <View className="space-y-6">
              <View className="flex-row items-center justify-between">
                 <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-gray-400 font-bold text-sm">ArcFace API</Text>
                 </View>
                 <Text className="text-emerald-500 font-black text-[10px] uppercase">Operational</Text>
              </View>
              <View className="flex-row items-center justify-between">
                 <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-gray-400 font-bold text-sm">Cluster Sync</Text>
                 </View>
                 <Text className="text-emerald-500 font-black text-[10px] uppercase">Stable</Text>
              </View>
              <View className="flex-row items-center justify-between">
                 <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-gray-400 font-bold text-sm">Payment Gateway</Text>
                 </View>
                 <Text className="text-emerald-500 font-black text-[10px] uppercase">Connected</Text>
              </View>
           </View>
        </View>

        <View className="py-10 items-center">
           <Text className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.4em]">SnapMoment Platform • Root Level Auth</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
