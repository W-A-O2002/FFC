// app/buyer/edit-profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useStore } from '../../store';
import { router } from 'expo-router';
import { User, Mail, MapPin, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: 'Local Area',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        location: user.location,
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!user || !formData.name || !formData.email) return;
    
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      location: formData.location,
    });
    
    router.back();
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{formData.name.charAt(0)}</Text>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={16} color="#6b7280" />
            </View>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Full Name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={16} color="#6b7280" />
            </View>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="Email Address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={16} color="#6b7280" />
            </View>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              placeholder="Location"
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
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
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#dcfce7', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#15803d' },
  formSection: { width: '100%' },
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    paddingVertical: 16, 
    fontSize: 16 
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});