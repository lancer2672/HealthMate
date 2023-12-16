import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  setCurrentExercise,
  setDoExercise
} from 'src/store/reducer/exerciseSlice';

export const withBackButtonHandler = WrappedComponent => {
  const EnhancedComponent = props => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleNavigateBack = () => {
      navigation.navigate('ExerciseHome');
      dispatch(setCurrentExercise(null));
      dispatch(setDoExercise([]));
    };
    useEffect(() => {
      const handleBackButton = () => {
        Alert.alert(
          'Are you sure to quit?',
          '',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Quit', onPress: handleNavigateBack}
          ],
          {cancelable: false}
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton
      );

      return () => backHandler.remove();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return EnhancedComponent;
};
