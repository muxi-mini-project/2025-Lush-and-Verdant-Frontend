import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { View,Text, } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { withDecay } from 'react-native-reanimated';
export default function ReallyTabLayout() {
  return (
    <Tabs
  
    screenOptions={{
        tabBarBackground:()=>(
            <LinearGradient  style={{height:50,borderTopLeftRadius:10,borderTopRightRadius:10}}colors={['#E3EDD2','#F1F5E9']} start={{x:0,y:0}} end={{x:0,y:1}} locations={[0.22,1]}></LinearGradient>
        ),
        tabBarActiveTintColor: '#5D6641',
        headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
          position:'absolute',
         
          
          
          
          borderTopRightRadius:10,
          borderTopLeftRadius:10,
          },
      }}>
       <Tabs.Screen 
      name="forest" 
      options={{ 
        title: '森林', 
        tabBarIcon:({focused})=>{const iconSoucer=focused?require('../../assets/images/Slice 17.png'):require('../../assets/images/Slice 19.png')
            return(<Image source={iconSoucer} style={{width:30,height:34}}></Image>)
        }
      }}/>
         <Tabs.Screen 
      name="circle" 
      options={{ 
        title: '同心圆', 
        tabBarIcon:({focused})=>{const iconSoucer=focused?require('../../assets/images/Slice 12.png'):require('../../assets/images/Slice 8.png')
            return(<Image source={iconSoucer} style={{width:30,height:30}}></Image>)
        }}} />
          <Tabs.Screen 
      name="mainPage" 
      options={{ 
        title: '主页', 
         tabBarIcon: ({focused})=>{const iconSoucer=focused?require('../../assets/images/Slice 15.png'):require('../../assets/images/Slice 16.png')
            return(<Image source={iconSoucer} style={{width:30,height:34}}></Image>)
        }      }} />
      <Tabs.Screen 
      name="society" 
      options={{ 
        title: '串门', 
        tabBarIcon:({focused})=>{const iconSoucer=focused?require('../../assets/images/Slice 10.png'):require('../../assets/images/Slice 9.png')
            return(<Image source={iconSoucer} style={{width:34,height:30}}></Image>)
        }}} />
          <Tabs.Screen 
      name="mine" 
      options={{ 
        title: '我的', 
        headerShown:false,
        tabBarStyle:{position:'absolute',shadowColor:'transparent',elevation:0,borderTopWidth:0},
        tabBarBackground:()=>(
                <View style={{backgroundColor:'#FFFFFF', height:50,borderColor:'red'}}><Text></Text></View>
      ),
        tabBarIcon:({focused})=>{const iconSoucer=focused?require('../../assets/images/Slice 13.png'):require('../../assets/images/Slice 14.png')
            return(<Image source={iconSoucer} style={{width:34,height:30}}></Image>)
        }  }} />
    </Tabs>
  );
}