import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ParksScreen from './screens/Park';
import ParkDetailsScreen from './screens/ParkDetails';
import Wishlist from './screens/WishList';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

/**
 * StAuth10244: I Nevil Patel, 000892482 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
 */


const AppContent = () => {
  const { isDarkMode, background, text } = useTheme(); // Get theme properties from context

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={background}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: background }, // Set header background color
            headerTintColor: text, // Set header text color
            headerTitleStyle: { fontWeight: 'bold' }, // Optional: Adjust title styling
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Parks" component={ParksScreen} />
          <Stack.Screen name="ParkDetails" component={ParkDetailsScreen} />
          <Stack.Screen name="WishList" component={Wishlist} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setSplashVisible(false)} />;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
