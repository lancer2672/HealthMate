import {useNavigation, useRoute} from '@react-navigation/native';
import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {playlistSelector} from 'src/store/selectors';

const ScreenHeader = ({title}) => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const {selectedPlaylist} = useSelector(playlistSelector);
  const dispatch = useDispatch<any>();

  const navigateBack = () => {
    navigation.goBack();
  };

  console.log('selectedItems', selectedSongs);

  return (
    <View style={{paddingBottom: 2}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default ScreenHeader;

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
