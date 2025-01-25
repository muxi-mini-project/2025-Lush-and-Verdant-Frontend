import {  View, Text, StyleSheet,TextInput, Pressable,Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';

const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;



export default function LoginPage(){
    const [isChecked,setChecked]=useState(false)
    const [name,setName]=useState('')
    return(
        <LinearGradient colors={['#D8F9C0','#F2FFCF','#FFFFFF']} 
        style={styles.background}
        start={{x:0,y:0}}
        end={{x:0,y:1}} locations={[0,0.27,0.79]}>
        <View style={styles.form}>
            <View style={styles.headregion}>
            <Text style={styles.headtext}>你好！</Text>
            <Text style={styles.headtext}>欢迎使用葱茏</Text>
            </View> 
        
        <View style={{flex:1/3, display:'flex' ,alignItems:'center', justifyContent:'space-around'}}>
         <TextInput style={styles.input1} placeholder='请输入邮箱' keyboardType='email-address' value={name} onChangeText={setName}></TextInput>
         <TextInput style={styles.input2} placeholder='请输入密码'></TextInput>
        </View> 
        <Pressable style={styles.login}>
            <LinearGradient colors={['#CDF3AA','#E6FEA2']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.loginstyle}><Text style={{fontSize:17,fontWeight:700,letterSpacing:3}}>登录</Text></LinearGradient>
        </Pressable>
        <View style={styles.functionregion}>
            <Pressable style={{flexWrap:'nowrap',flexDirection:'row',justifyContent:'center',alignItems:'center',padding:1}}><Link href='/(tabsin)/forgetPassword' style={{color:'#A5A5A5',backgroundColor:"#ffffff",textAlign:'center'}}>忘记密码|</Link><Link href='/(tabsin)/register' style={{color:'#A5A5A5'}}>注册新用户</Link></Pressable>
        </View>
        <View style={{flexWrap:'wrap', width:300, height:30,position:'relative',left:10,top:40}}><Checkbox
            value={isChecked}
            onValueChange={setChecked}
            style={styles.checkbox}
        /><Text style={{position:'absolute',left:35,top:6, color:'#A5A5A5'}}>我已同意<Link href='/' style={{color:'#3289FF'}}>《用户协议》</Link>和<Link href='/' style={{color:'#3289FF'}}>《隐私条款》</Link></Text></View>
        </View>
        </LinearGradient>
    )
} 
const styles=StyleSheet.create(
    {
        background:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            
        },
        form:{
            display:'flex', 
            justifyContent:'space-around',
            alignItems:'center',
            width:deviceWidthDp*0.84,
            backgroundColor:'white',
            height:deviceHeightDp*0.75,
            borderRadius:53
        },
        headregion:{
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            flex:1/3,
            width:148,
            height:63,
            marginRight:deviceWidthDp*0.4,
            position:'relative',
            top:-deviceHeightDp*0.05
      
        },
        headtext:{
            fontSize:23,
            fontWeight:800,
            lineHeight:28,
            letterSpacing:1,
    
        },
        input1:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            position:'relative',
            bottom:deviceHeightDp*0.12
          
            
            
        },
        input2:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            bottom:deviceHeightDp*0.12
        },
        login:{
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            position:'relative',
            bottom:deviceHeightDp*0.12,
          
           
        },
        loginstyle:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:25
            
        },
        functionregion:{
            
            display:'flex',
            justifyContent:'center',
            width:deviceWidthDp*0.4,
            height:deviceHeightDp*0.05,
            color:'#A5A5A5',
            backgroundColor:'white',
            position:'relative',
            bottom:deviceHeightDp*0.12
            
        },
        checkbox:{
              borderRadius:10,
              margin:8,
            
        }
        
    }
)