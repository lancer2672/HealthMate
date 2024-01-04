import {CheckBox} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {setHistoryMeal} from 'src/services/firebase/database/meal-history';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import FoodCard from './FoodCard.component';

const ListFood = ({mealName, foodMeal, handleNavigateSeacrch, navigation}) => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const {user} = useSelector(userSelector);
  const handleSelectItem = item => {
    if (checkSelected(item)) {
      setSelectedItems(selectedItems.filter(i => i.tag_id !== item.tag_id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  console.log('foodMeal', {mealName, foodMeal});
  const [checked, setChecked] = useState(false);
  const theme = useTheme();
  const getTotalCalories = () => {
    let total = 0;
    foodMeal.forEach(item => {
      total += item.realCalories;
    });
    setTotalCalories(total);
  };
  const handleParentSelectItem = item => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const checkSelected = item => {
    const isExist = selectedItems.find(i => i.tag_id === item.tag_id);
    return !!isExist;
  };
  const handleSaveFoodHistory = async () => {
    const newMeal = foodMeal.map(t => {
      const find = selectedItems.findIndex(i => i.tag_id === t.tag_id);
      return find >= 0
        ? {
            ...t,
            isDone: true
          }
        : {...t, isDone: false};
    });

    console.log('handleSaveFoodHistory', foodMeal, newMeal);
    await setHistoryMeal({
      userId: user.uid,
      meal: newMeal,
      mealType: mealName.toLowerCase()
    });
  };
  const countTotalCalorie = () => {
    return foodMeal.reduce((acc, i) => {
      return acc + i.realCalories * i.realQty;
    }, 0);
  };
  useEffect(() => {
    if (selectedItems) {
      handleSaveFoodHistory();
    }
  }, [selectedItems, foodMeal]);
  useEffect(() => {
    setSelectedItems(foodMeal.map(t => t.isDone));
  }, []);
  useEffect(() => {
    getTotalCalories();
  });
  return (
    <View style={styles.mealContainer}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: 'gray',
          padding: 5,
          paddingLeft: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 10,
          backgroundColor: '#e8e6e6'
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          <CheckBox
            style={{padding: 10, borderRadius: 24}}
            onChange={isChecked => {
              setChecked(isChecked);
              setSelectedItems(isChecked ? foodMeal : []);
            }}
            checked={checked}
          />
          <Text style={styles.mealName}>{mealName}</Text>
          <TouchableOpacity
            style={{padding: 3}}
            onPress={handleNavigateSeacrch}>
            <AntDesign
              name="pluscircle"
              size={16}
              color={theme.secondary}></AntDesign>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.mealName}>{countTotalCalorie()}</Text>
        </View>
      </View>
      <View
        style={{
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        {foodMeal.length > 0 ? (
          <View>
            {/* <FlatList
              data={foodMeal}
              renderItem={({item}) => <FoodCard foodMeal={item} />}
              keyExtractor={item => item.id}
            /> */}
            {foodMeal.map(item => (
              <FoodCard
                key={item.id}
                mealName={mealName}
                foodMeal={item}
                navigation={navigation}
                selected={checkSelected(item)}
                onSelect={() => handleSelectItem(item)}
              />
            ))}
          </View>
        ) : (
          <Text>No foods logged yet</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    flexDirection: 'column',
    paddingBottom: 10
    // margin: 10,
    // borderBottomWidth: 1,
    // borderColor: 'blue'
  },
  mealName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default ListFood;
