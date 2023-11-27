import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
// import {SearchBar} from 'react-native-elements';
import {Searchbar} from 'react-native-paper';
import axios from 'axios';
import {APP_ID_NUTRITIONIX, API_KEY_NUTRITIONIX} from '@env';

const SearchInput = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [renderedTagIds, setRenderedTagIds] = useState([]);
  const [flatListHeight, setFlatListHeight] = useState(0);

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (searchText === '') return;
    else {
      try {
        const response = await axios.get(
          'https://trackapi.nutritionix.com/v2/search/instant?query=' +
            searchText,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-app-id': APP_ID_NUTRITIONIX,
              'x-app-key': API_KEY_NUTRITIONIX,
            },
          },
        );

        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching for food:', error);
      }
    }
  };

  const commonResults = Array.from(
    new Set(searchResults.common?.map(item => item.tag_id) ?? []),
  ).map(tagId => searchResults.common.find(item => item.tag_id === tagId));

  const renderSearchResult = ({item}) => {
    console.log('item', item);
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Image
          source={{uri: item.photo.thumb}}
          style={{width: 50, height: 50}}
        />
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <Text style={styles.itemName}>{item.food_name}</Text>
          <Text>{item.serving_unit}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search"
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearch}
        value={searchText}
        style={{
          size: 15,
          margin: 12,
          backgroundColor: 'white',
          borderColor: 'gray',
          borderWidth: 1.5,
        }}
        inputStyle={{
          backgroundColor: 'white',
          color: 'black',
          borderRadius: 25,
          borderColor: 'transparent',
          fontSize: 16,
        }}
      />
      {/* <View style={{backgroundColor: 'white', flex: 1}}>
        <Text>Common:</Text>
        <FlatList
          data={commonResults}
          keyExtractor={item => item.tag_id}
          renderItem={renderSearchResult}
          paddingBottom={20}
          showsVerticalScrollIndicator={true}
          initialNumToRender={15}
          windowSize={10}
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setFlatListHeight(height);
          }}
        />
        <Text>Branded:</Text>
      </View> */}
      <ScrollView
        style={{backgroundColor: 'white'}}
        showsVerticalScrollIndicator={true}>
        <Text style={styles.textHeading}>Common</Text>
        {commonResults.map((item, index) => (
          <View key={index} style={[styles.itemContainer, styles.itemCommon]}>
            <Image
              source={{uri: item.photo.thumb}}
              style={{width: 50, height: 50}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.itemName}>{item.food_name}</Text>
              <Text>{item.serving_unit}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.textHeading}>Branded</Text>
        {searchResults.branded?.map((item, index) => (
          <View key={index} style={[styles.itemContainer, styles.itemBranded]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <Image
                source={{uri: item.photo.thumb}}
                style={{width: 50, height: 50}}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '80%',
                }}>
                <Text style={styles.itemName}>{item.food_name}</Text>
                <Text>1 {item.serving_unit}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <Text style={{color: 'blue', fontWeight: 'bold'}}>
                {item.nf_calories}
              </Text>
              <Text>cal</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 12,
    paddingTop: 12,
  },
  itemContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    gap: 12,
  },
  itemCommon: {
    justifyContent: 'flex-start',
  },
  itemBranded: {
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default SearchInput;
