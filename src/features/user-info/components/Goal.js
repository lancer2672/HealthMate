import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GOAL} from 'src/constants';

const Goal = ({onNext, value, onChange}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>What's your goal</Text>
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() => {
            onChange(GOAL.FITTER);
          }}
          style={[
            styles.card,
            {backgroundColor: value === GOAL.FITTER ? '#d4d4d4' : 'white'}
          ]}>
          <Text style={styles.title}>Get fitter</Text>
          <Text style={styles.subtitle}>Tone up & feel healthy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(GOAL.FIT);
          }}
          style={[
            styles.card,
            {backgroundColor: value === GOAL.FIT ? '#d4d4d4' : 'white'}
          ]}>
          <Text style={styles.title}>Keep fit</Text>
          <Text style={styles.subtitle}>Maintain a healthy lifestyle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(GOAL.LOSE_WEIGHT);
          }}
          style={[
            styles.card,
            {backgroundColor: value === GOAL.LOSE_WEIGHT ? '#d4d4d4' : 'white'}
          ]}>
          <Text style={styles.title}>Lose weight</Text>
          <Text style={styles.subtitle}>Get motivated & energized</Text>
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

export default Goal;

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
    marginVertical: 12,
    marginHorizontal: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  textContainer: {
    width: '100%'
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
