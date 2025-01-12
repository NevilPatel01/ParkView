import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useTheme } from '../components/ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';  
const WishListScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const { background, text, cardBackground } = useTheme();

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    };

    fetchFavorites();
  }, []);

  const handleRemoveAll = async () => {
    Alert.alert(
      'Remove All',
      'Are you sure you want to remove all parks from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('favorites');
            setFavorites([]);
            Toast.show({
              type: 'info',
              text1: 'Wishlist Cleared',
              text2: 'All parks have been removed from your wishlist.',
            });
          },
        },
      ]
    );
  };

  const handleNavigate = (parkId) => {
    navigation.navigate('ParkDetails', { parkId });
  };

  const handleRemoveFavorite = async (id) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    Toast.show({
      type: 'info',
      text1: 'Park Removed',
      text2: 'This park has been removed from your wishlist.',
    });
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBackground }]}
        onPress={() => handleNavigate(item.id)}
      >
        <Text style={[styles.parkName, { color: text }]}>🌳 {item.name}</Text>
        {item.location && <Text style={[styles.location, { color: text }]}>📍 {item.location}</Text>}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: text }]}>Your Wishlist</Text>
        {favorites.length > 0 && (
          <TouchableOpacity style={styles.removeAllButton} onPress={handleRemoveAll}>
            <Text style={styles.removeAllButtonText}>Remove All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Your wishlist is empty! Start adding parks to see them here. 🌲</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'column', // Change to column for better centering
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',    // Centers horizontally
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center', // Ensure text is centered within its container
  },
  removeAllButton: {
    marginTop: 10, // Add spacing between text and button
    backgroundColor: '#e53e3e',
    borderRadius: 5,
    padding: 8,
  },
  removeAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  parkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#4a5568',
  },
  emptyText: {
    textAlign: 'center',
    color: '#4a5568',
    fontSize: 16,
    marginTop: 20,
  },
  removeButton: {
    backgroundColor: '#e53e3e',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '85%',
    marginLeft: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export default WishListScreen;
