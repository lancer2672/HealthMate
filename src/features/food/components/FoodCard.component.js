import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import RNPickerSelect from 'react-native-picker-select';

const FoodCard = ({data, onDelete}) => {
  const getAltMeasures = item => {
    return item.alt_measures.map(item => ({
      label: item.measure,
      value: item.measure
    }));
  };

  const renderItem = (rowData, rowMap) => {
    const item = rowData.item;
    return (
      <View style={styles.cardContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
          }}>
          <Image
            source={{uri: item.photo.thumb}}
            style={{width: 50, height: 50}}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10
              }}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={item.serving_qty.toString()} // Đảm bảo giá trị là một chuỗi
                onChangeText={text => {
                  // Kiểm tra xem người dùng đã nhập một giá trị hợp lệ chưa
                  // Nếu bạn muốn thực hiện các xử lý khác sau khi giá trị thay đổi, bạn có thể thêm vào đây
                }}
              />
              <RNPickerSelect
                items={getAltMeasures(item)}
                style={{
                  inputAndroid: {
                    justifyContent: 'center',
                    width: 180,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderWidth: 5,
                    borderColor: 'purple',
                    borderRadius: 8,
                    backgroundColor: 'lightgrey',
                    color: 'black'
                  }
                }}
                value={item.serving_unit}
                onValueChange={value => {
                  // Xử lý sự kiện thay đổi với giá trị `value`
                }}
              />
            </View>
            <Text style={{fontSize: 16, color: 'black'}}>{item.food_name}</Text>
          </View>
          <TouchableOpacity>
            <AntDesign name="infocirlce" size={18} color="black"></AntDesign>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
          <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
            {item.nf_calories}
          </Text>
          <Text>cal</Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (rowData, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(rowData.item)}>
        <Text style={{color: 'white'}}>
          <MaterialCommunityIcons name="delete" color="white" size={24} />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={data}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      disableRightSwipe={true}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'white'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 40,
    fontSize: 16,
    textAlign: 'center'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 10
  },
  deleteButton: {
    width: 75,
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FoodCard;
