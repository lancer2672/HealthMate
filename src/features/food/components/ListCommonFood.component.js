import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {capitalizeFirstLetter} from 'src/utils/tranformData';

const ListCommonFood = ({date, mealName, searchResults, navigation}) => {
  const commonResults = Array.from(
    new Set(searchResults.common?.map(item => item.tag_id) ?? [])
  )
    .map(tagId => searchResults.common.find(item => item.tag_id === tagId))
    .map(i => {
      return {
        ...i,
        food_name: capitalizeFirstLetter(i.food_name)
      };
    });

  const handleNavigateLogFood = item => {
    console.log('date', date);
    navigation.pop();
    navigation.navigate('LogFood', {
      data: {
        date: date,
        mealName: mealName,
        item: item,
        type: 'common'
      }
    });
  };
  console.log('commonResults', commonResults);
  return (
    <>
      {commonResults.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemContainer, styles.itemCommon]}
          onPress={() => {
            handleNavigateLogFood(item);
          }}>
          <Image
            source={{uri: item.photo.thumb}}
            style={{width: 50, height: 50}}
          />
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.itemName}>{item.food_name}</Text>
            <Text>{item.serving_unit}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    gap: 12
  },
  itemCommon: {
    justifyContent: 'flex-start'
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default ListCommonFood;
