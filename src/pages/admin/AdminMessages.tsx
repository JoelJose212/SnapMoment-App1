import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MessageSquare, Mail, User, Reply, CheckCircle } from 'lucide-react-native';
import api from '../../lib/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/enquiries');
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Inbound Protocol</Text>
            <Text className="text-3xl font-black text-white">Enquiries</Text>
          </View>
          <View className="bg-primary/20 px-4 py-2 rounded-2xl border border-primary/20">
             <Text className="text-primary font-black text-[10px] uppercase tracking-widest">{messages.length} New</Text>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMessages} tintColor="#FF6E6C" />}
        >
          {messages.length === 0 ? (
            <View className="py-20 items-center justify-center bg-card-dark/30 border border-dashed border-gray-800 rounded-[3rem]">
               <Mail size={48} color="#374151" />
               <Text className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">Inbox Cleared</Text>
            </View>
          ) : (
            messages.map((msg: any) => (
              <View 
                key={msg.id}
                className="bg-card-dark border border-gray-800 p-6 rounded-[3rem] mb-4 overflow-hidden"
              >
                <View className="flex-row justify-between mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/5">
                      <User size={18} color="#9ca3af" />
                    </View>
                    <View>
                      <Text className="text-white font-bold text-sm">{msg.name}</Text>
                      <Text className="text-gray-500 text-[10px] font-bold">{msg.email}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-[8px] font-bold uppercase tracking-widest">2h Ago</Text>
                </View>

                <View className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
                  <Text className="text-gray-300 text-xs leading-5 italic">"{msg.message}"</Text>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-primary py-4 rounded-2xl flex-row items-center justify-center gap-2">
                    <Reply size={16} color="white" />
                    <Text className="text-white font-black uppercase text-[10px] tracking-widest">Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-6 bg-white/5 rounded-2xl border border-white/5 items-center justify-center">
                    <CheckCircle size={18} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
