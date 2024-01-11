import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {FlatList, Modal, TouchableWithoutFeedback} from 'react-native';
import {Button} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {setGroupPlan} from 'src/services/firebase/database/group';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import PlanItem from './PlanItem';

const AddGroupPlanModal = ({visible, onClose}) => {
  const {plans} = useSelector(exerciseSelector);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const toast = useToast();
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();

  const handleAddGroupPlan = async () => {
    if (selectedPlan) {
      await setGroupPlan({groupId: user.groupId, plan: selectedPlan});
      // onAddPlan(selectedPlan);
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={visible}>
      <TouchableWithoutFeedback onPress={null}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}} />

          <View style={styles.subModalContainer}>
            <View style={styles.header}>
              <Text style={styles.modalHeading}>Your plan</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={plans}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      selectedPlan?.planName === item.planName
                        ? 'gray'
                        : 'white'
                  }}
                  onPress={() => setSelectedPlan(item)}>
                  <PlanItem
                    isSelected={selectedPlan?.planName === item.planName}
                    plan={item}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => `${item.name}plan`}
            />

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: 6,
                justifyContent: 'flex-end'
              }}>
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleAddGroupPlan}>
                Update
              </Button>
            </View>
          </View>

          <View style={{flex: 1.2}} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 26,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingBottom: 12
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
  container: {
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: 'white',
    right: 0,
    padding: 8,
    left: 0
  },
  option: {
    marginLeft: 12,
    fontSize: 16
  },
  playlistItemContainer: {
    height: 70,
    backgroundColor: '#101010',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    width: 280,
    padding: 12,
    margin: 12
  },
  subModalContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    paddingTop: 12,
    alignItems: 'center',
    height: 400,
    marginHorizontal: 24,
    borderRadius: 4
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 4
  },
  suffix: {
    marginLeft: 5
  }
});

export default AddGroupPlanModal;
