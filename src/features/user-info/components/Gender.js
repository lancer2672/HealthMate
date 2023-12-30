import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import {GENDER} from 'src/constants';

const Gender = ({onNext, value, onChange}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>What's your gender</Text>
      <View style={styles.subContainer}>
        <TouchableOpacity
          onPress={() => {
            onChange(GENDER.MALE);
          }}
          style={[
            styles.card,
            {backgroundColor: value === GENDER.MALE ? '#d4d4d4' : 'white'}
          ]}>
          <Foundation name="male-symbol" size={40} color="#0000FF" />
          <Text style={styles.title}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(GENDER.FEMALE);
          }}
          style={[
            styles.card,
            {backgroundColor: value === GENDER.FEMALE ? '#d4d4d4' : 'white'}
          ]}>
          <Foundation name="female-symbol" size={40} color="#FFC0CB" />
          <Text style={styles.title}>Female</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{marginTop: 'auto', justifyContent: 'flex-end', width: '100%'}}>
        <TouchableOpacity onPress={onNext} style={styles.btn}>
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Gender;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  question: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 12,
    color: 'black'
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  subtitle: {
    color: 'black',

    color: '#6c757d' // Bootstrap's secondary color for a lighter, muted color
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
