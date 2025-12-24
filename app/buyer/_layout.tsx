// app/buyer/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, ShoppingCart, MessageCircle, User } from 'lucide-react-native';
import { useStore } from '../../store';
import { View, Text } from 'react-native';
import { router } from 'expo-router'; 

export default function BuyerLayout() {
  console.log("✅ BuyerLayout is being rendered!");
  const cart = useStore((state) => state.cart);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingBottom: 4, paddingTop: 4 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingCart color={color} size={size} />
              {cart.length > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cart.length}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chats" // This is not a screen really (won't render anything)
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab behavior
            router.navigate('/chats'); // Navigate to top-level route
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}