import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Pressable, TextInput } from 'react-native';
import { useGroups } from '../groupprovider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ButtonSwitch from '@/components/ButtonSwitch';

const deviceHeightDp = Dimensions.get('screen').height;
const deviceWidthDp = Dimensions.get('screen').width;

export default function GroupSettings() {
  const router=useRouter()
  const { groupId } = useLocalSearchParams() as { groupId: string };
  const { groups, updateGroup,leaveGroup } = useGroups(); // 获取 groups 和 updateGroup
  const group = groups.find(g => g.groupId === groupId); // 根据 groupId 获取小组

  if (!group) {
    return <Text>小组信息未找到</Text>;
  }
 const handleLeaveGroup=(groupId:string)=>{
     leaveGroup(groupId)
     router.push('/(reallyTabs)/circle')
 }
  const [newGroupName, setNewGroupName] = useState(group.groupName);
  const [newGroupDesc, setNewGroupDesc] = useState(group.groupDesc);

  const handleUpdateGroup = () => {
    updateGroup(groupId, newGroupName, newGroupDesc); // 更新小组信息
    // 这里可以导航回到小组页面或显示更新成功消息
      router.push('/(reallyTabs)/circle')
  };

  return (
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.27, 0.79]}
        style={styles.modalContent}
      >
        <View style={styles.headregion}><Text style={styles.modalTitle}>小组设置</Text></View>
        <View style={styles.settingsregion}><View style={{display:'flex',flexDirection:'row', width:deviceWidthDp*0.9}}><Text style={styles.input1t}>更改组名</Text><TextInput
          style={styles.input1}
          placeholder="小组名称"
          value={newGroupName}
          onChangeText={setNewGroupName}
        /></View>
        <View style={{display:'flex',flexDirection:'row',width:deviceWidthDp*0.9}}><Text style={styles.input2t}>更改组名</Text> <TextInput
          style={styles.input2}
          placeholder="小组简介(少于三十字）"
          value={newGroupDesc}
          onChangeText={setNewGroupDesc}
          multiline={true}
        /></View>
        <View style={{display:'flex',flexDirection:'row',width:deviceWidthDp*0.9,marginTop:deviceHeightDp*0.02}}>
          <Text style={{flex:1/2,letterSpacing:1}}>目标是否公开</Text>
          <View style={{flex:3/16}}></View>
          <ButtonSwitch style={{flex:5/16}}></ButtonSwitch>

          </View>
          <View style={{display:'flex',flexDirection:'row',width:deviceWidthDp*0.9,marginTop:deviceHeightDp*0.02}}>
          <Text style={{flex:1/2,letterSpacing:1}}>免打扰</Text>
          <View style={{flex:3/16}}></View>
          <ButtonSwitch style={{flex:5/16}}></ButtonSwitch>

          </View>
       </View>
        <View style={styles.unless}></View>
        <View style={styles.defineregion}> <Pressable style={styles.login} onPress={handleUpdateGroup}>
          <LinearGradient
            colors={['#CDF3AA', '#E6FEA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginstyle}
          >
            <Text style={{ fontSize: 17, fontWeight: 700, letterSpacing: 3 }}>确认提交</Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.login} onPress={() =>handleLeaveGroup(groupId)}>
          <LinearGradient
            colors={['#CDF3AA', '#E6FEA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginstyle}
          >
            <Text style={{ fontSize: 17, fontWeight: 700, letterSpacing: 3 }}>退出小组</Text>
          </LinearGradient>
        </Pressable></View>
       
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  input1t:{
     flex:1/4,
     letterSpacing:1,
  },
  input1: {
    flex:3/4,
    height: deviceHeightDp * 0.06,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation:7,
    shadowColor:'black',
    shadowOpacity:1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    
  },
  input2t:{
      flex:1/4,
      letterSpacing:1,
      marginTop:deviceHeightDp*0.03,
  },
  input2: {
    flex:3/4,
    shadowColor:'black',
    height: deviceHeightDp * 0.4,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: deviceHeightDp * 0.02,
  },
  headregion:{
      flex:1/8
  },
  settingsregion:{
    flex:1/2
  },
  unless:{
    flex:3/16,
  },
  defineregion:{
    flex:3/16,
  },
  modalContainer: {
    flex: 1,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: deviceWidthDp * 1,
    height: deviceHeightDp * 1,
    backgroundColor: 'white',
    padding: deviceWidthDp * 0.05,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
    marginTop:deviceHeightDp*0.05,
    color: '#444E38',
  },
  
  
  login: {
    width: deviceWidthDp * 0.7,
    height: deviceHeightDp * 0.06,
    marginTop: deviceHeightDp * 0.03,
  },
  loginstyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});