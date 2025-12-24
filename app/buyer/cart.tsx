// app/buyer/cart.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const addToCart = useStore((state) => state.addToCart);
  const placeOrder = useStore((state) => state.placeOrder);

  const total = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert('Confirm Order', 'Place your order now?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: placeOrder },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingCart size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity onPress={() => router.replace('/buyer')} style={styles.shopNowButton}>
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list}>
            {cart.map((item) => (
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemFarmer}>{item.farmerName}</Text>
                </View>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>${(item.price * item.cartQuantity).toFixed(2)}</Text>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.qtyBtn}
                    >
                      <Minus size={14} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.cartQuantity}</Text>
                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={14} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: { marginTop: 16, fontSize: 16, color: '#9ca3af' },
  shopNowButton: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopNowText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 20, paddingBottom: 120 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  itemFarmer: { fontSize: 12, color: '#6b7280' },
  itemFooter: { alignItems: 'flex-end', gap: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#15803d' },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 4,
  },
  qtyBtn: { padding: 6 },
  qtyText: { marginHorizontal: 8, fontSize: 14, fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: '#6b7280' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  checkoutBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});