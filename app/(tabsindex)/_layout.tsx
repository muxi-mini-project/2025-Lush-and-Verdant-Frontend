import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayoutindex() {
  return (
    <Tabs
     initialRouteName='index1'
    screenOptions={{
        
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
            backgroundColor: '#25292e',
            
    
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
          backgroundColor: '#25292e',
          display:'none'
          },
          
      }}>
     
     
        <Tabs.Screen 
      name="index1"    
      options={{
        headerShown:false
        //这个地方可以隐藏一个很犯人的顶部栏
        }} />
    </Tabs>
  );
}