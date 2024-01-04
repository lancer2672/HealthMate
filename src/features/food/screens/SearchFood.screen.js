import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
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
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingTop: 12
  }
});
