import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Pressable
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, playlistSelector} from 'src/store/selectors';
import {Button} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import ListSong from '../../components/playlist/ListSong';
import ScreenHeader from 'src/components/ScreenHeader';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {FlatList} from 'react-native';
import PlaylistItem from '../../components/playlist/PlaylistItem';
import audioServiceIns from 'src/services/audio/audioIns';

const SelectMusic = () => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [isShuffleEnable, setIsShuffleEnable] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const {playlists} = useSelector(playlistSelector);
  const {} = useSelector(playlistSelector);
  const navigation = useNavigation<any>();

  const navigateToStartSession = () => {
    navigation.navigate('ReadyExercise');
  };
  const handleSetSelectedMusics = async () => {
    let songs = selectedSongs
      // .concat(playlistSongs)
      .filter(
        (item, index, self) =>
          index === self.findIndex(t => t.title === item.title)
      );
    console.log('song result', songs);
    await audioServiceIns.clearPlaylist();
    await audioServiceIns.addTrack(selectedSongs);
    navigateToStartSession();
  };

  const toggleSelectedPlaylist = playlist => {
    setSelectedPlaylist(selectedPlaylist == null ? playlist : null);
  };
  const toggleShuffleEnable = () => {
    setIsShuffleEnable(!isShuffleEnable);
  };
  const toggleShowSeachBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };
  const toggleSongSelection = song => {
    const index = selectedSongs.findIndex(s => s.title === song.title);
    if (index === -1) {
      setSelectedSongs([...selectedSongs, song]);
    } else {
      setSelectedSongs(selectedSongs.filter(i => i.title !== song.title));
    }
    // onSelectedSongsChanged
  };
  useEffect(() => {
    if (selectedPlaylist) {
      let playlistSongs = selectedPlaylist?.songs || [];
      let newListSongs = selectedSongs
        .concat(playlistSongs)
        .filter(
          (item, index, self) =>
            index === self.findIndex(t => t.title === item.title)
        );
      console.log('new ListSOngs', newListSongs);
      setSelectedSongs(newListSongs);
    }
  }, [selectedPlaylist]);
  useEffect(() => {}, [isShuffleEnable]);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ScreenHeader title={'Songs'}></ScreenHeader>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 12,
            paddingTop: 12
          }}>
          <TouchableOpacity onPress={toggleShowSeachBar} style={{padding: 4}}>
            <Feather name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleShuffleEnable} style={{padding: 4}}>
            <Ionicons
              name="shuffle"
              size={24}
              style={{
                opacity: isShuffleEnable ? 1 : 0.4
              }}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <ListSong
          onItemClick={toggleSongSelection}
          selectedSongs={selectedSongs}
          searchBarVisible={searchBarVisible}></ListSong>
      </View>
      <View
        style={{
          flex: 1,
          elevation: 1,
          paddingVertical: 12,
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%'
        }}>
        <Text style={[styles.title, {marginVertical: 12}]}>Playlist</Text>
        <View style={{width: '100%', flex: 1}}>
          <FlatList
            contentContainerStyle={{marginBottom: 20}}
            removeClippedSubviews={false}
            data={playlists}
            renderItem={({item}) => (
              <Pressable onPress={() => toggleSelectedPlaylist(item)}>
                <PlaylistItem
                  isSelected={selectedPlaylist?.name == item.name}
                  playlist={item}
                  iconVisible={false}
                />
              </Pressable>
            )}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            style={[
              buttonStyles.primary,
              {
                width: 200,
                alignSelf: 'center'
              }
            ]}
            mode="contained"
            onPress={handleSetSelectedMusics}>
            Next
          </Button>
          <TouchableOpacity
            style={{
              padding: 4,
              position: 'absolute',
              alignSelf: 'center',
              right: -60
            }}
            onPress={navigateToStartSession}>
            <Entypo name="chevron-right" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectMusic;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});
