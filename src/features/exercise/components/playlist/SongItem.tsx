import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useContext, memo, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {userSelector} from 'src/store/selectors';
import {formatSongDuration} from 'src/utils/tranformData';
import {useTheme} from 'styled-components';

const SongItem = ({isSelected = false, song = {}}) => {
  const theme = useTheme();
  const {user} = useSelector(userSelector);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? theme.secondary : null,
          borderWidth: 2,
          borderColor: theme.secondary
        }
      ]}>
      <Image
        source={require('../../../../assets/imgs/music_disc.png')}
        style={styles.img}></Image>
      <View style={{flex: 1, marginLeft: 12}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: isSelected ? 'white' : 'gray',
              fontWeight: '500'
            }}>
            {song.title}
          </Text>
          <Feather
            name="headphones"
            size={18}
            color={isSelected ? 'white' : 'gray'}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{color: isSelected ? 'white' : 'gray'}}></Text>
      </View>
      <Text
        style={{
          color: isSelected ? 'white' : 'gray',
          marginLeft: 12,
          marginRight: 4
        }}>
        {formatSongDuration(song.duration)}
      </Text>
    </View>
  );
};

export default memo(SongItem);

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
