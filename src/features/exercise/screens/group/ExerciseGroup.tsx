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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
  quitGroup,
  setGroupPlan
} from 'src/services/firebase/database/group';
import {setUser} from 'src/store/reducer/userSlice';
import InputText from 'src/components/TextInput';
import AddGroupPlanModal from '../../components/AddGroupPlanModal';

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
  const [detailVisible, setDetailVisible] = useState(false);
  const [planlistVisible, setPlanlistVisible] = useState(false);
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
    if (user.groupId && group) {
      await quitGroup({
        groupId: user.groupId,
        userId: user.uid
      });
      const currentUserIndex = group.members.findIndex(
        member => member.userId === user.uid
      );
      const nextCreator =
        currentUserIndex < group.members.length - 1
          ? group.members[currentUserIndex + 1]
          : group.members[0];
      dispatch(
        setUser({
          user: {...user, groupId: null, nextCreator: nextCreator.userId}
        })
      );
    }
  };
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
      console.log('groupdata trackgroup', groupData);
      if (groupData) {
        const sortedMembers = Object.entries(groupData.members || {})
          .map(([userId, memberData]) => ({userId, ...memberData}))
          .sort((a, b) => b.weekPoint - a.weekPoint);
        setGroup({...groupData, members: sortedMembers});
      }
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

  const openDetailPlanModal = () => {
    // await setGroupPlan({groupId:user.groupId, plan})
    setDetailVisible(true);
  };
  const handleJoinGroup = async groupId => {
    await joinGroup({userId: user.uid, groupId});
    dispatch(setUser({user: {...user, groupId}}));
  };
  const handleSearch = async () => {
    const groupsRef = firebaseDatabase.ref('groups');
    const snapshot = await groupsRef.once('value');
    const groups = snapshot.val();

    const foundGroup = Object.entries(groups).find(
      ([groupId, groupData]) =>
        groupData.groupSearchId?.toString().toLowerCase() ===
        searchKeyword.toLowerCase()
    );

    if (foundGroup) {
      const [groupId, groupData] = foundGroup;
      console.log(`Found group with ID: ${groupId}`, groupData);
      // Xử lý tiếp theo nếu tìm thấy group
      handleJoinGroup(groupId);
    } else {
      Alert.alert(
        'Search result',
        'Group not found!',
        [{text: 'Ok', style: 'cancel'}],
        {
          cancelable: false
        }
      );
    }
  };

  useEffect(() => {
    if (user.groupId) {
      trackGroup();
    }
  }, [user.groupId]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* header */}
        <View style={{paddingBottom: 2}}>
          <View style={[styles.header, {backgroundColor: theme.green1}]}>
            <TouchableOpacity onPress={navigateBack}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text style={[styles.title]}>Exercise group</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View
            style={[styles.searchContainer, {backgroundColor: theme.green2}]}>
            <View style={{flex: 1}}>
              {user.groupId ? (
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginLeft: 12
                  }}>
                  <TouchableOpacity
                    onPress={openDetailPlanModal}
                    style={styles.icon}>
                    <FontAwesome name="list-alt" size={32} color="white" />
                  </TouchableOpacity>
                  <View style={{marginRight: 'auto'}}>
                    <Text style={[styles.title]}>{group?.name}</Text>
                    <Text style={[styles.title, {fontSize: 16, opacity: 0.8}]}>
                      #{group?.groupSearchId}
                    </Text>
                  </View>
                </View>
              ) : (
                <Searchbar
                  autoFocus={false}
                  icon={'account-search'}
                  placeholder="Search group id"
                  value={searchKeyword}
                  onIconPress={handleSearch}
                  onChangeText={setSearchKeyword}
                  iconColor={'#bdafaf'}
                />
              )}
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
              {/* <Text>You not in any group</Text> */}
            </View>
          )}

          <CreateGroupModal
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}></CreateGroupModal>
          <DetailGroupPlanModal
            group={group}
            openCreateModal={() => {
              setPlanlistVisible(true);
            }}
            visible={detailVisible}
            onClose={() => {
              setDetailVisible(false);
            }}></DetailGroupPlanModal>
          <AddGroupPlanModal
            visible={planlistVisible}
            onClose={() => {
              setPlanlistVisible(false);
            }}></AddGroupPlanModal>
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

