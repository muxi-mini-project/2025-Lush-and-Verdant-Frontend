import {  View, Text, StyleSheet,TextInput, Pressable,Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;


export default function ForgetPassword(){
    const [isChecked,setChecked]=useState(false)
    return(
        <LinearGradient colors={['#D8F9C0','#F2FFCF','#FFFFFF']} 
        style={styles.background}
        start={{x:0,y:0}}
        end={{x:0,y:1}} locations={[0,0.27,0.79]}>
        <View style={styles.form}>
            <View style={styles.headregion}>
            <Text style={styles.headtext}>找回密码</Text>
            
            </View> 
        </View>
        <View>
         
         <TextInput style={styles.input1} placeholder='请输入邮箱' keyboardType='email-address'></TextInput><Pressable style={{position:'absolute', left:deviceWidthDp*0.2,top:deviceHeightDp*0.2,width:75}}><Text style={{color:'#A0D4A3'}}>获取验证码</Text></Pressable>
         <TextInput style={styles.input2} placeholder='请输入密码'></TextInput>
         <TextInput style={styles.input3} placeholder='请输入密码'></TextInput>
         <TextInput style={styles.input4} placeholder='请输入验证码'></TextInput>
         <Pressable style={{position:'absolute', left:deviceWidthDp*0.13,top:-deviceHeightDp*0.56 }}><Text style={{color:'#A0D4A3',fontSize:deviceHeightDp*0.015}}>发送验证码</Text></Pressable>
        </View> 
        <View>
         <Pressable style={styles.login}>
            <LinearGradient colors={['#CDF3AA','#E6FEA2']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.loginstyle}><Text style={{fontSize:17,fontWeight:700,letterSpacing:3}}>设置</Text></LinearGradient>
         </Pressable>
        </View>
        <View style={{flexWrap:'wrap', width:300, height:30,position:'relative',left:10,top:40}}><Checkbox
            value={isChecked}
            onValueChange={setChecked}
            style={styles.checkbox}
        /><Text style={{position:'absolute',left:35,top:6, color:'#A5A5A5'}}>我已同意<Link href='/' style={{color:'#3289FF'}}>《用户协议》</Link>和<Link href='/' style={{color:'#3289FF'}}>《隐私条款》</Link></Text></View>
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
            position:'relative',
            left:0,
            top:0,
            width:deviceWidthDp*0.84,
            backgroundColor:'white',
            height:deviceHeightDp*0.75,
            borderRadius:53
        },
        headregion:{
            position:'relative',
            top:deviceHeightDp*0.05,
            left:deviceWidthDp*0.07,
            width:148,
            height:63,
        
        },
        headtext:{
            fontSize:23,
            fontWeight:800,
            lineHeight:28,
            letterSpacing:1
        },
        input1:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            position:'absolute',
            top:-deviceHeightDp*0.58,
            left:-deviceWidthDp*0.36
            
        },
        input2:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            position:'absolute',
            top:-deviceHeightDp*0.48,
            left:-deviceWidthDp*0.36
        },
        login:{
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            position:'absolute',
            top:-deviceHeightDp*0.18,
            left:-deviceWidthDp*0.36,
        },
        loginstyle:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:25
        },
        functionregion:{
            flexWrap:'wrap',
            width:72,
            height:30,
            position:'absolute',
            left:138,
            top:529,
            color:'#A5A5A5'
            
        },
        checkbox:{
              borderRadius:10,
              margin:8,
              position:'absolute',
              top:0
        },
        input3:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            position:'absolute',
            top:-deviceHeightDp*0.38,
            left:-deviceWidthDp*0.36
            
    },
        input4:{
            backgroundColor:'#F7F7F7',
            width:deviceWidthDp*0.7,
            height:deviceHeightDp*0.06,
            borderRadius:25,
            color:'#CCCCCC',
            position:'absolute',
            top:-deviceHeightDp*0.28,
            left:-deviceWidthDp*0.36
            
        }


}

)