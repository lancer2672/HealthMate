import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

const TabButton = ({onButtonClick}) => {
  const onClick = index => {
    onButtonClick(index);
  };
  const buttons = ['Exercise', 'Group', 'Plan'];
  return (
    <View
      style={{
        paddingHorizontal: 4,
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
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 12,
    flex: 1,
    // minWidth: 100,
    marginHorizontal: 6,
    borderColor: '#f27638',
    backgroundColor: '#f27638'
  }
});
