// app/farmer/index.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { Package, PlusCircle, MessageCircle, User as UserIcon, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FarmerHome() {
  const user = useStore((state) => state.user);
  const products = useStore((state) => state.products);

  if (!user) return null;

  const myProducts = products.filter(product => product.farmerId === user.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Package size={24} color="#16a34a" />
            <Text style={styles.statValue}>{myProducts.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={24} color="#16a34a" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>My Products</Text>
            <TouchableOpacity onPress={() => router.push('/farmer/add')}>
              <PlusCircle size={20} color="#16a34a" />
            </TouchableOpacity>
          </View>

          {myProducts.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No products listed yet.</Text>
            </View>
          ) : (
            <View style={styles.productList}>
              {myProducts.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <Image source={{ uri: product.image }} style={styles.thumb} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.stock}>
                      Stock: {product.quantity} {product.unit}
                      {product.quantity < 5 && (
                        <View style={styles.lowStockBadge}>
                          <AlertTriangle size={12} color="#dc2626" />
                          <Text style={styles.lowStockText}> Low</Text>
                        </View>
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/farmer/profile')}>
          <UserIcon size={20} color="#1f2937" />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: '#16a34a' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  scrollContent: { paddingBottom: 20 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 12 },
  statItem: { alignItems: 'center', gap: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  emptyBox: { padding: 32, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' },
  emptyText: { color: '#9ca3af' },
  productList: { gap: 12 },
  productCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', gap: 12 },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', color: '#1f2937' },
  stock: { fontSize: 12, color: '#6b7280', flexDirection: 'row', alignItems: 'center' },
  lowStockBadge: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  lowStockText: { color: '#dc2626', fontSize: 12, fontWeight: 'bold' },
  profileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, marginHorizontal: 20 },
  profileText: { color: '#1f2937', fontWeight: 'bold' },
});