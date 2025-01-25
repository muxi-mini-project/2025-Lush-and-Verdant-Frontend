import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Society() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>这是社交</Text>
      <Link href="/(tabsin)/login" style={styles.test}>这是一个用于测试的链接</Link>
      <Link href="/(tabsindex)/index1" style={styles.test}>这是一个用于测试的链接</Link>
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