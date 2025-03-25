import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Dimensions } from 'react-native';
const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;
import { Image } from 'expo-image';
interface SearchBarProps {
  placeholder?: string; // 输入框的提示文字
  onSearch: (query: string) => void; // 搜索函数
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = '请输入小组名', onSearch }) => {
  const [query, setQuery] = useState<string>(''); // 存储输入框的文本内容

  const handleSearch = () => {
    onSearch(query); // 执行搜索操作
  };

  return (
    <View style={styles.container}>
    <Image source={require("../assets/images/Slice 20.png")} style={{width:deviceWidthDp*0.06,height:deviceWidthDp*0.06,position:'absolute',left:-deviceWidthDp*0.37,top:deviceHeightDp*0.035,zIndex:2}}></Image>
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery} // 输入框内容变化时更新 query
      />
      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Text style={styles.buttonText}>搜索</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
   
  },
  input: {
     position:'absolute',
     left:-deviceWidthDp*0.4,
     top:deviceWidthDp*0.058,
     zIndex:1,
    height:deviceHeightDp*0.04,
    width:deviceWidthDp*0.8,
    paddingHorizontal: 40,
    paddingVertical:deviceHeightDp*0.00,
    fontSize: deviceHeightDp*0.015,
    letterSpacing: 0.5,
    color:"raba(0,0,0,0.5)",
    backgroundColor: 'rgba(244, 244, 244, 0.51)',
    borderRadius: 25,
  },
  button: {
    
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  buttonText: {
    fontFamily:"ABeeZee",
    color: '5E5E5E',
    fontSize: 16,
    position:'absolute',
    left:deviceWidthDp*0.4,
    letterSpacing:0.5,
    top:deviceWidthDp*0.05,
  },
});

export default SearchBar;