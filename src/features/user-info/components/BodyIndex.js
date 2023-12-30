import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const BodyIndex = ({
  name,
  placerholder,
  inputMode,
  onNext,
  value,
  onChange,
  afix = ''
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{name}</Text>
      <TextInput
        mode="flat"
        underlineColor="orange"
        value={value}
        inputMode={inputMode}
        placeholder={placerholder}
        activeUnderlineColor="orange"
        onChangeText={onChange}
        style={styles.input}
        right={<TextInput.Affix textStyle={{color: 'black'}} text={afix} />}
      />
      <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
        <TouchableOpacity onPress={onNext} style={styles.btn}>
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BodyIndex;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  input: {
    fontSize: 32,
    backgroundColor: 'transparent'
  },
  question: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 12,
    color: 'black'
  },
  btn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    elevation: 2,
    backgroundColor: '#b5b5b5',

    marginRight: 20
  }
});
