import {StyleSheet, Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const NutrientTag = ({nutrient, absorb, total, background, bgCircle}) => {
  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <View style={[styles.circleContainer]}>
        <AnimatedCircularProgress
          size={40}
          rotation={'-45deg'}
          width={6}
          fill={total === 0 ? 0 : (absorb / total) * 100}
          tintColor={bgCircle}
          backgroundColor={'white'}>
          {/* {fill => (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.step}>{steps}</Text>
            <Text style={{color: 'white', fontSize: 18}}>
              {stepTarget === 0 ? 'steps' : `of ${stepTarget} steps`}
            </Text>
          </View>
        )} */}
        </AnimatedCircularProgress>
      </View>
      <Text style={styles.title}>{nutrient}</Text>
      <Text style={styles.subTitle}>
        {absorb.toFixed(2)}/{total.toFixed(2)} g
      </Text>
    </View>
  );
};

export default NutrientTag;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    marginBottom: 12,
    padding: 2,
    alignItems: 'center'
  },
  circleContainer: {
    width: 50,
    height: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  subTitle: {
    color: 'black',
    fontSize: 16,
    width: '100%',
    textAlign: 'center'
  }
});
