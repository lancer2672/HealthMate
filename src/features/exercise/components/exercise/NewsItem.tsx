import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, 
  Image
} from 'react-native';
import { WebView } from 'react-native-webview'; 

const {width} = Dimensions.get('screen');

const NewsItem = ({target, navigation}) => {
    console.log(target.imageUrl);
  const [listExercise, setListExercise] = useState([]);
//   const navigation = useNavigation();
  useEffect(() => {}, []);

  const handleNavigateNews = () => {
    navigation.navigate('WebViewScreen', {
      uri: target.link
    });
  };
  
  return (
    <TouchableOpacity  style={{
        flex: 1
    }} onPress={handleNavigateNews}>
        
      <ImageBackground
        style={styles.rmCard}
        resizeMode="cover"
        source={target.imageUrl}>
        
      </ImageBackground>
      <View
          style={{
            margin: 10,
            flex: 1,
            flexDirection: 'row',
            // alignItems: 'flex-end',
            width: width - 40,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: 'bold'
            }}>
            {`${target.title}`}
          </Text>
          <View 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              flexDirection: 'row'
            }}>
          </View>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rmCard: {
    width: width - 40,
    height: 140,
    marginRight: 20,
    borderRadius: 10,
    // borderWidth: 1,
    // overflow: 'hidden',
    padding: 10
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default NewsItem;
