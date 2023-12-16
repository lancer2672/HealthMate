import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';

const NutriFact = ({foodMeal}) => {
  console.log('foodMeal12', foodMeal);
  const [factor, setFactor] = useState(
    foodMeal.realGrams / foodMeal.serving_weight_grams
  );

  const getValue = id => {
    let foundValue = 0;
    foodMeal.full_nutrients.forEach(item => {
      if (item.attr_id === id) {
        foundValue = item.value;
      }
    });
    return foundValue;
  };

  console.log('factor', factor);
  return (
    <View style={{alignItems: 'center'}}>
      <View style={styles.container}>
        <View
          style={{
            borderBottomWidth: 13,
            borderColor: 'black',
            width: '100%'
          }}>
          <Text style={{fontSize: 30, fontWeight: '900', color: 'black'}}>
            Nutrition Facts
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 6,
            borderColor: 'black',
            width: '100%'
          }}>
          <Text style={{fontSize: 15, fontWeight: '900', color: 'black'}}>
            Amount Per Serving
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 25, fontWeight: '900', color: 'black'}}>
              Calories
            </Text>
            <Text style={{fontSize: 25, fontWeight: '900', color: 'black'}}>
              {(foodMeal.nf_calories * factor).toFixed(1)}
            </Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Total Fat</Text>
          <Text style={styles.detailText}>
            {(foodMeal.nf_total_fat * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Saturated Fat</Text>
          <Text style={styles.detailText}>
            {(getValue(606) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Polyunsaturated Fat</Text>
          <Text style={styles.detailText}>
            {(getValue(646) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Monounsaturated Fat</Text>
          <Text style={styles.detailText}>
            {(getValue(645) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Cholesterol</Text>
          <Text style={styles.detailText}>
            {(getValue(601) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sodium</Text>
          <Text style={styles.detailText}>
            {(getValue(307) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Total Carbohydrates</Text>
          <Text style={styles.detailText}>
            {(getValue(205) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Dietary Fiber</Text>
          <Text style={styles.detailText}>
            {(getValue(291) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Sugars</Text>
          <Text style={styles.detailText}>
            {(getValue(269) * factor).toFixed(1)}g
          </Text>
        </View>
        <View
          style={[
            styles.titleContainer,
            {
              borderBottomWidth: 10,
              borderColor: 'black'
            }
          ]}>
          <Text style={styles.titleText}>Portein</Text>
          <Text style={styles.detailText}>
            {(getValue(203) * factor).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.detailText}>Vitamin D</Text>
          <Text style={styles.detailText}>
            {(getValue(324) * factor).toFixed(1)}IU
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.detailText}>Calcium</Text>
          <Text style={styles.detailText}>
            {(getValue(301) * factor).toFixed(1)}mg
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.detailText}>Iron</Text>
          <Text style={styles.detailText}>
            {(getValue(303) * factor).toFixed(1)}mg
          </Text>
        </View>
        <View
          style={[
            styles.titleContainer,
            {
              borderBottomWidth: 10,
              borderColor: 'black'
            }
          ]}>
          <Text style={styles.detailText}>Potassium</Text>
          <Text style={styles.detailText}>
            {(getValue(306) * factor).toFixed(1)}mg
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Caffeine</Text>
          <Text style={styles.detailText}>
            {(getValue(262) * factor).toFixed(1)}g
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 20
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: 'black'
  },
  detailContainer: {
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailText: {
    fontSize: 15,
    color: 'black'
  }
});

export default NutriFact;
