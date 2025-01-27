import { Text, View, StyleSheet,Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image } from 'expo-image';
import { populateParams } from 'expo-router/build/fork/getStateFromPath-forks';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;
const PlaceholderImage=require('../../assets/images/登录.png')
export default function Mine() {
  const [username,setUsername]=useState('用户名')
  const[islogin,setIslogin]=useState(true)
  const [number1,setNumber1]=useState(100)
  const [number2,setNumber2]=useState(1)
  const [number3,setNumber3]=useState(1)
  const [selectedImage,setSelectedImage] =useState<string |undefined>(undefined)
  const pickImageAsync =async ()=>{
    let result =await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing:true,
      quality:1,
    })
    if(!result.canceled){
      setSelectedImage(result.assets[0].uri)
    }else{
      alert('您没有选择照片')
    }
  }

  return (
    <LinearGradient  colors={['#D8F9C0','#F2FFCF','#FFFFFF']} 
    start={{x:0,y:0}}
    end={{x:0,y:1}} locations={[0,0.27,0.79]} style={styles.container}>
         <View style={styles.headerregion}>
          <Text style={styles.headertext}>个人主页</Text>
          <Pressable style={{position:'absolute',left:deviceWidthDp*0.05,top:deviceHeightDp*0.11,backgroundColor:'transparent',width:deviceWidthDp*0.2,height:deviceWidthDp*0.2}} onPress={pickImageAsync}><ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage}></ImageViewer></Pressable>
          <Text style={{position:'absolute',left:deviceWidthDp*0.35,top:deviceHeightDp*0.14,fontSize:20,letterSpacing:2,color:'#000000',fontWeight:'500'}}>{username}</Text>
          <Pressable style={{position:'absolute',left:deviceWidthDp*0.85,top:deviceHeightDp*0.15}}><Image source={require('../../assets/images/退出键.png')} style={{width:deviceWidthDp*0.04,height:deviceWidthDp*0.04}}></Image></Pressable>
          </View> 
         <View style={styles.mediumregion}>
          <View style={{display:'flex',flex:1/3,alignItems:'center',padding:1}}><Image source={require('../../assets/images/个人获赞.png')} style={{width:deviceWidthDp*0.05,height:deviceWidthDp*0.05,position:'absolute',left:deviceWidthDp*0.055,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceWidthDp*0.06,top:deviceHeightDp*0.036,fontWeight:'500'}}>森林获赞</Text><Text style={{position:'absolute',left:deviceWidthDp*0.12,top:deviceHeightDp*0.01}}>{number1}</Text></View>
          <View style={{flex:1/3,display:'flex',alignItems:'center',padding:1}}><Image source={require('../../assets/images/森林获赞.png')} style={{width:deviceWidthDp*0.048,height:deviceWidthDp*0.05,position:'absolute',left:deviceWidthDp*0.055,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceWidthDp*0.06,top:deviceHeightDp*0.036,fontWeight:'500'}}>完成小目标</Text><Text style={{position:'absolute',left:deviceWidthDp*0.12,top:deviceHeightDp*0.01}}>{number2}</Text></View>
          <View style={{flex:1/3,display:'flex',alignItems:'center',padding:1}}><Image source={require('../../assets/images/激励语获赞.png')} style={{width:deviceWidthDp*0.05,height:deviceWidthDp*0.05,position:'absolute',left:deviceWidthDp*0.055,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceWidthDp*0.06,top:deviceHeightDp*0.036,fontWeight:'500'}}>激励语获赞</Text><Text style={{position:'absolute',left:deviceWidthDp*0.12,top:deviceHeightDp*0.01}}>{number3}</Text></View></View> 
          <View style={styles.unuseless1}></View>
         <View style={styles.bottomregion}>
          <Pressable style={{flex:1/4,backgroundColor:'transparent',borderBottomWidth:0.2,borderColor:'grey'}} >{islogin?<View><Image source={require('../../assets/images/登录.png')} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:deviceWidthDp*0.028,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceHeightDp*0.04,top:deviceHeightDp*0.013,fontWeight:'500',color:'#333333'}}>退出登录</Text></View>:<View><Image source={require('../../assets/images/登录.png')} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:deviceWidthDp*0.028,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceHeightDp*0.04,top:deviceHeightDp*0.013,fontWeight:'500'}}>登录</Text></View>}</Pressable>
          <Pressable  style={{flex:1/4,backgroundColor:'transparent',borderBottomWidth:0.2,borderColor:'grey'}}><View><Image source={require('../../assets/images/引导教程.png')} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:deviceWidthDp*0.02,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceHeightDp*0.04,top:deviceHeightDp*0.013,fontWeight:'500',color:'#333333'}}>引导教程</Text></View></Pressable>
          <Pressable  style={{flex:1/4,backgroundColor:'transparent',borderBottomWidth:0.2,borderColor:'grey'}}><View><Image source={require('../../assets/images/设置.png')} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:deviceWidthDp*0.02,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceHeightDp*0.04,top:deviceHeightDp*0.013,fontWeight:'500',color:'#333333'}}>设置</Text></View></Pressable>
          <Pressable  style={{flex:1/4,backgroundColor:'transparent',borderBottomWidth:0.2,borderColor:'grey'}}><View><Image source={require('../../assets/images/用户反馈.png')} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:deviceWidthDp*0.02,top:deviceHeightDp*0.01}}></Image><Text style={{position:'absolute',left:deviceHeightDp*0.04,top:deviceHeightDp*0.013,fontWeight:'500',color:'#333333'}}>意见反馈</Text></View></Pressable></View> 
         <View style={styles.unuseless}></View>
         <View style={{backgroundColor:'lightgrey',width:1,height:deviceHeightDp*0.03,position:'absolute',top:deviceHeightDp*0.255,left:deviceWidthDp*0.32}}></View>
         <View style={{backgroundColor:'lightgrey',width:1,height:deviceHeightDp*0.03,position:'absolute',top:deviceHeightDp*0.255,left:deviceWidthDp*0.63}}></View>
         
    </LinearGradient>
    
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
    color: 'black',
  },
  test:{
    fontSize: 20,
    textDecorationLine: 'underline',
    color: 'black',
  },
  headerregion:{
    flex:1/4,
    display:'flex',
    alignItems:'center',
    padding:1,
    width:deviceWidthDp*1,
    
  },
  mediumregion:{
    flex:1/12,
    backgroundColor:'#FFFDFD',
    width:deviceWidthDp*0.9,
    display:'flex',
    borderRadius:9,
    flexDirection:'row',
    shadowColor:'#000000',
    shadowOffset:{width:0,height:20},
    shadowRadius:1,
    elevation:0.5,
    
  },
  bottomregion:{
     flex:1/4,
     display:'flex',
     backgroundColor:'#FFFDFD',
     borderRadius:9,
     width:deviceWidthDp*0.9,
     elevation:1.5
  },
  headertext:{
    marginTop:deviceHeightDp*0.05,
    color:'#444E38',
    fontWeight:'800',
    letterSpacing:1.5,
    fontSize:deviceHeightDp*0.02
  },
  unuseless1:{
       flex:1/32,
  },
  unuseless:{
    flex:20/48,
  }
});