const DetailGroupPlanModal = ({visible, onClose, group, openCreateModal}) => {
  const [groupName, setGroupName] = useState('');
  const toast = useToast();
  const dispatch = useDispatch<any>();
  const {user} = useSelector(userSelector);

  const handleOpenCreateModal = async () => {
    openCreateModal();
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
          borderRightColor: 'tomato',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1}}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.modalContainer, {minHeight: 500}]}>
          <View style={styles.header}>
            <Text style={styles.modalHeading}>Group plan</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',

              width: '100%'
            }}>
            {group?.plan?.exercise ? (
              <FlatList
                style={{width: '100%'}}
                showsVerticalScrollIndicator={false}
                data={group?.plan?.exercise || []}
                renderItem={({item, index}) => (
                  <View style={{paddingTop: 8}}>
                    <DetailPlanItem
                      index={index}
                      exercise={item}></DetailPlanItem>
                    <View style={styles.itemSeparator}></View>
                  </View>
                )}
                keyExtractor={item => `${item.name}plan-tiem`}
              />
            ) : (
              <Text style={[styles.title, {color: 'gray'}]}>
                Group not set any plan yet
              </Text>
            )}
          </View>
          {user.uid === group?.creatorId && (
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleOpenCreateModal}>
              Update
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};

const DetailPlanItem = ({exercise, index}) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const navigateToDetailExercise = () => {
    navigation.navigate('DetailExercise', {
      exercise
    });
  };
  return (
    <>
      <TouchableOpacity
        style={[
          {
            backgroundColor: 'white'
          },
          itemStyles.item
        ]}>
        <View style={[itemStyles.circleNumber, {backgroundColor: 'gray'}]}>
          <Text style={[itemStyles.number]}>{index + 1}</Text>
        </View>
        <View
          style={{
            overflow: 'hidden',
            marginRight: 12,
            borderRadius: 12
          }}>
          <Image
            source={{uri: exercise.gifUrl}}
            resizeMode="cover"
            style={{
              width: 80,
              height: 80
            }}></Image>
        </View>

        <View style={itemStyles.itemInfo}>
          <Text
            style={[
              itemStyles.itemName,
              {
                color: 'gray'
              }
            ]}>
            {exercise.name}
          </Text>
          <Text
            style={[
              itemStyles.itemTime,
              {
                color: 'gray'
              }
            ]}>
            {convertSecondsToMinutesAndSeconds(exercise.duration)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigateToDetailExercise}
          style={itemStyles.itemIcon}>
          <AntDesign name="questioncircleo" size={24} color={'gray'} />
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
};

const itemStyles = StyleSheet.create({
  itemInfo: {flex: 1},
  itemName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  circleNumber: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 28,
    marginRight: 12
  },
  number: {
    color: 'white'
  },
  itemTime: {},
  itemIcon: {
    marginLeft: 8,
    padding: 4
  },
  item: {
    padding: 8,
    paddingVertical: 16,
    // borderRadius: 4,
    flexDirection: 'row',
    // marginHorizontal: 12,
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 12,
    alignItems: 'center'
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1
    // alignItems: 'center'
  },
  itemSeparator: {
    width: '100%',
    borderWidth: 1
  },
  img: {borderRadius: 50, width: 60, height: 60, resizeMode: 'cover'},
  title: {
    fontSize: 26,
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
    fontSize: 24,
    marginLeft: 12,
    color: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center'
  },
  icon: {
    padding: 4
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
    justifyContent: 'flex-start',

    alignItems: 'center'
  }
});
