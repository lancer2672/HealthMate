import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button, Searchbar, Snackbar} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import SongItem from './SongItem';
import {requestStoragePermission} from 'src/permissions';
import {getAll} from 'react-native-get-music-files';
import buttonStyles from 'src/features/theme/styles/button';
import {useDispatch, useSelector} from 'react-redux';
import {playlistSelector} from 'src/store/selectors';
import {addSongAction} from 'src/store/reducer/thunks/playlistAction';

const ListSong = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [deviceSongs, setDeviceSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const searchTimeout = useRef<any>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const {selectedPlaylist} = useSelector(playlistSelector);
  const dispatch = useDispatch<any>();
  const getDeviceSongs = async () => {
    try {
      console.log('getDeviceSongs');
      await requestStoragePermission();
      const songsOrError = await getAll({
        limit: 20,
        offset: 0,
        coverQuality: 50,
        minSongDuration: 1000
      });
      if (typeof songsOrError === 'string') {
        // do something with the error
        return;
      }
      console.log('get device songs result', songsOrError);
      setDeviceSongs(songsOrError);
      setSongs(songsOrError);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDeviceSongs();
  }, []);

  const searchSongs = () => {
    const searchResult = deviceSongs.filter(s =>
      s.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setSongs(searchResult);
  };
  const navigateBack = () => {
    navigation.goBack();
  };
  const toggleSongSelection = index => {
    if (selectedSongs.includes(index)) {
      setSelectedSongs(selectedSongs.filter(i => i !== index));
    } else {
      setSelectedSongs([...selectedSongs, index]);
    }
  };
  const addSongsToPlaylist = () => {
    if (selectedPlaylist) {
      const selectedSongItem = songs.filter((s, i) =>
        selectedSongs.includes(i)
      );
      console.log('selectedSongItem', selectedSongItem);
      dispatch(
        addSongAction({
          playlistName: selectedPlaylist.name,
          songs: selectedSongItem
        })
      );
      navigation.goBack();
    }
  };
  console.log('selectedItems', selectedSongs);
  useEffect(() => {
    if (searchKeyword.trim() == '') {
      setSongs(deviceSongs);
    } else {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        searchSongs();
      }, 400);
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchKeyword]);
  return (
    <View style={styles.container}>
      <View style={{paddingBottom: 5, marginBottom: 12}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>List device song</Text>
        </View>
      </View>
      <Searchbar
        autoFocus={false}
        icon={'account-search'}
        placeholder="Search"
        value={searchKeyword}
        onIconPress={() => console.log('press')}
        onChangeText={setSearchKeyword}
        iconColor={'#bdafaf'}
      />
      <Snackbar
        visible={snackbarVisible}
        duration={1000}
        onDismiss={() => setSnackbarVisible(false)}
        style={{
          backgroundColor: '#e3d8d8',
          position: 'absolute',
          top: 0,
          right: -16,
          left: 0,
          zIndex: 1
        }}>
        <View>
          <Text>Not found</Text>
        </View>
      </Snackbar>
      <FlatList
        style={{padding: 8}}
        contentContainerStyle={{marginTop: 20}}
        removeClippedSubviews={false}
        data={songs}
        keyExtractor={(item, index) => `x233${index}`}
        renderItem={({item, index}) => (
          <Pressable onPress={() => toggleSongSelection(index)}>
            <SongItem isSelected={selectedSongs.includes(index)} song={item} />
          </Pressable>
        )}
      />
      <Button
        style={[
          buttonStyles.primary,
          {
            width: 200,
            alignSelf: 'center'
          }
        ]}
        mode="contained"
        onPress={addSongsToPlaylist}>
        Add
      </Button>
    </View>
  );
};

export default ListSong;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,
    color: 'black'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
  }
});
