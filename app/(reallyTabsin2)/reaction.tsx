import { Text, View, StyleSheet,Dimensions, Pressable,TextInput} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import ButtonSwitch from '@/components/ButtonSwitch';



const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;

export default function Reaction() {

  const[islogin,setIslogin]=useState(true)
 
  const [selectedImage,setSelectedImage] =useState<string |undefined>(undefined)
  const [time,setTime]=useState<string>('22:00')
 
  
  return (
    <LinearGradient  colors={['#D8F9C0','#F2FFCF','#FFFFFF']} 
    start={{x:0,y:0}}
    end={{x:0,y:1}} locations={[0,0.27,0.79]} style={styles.container}>
       <View style={styles.headerregion}>
                <Text style={styles.headertext}>意见反馈</Text>
              </View> 
       <View style={styles.textregion}><Text style={styles.text1}>葱茏一直在努力，</Text><Text style={styles.text2}>只为陪你共望青山。</Text></View>
       <View style={styles.reactionregion}>
          <TextInput style={styles.input1} placeholder='请提交反馈意见'></TextInput>    
          <TextInput style={styles.input2} placeholder='输入联系方式（手机号/QQ号/邮箱）'></TextInput>
       
       </View>
       <View style={styles.unless}></View>
       <View style={styles.submitregion}>
           <Pressable style={styles.login}>
                       <LinearGradient colors={['#CDF3AA','#E6FEA2']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.loginstyle}><Text style={{fontSize:17,fontWeight:700,letterSpacing:3}}>确认提交</Text></LinearGradient>
                   </Pressable>
       </View>
          
    </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
  input1:{
       width:deviceWidthDp*0.85,
       backgroundColor:'white',
       height:deviceHeightDp*0.3,
       textAlignVertical:'top',
       borderRadius:9,
       shadowColor:'black',
       shadowRadius:1,
       elevation:10,
     
       
  },
  input2:{
    width:deviceWidthDp*0.85,
    backgroundColor:'white',
    height:deviceHeightDp*0.06,
    borderRadius:9,
    marginTop:deviceHeightDp*0.02,
    elevation:10,
  },
  text1:{
    fontSize:deviceWidthDp*0.05,
  },
  text2:{
    fontSize:deviceWidthDp*0.05,
  },
  login:{
    width:deviceWidthDp*0.85,
    height:deviceHeightDp*0.06,
    position:'relative',
    bottom:deviceHeightDp*0.01,
  
   
},
loginstyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25
    
},
  textregion:{
      flex:1/8,
      width:deviceWidthDp*1,
      color:'#333333',
      marginLeft:deviceWidthDp*0.15,
      padding:1,
     
  },
  reactionregion:{
    flex:1/2,
    display:"flex",
    alignItems:"center",
  
    width:deviceWidthDp*1
  },
  unless:{
    flex:1/8,
  
  },
  submitregion:{
    flex:1/8,
   display:"flex",
    

  },
  headertext:{
    marginTop:deviceHeightDp*0.05,
    color:'#444E38',
    fontWeight:'800',
    letterSpacing:1.5,
    fontSize:deviceHeightDp*0.02
  },
  headerregion:{
    flex:1/8,
    display:'flex',
    alignItems:'center',
    padding:1,
    width:deviceWidthDp*1,
    
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
 
});