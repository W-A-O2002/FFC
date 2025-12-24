// app/farmer/add.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { useStore, Category } from '../../store';
import { router } from 'expo-router';
import { Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveImageToDevice } from '../../services/imageStorage';

interface FormData {
  name: string;
  category: Category;
  price: string;
  unit: string;
  quantity: string;
  description: string;
  image: string;
}

export default function AddProductScreen() {
  const user = useStore((state) => state.user);
  const addProduct = useStore((state) => state.addProduct);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity || !user) return;

    let finalImage = formData.image;
    
    // Save image to device if it's from camera/gallery
    if (formData.image.startsWith('file://') || formData.image.startsWith('content://')) {
      try {
        finalImage = await saveImageToDevice(formData.image);
      } catch (error) {
        console.error('Image save failed:', error);
      }
    }

    addProduct({
      ...formData,
      image: finalImage,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      farmerId: user.id,
      farmerName: user.name,
      location: 'Local Farm',
    });

    router.replace('/farmer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
          <View style={styles.uploadOverlay}>
            <Upload size={24} color="#fff" />
            <Text style={styles.uploadText}>Change Image</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(t) => setFormData({ ...formData, name: t })}
          placeholder="e.g. Organic Carrots"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.row}>
          {(['Vegetables', 'Fruits', 'Dairy'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, formData.category === cat && styles.categoryActive]}
              onPress={() => setFormData({ ...formData, category: cat })}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Price per Unit</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(t) => setFormData({ ...formData, price: t })}
              placeholder="2.50"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              value={formData.unit}
              onChangeText={(t) => setFormData({ ...formData, unit: t })}
              placeholder="kg"
            />
          </View>
        </View>

        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={(t) => setFormData({ ...formData, quantity: t })}
          placeholder="100"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(t) => setFormData({ ...formData, description: t })}
          placeholder="Freshly harvested..."
          multiline
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>List Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: '#16a34a' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { padding: 20 },
  imageUpload: { marginBottom: 24, position: 'relative' },
  imagePreview: { width: '100%', height: 200, backgroundColor: '#e5e7eb', borderRadius: 12 },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontSize: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 16 },
  half: { flex: 1 },
  categoryBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  categoryActive: { backgroundColor: '#dcfce7', borderColor: '#16a34a' },
  categoryText: { color: '#16a34a', fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});