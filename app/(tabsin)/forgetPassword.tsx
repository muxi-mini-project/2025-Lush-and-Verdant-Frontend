import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useRouter } from "expo-router";
import { post } from "@/components/Api";
import { useGroups } from "../groupprovider";
const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;

export default function ForgetPassword() {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email, setEmail } = useGroups();
  const [code, setCode] = useState("");
  const handleSend = async () => {
    try {
      const sendEmail = {
        email: email,
      };
      const response = await post(
        "http://8.129.3.142:8080/user/send_email",
        sendEmail
      );
      if (response.ok) {
        const result = await response.json();
        alert("验证码发送成功");
      }
    } catch (error) {
      alert("验证码发送失败");
    }
  };

  const handleForgetPassword = async () => {
    // 验证输入框是否为空
    const isEmailEmpty = email === "" || email == null;
    const isPasswordEmpty = password === "" || password == null;
    const isConfirmPasswordEmpty =
      confirmPassword === "" || confirmPassword == null;

    if (isEmailEmpty || isPasswordEmpty || isConfirmPasswordEmpty) {
      // 使用更安全的方式显示错误信息
      alert("输入框不能为空");
      return;
    }

    // 验证两次密码是否一致
    if (confirmPassword !== password) {
      alert("两次密码输入不一致");
      return;
    }

    // 验证复选框是否被选中
    if (!isChecked) {
      alert("请先按下面那个小按钮");
      return;
    } else {
      try {
        router.back();
      } catch (error) {
        console.error("返回上一页失败:", error);
        alert("返回上一页失败，请稍后再试");
      }
      try {
        const forgetPasswordData = {
          email: email,
          password: password,
          code: code,
        };
        const response = await post(
          "http://8.129.3.142:8080/user/foralt",
          forgetPasswordData
        );
        if (response.ok) {
          const result = await response.json();
          alert("您已经重新注册成功");
          router.push("/(tabsin)/login");
        }
      } catch (error) {
        alert("注册失败");
      }
    }
  };

  return (
    <LinearGradient
      colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
    >
      <View style={styles.form}>
        <View style={styles.headregion}>
          <Text style={styles.headtext}>找回密码</Text>
        </View>
      </View>
      <View>
        <TextInput
          style={styles.input1}
          value={email}
          onChangeText={setEmail}
          placeholder="请输入邮箱"
          keyboardType="email-address"
        ></TextInput>
        <Pressable
          style={{
            position: "absolute",
            left: deviceWidthDp * 0.2,
            top: deviceHeightDp * 0.2,
            width: 75,
          }}
        >
          <Text style={{ color: "#A0D4A3" }}>获取验证码</Text>
        </Pressable>
        <TextInput
          style={styles.input2}
          value={password}
          onChangeText={setPassword}
          placeholder="请输入密码"
        ></TextInput>
        <TextInput
          style={styles.input3}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="请输入密码"
        ></TextInput>
        <TextInput
          style={styles.input4}
          value={code}
          onChangeText={setCode}
          placeholder="请输入验证码"
        ></TextInput>
        <Pressable
          onPress={handleSend}
          style={{
            position: "absolute",
            left: deviceWidthDp * 0.13,
            top: -deviceHeightDp * 0.56,
          }}
        >
          <Text style={{ color: "#A0D4A3", fontSize: deviceHeightDp * 0.015 }}>
            发送验证码
          </Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={handleForgetPassword} style={styles.login}>
          <LinearGradient
            colors={["#CDF3AA", "#E6FEA2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginstyle}
          >
            <Text style={{ fontSize: 17, fontWeight: 700, letterSpacing: 3 }}>
              设置
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View
        style={{
          flexWrap: "wrap",
          width: 300,
          height: 30,
          position: "relative",
          left: 10,
          top: 40,
        }}
      >
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          style={styles.checkbox}
        />
        <Text
          style={{ position: "absolute", left: 35, top: 6, color: "#A5A5A5" }}
        >
          我已同意
          <Link href="/" style={{ color: "#3289FF" }}>
            《用户协议》
          </Link>
          和
          <Link href="/" style={{ color: "#3289FF" }}>
            《隐私条款》
          </Link>
        </Text>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    position: "relative",
    left: 0,
    top: 0,
    width: deviceWidthDp * 0.84,
    backgroundColor: "white",
    height: deviceHeightDp * 0.75,
    borderRadius: 53,
  },
  headregion: {
    position: "relative",
    top: deviceHeightDp * 0.05,
    left: deviceWidthDp * 0.07,
    width: 148,
    height: 63,
  },
  headtext: {
    fontSize: 23,
    fontWeight: 800,
    lineHeight: 28,
    letterSpacing: 1,
  },
  input1: {
    backgroundColor: "#F7F7F7",
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    borderRadius: 25,
    color: "#CCCCCC",
    position: "absolute",
    top: -deviceHeightDp * 0.58,
    left: -deviceWidthDp * 0.36,
  },
  input2: {
    backgroundColor: "#F7F7F7",
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    borderRadius: 25,
    color: "#CCCCCC",
    position: "absolute",
    top: -deviceHeightDp * 0.48,
    left: -deviceWidthDp * 0.36,
  },
  login: {
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    position: "absolute",
    top: -deviceHeightDp * 0.18,
    left: -deviceWidthDp * 0.36,
  },
  loginstyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  functionregion: {
    flexWrap: "wrap",
    width: 72,
    height: 30,
    position: "absolute",
    left: 138,
    top: 529,
    color: "#A5A5A5",
  },
  checkbox: {
    borderRadius: 10,
    margin: 8,
    position: "absolute",
    top: 0,
  },
  input3: {
    backgroundColor: "#F7F7F7",
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    borderRadius: 25,
    color: "#CCCCCC",
    position: "absolute",
    top: -deviceHeightDp * 0.38,
    left: -deviceWidthDp * 0.36,
  },
  input4: {
    backgroundColor: "#F7F7F7",
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    borderRadius: 25,
    color: "#CCCCCC",
    position: "absolute",
    top: -deviceHeightDp * 0.28,
    left: -deviceWidthDp * 0.36,
  },
});
