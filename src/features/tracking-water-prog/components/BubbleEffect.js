import {StatusBar} from 'expo-status-bar';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useState, memo, useRef, useEffect, useLayoutEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
const dimension = Dimensions.get('window');

const WAVE_PHASE_HEIGHT = 32;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BubbleEffect = ({heightLimit = 0}) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const numBubbles = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numBubbles; i++) {
        const size = Math.random() * 24 + 10;
        const left = Math.random() * SCREEN_WIDTH;
        newBubbles.push({size, left});
      }

      setBubbles(newBubbles);
    };

    generateBubbles();

    const intervalId = setInterval(generateBubbles, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {bubbles.map((bubble, index) => (
        <Bubble
          key={index}
          size={bubble.size}
          left={bubble.left}
          heightLimit={heightLimit}
        />
      ))}
    </View>
  );
};

const Bubble = ({size, left, heightLimit}) => {
  const scaleAnim = useSharedValue(1);
  const translateY = useSharedValue(0);
  const bubbleEffectProps = useAnimatedProps(() => {
    return {
      transform: [
        {
          scale: scaleAnim.value
        },
        {
          translateY: translateY.value
        }
      ]
    };
  });

  const runBubbleEffect = () => {
    const animTime = size * 100;

    // abtract Menu Header Height
    let newYValue = Math.max(heightLimit - Math.random() * 140 - 20, 0);

    translateY.value = withRepeat(
      withTiming(
        -newYValue,
        {
          duration: animTime,
          easing: Easing.in(Easing.ease)
        },
        isFinished => {
          if (isFinished) {
          }
        }
      )
    );
    scaleAnim.value = withTiming(
      1.1,
      {
        duration: animTime
      },
      isFinished => {
        if (isFinished) {
          translateY.value = newYValue;
          scaleAnim.value = withTiming(0, {
            duration: 30,
            easing: Easing.in(Easing.ease)
          });
        }
      }
    );
  };

  useEffect(() => {
    runBubbleEffect();
  }, [heightLimit]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top: SCREEN_HEIGHT,
          left
          //   transform: [{translateX: left}]
        }
      ]}
      animatedProps={bubbleEffectProps}></Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    flex: 1,
    backgroundColor: 'tomato',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0,123,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0,123,255,1)',
    shadowColor: '#007BFF',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
});

export default BubbleEffect;
