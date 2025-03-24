import { useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Dimensions, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../groupprovider';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;
import { useState } from 'react';

export default function ChatRoom() {
  const { groupId, userId } = useLocalSearchParams() as { groupId: string; userId: string };
  const router = useRouter();
  const { groups, sendMessage } = useGroups();
  const [newMessage, setNewMessage] = useState('');
  

  // 获取当前小组信息
  const group = groups.find((g) => g.groupId === groupId);

  if (!group) return <View style={styles.container}><Text>小组不存在</Text></View>;

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(groupId, newMessage, userId);
      setNewMessage('');
    }
  };
   const handlesettings=(groupId:string)=>{
      router.push(`/(groupsettings)/${groupId}`)
   }
  return (
    <LinearGradient
      colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={8} style={styles.container1}>
        {/* 消息列表 */}
        <View style={styles.headregion}>
          <Text style={styles.textregion}>top</Text>
          <View style={styles.pictureregion}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarContainer}>
              {group.members.slice(0, 5).map((member) => (
                <Image
                  key={member.userId}
                  source={{ uri: member.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
          <Pressable style={styles.settingsregion} onPress={()=>handlesettings(groupId)}>
            <Image
              resizeMode="contain"
              style={{ width: 26, height: 26 }}
              source={require('../../assets/images/Group 60.png')}
            ></Image>
          </Pressable>
        </View>

        <View style={styles.choiceregion}>
          <Pressable style={styles.com}>
            <Text style={{ textAlign: 'center', letterSpacing: 1, fontSize: deviceWidthDp * 0.038 }}>
              互动面板
            </Text>
          </Pressable>
          <Pressable style={styles.ing}>
            <Text style={{ textAlign: 'center', letterSpacing: 1, fontSize: deviceWidthDp * 0.038 }}>
              种植进度
            </Text>
          </Pressable>
        </View>

        <View style={styles.messageregion}>
          <ScrollView contentContainerStyle={styles.messageContainer}   showsVerticalScrollIndicator={false}   >
            {group.messages.map((message) => {
              const isOwn = message.senderId === userId;
              const sender = group.members.find((m) => m.userId === message.senderId);

              return (
                <View
                  key={message.messageId}
                  style={[
                    styles.messageBubble,
                    isOwn ? styles.ownMessage : styles.otherMessage,
                  ]}
                >
                  {!isOwn && <Text style={styles.senderName}>{sender?.userName}</Text>}
                  <Text style={styles.messageText}>{message.content}</Text>
                  <Text style={styles.timeText}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 消息输入区域 */}
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
}

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop:deviceHeightDp*0.04,
  },
  avatar: {
    width: deviceWidthDp * 0.08,
    height: deviceWidthDp * 0.08,
    borderRadius: deviceWidthDp * 0.06,
    marginRight: 10,
    borderWidth:deviceWidthDp*0.008,
  },
  com: {
    width: deviceWidthDp * 0.25,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: 'white',
    height: deviceHeightDp * 0.04,
    display: 'flex',
    justifyContent: 'center',
  },
  ing: {
    width: deviceWidthDp * 0.25,
    elevation: 3,
    borderRadius: 20,
    backgroundColor: 'white',
    height: deviceHeightDp * 0.04,
    display: 'flex',
    justifyContent: 'center',
  },
  textregion: {
    flex: 3 / 16,
    textAlign: 'center',
    marginTop: deviceHeightDp * 0.05,
    color: '#444E38',
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  pictureregion: {
    flex: 10 / 16,
    backgroundColor: 'transparent',
  },
  settingsregion: {
    flex: 3 / 16,
    marginTop: deviceHeightDp * 0.055,
    display: 'flex',
    alignItems: 'center',
  },
  headregion: {
    flex: 1 / 8,
    width: deviceWidthDp * 0.85,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choiceregion: {
    width: deviceWidthDp * 0.8,
    flex: 1 / 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  messageregion: {
    flex: 3 / 4,
  },
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    borderRadius: 20,
    padding: deviceHeightDp * 0.03,
    width: deviceWidthDp * 0.8,
    height: deviceHeightDp * 0.8,
    backgroundColor: 'white',
    paddingBottom: deviceHeightDp * 0.08, // 为输入区域留出空间
  },
  messageBubble: {
    maxWidth: '80%',
    padding: deviceWidthDp * 0.02,
    borderRadius: 16,
    marginBottom: deviceWidthDp * 0.03,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  senderName: {
    fontSize: deviceWidthDp * 0.03,
    color: '#666',
    marginBottom: deviceHeightDp * 0.005,
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
  inputContainer: {
    flex: 1 / 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: deviceWidthDp * 0.01,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
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
