import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Picker,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

let socket;

const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'pt', label: '🇵🇹 Português' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'zh', label: '🇨🇳 中文' }
];

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      message: '👋 Welcome to Underground ID v2.0! 🚀 Say "High ID" to activate voice commands.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [language, setLanguage] = useState('en');
  const [voiceActive, setVoiceActive] = useState(false);
  const [stats, setStats] = useState({ messages: 0, languages: 8 });
  const flatListRef = useRef(null);

  useEffect(() => {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat:message', (data) => {
      setMessages(prev => [...prev, data]);
      setStats(s => ({ ...s, messages: s.messages + 1 }));
    });

    socket.on('voice:activated', () => {
      setVoiceActive(true);
    });

    return () => socket?.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: input,
        userId: 1,
        language: language
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        message: response.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStats(s => ({ ...s, messages: s.messages + 2 }));
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceActivation = () => {
    setVoiceActive(!voiceActive);
    if (!voiceActive) {
      Alert.alert('🎤 Voice Activated', `Underground ID activated in ${LANGUAGES.find(l => l.code === language)?.label}`);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>🎤 Underground ID v2.0</Text>
            <Text style={styles.headerSubtitle}>
              {isConnected ? '🟢 Online' : '🔴 Offline'} • {stats.messages} messages
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.voiceButton, voiceActive && styles.voiceButtonActive]}
            onPress={handleVoiceActivation}
          >
            <Text style={styles.voiceButtonText}>🎤</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selector */}
        <ScrollView horizontal style={styles.languageSelector}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                language === lang.code && styles.languageButtonActive
              ]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={styles.languageButtonText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.messageListContent}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              editable={!loading}
              multiline
              maxLength={500}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#ff6b35" style={styles.loader} />
            ) : (
              <TouchableOpacity
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!input.trim()}
              >
                <Text style={styles.sendButtonText}>↗</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f'
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999'
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceButtonActive: {
    backgroundColor: '#4CAF50'
  },
  voiceButtonText: {
    fontSize: 24
  },
  languageSelector: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333'
  },
  languageButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35'
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  messageList: {
    flex: 1
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 16
  },
  messageBubble: {
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: '85%'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff6b35'
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a'
  },
  messageText: {
    color: '#fff',
    fontSize: 15
  },
  timestamp: {
    color: '#999',
    fontSize: 11,
    marginTop: 4
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    paddingHorizontal: 12
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100
  },
  loader: {
    marginRight: 8
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  sendButtonDisabled: {
    backgroundColor: '#666'
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
});
