import {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {removeCustomFood} from 'src/services/firebase/database/custom-food';
import {useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import UpdateCustomFood from './UpdateCustomFood';

export default function FoodItem({food, setItemQty, isSelected, onSelect}) {
  const [amount, setAmount] = useState('1');
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const {user} = useAppSelector(userSelector);
  const handleDelFood = async () => {
    await removeCustomFood({userId: user.uid, food});
  };
  useEffect(() => {
    if (Number(amount) != NaN) {
      setItemQty(food, amount);
    }
  }, [amount]);
  return (
    <TouchableOpacity
      onLongPress={() => {
        setVisible(true);
      }}
      onPress={onSelect}
      style={[
        styles.container,
        {backgroundColor: isSelected ? theme.secondary : '#d9d7d7'}
      ]}>
      <Image style={styles.img} source={{uri: food.photo.thumb}}></Image>
      <View style={{paddingHorizontal: 12, flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.name, {flex: 1}]}>{food.foodName}</Text>
          <Text style={[styles.name, {fontSize: 16}]}>
            {food.realCalories} kcal
          </Text>
        </View>
        <Text style={styles.nutrient}>
          {food.realCarbo} g Carbs {food.realFat} g Fat {food.realProtein} g
          Prot
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={handleDelFood} style={{padding: 4}}>
          <Ionicons
            name="trash"
            size={24}
            color="tomato"
            style={{
              padding: 2
            }}
          />
        </TouchableOpacity>
        <TextInput
          value={amount}
          inputMode="numeric"
          onChangeText={setAmount}
          style={[
            styles.name,
            {
              backgroundColor: 'gray',
              textAlign: 'center',
              width: 40,
              padding: 0,
              borderRadius: 4,
              color: 'white',
              height: 40,
              alignSelf: 'center'
            }
          ]}></TextInput>
      </View>
      <UpdateCustomFood
        visible={visible}
        food={food}
        onClose={() => {
          setVisible(false);
        }}></UpdateCustomFood>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#d9d7d7',
    borderRadius: 12,
    margin: 6
    // alignItems: 'center'
  },
  nutrient: {
    color: '#4f4d4d',
    fontSize: 15
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 12
  }
});
