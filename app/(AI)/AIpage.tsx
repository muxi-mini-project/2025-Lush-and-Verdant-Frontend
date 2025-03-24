import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

const ChatRoomAI: React.FC = () => {
  // messages 数组中，每条消息包含 id、content、type（'user' 或 'ai'）以及 timestamp
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
 
 const router=useRouter()
 const handletocalender=()=>{
    router.push("/(calender)/calenderpage")
  }

  const handleSend = () => {
    if (newMessage.trim()) {
    
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        type: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

    
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now().toString() + '-ai',
          content: '这是 AI 的回复消息',
          type: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <LinearGradient
      colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={6} style={styles.container1}>
        {/* 顶部标题区域 */}
        <View style={styles.headregion}>
          <Text style={styles.textregion}>智能规划</Text>
        </View>

        {/* 消息列表区域 */}
        <View style={styles.messageregion}>
          <ScrollView contentContainerStyle={styles.messageContainer} showsVerticalScrollIndicator={false}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.type === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.timeText}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 操作区域按钮 */}
        <View style={styles.actionContainer}>
          <View style={styles.topButtonsContainer}>
            <Pressable style={styles.topButton} onPress={() => { /* 重新生成功能 */ }}>
              <Text style={styles.topButtonText}>重新生成</Text>
            </Pressable>
            <Pressable style={styles.topButton} onPress={handletocalender}>
              <Text style={styles.topButtonText}>自己调整</Text>
            </Pressable>
          </View>
          <Pressable style={styles.applyButton} onPress={() => { /* 应用功能 */ }}>
            <Text style={styles.applyButtonText}>应用</Text>
          </Pressable>
        </View>

        {/* 输入区域 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="输入消息..."
            multiline
          />
          <Pressable style={styles.sendButton} onPress={handleSend} disabled={!newMessage.trim()}>
            <Text style={styles.sendButtonText}>发送</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatRoomAI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headregion: {
    width: deviceWidthDp * 0.85,
    marginTop: deviceHeightDp * 0.05,
    marginBottom: deviceHeightDp * 0.02,
    alignItems: 'center',
  },
  textregion: {
    color: '#444E38',
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  messageregion: {
    flex: 1,
    width: deviceWidthDp * 0.88,

  },
  messageContainer: {
    padding: deviceHeightDp * 0.03,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingBottom: deviceHeightDp * 0.08, // 为输入区域预留空间
  },
  messageBubble: {
    maxWidth: '80%',
    padding: deviceWidthDp * 0.02,
    borderRadius: 16,
    marginBottom: deviceWidthDp * 0.03,
  },
  // 用户消息：绿色气泡，右侧显示
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 4,
  },
  // AI 消息：灰色气泡，左侧显示
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: deviceWidthDp * 0.04,
    color: '#333',
  },
  timeText: {
    fontSize: deviceWidthDp * 0.02,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: deviceHeightDp * 0.01,
  },
  actionContainer: {
    width: deviceWidthDp * 0.85,
    marginVertical: 10,
    alignItems: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  topButton: {
    flex: 1,
    backgroundColor: '#FFF',
   elevation:1,
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  topButtonText: {
    color: '#444E38',
    fontWeight: '600',
    fontSize: 16,
  },
  applyButton: {
    width: '100%',
    backgroundColor: '#C9EC20',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  inputContainer: {
    width: deviceWidthDp * 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    padding: deviceWidthDp * 0.01,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    minHeight: deviceHeightDp * 0.04,
    maxHeight: deviceHeightDp * 0.12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: deviceWidthDp * 0.01,
  },
  sendButton: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'black',
    letterSpacing: 1,
    fontWeight: '500',
  },
});
