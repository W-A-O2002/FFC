import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { router } from 'expo-router';
import { Sprout, Tractor, ShoppingBasket } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [role, setRole] = useState<'buyer' | 'farmer'>('buyer');
  const [name, setName] = useState('');
  const login = useStore((state) => state.login);

  const handleLogin = () => {
    if (!name.trim()) return;
    login(role, name);
    if (role === 'farmer') {
      router.replace('/farmer');
    } else {
      router.replace('/buyer');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Sprout size={64} color="#16a34a" />
        </View>
        <Text style={styles.title}>FarmConnect</Text>
        <Text style={styles.subtitle}>Fresh produce, directly from the source.</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'buyer' && styles.roleActive]}
            onPress={() => setRole('buyer')}
          >
            <ShoppingBasket size={24} color={role === 'buyer' ? '#15803d' : '#6b7280'} />
            <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'farmer' && styles.roleActive]}
            onPress={() => setRole('farmer')}
          >
            <Tractor size={24} color={role === 'farmer' ? '#15803d' : '#6b7280'} />
            <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>Farmer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. John Doe"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    backgroundColor: '#dcfce7',
    padding: 20,
    borderRadius: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  roleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleTextActive: {
    color: '#15803d',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});