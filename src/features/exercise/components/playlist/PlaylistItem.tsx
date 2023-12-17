import {memo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {removePlaylistAction} from 'src/store/reducer/thunks/playlistAction';
import {useTheme} from 'styled-components';

const PlaylistItem = ({playlist, isSelected = false, iconVisible = true}) => {
  const [isShow, setIsShow] = useState(false);
  const [playListName, setPlaylistName] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const onClose = () => {
    setIsShow(false);
  };

  const handleEditPlaylist = (index, name) => {
    setIsShow(true);
  };
  const handleDeletePlaylist = () => {
    dispatch(removePlaylistAction(playlist.name));
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? theme.secondary : null,
          borderColor: theme.secondary
        }
      ]}>
      <View
        style={{
          flex: 1,
          // marginLeft: 12,
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}>
        <View>
          <Text
            style={{
              fontSize: 16,
              color: isSelected ? 'white' : 'gray',

              fontWeight: '500',
              marginLeft: 10
            }}>
            {playlist.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isSelected ? 'white' : 'gray',
              fontWeight: '500',
              marginLeft: 10
            }}>
            {playlist.songs.length} song
          </Text>
        </View>
      </View>
      {iconVisible && (
        <TouchableOpacity onPress={handleDeletePlaylist}>
          <Icon name="delete" size={22} color={isSelected ? 'white' : 'gray'} />
        </TouchableOpacity>
      )}
    </View>
  );
};
const color = {
  APP_BG: '#fff',
  FONT: '#303d49',
  FONT_MEDIUM: '#636363',
  FONT_LIGHT: '#b6b8b9',
  MODAL_BG: 'rgba(0,0,0,0.2)',
  ACTIVE_BG: '#5252ad',
  ACTIVE_FONT: '#fff'
};

export default memo(PlaylistItem);
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    margin: 12
    // elevation: 2
  },
  boxWithShadow: {
    // shadowColor: '#000',
    // borderWidth: 1,
    // overflow: 'hidden',
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15
  },
  modalBG: {
    backgroundColor: color.MODAL_BG
  },
  img: {borderRadius: 50, width: 40, height: 40, resizeMode: 'cover'},
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: 'red',
    marginBottom: 30
  },
  text: {
    fontSize: 30
  }
});
