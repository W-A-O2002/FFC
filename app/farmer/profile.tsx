// app/farmer/profile.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { User, Mail, MapPin, Package, Trash2, LogOut, Pencil } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FarmerProfile() {
  const user = useStore((state) => state.user);
  const products = useStore((state) => state.products);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const logout = useStore((state) => state.logout);

  if (!user) return null;

  const handleDelete = (id: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteProduct(id) }
    ]);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.infoRow}>
            <Mail size={14} color="#6b7280" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
          <View style={styles.roleTag}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Manage Products</Text>
            <TouchableOpacity onPress={() => router.push('/farmer/add')}>
              <Text style={styles.addText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {products.filter(p => p.farmerId === user.id).length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No products listed.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {products
                .filter(p => p.farmerId === user.id)
                .map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={{ uri: product.image }} style={styles.thumb} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.stock}>Stock: {product.quantity} {product.unit}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        onPress={() => router.push({ pathname: '/farmer/edit/[id]', params: { id: product.id } })}
                        style={styles.editBtn}
                      >
                        <Pencil size={16} color="#1d4ed8" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(product.id)} style={styles.deleteBtn}>
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#15803d' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  infoText: { color: '#6b7280', fontSize: 14 },
  roleTag: { marginTop: 12, backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { color: '#16a34a', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  addText: { color: '#16a34a', fontWeight: 'bold' },
  emptyBox: { padding: 32, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' },
  emptyText: { color: '#9ca3af' },
  list: { gap: 12 },
  productCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    alignItems: 'center', 
    gap: 12,
    flexDirection: 'row'
  },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', color: '#1f2937' },
  stock: { fontSize: 12, color: '#6b7280' },
  actionButtons: { 
    flexDirection: 'row', 
    gap: 8 
  },
  editBtn: { 
    padding: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtn: { 
    padding: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fef2f2', padding: 16, borderRadius: 12 },
  logoutText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16 },
});