// app/product/[id].tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useStore } from '../../store';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShoppingCart, AlertTriangle, MapPin, User, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateRecipe } from '../../services/gemini';
import * as Sharing from 'expo-sharing';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useStore((state) => 
    state.products.find((p) => p.id === id)
  );
  const user = useStore((state) => state.user);
  const addToCart = useStore((state) => state.addToCart);

  const [recipe, setRecipe] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (user?.role === 'farmer') {
      Alert.alert('Farmers can’t add to cart', 'You can only manage your products.');
      return;
    }
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };

  const handleGenerateRecipe = async () => {
    setLoading(true);
    try {
      const result = await generateRecipe(product.name);
      setRecipe(result);
    } catch (error) {
      console.error('Recipe error:', error);
      setRecipe('Sorry, I couldn’t generate a recipe right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
  try {
    const message = `Check out this fresh produce on FarmConnect!\n\n${product.name}\n${product.description}\nPrice: $${product.price}/${product.unit}`;
    await Sharing.shareAsync(`data:text/plain;charset=utf-8,${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Share Failed', 'Unable to share this product.');
  }
};

  const isLowStock = product.quantity < 5;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product</Text>
          <TouchableOpacity onPress={handleShare}>
            <Share2 size={24} color="#16a34a" />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <AlertTriangle size={16} color="#dc2626" />
              <Text style={styles.lowStockText}> Only {product.quantity} left!</Text>
            </View>
          )}
          
          <Text style={styles.price}>${product.price.toFixed(2)}/{product.unit}</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.stock}>
            <Text style={styles.stockLabel}>Available: </Text>
            <Text style={styles.stockValue}>
              {product.quantity} {product.unit}
              {isLowStock && ' ⚠️'}
            </Text>
          </View>
        </View>

        <View style={styles.farmerCard}>
          <View style={styles.farmerHeader}>
            <User size={20} color="#16a34a" />
            <Text style={styles.farmerTitle}>Sold by</Text>
          </View>
          <Text style={styles.farmerName}>{product.farmerName}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.farmerLocation}>{product.location}</Text>
          </View>
        </View>

        {user?.role === 'buyer' && (
          <>
            <TouchableOpacity style={styles.recipeBtn} onPress={handleGenerateRecipe} disabled={loading}>
  {loading ? (
    <Text style={styles.recipeBtnText}>Generating...</Text>
  ) : (
    <Text style={styles.recipeBtnText}>Generate Recipe</Text>
  )}
</TouchableOpacity>

            {recipe && (
              <View style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>Recipe Idea:</Text>
                <Text style={styles.recipeContent}>{recipe}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
              <ShoppingCart size={20} color="#fff" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  image: { 
    width: '100%', 
    height: 250, 
    borderRadius: 16, 
    backgroundColor: '#f3f4f6',
    marginBottom: 20
  },
  info: { marginBottom: 24 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  category: { 
    fontSize: 14, 
    color: '#6b7280', 
    backgroundColor: '#f0fdf4',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12
  },
  lowStockBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12
  },
  lowStockText: { 
    color: '#dc2626', 
    fontWeight: 'bold',
    fontSize: 14
  },
  price: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#15803d',
    marginBottom: 12
  },
  description: { 
    fontSize: 16, 
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16
  },
  stock: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  stockLabel: { 
    fontSize: 16, 
    color: '#6b7280',
    fontWeight: '500'
  },
  stockValue: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#1f2937'
  },
  
  farmerCard: { 
    backgroundColor: '#f0fdf4', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  farmerHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    marginBottom: 8
  },
  farmerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#16a34a' 
  },
  farmerName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1f2937',
    marginBottom: 6
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  farmerLocation: { 
    color: '#6b7280', 
    fontSize: 14 
  },
  
  recipeBtn: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeBtnText: {
    color: '#1d4ed8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  recipeContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  addToCartBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});