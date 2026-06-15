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
  Alert
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
      message: '👋 Welcome to Underground ID! How can I help you today? 🎤 Say "High ID" to activate voice commands.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [language, setLanguage] = useState('en');
  const [voiceActive, setVoiceActive] = useState(false);
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
      console.log('✅ Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat:message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on('voice:activated', (data) => {
      setVoiceActive(true);
      console.log('🎤 Voice activated');
    });

    return () => socket?.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: input,
      language: language,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: input,
        userId: 1,
        language: language,
        conversationHistory: messages.filter(m => m.role !== 'system')
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        message: response.data.reply,
        language: language,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceActivation = async () => {
    setVoiceActive(!voiceActive);
    
    if (!voiceActive) {
      try {
        const response = await axios.post(`${API_BASE_URL}/voice/detect`, {
          audioData: 'mock_audio_data',
          language: language
        });
        
        if (response.data.detected) {
          Alert.alert('✅ Voice Activated', `Underground ID activated in ${LANGUAGES.find(l => l.code === language)?.label}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Voice detection failed');
      }
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
        {item.timestamp.toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>🎤 Underground ID</Text>
            <Text style={styles.headerSubtitle}>
              {isConnected ? '🟢 Online' : '🔴 Offline'} • {LANGUAGES.find(l => l.code === language)?.label}
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
        <View style={styles.languageSelector}>
          <Text style={styles.languageLabel}>Language:</Text>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            {LANGUAGES.map(lang => (
              <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
            ))}
          </Picker>
        </View>

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
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8
  },
  voiceButtonText: {
    fontSize: 24
  },
  languageSelector: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  languageLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    borderRadius: 4
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
    backgroundColor: '#ff6b35',
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    borderBottomLeftRadius: 4
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20
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
    paddingHorizontal: 12,
    paddingRight: 4
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
    alignItems: 'center'
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
