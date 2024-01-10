import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';

const CustomEditText = ({
  style,
  label,
  defaultValue,
  value,
  inputMode,
  afix,
  placeholder,
  onChangeText = null,
  onPress = null,
  editable = true
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.defaultStyle, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View pointerEvents={editable ? 'auto' : 'none'}>
        <TextInput
          placeholderTextColor={'gray'}
          inputMode={inputMode}
          onChangeText={onChangeText}
          editable={editable}
          value={value}
          placeholder={placeholder}
          numberOfLines={1}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={[styles.input]}
          right={
            afix ? (
              <TextInput.Affix textStyle={{color: 'black'}} text={afix} />
            ) : null
          }
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
    paddingHorizontal: 6
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
