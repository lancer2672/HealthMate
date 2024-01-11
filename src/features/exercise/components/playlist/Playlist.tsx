import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {FlatList, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedPlaylist} from 'src/store/reducer/playlistSlice';
import {getPlaylistsAction} from 'src/store/reducer/thunks/playlistAction';
import {playlistSelector} from 'src/store/selectors';
import PlaylistItem from './PlaylistItem';

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
