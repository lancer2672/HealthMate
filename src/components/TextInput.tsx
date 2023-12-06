import React, {memo, useState, forwardRef} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {TextInput} from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const InputText = forwardRef(
  ({keyboardType, onChangeText, placeholder, value}, ref) => {
    return (
      <TextInput
        mode="outlined"
        outlineStyle={{
          borderRadius: 0,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          marginHorizontal: 20
        }}
        contentStyle={{
          margin: 0
        }}
        placeholderTextColor={'black'}
        textColor={'black'}
        style={styles.textInput}
        value={value}
        keyboardType={keyboardType ?? 'default'}
        onChangeText={onChangeText}
        placeholder={placeholder}></TextInput>
    );
  }
);

export default InputText;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 8,
    width: SCREEN_WIDTH - 32,
    fontSize: 14,
    padding: 0,
    color: 'black'
  }
});
