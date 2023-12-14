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
import buttonStyles from 'src/features/theme/styles/button';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, playlistSelector} from 'src/store/selectors';
import {addSongAction} from 'src/store/reducer/thunks/playlistAction';
import ListSong from '../../components/playlist/ListSong';
import ScreenHeader from 'src/components/ScreenHeader';

const AddSongToPlaylist = ({}) => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const {selectedPlaylist} = useSelector(playlistSelector);
  const dispatch = useDispatch<any>();
  const {doExercise} = useSelector(exerciseSelector);
  const navigateBack = () => {
    navigation.goBack();
  };
  const toggleSongSelection = song => {
    const index = selectedSongs.findIndex(s => s.title === song.title);
    if (index === -1) {
      setSelectedSongs([...selectedSongs, song]);
    } else {
      setSelectedSongs(selectedSongs.filter(i => i.title !== song.title));
    }
  };
  const addSongsToPlaylist = () => {
    if (selectedPlaylist) {
      console.log('selectedSongs', selectedSongs);
      dispatch(
        addSongAction({
          playlistName: selectedPlaylist.name,
          songs: selectedSongs
        })
      );
      navigation.goBack();
    }
  };
  console.log('selectedItems', selectedSongs);

  return (
    <View style={styles.container}>
      <ScreenHeader title={'Songs'}></ScreenHeader>
      <ListSong
        onItemClick={toggleSongSelection}
        selectedSongs={selectedSongs}></ListSong>
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

export default AddSongToPlaylist;

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
