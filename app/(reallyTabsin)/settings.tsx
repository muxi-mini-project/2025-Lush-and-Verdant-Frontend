import { Text, View, StyleSheet, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image } from "expo-image";
import ButtonSwitch from "@/components/ButtonSwitch";

const deviceWidthDp = Dimensions.get("screen").width;
const deviceHeightDp = Dimensions.get("screen").height;

export default function Settings() {
  const [islogin, setIslogin] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [time, setTime] = useState<string>("22:00");

  return (
    <LinearGradient
      colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    >
      <View style={styles.headerregion}>
        <Text style={styles.headertext}>设置</Text>
      </View>
      <View style={styles.bottomregion}>
        <View
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "grey",
          }}
        >
          <View>
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.01,
                top: deviceHeightDp * 0.016,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              目标是否公开
            </Text>
            <ButtonSwitch
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.32,
                top: deviceHeightDp * 0.01,
              }}
            ></ButtonSwitch>
          </View>
        </View>
        <View
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "grey",
          }}
        >
          <View>
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.01,
                top: deviceHeightDp * 0.016,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              激励（语音）是否公开
            </Text>
            <ButtonSwitch
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.32,
                top: deviceHeightDp * 0.01,
              }}
            ></ButtonSwitch>
          </View>
        </View>
        <View
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "grey",
          }}
        >
          <View>
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.01,
                top: deviceHeightDp * 0.016,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              当前目标截止时间
            </Text>
            <Text
              style={{
                position: "absolute",
                left: deviceWidthDp * 0.75,
                top: deviceHeightDp * 0.015,
              }}
            >
              {time}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1 / 4,
            backgroundColor: "transparent",
            borderBottomWidth: 0.2,
            borderColor: "grey",
          }}
        >
          <View>
            <Text
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.01,
                top: deviceHeightDp * 0.016,
                fontWeight: "500",
                color: "#333333",
              }}
            >
              目标提醒弹窗
            </Text>
            <ButtonSwitch
              style={{
                position: "absolute",
                left: deviceHeightDp * 0.32,
                top: deviceHeightDp * 0.01,
              }}
            ></ButtonSwitch>
          </View>
        </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headertext: {
    marginTop: deviceHeightDp * 0.05,
    color: "#444E38",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  headerregion: {
    flex: 1 / 8,
    display: "flex",
    alignItems: "center",
    padding: 1,
    width: deviceWidthDp * 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomregion: {
    flex: 1 / 4,
    display: "flex",
    backgroundColor: "#FFFDFD",
    borderRadius: 9,
    width: deviceWidthDp * 0.9,
    elevation: 1.5,
  },

  unuseless: {
    flex: 5 / 8,
  },
  buttonswitch: {},
});
