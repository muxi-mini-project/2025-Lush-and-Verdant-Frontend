import { Text, View, StyleSheet, Pressable, Dimensions, ScrollView, KeyboardAvoidingView,TouchableWithoutFeedback, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import SearchBar from '@/components/Search';
import GroupCard from '@/components/Group';
import { useRouter } from 'expo-router';
import ButtonSwitch from '@/components/ButtonSwitch';
import { useGroups } from '../groupprovider';
const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;

export default function Circle() {
  const [state, setState] = useState<string>('find');
  const [activeButton, setActiveButton] = useState<string | null>('button1');
 
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const router = useRouter();
  const { groups, setGroups, filteredGroups, setFilteredGroups } = useGroups();
  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const result = groups.filter((group) =>
      group.groupName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredGroups(result);
  };

  const handleJoinGroup = (groupId: string) => {
    setFilteredGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === groupId ? { ...group, isJoined: true } : group
      )
    );
  };

  const handlePress1 = (buttonId: string) => {
    setActiveButton(buttonId);
    setState('find');
    setFilteredGroups(groups);
  };

  const handlePress2 = (buttonId: string) => {
    setActiveButton(buttonId);
    setState('mine');
    const joinedGroups = groups.filter(group => group.isJoined);
    setFilteredGroups(joinedGroups);
  };

  const handleCreateNewGroup = () => {
    const newGroupId = (parseInt(groups[groups.length - 1].groupId) + 1).toString();
    const newGroup = {
      groupId: newGroupId,
      groupName: newGroupName,
      groupDesc: newGroupDesc,
      groupAvatar: 'https://example.com/avatar.png',
      isJoined: true, // 默认加入新创建的组
      messages:[],
      members: [{ // 添加初始成员
        userId: 'user1', // 应该使用当前用户信息
        userName: '当前用户',
        avatar: 'https://example.com/user1-avatar.png'
      }],
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setFilteredGroups((prevGroups) => [...prevGroups, newGroup]);
    setShowModal(false); // 关闭 Modal
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handlerouter = (groupId: string) => {
    
    router.push({
      pathname:"/groupcom/[groupId]",
      params:{
        groupId:groupId,
        userId:"user2"
      }
    }); // 
  };

  if (state === 'find') {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <LinearGradient colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.27, 0.79]} style={styles.container}>
          <View style={styles.headregion}>
            <Text style={styles.headertext}>同心圆</Text>
          </View>
          <View style={styles.choiceregion}>
            <Pressable onPress={() => handlePress1('button1')} style={[styles.button1, activeButton === 'button1' ? styles.buttonswitch : null]}>
              <Text style={{ fontSize: deviceWidthDp * 0.05, textAlign: 'center' }}>寻找小组</Text>
            </Pressable>
            <Pressable onPress={() => handlePress2('button2')} style={[styles.button2, activeButton === 'button2' ? styles.buttonswitch : null]}>
              <Text style={{ fontSize: deviceWidthDp * 0.05, textAlign: 'center' }}>我的小组</Text>
            </Pressable>
          </View>
          <View style={styles.findregion}>
            <SearchBar onSearch={handleSearch}></SearchBar>
          </View>
          <ScrollView style={styles.contextregion}>
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                groupName={group.groupName}
                groupDesc={group.groupDesc}
                groupAvatar={group.groupAvatar}
                groupId={group.groupId}
                isJoined={group.isJoined}
                onJoinGroup={handleJoinGroup}
                disabledButton={true}
              />
            ))}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  if (state === 'mine') {
    const joinedGroups = filteredGroups.filter((group) => group.isJoined);
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <LinearGradient colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.27, 0.79]} style={styles.container}>
          <View style={styles.headregion}>
            <Text style={styles.headertext}>同心圆</Text>
          </View>
          <View style={styles.choiceregion}>
            <Pressable onPress={() => handlePress1('button1')} style={[styles.button1, activeButton === 'button1' ? styles.buttonswitch : null]}>
              <Text style={{ fontSize: deviceWidthDp * 0.05, textAlign: 'center' }}>寻找小组</Text>
            </Pressable>
            <Pressable onPress={() => handlePress2('button2')} style={[styles.button2, activeButton === 'button2' ? styles.buttonswitch : null]}>
              <Text style={{ fontSize: deviceWidthDp * 0.05, textAlign: 'center' }}>我的小组</Text>
            </Pressable>
          </View>
          <View style={styles.unless2}></View>
          <ScrollView style={styles.contextregion}>
            {joinedGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                groupName={group.groupName}
                groupDesc={group.groupDesc}
                groupAvatar={group.groupAvatar}
                groupId={group.groupId}
                isJoined={group.isJoined}
                onJoinGroup={handleJoinGroup}
                customButtonAction={()=>handlerouter(group.groupId)}
                disabledButton={false}
                customButtonStyle={{
                  position: 'absolute',
                  left: deviceWidthDp * 0.7,
                  top: deviceHeightDp * 0.05,
                  width: deviceWidthDp * 0.15,
                  backgroundColor: '#EFFFD0',
                  borderRadius: 20,
                  alignItems: 'center',
                }}
                customButtonText={'mine'}
              />
            ))}
          </ScrollView>

          {/* Add Button only in "mine" state */}
          <Pressable style={styles.addButton} onPress={() => setShowModal(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>

          {/* Modal to create new group */}
          {showModal && (
            <Modal transparent={true} animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
              <View style={styles.modalContainer}>
                <LinearGradient colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.27, 0.79]} style={styles.modalContent}>
                  <Text style={styles.modalTitle}>新建小组</Text>
                  <TextInput
                    style={styles.input1}
                    placeholder="小组名称"
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                  />
                  <TextInput
                    style={styles.input2}
                    placeholder="小组简介(少于三十字）"
                    value={newGroupDesc}
                    onChangeText={setNewGroupDesc}
                    multiline={true}
                  />
                  <View style={{display:'flex', flexDirection:'row',marginTop:deviceHeightDp*0.04}}><Text style={{flex:1/2}}>是否公开</Text><View style={{flex:3/16}}></View><ButtonSwitch style={{flex:1/4}}></ButtonSwitch></View>
                  <Pressable style={styles.login} onPress={handleCreateNewGroup}>
                             <LinearGradient colors={['#CDF3AA','#E6FEA2']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.loginstyle}><Text style={{fontSize:17,fontWeight:700,letterSpacing:3}}>确认提交</Text></LinearGradient>
                         </Pressable>
                         <Pressable style={styles.login} onPress={()=>setShowModal(false)}>
                             <LinearGradient colors={['#CDF3AA','#E6FEA2']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.loginstyle}><Text style={{fontSize:17,fontWeight:700,letterSpacing:3}}>取消</Text></LinearGradient>
                         </Pressable>
                       
                </LinearGradient>
              </View>
            </Modal>
          )}
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  login:{
    width:deviceWidthDp*0.7,
    height:deviceHeightDp*0.06,
    marginTop:deviceHeightDp*0.03,
   
},
loginstyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25
    
},
  button2: {
    width: deviceWidthDp * 0.425,
    height: deviceHeightDp * 0.05,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 9,
    elevation: 5,
  },
  button1: {
    width: deviceWidthDp * 0.425,
    height: deviceHeightDp * 0.05,
    backgroundColor: 'white',
    elevation: 5,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 9,
  },
  buttonswitch: {
    backgroundColor: '#C6FF88',
  },
  headertext: {
    marginTop: deviceHeightDp * 0.02,
    color: '#444E38',
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  headregion: {
    flex: 1 / 8,
  },
  choiceregion: {
    flex: 1 / 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: deviceWidthDp * 1,
  },
  findregion: {
    flex: 2 / 16,
  },
  unless2: {
    flex: 1 / 16,
  },
  contextregion: {
    flex: 1 / 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  test: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  // Add Button styles
  addButton: {
    position: 'absolute',
    bottom: deviceHeightDp * 0.06,
    right: deviceWidthDp * 0.05,
    width: deviceWidthDp * 0.12,
    height: deviceWidthDp * 0.12,
    backgroundColor: '#EFFFD0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: deviceWidthDp * 0.08,
    color: 'black',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: deviceWidthDp * 0.9,
    height:deviceHeightDp*0.9,
    backgroundColor: 'white',
    padding: deviceWidthDp * 0.05,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight:'800',
    letterSpacing:1.5,
    fontSize:deviceHeightDp*0.02,
    marginTop:deviceHeightDp*0.01,
    color:'#444E38',
  },
  input1: {
    width: '100%',
    height: deviceHeightDp * 0.06,
    backgroundColor:'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 0,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical:10,
    marginTop: deviceHeightDp * 0.02,
  },
  input2:{
    width: deviceWidthDp*0.8,
    height: deviceHeightDp * 0.3,
    backgroundColor:'white',
    shadowColor: '#000',
     textAlignVertical:"top",
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 0,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: deviceHeightDp * 0.02,
    
  }
});
