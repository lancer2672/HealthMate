import {CheckBox} from '@ui-kitten/components';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useAppDispatch, useAppSelector} from 'src/store/hooks';
// import {userSelector, foodMealSelector} from 'src/store/selectors';
// import {useSelector} from 'react-redux';

const FoodCard = ({mealName, selected, onSelect, foodMeal, navigation}) => {
  console.log('foodMeal17', foodMeal);
  
  const handleNavigateEditFood = foodMeal => {
    navigation.navigate('EditFood', {
      data: {
        mealName: mealName,
        foodMeal: foodMeal
      }
    });
  };
  return (
    <View style={styles.foodContainer}>
      <View style={styles.inforContainer}>
        <CheckBox checked={selected} onChange={onSelect} />
        <Image
          source={{uri: foodMeal.photo.thumb}}
          style={{width: 50, height: 50}}
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
            {foodMeal.realQty} {foodMeal.realUnit}
          </Text>
        </View>
      </View>
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
    </View>
  );
};

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
