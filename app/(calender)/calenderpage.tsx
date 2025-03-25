import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useGroups } from '../groupprovider';
import { post,get,del,put } from '@/components/Api';
import { result } from 'lodash';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

interface EventItem {
 
  title: string;
  details: string;
  goal_id:string;
  task_id:string,
  backgroundColor?: string;
  textColor?: string;
  
}

interface EventsByDate {
  [date: string]: EventItem[];
}

// 定义初始数据，格式为 'YYYY-MM-DD'
const initialEvents: EventsByDate = {
  
};

/** 自定义日历单元（日期格），显示日期数字和最多2个事件预览 */
interface DayCellProps {
  date: any;
  events: EventItem[];
  onPress: (dateString: string) => void;
  isToday:boolean;
}

const DayCell = ({ date, events, onPress,isToday }: DayCellProps) => (
  <Pressable style={[styles.dayCell,isToday&&styles.todayCell]} onPress={() => onPress(date.dateString)}>
    {/* 日期数字放在左上角 */}
    <Text style={[styles.dayText,isToday&&styles.todayText]}>{date.day}</Text>
    <View style={styles.eventsPreview}>
      {events.slice(0, 2).map((event,index) => (
        <View key={`${event.task_id}-${index}`} style={[styles.eventPreview,{backgroundColor:event.backgroundColor ||'#C9EC20'}]}>
          <Text style={[styles.eventPreviewText, { color: event.textColor || '#2e7d32' }]} numberOfLines={1}>
            {event.title}
          </Text>
        </View>
      ))}
      {events.length > 2 && <Text style={styles.moreText}>...</Text>}
    </View>
  </Pressable>
);

/** 弹出模态框：显示某天的事件列表，并支持新增/编辑/删除 */
interface DayEventModalProps {
  date: string;
  events: EventItem[];
  onClose: () => void;
  onUpdate: (date: string, events: EventItem[]) => void;
}

