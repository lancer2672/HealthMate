import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import axios from 'axios';
import {APP_ID_NUTRITIONIX, API_KEY_NUTRITIONIX} from '@env';

const SearchInput = ({handleSetSearchResults}) => {
  const [searchText, setSearchText] = useState('');

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
              'x-app-key': API_KEY_NUTRITIONIX
            }
          }
        );
        handleSetSearchResults(response.data);
      } catch (error) {
        console.error('Error searching for food:', error);
      }
    }
  };

  // const commonResults = Array.from(
  //   new Set(searchResults.common?.map(item => item.tag_id) ?? [])
  // ).map(tagId => searchResults.common.find(item => item.tag_id === tagId));

  return (
    <View style={{backgroundColor: 'white'}}>
      <View>
        <Searchbar
          placeholder="Search foods to log"
          onChangeText={text => setSearchText(text)}
          onSubmitEditing={handleSearch}
          value={searchText}
          style={{
            margin: 8,
            backgroundColor: 'white',
            borderColor: 'gray',
            borderWidth: 1.5
          }}
          inputStyle={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 25,
            borderColor: 'transparent',
            fontSize: 16
          }}
          autoFocus={true}
        />
      </View>
      {/*  */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default SearchInput;
