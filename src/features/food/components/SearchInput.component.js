import {API_KEY_NUTRITIONIX, APP_ID_NUTRITIONIX} from '@env';
import axios from 'axios';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {capitalizeFirstLetter} from 'src/utils/tranformData';

const SearchInput = ({handleSetSearchResults}) => {
  const [searchText, setSearchText] = useState('');

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (searchText === '') {
      console.log('Search text is empty');
      handleSetSearchResults([]);
      return;
    } else {
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
        console.log('handleSetSearchResults', response.data);
        handleSetSearchResults({
          ...response.data,
          common: response.data.common.map(t => ({
            ...t,
            tag_name: capitalizeFirstLetter(t.tag_name)
          }))
        });
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