const DayEventModal = ({ date, events, onClose, onUpdate }: DayEventModalProps) => {
  const [localEvents, setLocalEvents] = useState<EventItem[]>(events);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const{goal_id,setGoalId,task_id,setTaskId,flag,setFlag}=useGroups()

  const openAddModal = () => {
    setEditMode('add');
    setTitle('');
    setDetails('');
    setSubModalVisible(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditMode('edit');
    setSelectedEvent(event);
    setTitle(event.title);
    setDetails(event.details);
    console.log(event.details)
    console.log(event.title)
    setGoalId(event.goal_id)
    console.log(event.goal_id)
    console.log(event.task_id)
    setSubModalVisible(true);
    setTaskId(event.task_id)
  };

  const handleCreate = async() => {
    const bgColors = ["#C9EC20", "#ECAB20"];
    const textColors: { [key: string]: string } = {
      "#C9EC20": "#2e7d32",
      "#ECAB20": "red",
    };
  
    if (!title.trim()) {
      Alert.alert('请输入事件名称');
      return;
    }
  
    const eventData ={
      date:date,
      tasks:[
        {
          details:details.trim(),
          title:title.trim(),
        }
      ]
    } 
    try{
        const  response=await post("http://8.129.3.142:8080/goal/MakeGoal",eventData,true)
        const result=await response.json()
        setGoalId(result.data.goal_id)
        console.log(result.data.goal_id)
        console.log(result.data.task_ids[0])
        
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        const chosenBg = bgColors[randomIndex];
        const chosenText = textColors[chosenBg];
        const newEvent: EventItem = {
          
          title: title.trim(),
          details: details.trim(),
          goal_id:result.data.goal_id,
          task_id:result.data.task_ids[0],
          backgroundColor: chosenBg,
          textColor: chosenText,
      
        };
        const updated = [...localEvents, newEvent];
        setLocalEvents(updated);
        onUpdate(date, updated);
        setFlag(!flag)
        console.log(newEvent)
    }catch(e){
      alert("添加任务失败")
    }
   
  
   
   
    setSubModalVisible(false);
  };

  const handleUpdate = async(id:string) => {
    
    
    const updated = localEvents.map(event =>
      event.goal_id === id
        ? { ...event, title: title.trim(), details: details.trim() }
        : event
    );
  
    setLocalEvents(updated);
    onUpdate(date, updated);
    setSubModalVisible(false);
    console.log(task_id)
     console.log(goal_id)
    try{
      const updateData={
            details:details,
            title:title,
      }
      console.log(goal_id)
      console.log(updateData)
      const response2=await put(`http://8.129.3.142:8080/goal/UpdateGoal/${task_id}`,updateData,true)
      console.log("修改")
      
    }
      catch(e){
        console.log(e)
      }
  };

  const handleDelete = async(id: string) => {
    const updated = localEvents.filter(event => event.goal_id !== id);
    setLocalEvents(updated);
    onUpdate(date, updated);
    setSubModalVisible(false);
  
    try{
       
       const response1=await del(`http://8.129.3.142:8080/goal/DeleteGoal/${task_id}`,true)
       console.log("删除成功")
    }catch(e){
      console.log(e)
    }
  };

  return (
    <Modal transparent visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContentFull}>
         
          <ScrollView style={styles.modalEventList}>
            {localEvents.map((event,index) => (
              <Pressable
                key={event.goal_id}
                style={styles.modalEventItem}
                onPress={() => openEditModal(event)}
              >
                <Text style={styles.modalEventTitle}>{event.title}</Text>
                <Text style={styles.modalEventDetails} numberOfLines={1}>
                  {event.details}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.addButtonModal} onPress={openAddModal}>
            <Text style={styles.addButtonModalText}>+ 添加事件</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </Pressable>
          {subModalVisible && (
            <Modal
              transparent
              visible={subModalVisible}
              animationType="fade"
              onRequestClose={() => setSubModalVisible(false)}
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editMode === 'add' ? '创建事件' : '编辑事件'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="请输入事件标题（不超过4个字）"
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    style={[styles.input, styles.detailsInput]}
                    placeholder="请输入详细内容（不超过60个字）"
                    multiline
                    value={details}
                    onChangeText={setDetails}
                  />
                  <View style={styles.buttonRow}>
                    {editMode === 'edit' && (
                      <Pressable
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => selectedEvent && handleDelete(selectedEvent.goal_id)}
                      >
                        <Text style={{ color: 'darkred',fontWeight: '500',}}>删除</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.button, styles.submitButton]}
                      onPress={editMode === 'add' ? handleCreate :()=> {if(selectedEvent){handleUpdate(selectedEvent.goal_id)}}}
                    >
                      <Text style={styles.buttonText}>
                        {editMode === 'add' ? '提交' : '保存'}
                      </Text>
                    </Pressable>
                    <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setSubModalVisible(false)}
                  >
                    <Text>取消</Text>
                  </Pressable>
                  </View>
                 
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </Modal>
  );
};

/* 自定义头部和星期行 */

const formatMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return <Text style={{ color: '#444E38',
    fontWeight: '900',
    letterSpacing: 1.5,
   fontFamily:'Poppins-Regular',
    fontSize: deviceHeight * 0.02,}}>{`${year}.${month < 10 ? '0' + month : month}`}</Text>
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

interface CustomHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

const CustomHeader = ({ currentMonth, onPrev, onNext }: CustomHeaderProps) => {
  return (
    <View style={styles.customHeaderContainer}>
      <Pressable onPress={onPrev} style={styles.navButtonContainer}>
        <Text style={styles.navButton}>‹</Text>
      </Pressable>
      <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
      <Pressable onPress={onNext} style={styles.navButtonContainer}>
        <Text style={styles.navButton}>›</Text>
      </Pressable>
    </View>
  );
};

const CustomWeekDays = () => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <View style={styles.weekdaysContainer}>
      {weekdays.map((day, index) => (
        <Text key={index} style={styles.weekdayText}>
          {day}
        </Text>
      ))}
    </View>
  );
};

/* 整体日历组件 */

