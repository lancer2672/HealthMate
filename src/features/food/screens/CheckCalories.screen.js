import {
  View,
  Text,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import SearchInput from '../components/SearchInput.component';

export default function CheckCalories() {
  return (
    <View style={{flex: 1}}>
      <SearchInput />
    </View>
  );
}
