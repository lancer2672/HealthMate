import {Text, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
const Timer = ({onChange, value, onEnd, isPlaying, textStyle = {}}) => {
  const [time, setTime] = useState(value);
  useEffect(() => {
    if (time > 0 && isPlaying) {
      const timerId = setTimeout(() => {
        setTime(time - 1);
        onChange(time - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    if (time == 0) {
      onEnd();
    }
  }, [time, isPlaying]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  useEffect(() => {
    setTime(() => value);
  }, [value]);
  return (
    <View>
      <Text
        style={[
          {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#5c8973'
          },
          textStyle
        ]}>
        {formatTime(time)}
      </Text>
    </View>
  );
};

export default Timer;