const CalendarWithEvents = () => {

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {userId,eventsByDate,setEventsByDate,flag,setFlag}=useGroups();
 

  const handleDayPress = (dateString: string) => {
    setSelectedDate(dateString);
  };

  const handleUpdateEvents = (date: string, events: EventItem[]) => {
    setEventsByDate(prev => ({ ...prev, [date]: events }));
  };

  const renderDay = (props: any) => {
    
    const { date } = props;
    const today = new Date();
    const todayString = formatDate(today); // 获取 'YYYY-MM-DD' 格式的当前日期
    const isToday = date.dateString === todayString; // 判断是否是今天
    const dayEvents = eventsByDate[date.dateString] || [];
   
   
    return <DayCell date={date} events={dayEvents} onPress={handleDayPress} isToday={isToday} />;
  };

  const onPrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const onNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };
  useEffect(()=>{
    const getEvents = async () => {
      try{
          const response = await get("http://8.129.3.142:8080/goal/HistoricalGoal",true)
          const result = await response.json()
          console.log(result.data)
          setEventsByDate(result.data)
          console.log("获取成功")
      }catch(e){
        alert("获取失败")
        console.log(e)
      }
      
    };
    getEvents()
  },[flag])
  return (
    <LinearGradient colors={['#D8F9C0', '#F2FFCF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.27, 0.79]} style={styles.calendarContainer}>
      <CustomHeader currentMonth={currentMonth} onPrev={onPrevMonth} onNext={onNextMonth} />
      <CustomWeekDays />
      {/* 使用 key 来确保月份变化时日历网格会更新 */}
      <Calendar
       theme={{
       
        calendarBackground: 'transparent', // 日历背景透明
        textSectionTitleColor: '#333', // 头部（周标题）颜色
        selectedDayBackgroundColor: '#ff5722', // 选中的日期背景
        selectedDayTextColor: '#fff', // 选中日期的文字颜色
        todayTextColor: '#ff5722', // 今天的文字颜色
        dayTextColor: '#333', // 普通日期文字颜色
        textDisabledColor: '#ccc', // 禁用日期（非本月日期）颜色
        dotColor: '#ff5722', // 事件小圆点颜色
        selectedDotColor: '#ffffff', // 选中状态下事件小圆点颜色
        arrowColor: '#ff5722', // 左右切换箭头颜色
        monthTextColor: '#333', // 月份标题颜色
      
      }}
      hideExtraDays={true} 
        style={styles.calendar}
        key={formatDate(currentMonth)}
        current={formatDate(currentMonth)}
        dayComponent={renderDay}
        hideArrows={true}
        renderHeader={() => null}
        hideDayNames={true}
        onMonthChange={(monthData) => {
          setCurrentMonth(new Date(monthData.dateString));
        }}
      
       
      />
      {selectedDate && (
        <DayEventModal
       
          date={selectedDate}
          events={eventsByDate[selectedDate] || []}
          onClose={() => setSelectedDate(null)}
          onUpdate={handleUpdateEvents}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  todayText:{
    color:'#ECAB20',
  },
  todayCell:{
     backgroundColor:'rgba(201, 236, 32, 0.3)', 
  },
  calendarContainer: {
    flex: 1,
    display:'flex',
    height: deviceHeight * (5 / 6),
  
  },
  calendar: {
  display:'flex',
  alignItems:'stretch',   
    width: deviceWidth*1,
   backgroundColor:'transparent'
    
  
  },
  dayCell: {
    width: deviceWidth / 7 - StyleSheet.hairlineWidth,
    height: (deviceHeight / 13) *1.5,
    marginHorizontal: StyleSheet.hairlineWidth / 2,

    
  },
  dayText: {
    fontSize: deviceWidth*0.04,
    
    fontWeight: '600',
    color: '#000000',
    padding: 2,
    
  },
  eventsPreview: {
    marginTop: 2,
    width: '100%',
  },
  eventPreview: {
    backgroundColor: '#C9EC20',
    borderRadius: 2,
    width:"90%",
    marginLeft: deviceWidth*0.01,
    paddingHorizontal: 1,
    marginBottom: 1,
  },
  eventPreviewText: {
    fontSize: 10,
    color: '#2e7d32',
  },
  moreText: {
    fontSize: 10,
    color: '#999',
  },
  customHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    paddingHorizontal: 10,
    paddingVertical: 8,
   
   
  },
  navButtonContainer: {
    padding: 5,
  },
  navButton: {
    fontSize: 24,
    color: '#2c3e50',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444E38',
  },
  weekdaysContainer: {
    flexDirection: 'row',
   
   
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: deviceWidth*0.04,
    fontWeight: '200',
    color: '#000000',
    paddingVertical: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentFull: {
    width: deviceWidth * 0.9,
    height: deviceHeight * 0.7,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  modalContent: {
    width: deviceWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalEventList: {
    flex: 1,
    marginBottom: 10,
  },
  modalEventItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  modalEventDetails: {
    fontSize: 14,
    color: '#666',
  },
  addButtonModal: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonModalText: {
    color: '#2e7d32',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
   
    borderColor: '#dfe6e9',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  detailsInput: {
    height: deviceHeight*0.1,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
   
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButton: {

    fontSize: 16,
    borderRadius:20,
    backgroundColor: '#e8f5e9',
  },
  deleteButton: {
    backgroundColor: '#EF7E7E',
    borderRadius:20,
  },
  buttonText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
});

export default CalendarWithEvents;
