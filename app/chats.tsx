// app/chats.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useStore } from '../store';
import { router } from 'expo-router';
import { UserCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatList() {
  const user = useStore((state) => state.user);
  const messages = useStore((state) => state.messages);
  const products = useStore((state) => state.products);
  const [refreshing, setRefreshing] = useState(false);

  if (!user) return null;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const partnerIds = Array.from(
    new Set(messages.map((m) => (m.senderId === user.id ? m.receiverId : m.senderId)))
  );

  const partners = partnerIds.map((id) => {
    const product = products.find((p) => p.farmerId === id);
    return {
      id,
      name: product ? product.farmerName : 'Unknown Farmer',
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Text style={{ color: '#16a34a' }}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {partners.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No conversations yet.</Text>
          </View>
        ) : (
          partners.map((partner) => (
            <TouchableOpacity
              key={partner.id}
              onPress={() => router.push(`/chat/${partner.id}`)}
              style={styles.chatRow}
            >
              <View style={styles.avatar}>
                <UserCircle size={32} color="#9ca3af" />
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.name}>{partner.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: { padding: 0 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: '#9ca3af', fontSize: 16 },
  chatRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, backgroundColor: '#f3f4f6', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  chatInfo: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
});