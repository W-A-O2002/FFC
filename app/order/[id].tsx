// app/order/[id].tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../../store';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetails() {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const orders = useStore((state) => state.orders);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#15803d';
      case 'pending': return '#a16207';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{order.id.substring(0, 8)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, { borderColor: getStatusColor(order.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetail}>{item.cartQuantity} × ${item.price.toFixed(2)}</Text>
            <Text style={styles.itemTotal}>${(item.price * item.cartQuantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryTotal}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 20 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  label: { fontSize: 14, color: '#6b7280' },
  value: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  statusBadge: { 
    borderWidth: 1, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 20 
  },
  statusText: { 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    fontSize: 12 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#1f2937' 
  },
  itemCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 4 
  },
  itemDetail: { fontSize: 14, color: '#6b7280' },
  itemTotal: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#15803d', 
    marginTop: 8 
  },
  summaryCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 20 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  summaryLabel: { fontSize: 16, color: '#6b7280' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  summaryTotal: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#15803d' 
  },
});