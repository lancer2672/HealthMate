import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import NewsItem from './NewsItem';

const data = [
  {
    title: 'Chăm sóc sức khỏe toàn diện nên bắt đầu từ ăn uống đúng cách | Báo Dân trí',
    link: 'https://dantri.com.vn/suc-khoe/cham-soc-suc-khoe-toan-dien-nen-bat-dau-tu-an-uong-dung-cach-20190821073355915.htm',
    imageUrl: require('../../../../assets/imgs/cham-soc-suc-khoe.webp')
  },
  {
    title: '20 mẹo ăn uống giúp bạn sống lâu, khỏe mạnh - VnExpress Sức khỏe',
    link: 'https://vnexpress.net/20-meo-an-uong-giup-ban-song-lau-khoe-manh-4689895.html',
    imageUrl: require('../../../../assets/imgs/20-meo-an-uong.jpg')
  },
  {
    title: 'Sống lành mạnh, ăn uống an toàn - Báo Quảng Ngãi điện tử',
    link: 'https://baoquangngai.vn/suc-khoe/202311/song-lanh-manh-an-uong-an-toan-e670e31/',
    imageUrl: require('../../../../assets/imgs/song-lanh-manh.jpg')
  },
  {
    title: 'Tình trạng giấc ngủ nói gì về sức khoẻ của bạn? | Prudential Việt Nam',
    link: 'https://www.prudential.com.vn/vi/blog-nhip-song-khoe/tinh-trang-giac-ngu-noi-gi-ve-suc-khoe-cua-ban/',
    imageUrl: require('../../../../assets/imgs/tinh-trang-suc-khoe.jpg')
  },
];
const ListTargetExercise = () => {
  const [targetList, setTargetList] = useState(data);
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Text style={styles.title}>Articles on healthcare</Text>
        
      </View>
      <View>
        <FlatList
          contentContainerStyle={{marginBottom: 20, marginTop: 4}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={targetList}
          keyExtractor={(item, index) => `x1${index}`}
          renderItem={({item}) => <NewsItem target={item} navigation={navigation} />}
        />
      </View>
    </>
  );
};

export default ListTargetExercise;

const styles = StyleSheet.create({
  target: {
    color: 'gray',
    fontSize: 24
  },
  title: {
    fontSize: 20,
    marginVertical: 8,
    fontWeight: 'bold'
  }
});
