// app/buyer/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, RefreshControl } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { MapPin, Search, Heart, HeartOff, ArrowUp, ArrowDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyerHome() {
  const products = useStore((state) => state.products);
  const user = useStore((state) => state.user);
  const addToCart = useStore((state) => state.addToCart);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'name' | 'price' | 'newest'>('newest');
  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy'];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price': return a.price - b.price;
      case 'newest': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    showNotification(`${product.name} added to cart!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name}</Text>
      </View>

      {notification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Search fresh produce..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryActive]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {(['name', 'price', 'newest'] as const).map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => setSortOption(option)}
              style={[styles.sortBtn, sortOption === option && styles.sortActive]}
            >
              <Text style={styles.sortText}>
                {option === 'name' ? 'Name' : option === 'price' ? 'Price' : 'Newest'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Fresh Picks</Text>
        {sortedProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No products match your search.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {sortedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.card}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <TouchableOpacity
                  style={styles.favoriteBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  {favorites.includes(product.id) ? (
                    <Heart color="#ef4444" size={20} fill="#ef4444" />
                  ) : (
                    <HeartOff color="#9ca3af" size={20} />
                  )}
                </TouchableOpacity>
                <Image source={{ uri: product.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.stock}>
                    {product.quantity} {product.unit} left
                  </Text>
                  <View style={styles.footer}>
                    <Text style={styles.price}>
                      ${product.price.toFixed(2)}/{product.unit}
                    </Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: '#16a34a' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  notification: { 
    position: 'absolute', 
    top: 60, 
    left: 20, 
    right: 20, 
    backgroundColor: '#16a34a', 
    padding: 12, 
    borderRadius: 8,
    zIndex: 10,
    alignItems: 'center'
  },
  notificationText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  scrollContent: { paddingBottom: 20 },
  searchContainer: { margin: 20, marginBottom: 10, position: 'relative' },
  searchIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    paddingLeft: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categories: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  categoryActive: { backgroundColor: '#16a34a' },
  categoryText: { color: '#4b5563', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  sortLabel: { fontSize: 14, color: '#6b7280' },
  sortBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 20 
  },
  sortActive: { backgroundColor: '#dcfce7', borderColor: '#16a34a' },
  sortText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 12, color: '#1f2937' },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  emptyText: { color: '#9ca3af' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16 },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteBtn: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  cardImage: { width: '100%', height: 120, backgroundColor: '#e5e7eb' },
  cardContent: { padding: 12 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  stock: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#15803d' },
  addButton: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  addButtonText: { fontSize: 12, fontWeight: 'bold', color: '#15803d' },
});