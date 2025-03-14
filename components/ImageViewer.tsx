import { StyleSheet,Dimensions } from "react-native";
import { Image, type ImageSource } from "expo-image";
const deviceWidthDp=Dimensions.get('screen').width;
const deviceHeightDp=Dimensions.get('screen').height;
type Props = {
  imgSource: ImageSource;
  selectedImage?:string;
};

export default function ImageViewer({ imgSource,selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width:deviceWidthDp*0.2,
    height:deviceWidthDp*0.2,
    backgroundColor:'white',
    borderRadius: 50,
  },
});