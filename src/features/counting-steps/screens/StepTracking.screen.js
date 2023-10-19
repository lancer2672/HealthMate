import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
const StepTracking = () => {
  const readSampleData = async () => {
    // await requestPermission();
    console.log('readSampleData called');
    const date = new Date();
    // initialize the client
    const isInitialized = await initialize();
    console.log('isInitialized', isInitialized);

    // request permissions
    const grantedPermissions = await requestPermission([
      {accessType: 'read', recordType: 'ActiveCaloriesBurned'},
      {accessType: 'read', recordType: 'Distance'},
      {accessType: 'read', recordType: 'FloorsClimbed'},
      {accessType: 'read', recordType: 'Steps'},
    ]);
    console.log('grantedPermissions', grantedPermissions);

    const timeRangeFilter = {
      operator: 'between',
      startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    };

    const result = await readRecords('Steps', {timeRangeFilter});
    console.log('result', result);

    // {
    //   result: [
    //     {
    //       startTime: '2023-01-09T12:00:00.405Z',
    //       endTime: '2023-01-09T23:53:15.405Z',
    //       energy: {
    //         inCalories: 15000000,
    //         inJoules: 62760000.00989097,
    //         inKilojoules: 62760.00000989097,
    //         inKilocalories: 15000,
    //       },
    //       metadata: {
    //         id: '239a8cfd-990d-42fc-bffc-c494b829e8e1',
    //         lastModifiedTime: '2023-01-17T21:06:23.335Z',
    //         clientRecordId: null,
    //         dataOrigin: 'com.healthconnectexample',
    //         clientRecordVersion: 0,
    //         device: 0,
    //       },
    //     },
    //   ],
    // }
  };
  useEffect(() => {
    readSampleData();
  }, []);
  return (
    <View>
      <Text>StepTracking</Text>
    </View>
  );
};

export default StepTracking;

const styles = StyleSheet.create({});
