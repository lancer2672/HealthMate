import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import {useTheme} from 'styled-components';

const TabButton = ({onButtonClick}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClick = index => {
    setSelectedIndex(index);
    onButtonClick(index);
  };
  const theme = useTheme();
  const buttons = ['Exercise', 'Plan'];
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
            style={[
              styles.button,
              {backgroundColor: selectedIndex == index ? theme.secondary : null}
            ]}
            mode="contained"
            textColor="black"
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
