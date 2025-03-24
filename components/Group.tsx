import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;

interface GroupCardProps {
  groupName: string;
  groupDesc: string;
  groupAvatar: string;
  groupId: string;
  isJoined: boolean;
  onJoinGroup: (groupId: string) => void;
  customButtonText?: string;
  customButtonStyle?: object;
  customButtonAction?: (groupId: string) => void;  // 修改为接受 groupId 作为参数
  disabledButton?: boolean;  // 父组件可以传递禁用状态
}

const GroupCard: React.FC<GroupCardProps> = ({
  groupName,
  groupDesc,
  groupAvatar,
  groupId,
  isJoined,
  onJoinGroup,
  customButtonText = '加入',
  customButtonStyle = {},
  customButtonAction,
  disabledButton = false,  // 默认不禁用按钮
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // 当按钮点击时调用 customButtonAction 或默认的 onJoinGroup
  const handleButtonPress = () => {
    if (customButtonAction) {
      customButtonAction(groupId); // 将 groupId 作为参数传递给父组件的 customButtonAction
    } else {
      onJoinGroup(groupId); // 如果没有传 customButtonAction，默认调用 onJoinGroup
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: groupAvatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.groupDesc}>
            {groupDesc.length > 100 ? `${groupDesc.substring(0, 100)}...` : groupDesc}
          </Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={1} style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>简介</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" onRequestClose={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>小组简介</Text>
          <Text>{groupDesc}</Text>
          <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity={1}
        style={[styles.joinButton, isJoined && styles.joinedButton, customButtonStyle]}
        onPress={handleButtonPress} // 使用 handleButtonPress 来处理按钮点击
        disabled={disabledButton && isJoined}  // 根据父组件传递的禁用状态
      >
        <Text style={styles.joinButtonText}>{customButtonText === 'mine' ? '进入' : (isJoined ? '已加入' : customButtonText)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
    width: deviceWidthDp * 0.95,
    height: deviceHeightDp * 0.1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: deviceWidthDp * 0.12,
    height: deviceWidthDp * 0.12,
    backgroundColor: 'white',
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  groupName: {
    fontSize: deviceHeightDp * 0.02,
    fontWeight: 'bold',
  },
  groupDesc: {
    fontSize: deviceHeightDp * 0.015,
    color: '#666',
  },
  button: {
    position: 'absolute',
    left: deviceWidthDp * 0,
    top: deviceHeightDp * 0.08,
    width: deviceWidthDp * 0.95,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignItems: 'center',
    borderTopColor: '#A4A4A4',
    borderTopWidth: 0.5,
  },
  buttonText: {
    color: '#000000',
    fontSize: deviceHeightDp * 0.015,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    width: deviceWidthDp * 0.15,
    height: deviceHeightDp * 0.05,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#EFFFD0',
    borderRadius: 25,
  },
  joinButton: {
    position: 'absolute',
    left: deviceWidthDp * 0.7,
    top: deviceHeightDp * 0.05,
    width: deviceWidthDp * 0.15,
    backgroundColor: '#EFFFD0',
    borderRadius: 20,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#9E9E9E',
  },
  joinButtonText: {
    color: '#000000',
    fontSize: 14,
  },
});

export default GroupCard;
