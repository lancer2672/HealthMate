import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import {ImageBackground} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, playlistSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import SongItem from '../components/playlist/SongItem';
import {useNavigation, useRoute} from '@react-navigation/native';
import {removeSongAction} from 'src/store/reducer/thunks/playlistAction';
const DetailPlaylist = ({}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {selectedPlaylist} = useSelector(playlistSelector);
  const dispatch = useDispatch<any>();
  console.log('selectedPlaylist', selectedPlaylist);
  const navigateToListSong = () => {
    navigation.navigate('ListSong');
  };
  const handleDeleteSong = song => {
    dispatch(removeSongAction({playlistName: selectedPlaylist.name, song}));
  };
  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.header1, {backgroundColor: theme.green3}]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{paddingLeft: 8, paddingRight: 4}}>
            <Ionicons name="chevron-back" size={32} color="#cac5e5" />
          </TouchableOpacity>
          <View
            style={{
              flex: 1
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 500,
                color: 'white',
                fontSize: 20
              }}>
              Playlist
            </Text>
          </View>
          <TouchableOpacity style={{paddingLeft: 4, paddingRight: 8}}>
            <Feather name="more-horizontal" size={32} color="#cac5e5" />
          </TouchableOpacity>
        </View>
        <View style={[styles.header2, {backgroundColor: theme.green2}]}></View>
        <View
          style={[
            {
              padding: 32,
              backgroundColor: theme.green2,
              position: 'absolute',
              borderRadius: 60,
              bottom: 0,
              marginLeft: 24,
              elevation: 5
            },
            styles.boxWithShadow
          ]}>
          <Image
            style={{width: 160, height: 160, borderRadius: 24}}
            source={require('../../../assets/imgs/girl_listening_to_music.png')}></Image>
        </View>
      </View>

      <View style={{flex: 1, backgroundColor: theme.green2}}>
        <View
          style={{
            paddingLeft: 24,
            marginTop: 12,
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center'
          }}>
          <Entypo name="beamed-note" size={24} color="white" />
          <Text style={styles.title}>Songs</Text>
          <TouchableOpacity
            style={{alignSelf: 'flex-start', padding: 4}}
            onPress={navigateToListSong}>
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginLeft: 12}}></View>
        </View>
        <FlatList
          data={selectedPlaylist.songs}
          renderItem={({item}) => (
            <TouchableOpacity onLongPress={() => handleDeleteSong(item)}>
              <SongItem isSelected={true} song={item}></SongItem>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default DetailPlaylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 12
  },
  header: {backgroundColor: '#1c1348'},
  header1: {
    height: 200,
    paddingTop: 24,
    backgroundColor: 'tomato',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  header2: {
    height: 100,
    backgroundColor: 'red'
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 5
  }
});
