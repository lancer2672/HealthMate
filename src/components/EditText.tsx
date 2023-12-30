import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';

const CustomEditText = ({
  style,
  label,
  defaultValue,
  value,
  inputMode,
  afix,
  onChangeText = null,
  onPress = null,
  editable = true
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.defaultStyle, style]}>
      <Text style={styles.label}>{label}</Text>
      <View pointerEvents={editable ? 'auto' : 'none'}>
        <TextInput
          inputMode={inputMode}
          onChangeText={onChangeText}
          editable={editable}
          value={value}
          numberOfLines={1}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={[styles.input]}
          right={<TextInput.Affix textStyle={{color: 'black'}} text={afix} />}
          defaultValue={defaultValue}></TextInput>
      </View>
    </Pressable>
  );
};

export default CustomEditText;

const styles = StyleSheet.create({
  defaultStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,
    marginVertical: 8,
    paddingHorizontal: 8
  },
  label: {
    marginTop: 2,
    marginLeft: 8,
    color: 'gray'
  },
  input: {
    marginBottom: 4,
    fontSize: 18,
    padding: 0,
    backgroundColor: 'transparent',
    fontWeight: '500'
  }
});
