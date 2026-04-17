import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { CreditCard, Download, ExternalLink, Filter } from 'lucide-react-native';
import api from '../../lib/api';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/invoices');
      setInvoices(res.data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="p-6 pb-0">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Financial Operations</Text>
            <Text className="text-3xl font-black text-white">Invoices</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-card-dark border border-gray-800 rounded-2xl items-center justify-center">
             <Filter size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInvoices} tintColor="#FF6E6C" />}
      >
        {invoices.length === 0 ? (
          <View className="py-20 items-center justify-center bg-card-dark/30 border border-dashed border-gray-800 rounded-[2.5rem]">
             <CreditCard size={48} color="#374151" />
             <Text className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-xs">No Recent Transactions</Text>
          </View>
        ) : (
          invoices.map((inv: any) => (
            <View 
              key={inv.id}
              className="bg-card-dark border border-gray-800 p-6 rounded-[2rem] mb-4"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">INV-{inv.id.substring(0, 8)}</Text>
                  <Text className="text-lg font-bold text-white">{inv.photographer_name}</Text>
                  <Text className="text-gray-500 text-[10px] font-bold mt-1">{inv.billing_date}</Text>
                </View>
                <View className="items-end">
                   <Text className="text-2xl font-black text-white">${inv.amount}</Text>
                   <View className={`px-2 py-0.5 rounded-full mt-1 ${inv.status === 'paid' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      <Text className={`text-[8px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'text-emerald-500' : 'text-red-500'}`}>{inv.status}</Text>
                   </View>
                </View>
              </View>

              <View className="flex-row gap-2 pt-4 border-t border-gray-800/50">
                 <TouchableOpacity className="flex-1 bg-white/5 py-3 rounded-xl border border-white/5 flex-row items-center justify-center gap-2">
                    <Download size={14} color="#9ca3af" />
                    <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Download PDF</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 items-center justify-center">
                    <ExternalLink size={16} color="#9ca3af" />
                 </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
