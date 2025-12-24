// app/_layout.tsx
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Optional:for debugging
  useEffect(() => {
    console.log('Current theme:', colorScheme);
  }, [colorScheme]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="buyer" options={{ headerShown: false }} />
      <Stack.Screen name="farmer" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chats" options={{ headerShown: false }} />
      <Stack.Screen name="farmer/edit/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}