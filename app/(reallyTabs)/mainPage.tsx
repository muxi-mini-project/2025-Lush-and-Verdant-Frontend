import { 
  Text, View, StyleSheet, Dimensions, TextInput, Pressable, 
  Modal, Animated 
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useGroups } from '../groupprovider';
import { put } from '@/components/Api';

const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;

export default function MainPage() {
  // 假数据：激励语
  const {slogan,setSlogan,user}=useGroups()
 

  const router = useRouter();
  const handletocalender=()=>{
    router.push("/(calender)/calenderpage")
  }
  const handletoAI=()=>{
    router.push("/(AI)/AIpage")
  }
  const [currentDate, setCurrentDate] = useState<string>('');

  const [isEdited, setIsEdited] = useState<boolean>(false);
  
  // 模拟事件数据（7 个事件）
  const initialEvents = [
    { id: 1, title: "事件一", details: "事件一的详细内容..." },
    { id: 2, title: "事件二", details: "事件二的详细内容..." },
    { id: 3, title: "事件三", details: "事件三的详细内容..." },
    { id: 4, title: "事件四", details: "事件四的详细内容..." },
    { id: 5, title: "事件五", details: "事件五的详细内容..." },
    { id: 6, title: "事件六", details: "事件六的详细内容..." },
    { id: 7, title: "事件七", details: "事件七的详细内容.." },
    { id: 8, title: "事件七", details: "事件七的详细内容.." },
   

  ];
  
  // 使用完整事件列表
  const [events, setEvents] = useState(initialEvents);
  // 全局滴水计数
  const [dropletCount, setDropletCount] = useState<number>(0);
  // Modal 状态，用于显示事件详细信息
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalEvent, setModalEvent] = useState<{ id: number; title: string; details: string } | null>(null);

  // 树阶段动画：tree1 初始显示，tree2、tree3 初始隐藏
  const tree1Opacity = useRef(new Animated.Value(1)).current;
  const tree2Opacity = useRef(new Animated.Value(0)).current;
  const tree3Opacity = useRef(new Animated.Value(0)).current;

  // 根据滴水计数更新树的显示阶段
  useEffect(() => {
    if (dropletCount === 2) {
      Animated.timing(tree1Opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(tree2Opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    if (dropletCount === 5) {
      Animated.timing(tree2Opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(tree3Opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [dropletCount]);

  // 更新日期
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(1, '0');
      const day = String(now.getDate()).padStart(1, '0');
      setCurrentDate(`${year}年${month}月${day}日`);
    };

    updateDate();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const timeout: number = nextMidnight.getTime() - Date.now();
    const timer = setTimeout(() => {
      updateDate();
      const interval = setInterval(updateDate, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  const handleedit = () => {
    setIsEdited(true);
  };

  const handlenotedit = async() => {
    setIsEdited(false);
    const user_id=user
    try{
      const data={
        slogan:slogan
      }
      
        const response=await put(`http://8.129.3.142:8080/slogan/ChangeSlogan/${user_id}`,data,true)
        alert("修改成功")
    }catch(e){
      console.log(e)
    }
  };

  // 处理左侧文本点击，显示 Modal
  const handleLeftPress = (event: { id: number; title: string; details: string }) => {
    setModalEvent(event);
    setModalVisible(true);
  };

  // 处理右侧滴水点击：调用动画后删除事件并更新滴水计数
  const handleDropletPress = (eventId: number) => {
    // 从完整列表中过滤掉该事件即可
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setDropletCount(prev => prev + 1);
  };

  // 定义事件按钮组件，采用普通 flex 布局排列
  const EventButton = ({ event }: { event: { id: number; title: string; details: string } }) => {
    const dropletAnim = useRef(new Animated.Value(0)).current;
    const onDropletClick = () => {
      Animated.timing(dropletAnim, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        handleDropletPress(event.id);
      });
    };

    return (
      <View style={styles.eventButton}>
        <Pressable onPress={() => handleLeftPress(event)} style={styles.eventTextContainer}>
          <Text style={styles.eventText} numberOfLines={1} ellipsizeMode="tail">
            {event.title}
          </Text>
        </Pressable>
        <Pressable onPress={onDropletClick} style={styles.dropletContainer}>
          <Animated.Image
            source={require('../../assets/images/water.png')}
            style={[styles.dropletImage, { transform: [{ translateY: dropletAnim }] }]}
          />
        </Pressable>
      </View>
    );
  };

  // functionregion：采用 flex 布局，使事件块在 eventsContainer 内近似对称排列
  // 树图片依然用绝对定位固定在底部
  const renderFunctionRegion = () => {
    return (
      <View style={styles.functionregion}>
        <View style={styles.eventsContainer}>
  {[0, 1, 2].map(index => {
    const event = events[index];
    return event ? (
      <EventButton key={event.id} event={event} />
    ) : (
      <View key={`placeholder-${index}`} style={styles.eventButtonPlaceholder} />
    );
  })}
</View>

        <View style={styles.treeContainer}>
          <Animated.Image
            source={require('../../assets/images/tree1.png')}
            style={[styles.treeImage1, { opacity: tree1Opacity }]}
            
          />
          <Animated.Image
            source={require('../../assets/images/tree2.png')}
            style={[styles.treeImage2, { opacity: tree2Opacity, position: 'absolute' }]}
          />
          <Animated.Image
            source={require('../../assets/images/tree3.png')}
            style={[styles.treeImage3, { opacity: tree3Opacity, position: 'absolute' }]}
          />
        </View>
      </View>
    );
  };

  // 根据编辑状态分别渲染页面
  if (!isEdited) {
    return (
      <LinearGradient 
        colors={['#F0FFDE','#FCFBD2']} 
        start={{x:0,y:0}} 
        end={{x:0,y:1}} 
        style={styles.container}
      >
        <ImageBackground 
          source={require("../../assets/images/背景草地.png")} 
          resizeMode='stretch' 
          style={styles.imgbackground}
        >
          <View style={styles.headregion}>
            <View style={styles.calender}>
              <Pressable onPress={handletocalender}  style={styles.tocalender}>
                <Image 
                
                  source={require("../../assets/images/calender.png")} 
                  style={{ height: deviceHeightDp * 0.04, width: deviceHeightDp * 0.04 }} 
                />
              </Pressable>
              <View style={styles.date}>
                <Text style={styles.datetext}>{currentDate}</Text>
              </View>
              <Pressable onPress={handletoAI} style={styles.toAI}><Text style={styles.AItext}>AI</Text></Pressable>
            </View>
            <View style={styles.editregion}>
              <View style={styles.passion}>
                <Text 
                  style={{ flex: 7/8, marginLeft: deviceWidthDp * 0.02, color: "#668B3F" }} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {slogan}
                </Text>
                <Pressable onPress={handleedit} style={{ flex: 1/8 }}>
                  <Image 
                    style={{ width: deviceWidthDp * 0.05, height: deviceWidthDp * 0.05 }} 
                    source={require('../../assets/images/editor.png')} 
                  />
                </Pressable>
               
              </View>
            </View>
          </View>
          {renderFunctionRegion()}
          <View style={styles.routerregion}></View>
        </ImageBackground>
        <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalTitlecon}><Text style={styles.modalTitle}>{modalEvent?.title}</Text><Pressable></Pressable></View>
              <View style={styles.modalDetailscon}><Text style={styles.modalDetails}>{modalEvent?.details}</Text></View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>关闭</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient 
        colors={['#F0FFDE','#FCFBD2']} 
        start={{x:0,y:0}} 
        end={{x:0,y:1}} 
        style={styles.container}
      >
        <ImageBackground 
          source={require("../../assets/images/背景草地.png")} 
          resizeMode='stretch' 
          style={styles.imgbackground}
        >
          <View style={styles.headregion}>
            <View style={styles.calender}>
              <Pressable style={styles.tocalender}>
                <Image 
                  source={require("../../assets/images/calender.png")} 
                  style={{ height: deviceHeightDp * 0.04, width: deviceHeightDp * 0.04 }} 
                />
              </Pressable>
              <View style={styles.date}>
                <Text style={styles.datetext}>{currentDate}</Text>
              </View>
              <Pressable onPress={handletoAI} style={styles.toAI}><Text style={styles.AItext}>AI</Text></Pressable>
            </View>
            <View style={styles.editregion}>
              <View style={styles.passion}>
                <TextInput 
                  style={{ flex: 7/8, marginLeft: deviceWidthDp * 0.02, color: "#668B3F" }}
                  value={slogan} 
                  onChangeText={setSlogan} 
                  maxLength={30}
                />
                <Pressable onPress={handlenotedit} style={{ flex: 1/8 }}>
                  <Image 
                    style={{ width: deviceWidthDp * 0.05, height: deviceWidthDp * 0.05 }} 
                    source={require('../../assets/images/editor.png')} 
                  />
                </Pressable>
              
              </View>
            </View>
          </View>
          {renderFunctionRegion()}
          <View style={styles.routerregion}></View>
        </ImageBackground>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalTitlecon}><Text style={styles.modalTitle}>{modalEvent?.title}</Text><Pressable></Pressable></View>
              <View style={styles.modalDetailscon}><Text style={styles.modalDetails}>{modalEvent?.details}</Text></View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>关闭</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  modalTitlecon:{
   flex:1/4,
   width:deviceWidthDp*0.7,
   backgroundColor:"#F5F5F5",
   borderRadius:25,
   height:deviceHeightDp*0.3,
   marginTop:deviceHeightDp*0.008,
   marginBottom:deviceHeightDp*0.008,
   marginVertical:-18,
   

  },
  modalDetailscon:{
    flex:1/2,
    width:deviceWidthDp*0.7,
   backgroundColor:"#F5F5F5",
   borderRadius:25,
   margin:10,
   padding:deviceWidthDp*0.03
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  imgbackground: {
    width: deviceWidthDp,
    height: deviceHeightDp * 0.8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headregion: {
    flex: 1/4,
  },
  calender: {
    flexDirection: 'row',
    width: deviceWidthDp * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tocalender: {
    flex: 1/8,
    marginTop: -deviceHeightDp * 0.15,
    marginLeft: deviceWidthDp * 0.1,
  },
  date: {
    flex: 6/8,
    marginTop: -deviceHeightDp * 0.15,
    marginLeft: deviceWidthDp * 0.08,
  },
  toAI:{
    flex:1/8,
    marginTop: -deviceHeightDp * 0.15,
  },
  AItext:{
    color: '#444E38',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: deviceHeightDp * 0.025,
  },
  datetext: {
    color: '#444E38',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: deviceHeightDp * 0.021,
  },
  editregion: {},
  passion: {
    width: deviceWidthDp * 0.8,
    backgroundColor: '#D6EE97',
    flexDirection: 'row',
    height: deviceHeightDp * 0.06,
    borderRadius: 25,
    marginTop: -deviceHeightDp * 0.03,
    alignItems: "center",
  },
  // functionregion 使用 flex 布局，将事件块在 eventsContainer 内近似对称排列
  functionregion: {
    flex: 2.6,
    width: deviceWidthDp,
    position: 'relative',
    display:'flex'
  },
  eventsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    flex:3/4,
    
    
    
  },
  routerregion: {
    flex: 3/16,
  },
  eventButton: {
    flexDirection: 'row',
    width: deviceWidthDp * 0.4,
    height:deviceWidthDp*0.1,
    backgroundColor: '#B0C3B0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign:'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    elevation: 2,
    
  },
  // 占位视图，保持按钮位置固定
  eventButtonPlaceholder: {
    width: deviceWidthDp * 0.4,
    height: 40,
    marginVertical: 10,
    
  },
  eventTextContainer: {
    flex: 0.7,
  },
  eventText: {
    
    color: '#444E38',
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: deviceHeightDp * 0.02,
  },
  dropletContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  dropletImage: {
    width: deviceWidthDp*0.16,
    height: deviceWidthDp*0.1,
    marginRight:-deviceWidthDp*0.05,
  },
  treeContainer: {
    position: 'absolute',
    bottom: deviceHeightDp*0.19,
    display:'flex',
    left:0,
    right:0,
    alignItems: 'center',
    justifyContent: 'center',
  
  
  },
  treeImage1: {
    width:deviceWidthDp*0.5,
    height:deviceHeightDp*0.2,
    bottom:deviceHeightDp*0.07,
    
     
  },
  treeImage2:{
    width:deviceWidthDp*0.75,
    height:deviceHeightDp*0.25,
    bottom:deviceHeightDp*0.07,
    left:deviceWidthDp*0.15
   

  },
  treeImage3:{
    width:deviceWidthDp*1,
    height:deviceHeightDp*0.42,
    bottom:-deviceHeightDp*0.04
    
  
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(95, 92, 92, 0.3)',
    justifyContent: 'flex-end',
    marginBottom:deviceHeightDp*0.05,
    alignItems: 'center',
    display:'flex',
  },
  modalContent: {
    width: deviceWidthDp * 0.8,
    height:deviceHeightDp*0.3,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    display:'flex',
    
  },
  modalTitle: {
    fontSize: deviceHeightDp*0.02,
    fontWeight: 'bold',
    padding:deviceHeightDp*0.01,

  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#D6EE97',
    flex:1/8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    height:deviceHeightDp*0.1,

  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
