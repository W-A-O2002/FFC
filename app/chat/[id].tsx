// app/chat/[id].tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useStore } from '../../store';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatRoom() {
  const { id: partnerId } = useLocalSearchParams<{ id: string }>();
  const user = useStore((state) => state.user);
  const messages = useStore((state) => state.messages);
  const [text, setText] = useState('');

  const chatMessages = messages.filter(
    (msg) =>
      (msg.senderId === user?.id && msg.receiverId === partnerId) ||
      (msg.senderId === partnerId && msg.receiverId === user?.id)
  );

  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = useStore((state) => state.sendMessage);

  const handleSend = () => {
    if (!text.trim() || !partnerId || !user) return;
    sendMessage(partnerId, text);
    setText('');
  };

  if (!user || !partnerId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isMe = item.senderId === user.id;
          return (
            <View style={[styles.msgWrapper, isMe ? styles.msgRight : styles.msgLeft]}>
              <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                <Text style={[styles.msgText, isMe ? styles.textRight : styles.textLeft]}>
                  {item.text}
                </Text>
                <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
        inverted
        style={styles.messagesContainer}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            multiline
            textAlignVertical="center"
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, !text.trim() && { opacity: 0.5 }]}
            disabled={!text.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  messagesContainer: { flex: 1 },
  messagesList: { padding: 16, paddingBottom: 20 },
  msgWrapper: { marginVertical: 8 },
  msgLeft: { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end' },
  bubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  bubbleLeft: { backgroundColor: '#fff', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#e5e7eb' },
  bubbleRight: { backgroundColor: '#16a34a', borderBottomRightRadius: 0 },
  msgText: { fontSize: 15 },
  textRight: { color: '#fff' },
  textLeft: { color: '#1f2937' },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  timeRight: { color: 'rgba(255,255,255,0.7)' },
  timeLeft: { color: '#9ca3af' },
  inputWrapper: { 
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#16a34a',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});