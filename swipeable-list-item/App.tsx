import React from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const ACTION_WIDTH = 80;

function Swipeable({ children }) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const next = startX.value + event.translationX;
      translateX.value = Math.max(-ACTION_WIDTH * 2, Math.min(0, next));
    })
    .onEnd(() => {
      const shouldOpen = Math.abs(translateX.value) > ACTION_WIDTH / 2;

      translateX.value = withSpring(shouldOpen ? -ACTION_WIDTH * 2 : 0, {
        damping: 20,
        stiffness: 150,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.wrapper}>
        <View style={styles.actions}>
          <Pressable
            style={[styles.action, { backgroundColor: '#ff3b30' }]}
            onPress={() => console.log('Delete')}>
            <Text style={styles.actionText}>
              <FontAwesome
                name={"trash"}
                size={34}
                color="#ffffff"
              />
            </Text>
          </Pressable>

          <Pressable
            style={[styles.action, { backgroundColor: '#007aff' }]}
            onPress={() => console.log('More')}>
            <Text style={styles.actionText}>
              <FontAwesome
                name={"plus-circle"}
                size={34}
                color="#ffffff"
              />
              </Text>
          </Pressable>
        </View>

        <Animated.View style={[styles.row, animatedStyle]}>
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Swipeable>
        <View style={styles.card}>
          <Text style={styles.text}>Swipe me</Text>
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#cfffdc',
  },
  wrapper: {
    flexDirection: 'row-reverse',
  },
  actions: {
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    height: '100%',
  },
  action: {
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  row: {
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: 'semibold',
    letterSpacing: 1,
    color: 'gray',
  },
});
