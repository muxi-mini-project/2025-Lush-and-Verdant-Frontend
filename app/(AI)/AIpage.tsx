import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { post, get } from "@/components/Api";
import { useGroups } from "../groupprovider";

const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}
interface Task {
  id: string;
  title: string;
  details: string;
}
interface EventItem {
  title: string;
  details: string;
  goal_id: string;
  task_id: string;
}

interface EventsByDate {
  [date: string]: EventItem[];
}

const ChatRoomAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // 用三个 useState 保存三个文本框的内容
  const [newCycle, setNewCycle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newSubject, setNewSubject] = useState<string>("");
  const { eventsByDate, setEventsByDate } = useGroups();
  const [taskData, setTaskData] = useState<EventsByDate>({});
  // 保存最后一次用户输入（用于思维导图中心节点）
  const [lastUserInput, setLastUserInput] = useState<{
    cycle: string;
    description: string;
    subject: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const handletocalender = () => {
    router.push("/(calender)/calenderpage");
  };

  const handleSend = async () => {
    if (newCycle.trim() && newDescription.trim() && newSubject.trim()) {
      // 将三个输入的内容组合成字符串
      const combinedContent = `周期: ${newCycle}\n描述: ${newDescription}\n主题: ${newSubject}`;
      const userMessage: Message = {
        id: Date.now().toString(),
        content: combinedContent,
        type: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setLastUserInput({
        cycle: newCycle,
        description: newDescription,
        subject: newSubject,
      });
      setNewCycle("");
      setNewDescription("");
      setNewSubject("");

      try {
        const toAIData = {
          cycle: newCycle,
          description: newDescription,
          topic: newSubject,
        };
        const response = await post(
          "http://8.129.3.142:8080/goal/GetGoal",
          toAIData,
          true
        );
        const result = await response.json();

        let aiFormattedMessage = "";
        for (const date in result.data) {
          if (result.data.hasOwnProperty(date)) {
            aiFormattedMessage += `日期: ${date}\n`;
            result.data[date].forEach((item: any, index: number) => {
              aiFormattedMessage += `主题: ${item.title}\n`;
              aiFormattedMessage += `详情: ${item.details}\n\n`;
            });
          }
        }
        setTaskData({ ...result.data });
        const aiMessage: Message = {
          id: Date.now().toString() + "-ai",
          content: aiFormattedMessage,
          type: "ai",
          timestamp: new Date(),
        };
        console.log(result.message);
        console.log(aiFormattedMessage);
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const AiCreateGoal = async () => {
    try {
      const formattedTaskData = {
        goals: Object.keys(taskData).map((date) => ({
          date,
          tasks: taskData[date].map((task) => ({
            title: task.title,
            details: task.details,
          })),
        })),
      };
      console.log(formattedTaskData);
      const response = await post(
        "http://8.129.3.142:8080/goal/MakeGoals",
        formattedTaskData,
        true
      );

      setEventsByDate((prev) => {
        const mergedData = { ...prev };
        for (const date in taskData) {
          if (taskData.hasOwnProperty(date)) {
            if (mergedData[date]) {
              mergedData[date] = [...mergedData[date], ...taskData[date]];
            } else {
              mergedData[date] = taskData[date];
            }
          }
        }
        return mergedData;
      });
      alert("应用成功");
    } catch (e) {
      alert("应用失败");
      console.log(e);
    }
  };

  return (
    <LinearGradient
      colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={6}
        style={styles.container1}
      >
        {/* 顶部标题区域 */}
        <View style={styles.headregion}>
          <Text style={styles.textregion}>智能规划</Text>
        </View>

        {/* 消息列表区域 */}
        <View style={styles.messageregion}>
          <ScrollView
            contentContainerStyle={styles.messageContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.type === "user"
                    ? styles.userMessage
                    : styles.aiMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.timeText}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 操作区域按钮 */}
        <View style={styles.actionContainer}>
          <View style={styles.topButtonsContainer}>
            <Pressable
              style={styles.topButton}
              onPress={() => {
                /* 重新生成功能 */
              }}
            >
              <Text style={styles.topButtonText}>重新生成</Text>
            </Pressable>
            <Pressable style={styles.topButton} onPress={handletocalender}>
              <Text style={styles.topButtonText}>自己调整</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.applyButton}
            onPress={() => {
              AiCreateGoal();
            }}
            disabled={isLoading}
          >
            <Text style={styles.applyButtonText}>应用</Text>
          </Pressable>
        </View>

        {/* 输入区域，三个文本输入框 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newCycle}
            onChangeText={setNewCycle}
            placeholder="周期(请输入你想要完成目标的时间)"
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="描述"
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            value={newSubject}
            onChangeText={setNewSubject}
            placeholder="主题"
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleSend}
            disabled={
              !newCycle.trim() || !newDescription.trim() || !newSubject.trim()
            }
          >
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
    justifyContent: "center",
    alignItems: "center",
  },
  headregion: {
    width: deviceWidthDp * 0.85,
    marginTop: deviceHeightDp * 0.05,
    marginBottom: deviceHeightDp * 0.02,
    alignItems: "center",
  },
  textregion: {
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  messageregion: {
    flex: 1,
    width: deviceWidthDp * 0.88,
  },
  messageContainer: {
    padding: deviceHeightDp * 0.03,
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingBottom: deviceHeightDp * 0.08,
  },
  messageBubble: {
    maxWidth: "80%", // 让气泡不会太宽
    paddingVertical: 10, // 适当增加垂直内边距
    paddingHorizontal: 10, // 适当增加水平内边距
    borderRadius: 16,
    marginBottom: 6,
    alignSelf: "flex-start", // 默认左对齐，用户消息右对齐
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    borderTopRightRadius: 4,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: deviceWidthDp * 0.03,
    color: "#333",
    flexWrap: "wrap",
    flexShrink: 1,
    paddingBottom: 5,
  },
  timeText: {
    fontSize: deviceWidthDp * 0.02,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: deviceHeightDp * 0.01,
  },
  actionContainer: {
    width: deviceWidthDp * 0.85,
    marginVertical: 10,
    alignItems: "center",
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  topButton: {
    flex: 1,
    backgroundColor: "#FFF",
    elevation: 1,
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  topButtonText: {
    color: "#444E38",
    fontWeight: "600",
    fontSize: 16,
  },
  applyButton: {
    width: "100%",
    backgroundColor: "#C9EC20",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  inputContainer: {
    width: deviceWidthDp * 0.85,
    flexDirection: "column",
    alignItems: "center",
    padding: deviceWidthDp * 0.01,
  },
  input: {
    width: "100%",
    minHeight: deviceHeightDp * 0.04,
    maxHeight: deviceHeightDp * 0.12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  sendButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "black",
    letterSpacing: 1,
    fontWeight: "500",
  },
});
