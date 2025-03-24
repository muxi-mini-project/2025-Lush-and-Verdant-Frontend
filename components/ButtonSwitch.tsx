import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, ViewStyle, TouchableOpacityProps, Dimensions } from 'react-native';

interface ButtonSwitchProps extends TouchableOpacityProps {
  style?: ViewStyle; // 允许传入额外的样式
  onPress?: () => void; // 允许传入触发的函数
  value?: boolean; // 从外部控制按钮的状态
  onChange?: (value: boolean) => void; // 允许传入外部状态更新函数
}

const deviceWidthDp = Dimensions.get('screen').width;
const deviceHeightDp = Dimensions.get('screen').height;

const ButtonSwitch: React.FC<ButtonSwitchProps> = ({ style, onPress, value, onChange, ...props }) => {
  const [isActive, setIsActive] = useState<boolean>(value || false); // 初始状态从外部的 value 或默认值 false 获取
  const sliderPosition = useState(new Animated.Value(0))[0]; // 用于控制滚轮的位置

  // 当外部的 value 改变时，更新内部状态
  useEffect(() => {
    if (value !== undefined && value !== isActive) {
      setIsActive(value); // 外部控制状态
    }
  }, [value]);

  // 切换按钮状态，并触发父组件的 onPress 函数
  const handleClick = () => {
    // 动画效果：让滑块从0变到50px（向右移动）或从50px变回0
    Animated.timing(sliderPosition, {
      toValue: isActive ? 0 : deviceWidthDp * 0.065, // 根据状态决定移动的距离
      duration: 300, // 动画时长
      useNativeDriver: false, // 使用原生驱动
    }).start();

    const newState = !isActive;
    setIsActive(newState); // 更新内部状态

    // 调用传入的 onPress 函数
    if (onPress) {
      onPress();
    }

    // 如果有 onChange，则触发它，传递新的状态
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.switchButton, isActive && styles.active]}
        onPress={handleClick}
        {...props}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateX: sliderPosition }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    width: deviceWidthDp * 0.15,
    height: deviceHeightDp * 0.035,
    backgroundColor: '#ccc',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  active: {
    backgroundColor: '#CDF3AA', // 激活时的绿色背景
  },
  slider: {
    width: deviceHeightDp * 0.03,
    height: deviceHeightDp * 0.03,
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    top: deviceWidthDp * 0.006,
    left: deviceWidthDp * 0.01,
  },
});

export default ButtonSwitch;
