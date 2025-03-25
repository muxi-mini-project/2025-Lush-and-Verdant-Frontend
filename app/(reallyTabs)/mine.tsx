import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useGroups } from "../groupprovider";
import * as SecureStore from "expo-secure-store";
import { put, del, get, post } from "@/components/Api";
import { Alert } from "react-native";

const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;
const PlaceholderImage = require("../../assets/images/登录.png");

export default function Mine() {
  const [username, setUsername] = useState("用户名");
  const { isLogin, setIsLogin, user, setSlogan } = useGroups();
  const [number1, setNumber1] = useState(100);
  const [number2, setNumber2] = useState(1);
  const [number3, setNumber3] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    PlaceholderImage
  );

  // 新增状态：是否显示编辑用户名的 Modal，以及编辑时的用户名
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  async function getUploadToken(): Promise<string> {
    const res = await get("http://8.129.3.142:8080/get_token", true);
    const resultp = await res.json();
    return resultp.data;
  }
  const editname = async () => {
    try {
      const userData = {
        id: user,
        username: editUsername,
        email: "",
      };
      const response3 = await post(
        "http://8.129.3.142:8080/user/update",
        userData,
        true
      );
      Alert.alert("修改用户名成功");
    } catch (e) {
      console.log(e);
      Alert.alert("修改用户名失败");
    }

    setUsername(editUsername);
    setIsModalVisible(false);
  };
  const offLogin = () => {
    setIsLogin(false);
    alert("您已经退出");
    SecureStore.deleteItemAsync("token").then(() => {});
    setSelectedImage(PlaceholderImage);
    setUsername("用户名");
    setSlogan("");
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imgUrl = result.assets[0].uri;
      setSelectedImage(imgUrl);
      try {
        const uploadToken = await getUploadToken();
        const formData = new FormData();
        formData.append("token", uploadToken);
        console.log(imgUrl);
        formData.append("file", {
          uri: imgUrl,
          name: "upload.jpg",
          type: "image/jpeg",
        } as any);
        const resp = await fetch("https://upload-z2.qiniup.com", {
          method: "POST",
          body: formData,
        });
        const responseData = await resp.json();

        const imageUrl = `http://mini-project.muxixyz.com/${responseData.key}`;
        setSelectedImage(imageUrl);

        console.log(imageUrl);
        console.log(user);
        const userData = {
          id: user,
          url: imageUrl,
        };

        const response = await put(
          "http://8.129.3.142:8080/image/user/update",
          userData,
          true
        );

        alert("修改头像成功");
      } catch (error) {
        console.error("上传失败", error);
      }
    } else {
      alert("您没有选择照片");
    }
  };

  const router = useRouter();

  const handleSettings = () => {
    router.push("/(reallyTabsin)/settings");
  };

  const handleLogin = () => {
    if (!isLogin) {
      router.push("/(tabsin)/login");
    }
  };

  const handleRecation = () => {
    router.push("/(reallyTabsin2)/reaction");
  };
  const id = user;
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response1 = await get(
          `http://8.129.3.142:8080/user/info/${id}`,
          true
        );
        const result1 = await response1.json();
        setUsername(result1.data.username);
      } catch (e) {
        console.log(e);
      }
      try {
        const response2 = await get(
          `http://8.129.3.142:8080/image/user/get/${id}`,
          true
        );
        const result2 = await response2.json();
        setSelectedImage(result2.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (isLogin === true) {
      getUserData();
    }
  }, []);
  return (
    <LinearGradient
      colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    >
      <View style={styles.headerregion}>
        <Text style={styles.headertext}>个人主页</Text>
        <Pressable
          style={{
            position: "absolute",
            left: deviceWidthDp * 0.05,
            top: deviceHeightDp * 0.11,
            backgroundColor: "transparent",
            width: deviceWidthDp * 0.2,
            height: deviceWidthDp * 0.2,
          }}
          onPress={() => {
            if (isLogin === true) {
              pickImageAsync();
            }
          }}
        >
          <Image
            source={selectedImage}
            style={{
              width: deviceWidthDp * 0.2,
              height: deviceWidthDp * 0.2,
              borderRadius: 50,
            }}
          />
        </Pressable>
        {/* 将用户名区域改为 Pressable，点击后唤出 Modal 编辑 */}
        <Pressable
          onPress={() => {
            if (isLogin !== false) {
              setIsModalVisible(true);
              setEditUsername(username);
            }
          }}
          style={{
            position: "absolute",
            left: deviceWidthDp * 0.35,
            top: deviceHeightDp * 0.14,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              letterSpacing: 2,
              color: "#000000",
              fontWeight: "500",
            }}
          >
            {username}
          </Text>
        </Pressable>
        <Pressable
          style={{
            position: "absolute",
            left: deviceWidthDp * 0.85,
            top: deviceHeightDp * 0.15,
          }}
        >
          <Image
            source={require("../../assets/images/退出键.png")}
            style={{
              width: deviceWidthDp * 0.04,
              height: deviceWidthDp * 0.04,
            }}
          />
        </Pressable>
      </View>

      <View style={styles.mediumregion}>
        <View style={{ flex: 1 / 3, alignItems: "center", padding: 1 }}>
          <Image
            source={require("../../assets/images/个人获赞.png")}
            style={{
              width: deviceWidthDp * 0.05,
              height: deviceWidthDp * 0.05,
              position: "absolute",
              left: deviceWidthDp * 0.055,
              top: deviceHeightDp * 0.01,
            }}
          />
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.06,
              top: deviceHeightDp * 0.036,
              fontWeight: "500",
            }}
          >
            森林获赞
          </Text>
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.12,
              top: deviceHeightDp * 0.01,
            }}
          >
            {number1}
          </Text>
        </View>
        <View style={{ flex: 1 / 3, alignItems: "center", padding: 1 }}>
          <Image
            source={require("../../assets/images/森林获赞.png")}
            style={{
              width: deviceWidthDp * 0.048,
              height: deviceWidthDp * 0.05,
              position: "absolute",
              left: deviceWidthDp * 0.055,
              top: deviceHeightDp * 0.01,
            }}
          />
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.06,
              top: deviceHeightDp * 0.036,
              fontWeight: "500",
            }}
          >
            完成小目标
          </Text>
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.12,
              top: deviceHeightDp * 0.01,
            }}
          >
            {number2}
          </Text>
        </View>
        <View style={{ flex: 1 / 3, alignItems: "center", padding: 1 }}>
          <Image
            source={require("../../assets/images/激励语获赞.png")}
            style={{
              width: deviceWidthDp * 0.05,
              height: deviceWidthDp * 0.05,
              position: "absolute",
              left: deviceWidthDp * 0.055,
              top: deviceHeightDp * 0.01,
            }}
          />
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.06,
              top: deviceHeightDp * 0.036,
              fontWeight: "500",
            }}
          >
            激励语获赞
          </Text>
          <Text
            style={{
              position: "absolute",
              left: deviceWidthDp * 0.12,
              top: deviceHeightDp * 0.01,
            }}
          >
            {number3}
          </Text>
        </View>
      </View>
      <View style={styles.unuseless1}></View>
      <View style={styles.bottomregion}>
        <Pressable
          onPress={isLogin ? offLogin : handleLogin}
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "rgba(0,0,0,0.1)",
          }}
        >
          {isLogin ? (
            <View>
              <Image
                source={require("../../assets/images/登录.png")}
                style={{
                  width: deviceWidthDp * 0.06,
                  height: deviceWidthDp * 0.06,
                  position: "absolute",
                  left: deviceWidthDp * 0.028,
                  top: deviceHeightDp * 0.01,
                }}
              />
              <Text
                style={{
                  position: "absolute",
                  left: deviceHeightDp * 0.04,
                  top: deviceHeightDp * 0.013,
                  fontWeight: "500",
                  color: "#333333",
                }}
              >
                退出登录
              </Text>
            </View>
          ) : (
            <View>
              <Image
                source={require("../../assets/images/登录.png")}
                style={{
                  width: deviceWidthDp * 0.06,
                  height: deviceWidthDp * 0.06,
                  position: "absolute",
                  left: deviceWidthDp * 0.028,
                  top: deviceHeightDp * 0.01,
                }}
              />
              <Text
                style={{
                  position: "absolute",
                  left: deviceHeightDp * 0.04,
                  top: deviceHeightDp * 0.013,
                  fontWeight: "500",
                }}
              >
                登录/注册
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "rgba(0,0,0,0.1)",
          }}
        >
          <View>
            <Image
              source={require("../../assets/images/引导教程.png")}
              style={{
                width: deviceWidthDp * 0.06,
                height: deviceWidthDp * 0.06,
                position: "absolute",
                left: deviceWidthDp * 0.02,
                top: deviceHeightDp * 0.01,
              }}
            />
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.04,
                top: deviceHeightDp * 0.013,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              引导教程
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "rgba(0,0,0,0.1)",
          }}
          onPress={handleSettings}
        >
          <View>
            <Image
              source={require("../../assets/images/设置.png")}
              style={{
                width: deviceWidthDp * 0.06,
                height: deviceWidthDp * 0.06,
                position: "absolute",
                left: deviceWidthDp * 0.02,
                top: deviceHeightDp * 0.01,
              }}
            />
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.04,
                top: deviceHeightDp * 0.013,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              设置
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={handleRecation}
          style={{ flex: 1 / 4, backgroundColor: "transparent" }}
        >
          <View>
            <Image
              source={require("../../assets/images/用户反馈.png")}
              style={{
                width: deviceWidthDp * 0.06,
                height: deviceWidthDp * 0.06,
                position: "absolute",
                left: deviceWidthDp * 0.02,
                top: deviceHeightDp * 0.01,
              }}
            />
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.04,
                top: deviceHeightDp * 0.013,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              意见反馈
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.unuseless}></View>
      <View
        style={{
          backgroundColor: "lightgrey",
          width: 1,
          height: deviceHeightDp * 0.03,
          position: "absolute",
          top: deviceHeightDp * 0.255,
          left: deviceWidthDp * 0.32,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "lightgrey",
          width: 1,
          height: deviceHeightDp * 0.03,
          position: "absolute",
          top: deviceHeightDp * 0.255,
          left: deviceWidthDp * 0.63,
        }}
      ></View>

      {/* Modal：编辑用户名 */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑用户名</Text>
            <TextInput
              style={styles.modalInput}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="请输入用户名"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={{ textAlign: "center" }}>取消</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={editname}>
                <Text style={{ textAlign: "center" }}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  test: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "black",
  },
  headerregion: {
    flex: 1 / 4,
    display: "flex",
    alignItems: "center",
    padding: 1,
    width: deviceWidthDp * 1,
  },
  mediumregion: {
    flex: 1 / 12,
    backgroundColor: "#FFFDFD",
    width: deviceWidthDp * 0.9,
    display: "flex",
    borderRadius: 9,
    flexDirection: "row",
    shadowColor: "#000000",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  bottomregion: {
    flex: 1 / 4,
    display: "flex",
    backgroundColor: "#FFFDFD",
    borderRadius: 9,
    width: deviceWidthDp * 0.9,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  headertext: {
    marginTop: deviceHeightDp * 0.05,
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  unuseless1: {
    flex: 1 / 32,
  },
  unuseless: {
    flex: 20 / 48,
  },
  // Modal 样式
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: deviceWidthDp * 0.8,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    width: deviceWidthDp * 0.2,
    textAlign: "center",
    backgroundColor: "#EFFDDC",
    borderRadius: 20,
  },
});
