import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
  Alert,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components';
import {Button, Searchbar, TextInput} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import {convertSecondsToMinutesAndSeconds} from 'src/utils/dateTimeHelper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {userSelector} from 'src/store/selectors';
import GroupItem from '../../components/GroupItem';
import {useToast} from 'react-native-toast-notifications';
import firebaseDatabase from 'src/services/firebase/database';
import {
  createGroup,
  joinGroup,
  quitGroup
} from 'src/services/firebase/database/group';
import {setUser} from 'src/store/reducer/userSlice';
import InputText from 'src/components/TextInput';

const data = [
  {
    rank: 2,
    username: 'name',
    streak: 5,
    avatar: 'https://picsum.photos/200/200'
  }
];
const groupRef = firebaseDatabase.ref('groups');

const ExerciseGroup = () => {
  const [group, setGroup] = useState();
  const [visible, setVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const theme = useTheme();
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();
  // const [exercise, setListExercise] = useState(selectedPlan.exercise);
  const navigation = useNavigation();
  const navigateBack = () => {
    navigation.goBack();
  };
  const handleQuitGroup = async () => {
    if (user.groupId) {
      await quitGroup({
        groupId: user.groupId,
        userId: user.uid
      });
      dispatch(setUser({user: {...user, groupId: null}}));
    }
  };
  console.log('user', user);
  const displayAlert = () => {
    Alert.alert(
      'Are you sure to quit?',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Quit', onPress: handleQuitGroup}
      ],
      {cancelable: false}
    );
  };
  const openModal = () => {
    setVisible(true);
  };

  console.log('group data', group);
  const trackGroup = () => {
    const groupRealtimeRef = groupRef.child(user.groupId);
    groupRealtimeRef.on('value', snapshot => {
      const groupData = snapshot.val();
      //sort group by week point
      if (groupData) {
        const sortedMembers = Object.entries(groupData.members)
          .map(([userId, memberData]) => ({userId, ...memberData}))
          .sort((a, b) => b.weekPoint - a.weekPoint);
        setGroup({...groupData, members: sortedMembers});
      }

      console.log('new group data', groupData);
    });
  };

  const getUserRankPosition = () => {
    if (group) {
      const rankPosition = group.members.findIndex(
        member => member.userId === user.uid
      );

      return `Top ${rankPosition + 1}`;
    }
    return '';
  };

  useEffect(() => {
    if (user.groupId) {
      trackGroup();
    }
  }, [user.groupId]);
  useEffect(() => {
    const handleSearch = () => {
      if (searchKeyword.trim() === '') {
        console.log('failed');
      } else {
        console.log('success');
      }
    };

    const searchTimeout = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [searchKeyword]);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{paddingBottom: 2}}>
          <View style={[styles.header, {backgroundColor: theme.green1}]}>
            <TouchableOpacity onPress={navigateBack}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>Exercise group</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View
            style={[styles.searchContainer, {backgroundColor: theme.green2}]}>
            <View style={{flex: 1}}>
              <Searchbar
                autoFocus={false}
                icon={'account-search'}
                placeholder="Search"
                value={searchKeyword}
                onIconPress={() => console.log('press')}
                onChangeText={setSearchKeyword}
                iconColor={'#bdafaf'}
              />
            </View>
            <TouchableOpacity
              style={[
                {
                  width: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 6,
                  borderRadius: 12,
                  marginHorizontal: 12,
                  backgroundColor: 'tomato'
                }
              ]}
              onPress={user.groupId ? displayAlert : openModal}>
              {user.groupId ? (
                <Feather name="corner-up-right" size={24} color="white" />
              ) : (
                <AntDesign name="plus" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
          {user.groupId ? (
            <>
              <View
                style={{
                  flex: 1,

                  backgroundColor: theme.green1
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 6,
                    backgroundColor: theme.green2
                  }}>
                  <Image
                    source={{uri: 'https://picsum.photos/200/200'}}
                    style={styles.img}></Image>
                  <Text style={styles.name}>Username</Text>
                  <View style={styles.separator}></View>
                  <Text style={[styles.name, {marginLeft: 'auto'}]}>
                    {getUserRankPosition()}
                  </Text>
                </View>
                <FlatList
                  data={group?.members || []}
                  renderItem={({item, index}) => {
                    const data = {
                      rank: index + 1,
                      ...item
                    };
                    return (
                      <TouchableOpacity>
                        <GroupItem {...data}></GroupItem>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,

                backgroundColor: theme.green1
              }}>
              <Text>You not in any group</Text>
            </View>
          )}

          <CreateGroupModal
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}></CreateGroupModal>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ExerciseGroup;

const CreateGroupModal = ({visible, onClose}) => {
  const [groupName, setGroupName] = useState('');
  const toast = useToast();
  const dispatch = useDispatch<any>();
  const {user} = useSelector(userSelector);

  const handleAddNewGroup = async () => {
    const {id, ...group} = await createGroup({
      creatorId: user.uid,
      name: groupName
    });
    console.log('id group', id, group);
    await joinGroup({userId: user.uid, groupId: id});
    dispatch(setUser({user: {...user, groupId: id}}));
    setGroupName('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1}}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.modalHeading}>Create group</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginLeft: 6,
              justifyContent: 'space-between'
            }}>
            <InputText
              style={styles.textInput}
              onChangeText={setGroupName}
              placeholder="Your group name"
              value={groupName}
            />
          </View>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleAddNewGroup}>
            Add
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
    // alignItems: 'center'
  },
  img: {borderRadius: 50, width: 60, height: 60, resizeMode: 'cover'},
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  separator: {
    width: 4,
    borderRadius: 20,
    height: 50,
    marginLeft: 'auto',
    backgroundColor: 'white'
  },
  name: {
    fontSize: 26,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center'
  },

  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
    // width: '100%',
  },
  //Modal
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 26,
    flex: 1
  },
  button: {
    borderRadius: 4,
    borderWidth: 2,
    margin: 12,
    alignSelf: 'flex-end',
    borderColor: 'black',
    backgroundColor: 'black'
  },
  textInput: {
    flex: 1
  },

  option: {
    marginLeft: 12,
    fontSize: 16
  },
  groupItemContainer: {
    height: 70,
    backgroundColor: '#101010',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    width: 280,
    padding: 12,
    margin: 12
  },
  modalContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    marginTop: 'auto',
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    paddingTop: 12,
    alignItems: 'center',
    borderRadius: 12
  }
});
