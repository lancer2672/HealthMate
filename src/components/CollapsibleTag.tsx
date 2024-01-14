import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';

const CollapsibleTag = ({children, title, titleStyle}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const rotateDegreeAnim = useSharedValue(0);
  const contentHeightAnim = useSharedValue(0);

  const onToggleShowContentVisible = () => {
    console.log('clicked');
    setIsContentVisible(!isContentVisible);
  };

  const animatedStyles = useAnimatedStyle(() => {
    rotateDegreeAnim.value = withTiming(isContentVisible ? 180 : 0);
    return {
      transform: [{rotate: `${rotateDegreeAnim.value}deg`}]
    };
  }, [isContentVisible]);

  const contentAnimatedStyles = useAnimatedStyle(() => {
    contentHeightAnim.value = withTiming(isContentVisible ? contentHeight : 0);
    return {
      height: contentHeightAnim.value
    };
  }, [isContentVisible, contentHeight]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onToggleShowContentVisible} style={styles.header}>
        <Text style={[styles.heading, titleStyle]} numberOfLines={2}>
          {title}
        </Text>
        <Animated.View style={[animatedStyles]}>
          <Entypo name="chevron-up" size={24} color="black" />
        </Animated.View>
      </Pressable>
      <Animated.View style={[{overflow: 'hidden'}, contentAnimatedStyles]}>
        <View
          style={{position: 'absolute', paddingTop: 12}}
          onLayout={event => {
            const height = event.nativeEvent.layout.height;
            if (height > 0 && contentHeight !== height) {
              setContentHeight(height);
            }
            console.log('height', height);
          }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
export default CollapsibleTag;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  heading: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  content: {
    position: 'absolute'
  }
});
