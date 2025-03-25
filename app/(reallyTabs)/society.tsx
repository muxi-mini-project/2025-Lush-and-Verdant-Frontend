import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function Society() {
  const router = useRouter();
  useEffect(() => {});
  return (
    <LinearGradient
      colors={["#D8F9C0", "#F2FFCF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.27, 0.79]}
      style={styles.container}
    ></LinearGradient>
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
    color: "#fff",
  },
  test: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
