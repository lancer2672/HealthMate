import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';
import React, {useState} from 'react';
import SearchInput from '../components/SearchInput.component';
import ListCommonFood from '../components/ListCommonFood.component';
import ListBrandedFood from '../components/ListBrandedFood.component';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function SearchFood({route, navigation}) {
  const {currentDate, mealName = 'breakfast'} = route.params.data;
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  console.log('mealName', mealName);
  console.log('currentDate', currentDate);

  const handleSetSearchResults = data => {
    setSearchResults(data);
    setShowResults(true);
  };

  const commonResults = Array.from(
    new Set(searchResults.common?.map(item => item.tag_id) ?? [])
  ).map(tagId => searchResults.common.find(item => item.tag_id === tagId));
  return (
    <>
      <SearchInput handleSetSearchResults={handleSetSearchResults} />
      {showResults ? (
        // <NavigationContainer>
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
      ) : // </NavigationContainer>
      null}
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
