// app/buyer/profile.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { User, Mail, MapPin, Package, LogOut, Pencil } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyerProfile() {
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const logout = useStore((state) => state.logout);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const reorderItems = useStore((state) => state.reorderItems);

  if (!user) return null;

  const myOrders = orders.filter((order) => order.buyerId === user.id);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleMarkDelivered = (orderId: string) => {
    Alert.alert('Confirm', 'Mark this order as delivered?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => updateOrderStatus(orderId, 'delivered') },
    ]);
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
          
          {/* ✅ Edit Profile Button */}
          <TouchableOpacity 
            onPress={() => router.push('/buyer/edit-profile')}
            style={styles.editProfileBtn}
          >
            <Pencil size={16} color="#1d4ed8" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#16a34a" />
            <Text style={styles.sectionTitle}>Order History</Text>
          </View>

          {myOrders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No orders yet.</Text>
            </View>
          ) : (
            <View style={styles.orderList}>
              {myOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>Order #{order.id.substring(0, 6)}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        order.status === 'delivered' ? styles.statusGreen : styles.statusYellow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          order.status === 'delivered' ? styles.textGreen : styles.textYellow,
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemText}>
                          {item.cartQuantity}× {item.name}
                        </Text>
                        <Text style={styles.itemText}>
                          ${(item.price * item.cartQuantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
                      style={styles.detailBtn}
                    >
                      <Text style={styles.viewDetails}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        reorderItems(order.items);
                        router.push('/buyer/cart');
                      }}
                      style={styles.reorderBtn}
                    >
                      <Text style={styles.reorderText}>Reorder</Text>
                    </TouchableOpacity>
                  </View>

                  {order.status === 'pending' && (
                    <TouchableOpacity
                      onPress={() => handleMarkDelivered(order.id)}
                      style={styles.markBtn}
                    >
                      <Text style={styles.markBtnText}>Mark as Delivered</Text>
                    </TouchableOpacity>
                  )}
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
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#15803d' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  infoText: { color: '#6b7280', fontSize: 14 },
  roleTag: {
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    color: '#16a34a',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  editProfileBtn: { 
    position: 'absolute', 
    top: 16, 
    right: 16, 
    backgroundColor: '#dbeafe', 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  editProfileText: { 
    color: '#1d4ed8', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  emptyText: { color: '#9ca3af' },
  orderList: { gap: 12 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: { fontSize: 12, color: '#9ca3af' },
  orderDate: { fontSize: 12, color: '#6b7280' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusGreen: { backgroundColor: '#dcfce7' },
  statusYellow: { backgroundColor: '#fef9c3' },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  textGreen: { color: '#15803d' },
  textYellow: { color: '#a16207' },
  orderItems: { gap: 4, marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemText: { fontSize: 14, color: '#374151' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  totalLabel: { fontSize: 14, color: '#6b7280' },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 12,
    gap: 8
  },
  detailBtn: { 
    flex: 1,
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetails: { 
    color: '#1d4ed8', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  reorderBtn: {
    flex: 1,
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderText: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: 12,
  },
  markBtn: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  markBtnText: {
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16 },
});