import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  FlatList
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableWithoutFeedback, Modal} from 'react-native';
import {Button} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  exerciseSelector,
  playlistSelector,
  userSelector
} from 'src/store/selectors';
import PlaylistItem from './PlaylistItem';
import {requestStoragePermission} from 'src/permissions';
import {
  addPlaylistAction,
  getPlaylistsAction
} from 'src/store/reducer/thunks/playlistAction';
import {
  selectedPlaylist,
  setSelectedPlaylist
} from 'src/store/reducer/playlistSlice';

const playlists = [
  {
    name: 'playlist 1',
    songs: [
      {
        duration: 242103,
        title:
          'y2mate.com - 2G18 Đến Bao Giờ  Datmaniac ft Cá Hồi Hoang  Video Lyric'
      }
    ]
  }
];

const Playlist = () => {
  const [show, setShow] = useState(false);
  const {playlists} = useSelector(playlistSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const viewDetailPlaylist = playlist => {
    dispatch(setSelectedPlaylist(playlist));
    navigation.navigate('DetailPlaylist');
  };
  const navigateToListSongs = () => {
    navigation.navigate('ListSong');
  };
  console.log('playlists', playlists);
  useEffect(() => {
    dispatch(getPlaylistsAction());
  }, []);
  return (
    <>
      <FlatList
        contentContainerStyle={{marginBottom: 20}}
        removeClippedSubviews={false}
        data={playlists}
        renderItem={({item}) => (
          <Pressable onPress={() => viewDetailPlaylist(item)}>
            <PlaylistItem playlist={item} />
          </Pressable>
        )}
      />
    </>
  );
};

export default Playlist;
