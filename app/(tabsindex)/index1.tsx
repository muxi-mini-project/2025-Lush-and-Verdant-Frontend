import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index1() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <Link href="/" style={styles.test}>这是零一一个用于测试的链接</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  test:{
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});