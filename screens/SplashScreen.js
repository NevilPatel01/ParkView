import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to </Text>
      <Text style={styles.text1}>Park View! </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  text1: {
    fontSize: 31,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default SplashScreen;
