import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {LIFE_STYLE} from 'src/constants';

const Lifestyle = ({onNext, value, onChange}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>What's your life style?</Text>
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() => {
            onChange(LIFE_STYLE.SEDENTARY);
          }}
          style={[
            styles.card,
            {
              backgroundColor:
                value === LIFE_STYLE.SEDENTARY ? '#d4d4d4' : 'white'
            }
          ]}>
          <Text style={styles.title}>Sedentary</Text>
          <Text style={styles.subtitle}>Little or no exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(LIFE_STYLE.LIGHTLY_ACTIVE);
          }}
          style={[
            styles.card,
            {
              backgroundColor:
                value === LIFE_STYLE.LIGHTLY_ACTIVE ? '#d4d4d4' : 'white'
            }
          ]}>
          <Text style={styles.title}>Lightly active</Text>
          <Text style={styles.subtitle}>
            Light exercise/sports 1-3 days/week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(LIFE_STYLE.MODERATELY_ACTIVE);
          }}
          style={[
            styles.card,
            {
              backgroundColor:
                value === LIFE_STYLE.MODERATELY_ACTIVE ? '#d4d4d4' : 'white'
            }
          ]}>
          <Text style={styles.title}>Moderately active</Text>
          <Text style={styles.subtitle}>
            Moderate exercise/sports 3-5 days/week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(LIFE_STYLE.VERY_ACTIVE);
          }}
          style={[
            styles.card,
            {
              backgroundColor:
                value === LIFE_STYLE.VERY_ACTIVE ? '#d4d4d4' : 'white'
            }
          ]}>
          <Text style={styles.title}>Very active</Text>
          <Text style={styles.subtitle}>
            Hard exercise/sports 6-7 days a week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onChange(LIFE_STYLE.EXTREMELY_ACTIVE);
          }}
          style={[
            styles.card,
            {
              backgroundColor:
                value === LIFE_STYLE.EXTREMELY_ACTIVE ? '#d4d4d4' : 'white'
            }
          ]}>
          <Text style={styles.title}>Extremely active</Text>
          <Text style={styles.subtitle}>
            Very hard exercise/sports & physical job or 2x training
          </Text>
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

export default Lifestyle;

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
