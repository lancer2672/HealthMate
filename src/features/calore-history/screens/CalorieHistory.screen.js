import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CollapsibleTag from 'src/components/CollapsibleTag';
import {getHistoryCalorieByDate} from 'src/services/firebase/database/calorie-history';
import {getHistoryMealByDate} from 'src/services/firebase/database/meal-history';
import {useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import CalorieHistoryChart from '../components/Chart';
const SCREEN_WIDTH = Dimensions.get('window').width;
const CalorieRecordHistory = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {user} = useAppSelector(userSelector);
  const theme = useTheme();
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={{paddingBottom: 2}}>
        <View style={[styles.header, {backgroundColor: theme.secondary}]}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Statistic</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={{
            marginVertical: 12,
            alignSelf: 'center',
            flexDirection: 'row'
          }}>
          <Text style={[styles.date]}>Statistics date </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.date, {color: theme.secondary, opacity: 0.8}]}>
              {format(selectedDate, 'dd-MM-yyyy')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, backgroundColor: 'tomato'}}>
          <CalorieHistoryChart
            selectedDate={selectedDate}></CalorieHistoryChart>
        </View>
        <View style={{flex: 1}}>
          <DetailRecord selectedDate={selectedDate}></DetailRecord>
        </View>
      </View>
      <DatePicker
        mode="date"
        date={selectedDate}
        modal
        open={showDatePicker}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onConfirm={date => {
          console.log('Date', date);
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default CalorieRecordHistory;

const ENUM_NUTRIENT_NAME = {
  realCalories: 'Average Calories',
  realCarbo: 'Average Carbs',
  realFat: 'Average Fat',
  realProtein: 'Average Protein'
};
const DetailRecord = ({selectedDate}) => {
  const [data, setData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const {user} = useAppSelector(userSelector);
  const mapData = history => {
    if (!history.nutrient) {
      setData(null);
    }
    const mappedData = [];
    for (const [key, value] of Object.entries(history.nutrient)) {
      const item = {
        name: ENUM_NUTRIENT_NAME[key],
        total: value.total
      };
      mappedData.push(item);
    }

    setData(mappedData);
  };
  const getUserActivityHistory = history => {
    console.log('getUserActivityHistory', history);
    if (!history.stepCalorie) return;
    setActivityData([{name: 'Walking', calorie: history.stepCalorie}]);
  };
  const mapMealData = mealHistory => {
    const food = [];
    for (const [mealType, value] of Object.entries(mealHistory)) {
      food.push(...value);
    }
    setFoodData(food);
    console.log('mapMealData', food);
  };
  useEffect(() => {
    if (user) {
      (async () => {
        const history = await getHistoryCalorieByDate({
          userId: user.uid,
          date: selectedDate
        });
        if (history) {
          mapData(history);
          getUserActivityHistory(history);
        }

        const mealHistory = await getHistoryMealByDate({
          userId: user.uid,
          date: selectedDate
        });
        if (mealHistory) {
          mapMealData(mealHistory);
        }
      })();
    }
  }, [user, selectedDate]);
  return (
    <ScrollView style={{flex: 1, padding: 6}}>
      <View style={{marginVertical: 8}}></View>

      <CollapsibleTag
        title={'Activity'}
        titleStyle={{color: 'black', fontWeight: '400'}}>
        <View
          style={{
            backgroundColor: 'tomato',
            borderRadius: 12,
            marginLeft: 6
          }}>
          {activityData?.map((item, i) => {
            return (
              <View style={{width: SCREEN_WIDTH - 24}} key={`${i}1243`}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 12
                  }}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text
                    style={[
                      styles.text,
                      {textAlign: 'right', marginRight: 12}
                    ]}>
                    {item.calorie} kcal
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </CollapsibleTag>
      <View style={{marginVertical: 8}}></View>

      <CollapsibleTag
        title={'Food'}
        titleStyle={{color: 'black', fontWeight: '400'}}>
        <View
          style={{
            backgroundColor: 'tomato',
            borderRadius: 12,
            marginLeft: 6
          }}>
          {foodData?.map((item, i) => {
            return (
              <View style={{width: SCREEN_WIDTH - 24}} key={`${i}1243`}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 12
                  }}>
                  <Text style={styles.text}>
                    {item.foodName} (
                    {(item.realCalories * item.realQty).toFixed(0)} kcal)
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {textAlign: 'right', marginRight: 12}
                    ]}>
                    {item.realQty} unit
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </CollapsibleTag>

      {data == null && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: '500', fontSize: 18}}>No data</Text>
        </View>
      )}
      <View style={{marginVertical: 8}}></View>

      {data?.map((item, i) => {
        return (
          <View key={`${i}123`}>
            <View style={styles.separator}></View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 12
              }}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={[styles.text, {textAlign: 'right'}]}>
                {item.total} g
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 16,
    color: 'black'
  },
  modalHeading: {
    textAlign: 'left',
    marginLeft: 12,
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 4,
    color: 'black'
  },
  date: {fontWeight: '500', color: 'black', fontSize: 18},
  separator: {
    backgroundColor: 'gray',
    opacity: 0.2,
    height: 1
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
    // width: '100%',
  },
  body: {
    flex: 1
  }
});
