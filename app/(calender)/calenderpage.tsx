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

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

interface EventItem {
  id: string;
  title: string;
  details: string;
}

interface EventsByDate {
  [date: string]: EventItem[];
}

// 定义初始数据，格式为 'YYYY-MM-DD'
const initialEvents: EventsByDate = {
  '2025-03-10': [
    { id: '1', title: '团队会议', details: '讨论项目进展' },
    { id: '2', title: '客户通话', details: '下午2点与客户沟通' },
  ],
  '2025-03-15': [
    { id: '1', title: 'React 研讨会', details: '参加React线上研讨会' },
  ],
  '2025-03-20': [
    { id: '1', title: '家庭晚餐', details: '7点与家人共进晚餐' },
    { id: '2', title: '健身', details: '晚上锻炼身体' },
    { id: '3', title: '月度报告', details: '完成本月工作报告' },
  ],
  '2025-04-10': [
    { id: '1', title: '团队会议', details: '讨论项目进展' },
    { id: '2', title: '客户通话', details: '下午2点与客户沟通' },
  ],
};

/** 自定义日历单元（日期格），显示日期数字和最多2个事件预览 */
interface DayCellProps {
  date: any;
  events: EventItem[];
  onPress: (dateString: string) => void;
}

const DayCell = ({ date, events, onPress }: DayCellProps) => (
  <Pressable style={styles.dayCell} onPress={() => onPress(date.dateString)}>
    {/* 日期数字放在左上角 */}
    <Text style={styles.dayText}>{date.day}</Text>
    <View style={styles.eventsPreview}>
      {events.slice(0, 2).map(event => (
        <View key={event.id} style={styles.eventPreview}>
          <Text style={styles.eventPreviewText} numberOfLines={1}>
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
    setSubModalVisible(true);
  };

  const handleCreate = async() => {
    if (!title.trim()) {
      Alert.alert('请输入事件名称');
      return;
    }
    const newEvent: EventItem = {
      id: Date.now().toString(),
      title: title.trim(),
      details: details.trim(),
    };
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
        alert(result.message)
    }catch(e){
      alert("添加任务失败")
    }
    const updated = [...localEvents, newEvent];
    setLocalEvents(updated);
    onUpdate(date, updated);
    setSubModalVisible(false);
  };

  const handleUpdate = () => {
    if (!selectedEvent) return;
    const updated = localEvents.map(event =>
      event.id === selectedEvent.id
        ? { ...event, title: title.trim(), details: details.trim() }
        : event
    );
    setLocalEvents(updated);
    onUpdate(date, updated);
    setSubModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const updated = localEvents.filter(event => event.id !== id);
    setLocalEvents(updated);
    onUpdate(date, updated);
    setSubModalVisible(false);
  };

  return (
    <Modal transparent visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContentFull}>
         
          <ScrollView style={styles.modalEventList}>
            {localEvents.map(event => (
              <Pressable
                key={event.id}
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
                        onPress={() => selectedEvent && handleDelete(selectedEvent.id)}
                      >
                        <Text style={{ color: 'darkred',fontWeight: '500',}}>删除</Text>
                      </Pressable>
                    )}
                    <Pressable
                      style={[styles.button, styles.submitButton]}
                      onPress={editMode === 'add' ? handleCreate : handleUpdate}
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
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {userId}=useGroups();

  const handleDayPress = (dateString: string) => {
    setSelectedDate(dateString);
  };

  const handleUpdateEvents = (date: string, events: EventItem[]) => {
    setEventsByDate(prev => ({ ...prev, [date]: events }));
  };

  const renderDay = (props: any) => {
    const { date } = props;
    const dayEvents = eventsByDate[date.dateString] || [];
    return <DayCell date={date} events={dayEvents} onPress={handleDayPress} />;
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
    height: (deviceHeight / 14) *1.5,
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
    paddingHorizontal: 2,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weekdaysContainer: {
    flexDirection: 'row',
   
   
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: deviceWidth*0.04,
    fontWeight: '700',
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
