import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {removePlanAction} from 'src/store/reducer/thunks/exerciseActions';
import {userSelector} from 'src/store/selectors';
const BottomMenu = ({visible, onClose, plan}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);
  const removePlan = () => {
    dispatch(removePlanAction({userId: user.uid, planName: plan.planName}));
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View
            style={{
              backgroundColor: 'black',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderColor: 'white'
            }}>
            <View
              style={{
                height: 12,
                width: 100,
                alignSelf: 'center',
                borderBottomWidth: 2,
                marginBottom: 12
              }}></View>

            <TouchableOpacity
              style={[styles.optionContainer]}
              onPress={removePlan}>
              <Text style={styles.option}>Delete plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  optionContainer: {
    borderColor: 'gray',
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%'
  },
  option: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
});
