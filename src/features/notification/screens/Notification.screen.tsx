import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import NotificationItem from '../components/NotificationItem';

const Notification = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderBottomWidth: 2
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4
          }}>
          <AntDesign name="arrowleft" size={24} color={'black'} />
        </TouchableOpacity>
        <Text>Notification</Text>
      </View>
      <View>
        <FlatList
          data={[]}
          keyExtractor={(item, index) => item._id}
          renderItem={({item}) => <NotificationItem notification={item} />}
        />
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({});
