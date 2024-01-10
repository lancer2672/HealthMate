import {CheckBox} from '@ui-kitten/components';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useAppDispatch, useAppSelector} from 'src/store/hooks';
// import {userSelector, foodMealSelector} from 'src/store/selectors';
// import {useSelector} from 'react-redux';

const FoodCard = ({
  mealName,
  selected,
  updateFood,
  onSelect,
  foodMeal,
  navigation
}) => {
  console.log('foodMeal17', foodMeal);
  const [visible, setVisible] = useState(false);
  const handleNavigateEditFood = foodMeal => {
    navigation.navigate('EditFood', {
      data: {
        mealName: mealName,
        foodMeal: foodMeal
      }
    });
  };
  return (
    <Pressable
      onPress={() => {
        if (foodMeal.isCustomFood) {
          setVisible(true);
        }
      }}
      style={styles.foodContainer}>
      <View style={styles.inforContainer}>
        <CheckBox checked={selected} onChange={onSelect} />
        <Image
          source={{uri: foodMeal.photo.thumb}}
          style={{width: 50, height: 50, borderRadius: 8}}
        />
        <View>
          <Text
            style={[
              styles.text,
              {
                color: 'black'
              }
            ]}>
            {foodMeal.foodName}
          </Text>
          <Text>
            {foodMeal.realQty} {foodMeal.realUnit || 'unit'}
          </Text>
        </View>
      </View>
      {!foodMeal.isCustomFood && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
          }}
          onPress={() => handleNavigateEditFood(foodMeal)}>
          <Text
            style={[
              styles.text,
              {
                color: 'green'
              }
            ]}>
            {foodMeal.realCalories * foodMeal.realQty}
          </Text>
          <AntDesign name="right" size={16} color="gray"></AntDesign>
        </TouchableOpacity>
      )}
      <UpdateFood
        visible={visible}
        mealName={mealName}
        food={foodMeal}
        onClose={() => setVisible(false)}></UpdateFood>
    </Pressable>
  );
};

import {ImageBackground, Modal, Pressable} from 'react-native';

import {useState} from 'react';
import CustomEditText from 'src/components/EditText';
import {updateFoodHistory} from 'src/services/firebase/database/meal-history';
import {useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
const UpdateFood = ({visible, mealName, food, onClose}) => {
  const {user} = useAppSelector(userSelector);
  const [newQty, setNewQty] = useState(food.realQty);
  const theme = useTheme();

  const handleUpdateFood = async () => {
    console.log('newQty', mealName, newQty);
    await updateFoodHistory({
      userId: user.uid,
      mealType: mealName.toLowerCase(),
      food: {...food, realQty: newQty}
    });
    onClose();
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={modalStyles.centeredView}>
        <Pressable style={modalStyles.modalView}>
          <View style={{borderRadius: 25, overflow: 'hidden'}}>
            <ImageBackground
              style={{
                width: 180,
                height: 180,
                backgroundColor: 'gray',
                borderRadius: 12
              }}
              resizeMode="cover"
              source={{
                uri: food.photo.thumb
              }}></ImageBackground>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <CustomEditText
              label={'Name'}
              placeholder={'Name'}
              value={food.foodName}
              style={{width: '60%', marginRight: 12}}
              editable={false}
            />
            <CustomEditText
              label={'Amount'}
              placeholder={''}
              value={newQty}
              style={{width: '40%'}}
              onChangeText={setNewQty}
              editable={true}
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
              value={food.realCalories}
              style={{width: '50%', marginRight: 12}}
              editable={false}
            />
            <CustomEditText
              afix={'g'}
              placeholder={'Protein'}
              label={'Protein'}
              value={food.realProtein}
              style={{width: '50%'}}
              editable={false}
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
              value={food.realCarbo}
              style={{width: '50%', marginRight: 12}}
              editable={false}
            />
            <CustomEditText
              afix={'g'}
              placeholder={'Fat'}
              label={'Fat'}
              value={food.realFat}
              style={{width: '50%'}}
              editable={false}
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
            onPress={handleUpdateFood}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Save</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
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

const styles = StyleSheet.create({
  foodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inforContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default FoodCard;
