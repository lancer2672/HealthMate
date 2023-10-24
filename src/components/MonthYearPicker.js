import {
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MonthPicker from 'react-native-month-year-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MonthYearPicker = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}) => {
  const ref = useRef();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [initialScrollIndex, setInitialScrollToIndex] = useState(false);
  useEffect(() => {
    setInitialScrollToIndex(selectedMonth);
  }, []);
  const showPicker = useCallback(value => setShow(value), []);
  console.log('Date', date);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    },
    [date, showPicker],
  );

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const onLeftClick = () => {
    let newMonth = selectedMonth - 1;
    if (newMonth < 0) {
      newMonth = 11;

      setSelectedYear(selectedYear - 1);
    }
    setSelectedMonth(newMonth);
  };
  const onRightClick = () => {
    let newMonth = selectedMonth + 1;
    if (newMonth > 11) {
      newMonth = 0;

      setSelectedYear(selectedYear + 1);
    }
    setSelectedMonth(newMonth);
  };

  useEffect(() => {
    ref.current?.scrollToIndex({
      index: selectedMonth,
      animated: true,
      viewPosition: 0.5,
    });
  }, [selectedMonth]);
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity style={{width: 30}} onPress={onLeftClick}>
        <Entypo name="chevron-left" size={32} color="white"></Entypo>
      </TouchableOpacity>

      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={months}
          horizontal
          pagingEnabled={true}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              ref.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          ref={ref}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={showPicker}
              style={{
                width: SCREEN_WIDTH - 80,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.date}>
                {item} {selectedYear}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `month-picker-${index}`}
        />
      </View>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 5)}
          locale="ko"
        />
      )}
      <TouchableOpacity style={{width: 30}} onPress={onRightClick}>
        <Entypo name="chevron-right" size={32} color="white"></Entypo>
      </TouchableOpacity>
    </View>
  );
};

export default MonthYearPicker;

const styles = StyleSheet.create({
  date: {textAlign: 'center', fontSize: 20, color: 'white', fontWeight: 'bold'},
});
