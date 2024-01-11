import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {observeCustomFood} from 'src/services/firebase/database/custom-food';
import {addFoodToHistory} from 'src/services/firebase/database/meal-history';
import {useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import FoodItem from '../components/FoodItem.component';
import ListBrandedFood from '../components/ListBrandedFood.component';
import ListCommonFood from '../components/ListCommonFood.component';
import SearchInput from '../components/SearchInput.component';

const Tab = createMaterialTopTabNavigator();

export default function SearchFood({route, navigation}) {
  const {currentDate, mealName = 'breakfast'} = route.params.data;
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log('currentDate', currentDate);
    setSearchResults([]);
    setShowResults(false);
  }, []);

  const handleSetSearchResults = data => {
    setSearchResults(data);
    setShowResults(true);
  };

  const ResetData = () => {
    setSearchResults([]);
    setShowResults(false);
  };

  const commonResults = Array.from(
    new Set(searchResults.common?.map(item => item.tag_id) ?? [])
  ).map(tagId => searchResults.common.find(item => item.tag_id === tagId));

  const handleNavigateLogFood = item => {
    navigation.pop();
    navigation.navigate('LogFood', {
      data: {
        date: currentDate,
        mealName: mealName,
        item: item,
        type: 'common'
      }
    });
  };

  return (
    <>
      <SearchInput handleSetSearchResults={handleSetSearchResults} />
      {showResults ? (
        <Tab.Navigator>
          <Tab.Screen name="All">
            {() => (
              <ScrollView
                style={{backgroundColor: 'white'}}
                showsVerticalScrollIndicator={true}>
                {Array.isArray(commonResults) && commonResults.length > 0 ? (
                  <>
                    <Text style={styles.textHeading}>Common</Text>
                    <ListCommonFood
                      date={currentDate}
                      mealName={mealName}
                      searchResults={searchResults}
                      navigation={navigation}
                    />
                  </>
                ) : null}
                {Array.isArray(searchResults.branded) &&
                searchResults.branded.length > 0 ? (
                  <>
                    <Text style={styles.textHeading}>Branded</Text>
                    <ListBrandedFood
                      date={currentDate}
                      mealName={mealName}
                      searchResults={searchResults}
                      navigation={navigation}
                    />
                  </>
                ) : null}
              </ScrollView>
            )}
          </Tab.Screen>
          <Tab.Screen name="Common">
            {() => (
              <ScrollView>
                <ListCommonFood
                  date={currentDate}
                  mealName={mealName}
                  searchResults={searchResults}
                  navigation={navigation}
                />
              </ScrollView>
            )}
          </Tab.Screen>
          <Tab.Screen name="Branded">
            {() => (
              <ScrollView>
                <ListBrandedFood
                  date={currentDate}
                  mealName={mealName}
                  searchResults={searchResults}
                  navigation={navigation}
                />
              </ScrollView>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <UserCustomFoods mealName={mealName} />
      )}
    </>
  );
}

const UserCustomFoods = ({mealName}) => {
  const [customFoods, setCustomFoods] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const {user} = useAppSelector(userSelector);
  const theme = useTheme();
  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
      observeCustomFood(user.uid, setCustomFoods);
    }
  }, [user]);

  const goBack = () => {
    navigation.goBack();
  };
  const toggleSelectedItem = item => {
    if (selectedItems.includes(item.tag_id)) {
      setSelectedItems(selectedItems.filter(id => id !== item.tag_id));
    } else {
      setSelectedItems([...selectedItems, item.tag_id]);
    }
  };
  const setItemQty = (item, qty) => {
    const newCustomFoods = customFoods.map(t => {
      if (t.tag_id == item.tag_id) {
        return {...t, realQty: qty};
      }
      return t;
    });
    setCustomFoods(newCustomFoods);
  };
  const addFoodToTodayMeal = async () => {
    if (selectedItems.length >= 0) {
      const selectedFoods = customFoods.filter(t =>
        selectedItems.includes(t.tag_id)
      );

      await Promise.all(
        selectedFoods.map(food => {
          return addFoodToHistory({mealType: mealName, userId: user.uid, food});
        })
      );
      goBack();
    }
  };
  console.log('custom fods', customFoods);
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={customFoods}
        renderItem={({item, index}) => (
          <FoodItem
            setItemQty={setItemQty}
            isSelected={selectedItems.includes(item.tag_id)}
            food={item}
            onSelect={() => toggleSelectedItem(item)}
          />
        )}
        keyExtractor={item => `${item.name}plan`}
      />
      <TouchableOpacity
        style={{
          alignSelf: 'flex-end',
          padding: 12,
          paddingHorizontal: 40,
          margin: 20,
          borderRadius: 12,
          backgroundColor: theme.secondary
        }}
        onPress={addFoodToTodayMeal}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  textHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingTop: 12
  }
});
