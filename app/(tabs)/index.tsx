import { Text, View, StyleSheet,TouchableOpacity,Dimensions } from 'react-native';
import { useNavigation,useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect,useState } from 'react';
import { get,post } from '@/components/Api';
import *as Device from 'expo-device';
import { Constants } from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;
export default function FirstPage(){
  const [deviceId,setDeviceId]=useState<string | null>(null)
  useEffect(()=>{
    const getDeviceInfo = async () => {
      const uniqueId = Device.deviceName; // 获取设备的唯一标识符（UUID）
      setDeviceId(uniqueId);
    };

    getDeviceInfo();
  },[])
  const router=useRouter()
  const handelePress=()=>{
    router.push('/(tabsin)/login')
  }
  return (
       <TouchableOpacity activeOpacity={0.9}  onPress={handelePress} style={styles.background}>
        
           <Image contentFit='contain' style={{ flex:1/5,height:deviceHeightDp*0.2,width:deviceWidthDp*0.55, position:'absolute',top:deviceHeightDp*0.2}} source={require('../../assets/images/logo.png')} />
           <Text style={{position:'absolute',top:deviceHeightDp*0.8, color:'#A0B7A6'}}>点击任意位置进入</Text>
       </TouchableOpacity>
  )
}
const styles=StyleSheet.create(
  {
    background:{
          backgroundColor:'#DEEBC2',
          flex:1,
          justifyContent:'center',
          alignItems:'center',
    }
  }
)