import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
   
    screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
          backgroundColor: '#25292e',
          },
      }}>
     
        <Tabs.Screen
       name="index"

       options={{
         title: '我的', 
         headerShown:false,
         tabBarStyle:{
            display:'none'
         },
         tabBarIcon:({ color,focused })=>(//这块要引入一个设计那边的组件库来确定图标
            <Ionicons name={focused?'home-sharp':'home-outline'} color={color} size={24}/>)
        }} />
        
  
    </Tabs>
  );
}