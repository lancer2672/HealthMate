import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const GenderSelection = ({visible, onClose, gender, setGender}) => {
  const handleSelectGender = value => {
    setGender(value);
    onClose();
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.centeredView} onPress={onClose}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => handleSelectGender(0)}
            style={[
              styles.touchableOpacity,
              {
                backgroundColor: gender == 0 ? 'gray' : null,
                borderColor: gender == 0 ? 'gray' : null
              }
            ]}>
            <Text style={styles.text}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectGender(1)}
            style={[
              styles.touchableOpacity,
              {
                backgroundColor: gender == 1 ? 'gray' : null,
                borderColor: gender == 1 ? 'gray' : null
              }
            ]}>
            <Text style={styles.text}>Female</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  modalView: {
    width: 260,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#b7bac9',
    elevation: 2
  },
  touchableOpacity: {
    flexDirection: 'row',
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    backgroundColor: 'gray',
    borderRadius: 12,
    alignItems: 'center'
  },
  text: {
    marginLeft: 12,
    fontWeight: '500',
    color: 'white',
    fontSize: 20
  }
});

export default GenderSelection;
