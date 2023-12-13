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
import Animated, {
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
const ListSong = ({selectedSongs, onItemClick, searchBarVisible = true}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [deviceSongs, setDeviceSongs] = useState([]);
  // const [selectedSongs, setSelectedSongs] = useState([]);
  // const [searchBarVisible, setSearchBarVisible] = useState(isSearchBarVisible);
  const [songs, setSongs] = useState([]);
  const searchTimeout = useRef<any>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const scaleAnim = useSharedValue(0);

  useEffect(() => {
    const animValue = searchBarVisible ? 1 : 0;
    scaleAnim.value = withSpring(animValue, {
      duration: 200
    });
  }, [searchBarVisible]);
  const getDeviceSongs = async () => {
    try {
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
      {searchBarVisible && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: -50
              },
              {scaleY: scaleAnim},
              {
                translateY: 50
              }
            ]
          }}>
          <Searchbar
            autoFocus={false}
            icon={'account-search'}
            placeholder="Search"
            value={searchKeyword}
            onIconPress={() => console.log('press')}
            onChangeText={setSearchKeyword}
            iconColor={'#bdafaf'}
          />
        </Animated.View>
      )}
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
        contentContainerStyle={{marginBottom: 20}}
        removeClippedSubviews={false}
        data={songs}
        keyExtractor={(item, index) => `x233${index}`}
        renderItem={({item, index}) => (
          <Pressable onPress={() => onItemClick(item)}>
            <SongItem
              isSelected={selectedSongs.find(s => s.title == item.title)}
              song={item}
            />
          </Pressable>
        )}
      />
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
