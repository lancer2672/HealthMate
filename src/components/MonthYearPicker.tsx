import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import Entypo from 'react-native-vector-icons/Entypo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SCREEN_WIDTH - 160;
const MonthYearPicker = ({selectedDate, onDateChange, textColor}) => {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [initialScrollIndex, setInitialScrollToIndex] = useState(false);
  const textcolor = textColor || 'white';
  useEffect(() => {
    setInitialScrollToIndex(selectedDate.getMonth());
  }, []);
  console.log('Month year picker selectedDate', selectedDate);
  const showPicker = useCallback(value => setShow(value), []);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate;

      showPicker(false);
      onDateChange(selectedDate);
    },
    [selectedDate, showPicker]
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
    'December'
  ];
  const onLeftClick = () => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1
    );
    onDateChange(newDate);
  };
  const onRightClick = () => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1
    );

    onDateChange(newDate);
  };

  useEffect(() => {
    console.log('Called', selectedDate);
    ref.current?.scrollToIndex({
      index: selectedDate.getMonth(),
      animated: true,
      viewPosition: 0
    });
  }, [selectedDate]);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH - 80
      }}>
      <TouchableOpacity style={{width: 30}} onPress={onLeftClick}>
        <Entypo name="chevron-left" size={32} color={textcolor}></Entypo>
      </TouchableOpacity>

      <View style={{width: SCREEN_WIDTH - 160}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={months}
          horizontal
          initialScrollIndex={selectedDate.getMonth()}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index
          })}
          pagingEnabled={true}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              ref.current?.scrollToIndex({
                index: info.index,
                animated: true
              });
            });
          }}
          ref={ref}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <MonthYearItem
              item={item}
              selectedYear={selectedDate.getFullYear()}
              onPress={showPicker}
              textcolor={textcolor}></MonthYearItem>
          )}
          keyExtractor={(item, index) => `month-picker-${index}`}
        />
      </View>
      <TouchableOpacity style={{width: 30}} onPress={onRightClick}>
        <Entypo name="chevron-right" size={32} color={textcolor}></Entypo>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          minimumDate={new Date(2020, 5)}
          maximumDate={new Date(2025, 5)}
        />
      )}
    </View>
  );
};

const MonthYearItem = ({onPress, item, selectedYear, textcolor}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: ITEM_WIDTH,
        // width: SCREEN_WIDTH,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text
        style={[
          styles.date,
          {
            color: textcolor
          }
        ]}>
        {item} {selectedYear}
      </Text>
    </TouchableOpacity>
  );
};
export default memo(MonthYearPicker);

const styles = StyleSheet.create({
  date: {textAlign: 'center', fontSize: 20, color: 'white', fontWeight: 'bold'}
});
