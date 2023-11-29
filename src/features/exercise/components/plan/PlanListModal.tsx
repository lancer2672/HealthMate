import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {TouchableWithoutFeedback, FlatList, Modal} from 'react-native';
import PlanItem from '../PlanItem';
import {Button} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';

const PlanListModal = ({visible, onClose}) => {
  const planList = [
    {
      name: 'new name',
      exercise: [],
      createdAt: new Date()
    }
  ];

  const toast = useToast();
  const [selectedItems, setSelectedItems] = useState({});
  const handleAddSongToPlaylist = () => {
    onClose();
    toast.show('Success', {
      duration: 1000,
      type: 'success',
      animationType: 'zoom-in'
    });
  };
  const toggleSelectedItem = index => {
    setSelectedItems(prev => {
      const newValue = !!prev[index];
      return {
        ...prev,
        [index]: !newValue
      };
    });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}} />

          <View style={styles.subModalContainer}>
            <Text style={styles.modalHeading}>Choose plan</Text>
            <FlatList
              data={planList}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedItems[index] ? 'gray' : 'white'
                  }}
                  onPress={() => toggleSelectedItem(index)}>
                  <PlanItem plan={item} />
                </TouchableOpacity>
              )}
              keyExtractor={item => `${item.name}plan`}
            />
            <Button
              key={`das}`}
              style={styles.button}
              mode="contained"
              onPress={handleAddSongToPlaylist}>
              Add
            </Button>
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
    fontWeight: '500'
  },
  button: {
    borderRadius: 4,
    borderWidth: 2,
    margin: 12,
    alignSelf: 'flex-end',
    borderColor: 'black',
    backgroundColor: 'black'
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
  }
});

export default PlanListModal;
