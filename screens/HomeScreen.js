import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, SafeAreaView } from 'react-native';
import { useTheme } from '../components/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { primary, text, toggleTheme, isDarkMode } = useTheme();

  const backgroundImage = isDarkMode
    ?  { uri: 'https://imgs.search.brave.com/4pvhr6zj-9Z191KqgbjNMk9Qg_U_ibsvhUh01wGJxuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJiYXQuY29t/L2ltZy81ODE5NzQt/bGFrZS1tb3VudGFp/bi13YXRlci1kYXJr/LW5hdHVyZS13YWxs/cGFwZXIuanBn' }
    : { uri: 'https://imgs.search.brave.com/ltltOGd8PslkGtKB66Uf-NWNm1LHHngs0o3e0W4afds/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzc5L2Zk/L2QxLzc5ZmRkMTcy/NTNiNTY5YTQxN2U5/ODBhOTlhZWNkOTc4/LmpwZw' };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'transparent'}]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.headerButton, styles.blurBackground]}>
              <Text style={[styles.headerButtonText, { color: text }]}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('WishList')} style={[styles.headerButton, styles.blurBackground]}>
              <Text style={[styles.headerButtonText, { color: text }]}>❤️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Welcome to <Text style={styles.gemText}>Park View!</Text></Text>
              <Text style={styles.summaryText}>
                Explore nearby parks. Your adventure awaits!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: primary }]}
              onPress={() => navigation.navigate('Parks')}
            >
              <Text style={styles.exploreButtonText}>Explore Parks →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerButton: {
    padding: 10,
    borderRadius: 20,
  },
  headerButtonText: {
    fontSize: 24,
  },
  blurBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  gemText: {
    color: "#4CAF50",
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  exploreButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  exploreButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
