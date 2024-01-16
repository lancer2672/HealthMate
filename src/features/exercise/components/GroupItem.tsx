import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';

const GroupItem = ({rank, userId, weekPoint, totalPoint}) => {
  console.log('Group item', {rank, userId, weekPoint, totalPoint});
  const theme = useTheme();
  const {user} = useSelector(userSelector);
  const getCrownType = () => {
    switch (rank) {
      case 1:
        return require('src/assets/imgs/yellow_crown.png');
      case 2:
        return require('src/assets/imgs/pink_crown.png');
      case 3:
        return require('src/assets/imgs/tomato_crown.png');
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.green3,
          borderColor: theme.secondary
        }
      ]}>
      {rank <= 3 && (
        <Image
          source={getCrownType()}
          style={{
            width: 60,
            height: 60,
            position: 'absolute',
            top: -28,
            left: -28,
            transform: [{rotate: '-30deg'}]
          }}></Image>
      )}
      <Text style={styles.rank}> {rank}</Text>
      <View style={styles.separator}></View>
      <View style={{flex: 1, marginLeft: 12}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '500'
            }}>
            {user.name || userId}
          </Text>
        </View>
        <Text numberOfLines={1} style={{color: 'white'}}></Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.weekPoint}>{weekPoint} point</Text>
        <Text style={styles.totalPoint}>{totalPoint} point</Text>
      </View>
    </View>
  );
};

export default GroupItem;

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: '#101010',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    margin: 12
  },
  totalPoint: {
    color: 'white',
    marginLeft: 12,
    marginRight: 4
  },
  weekPoint: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    marginLeft: 12,
    marginRight: 4
  },
  separator: {
    width: 4,
    borderRadius: 20,

    height: 50,
    marginLeft: 24,
    backgroundColor: 'white'
  },
  rank: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  boxWithShadow: {
    shadowColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10
  },
  img: {borderRadius: 50, width: 40, height: 40, resizeMode: 'cover'}
});
