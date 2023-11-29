import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

const TabButton = ({onButtonClick}) => {
  const onClick = index => {
    onButtonClick(index);
  };
  const buttons = ['Personal', 'Group', 'Plan'];
  return (
    <View
      style={{
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
      {buttons.map((button, index) => {
        return (
          <Button
            key={`das${index}`}
            style={styles.button}
            mode="contained"
            onPress={() => onClick(index)}>
            {button}
          </Button>
        );
      })}
    </View>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    borderWidth: 2,
    marginVertical: 12,
    borderColor: 'black',
    backgroundColor: 'black'
  }
});
