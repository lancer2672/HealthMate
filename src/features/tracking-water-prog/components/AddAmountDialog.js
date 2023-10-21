import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from 'styled-components';
const AddAmountDialog = ({isVisible, onClose, onClick}) => {
  const [inputVal, setInputVal] = React.useState('');
  const theme = useTheme();
  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      useNativeDriver={true}
      animationOut="fadeOut"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.container}>
        {/* Bất kỳ nội dung của menu nào bạn muốn đặt ở đây */}
        <Text style={styles.setting}>Water Amount</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="0 ml"
            value={inputVal}
            style={styles.input}
            onChangeText={setInputVal}></TextInput>
        </View>

        <TouchableOpacity
          onPress={async () => {
            onClose();
            if (!isNaN(inputVal) && inputVal > 0) {
              await onClick(parseInt(inputVal));
            }
            setInputVal('');
          }}
          style={{}}>
          <Text style={styles.category(theme)}>Add</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontWeight: 'bold',
    width: '100%',
    fontSize: 16,
  },
  container: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 24,
  },
  setting: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  category: theme => ({
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.waterTracking.primary,
  }),

  //setting item
  settingItemWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  settingName: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btn: {
    padding: 4,
  },
});

export default AddAmountDialog;
