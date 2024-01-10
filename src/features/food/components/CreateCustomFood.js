import {useState} from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useTheme} from 'styled-components';

import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-crop-picker';
import CustomEditText from 'src/components/EditText';
import {saveImageFile} from 'src/services/firebase';
import {addCustomFood} from 'src/services/firebase/database/custom-food';
import {useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
const CreateCustomFood = ({visible, onClose}) => {
  const {user} = useAppSelector(userSelector);
  const [selectedImage, setSelectedImage] = useState();
  const [newFood, setNewFood] = useState({
    name: '',
    realCalories: '0',
    realCarbo: '0',
    realProtein: '0',
    realFat: '0',
    photo: {},
    // 4gram, 4unit ...
    amount: ''
  });
  const theme = useTheme();
  const onInputChange = (field, value) => {
    setNewFood({...newFood, [field]: value});
  };
  const handleMediaSelection = async () => {
    try {
      const image = await ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo'
      });
      console.log('handleMediaSelection', image);
      setSelectedImage(image);
    } catch (error) {
      console.log(`Error when selecting :`, error);
    }
  };
  const handleCreateFood = async () => {
    console.log('imgeUrl', selectedImage);
    if (!selectedImage) {
      showMessage({
        message: 'Vui lòng chọn ảnh',
        type: 'success'
      });
      return;
    }
    const imageUrl = await saveImageFile(user.uid, selectedImage);

    await addCustomFood({
      userId: user.uid,
      food: {...newFood, tag_id: Date.now(), photo: {thumb: imageUrl}}
    });
    showMessage({
      message: 'Thêm thành công',
      type: 'success'
    });
    onClose();
    reset();
  };
  const reset = () => {
    setSelectedImage(null);
    setNewFood({
      name: '',
      realCalories: '0',
      realCarbo: '0',
      realProtein: '0',
      realFat: '0',
      photo: {},
      amount: ''
    });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.centeredView}>
        <Pressable style={styles.modalView}>
          <TouchableOpacity
            onPress={handleMediaSelection}
            style={{borderRadius: 25, overflow: 'hidden'}}>
            <ImageBackground
              style={{
                width: 180,
                height: 180,
                backgroundColor: 'gray',
                borderRadius: 12
              }}
              resizeMode="cover"
              source={{
                uri: selectedImage?.path != null ? selectedImage.path : null
              }}></ImageBackground>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <CustomEditText
              label={'Name'}
              placeholder={'Name'}
              value={newFood.name}
              style={{width: '50%', marginRight: 12}}
              onChangeText={newText => onInputChange('name', newText)}
            />
            <CustomEditText
              label={'Amount'}
              placeholder={''}
              value={newFood.amount}
              style={{width: '50%'}}
              onChangeText={newText => onInputChange('amount', newText)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <CustomEditText
              afix={'g'}
              placeholder={'Calorie'}
              label={'Calorie'}
              value={newFood.realCalories}
              style={{width: '50%', marginRight: 12}}
              onChangeText={newText => onInputChange('realCalories', newText)}
            />
            <CustomEditText
              afix={'g'}
              placeholder={'Protein'}
              label={'Protein'}
              value={newFood.realProtein}
              style={{width: '50%'}}
              onChangeText={newText => onInputChange('realProtein', newText)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <CustomEditText
              afix={'g'}
              placeholder={'Carbohydrat'}
              label={'Carbohydrat'}
              value={newFood.realCarbo}
              style={{width: '50%', marginRight: 12}}
              onChangeText={newText => onInputChange('realCarbo', newText)}
            />
            <CustomEditText
              afix={'g'}
              placeholder={'Fat'}
              label={'Fat'}
              value={newFood.realFat}
              style={{width: '50%'}}
              onChangeText={newText => onInputChange('realFat', newText)}
            />
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              padding: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: theme.secondary
            }}
            onPress={handleCreateFood}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Add</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CreateCustomFood;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});
