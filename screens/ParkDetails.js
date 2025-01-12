import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ImageViewer } from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useTheme } from '../components/ThemeContext';

const ParkDetailsScreen = ({ route }) => {
  const { parkId } = route.params; 
  const { background, text, cardBackground } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [parkDetails, setParkDetails] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const GOOGLE_PLACES_API_KEY = '';

  const reviewsCount = 5;

  useEffect(() => {
    const fetchParkDetails = async () => {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${parkId}&key=${GOOGLE_PLACES_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
          setParkDetails(data.result);
        } else {
          throw new Error('Error fetching park details: ' + data.status);
        }
      } catch (error) {
        console.error('Error fetching park details:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load park details. Please try again later.',
        });
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorited(favorites.some((favorite) => favorite.id === parkId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to check favorite status. Please try again later.',
        });
      }
    };

    fetchParkDetails();
    checkFavoriteStatus();
  }, [parkId]);

  const handleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (favorites.some((favorite) => favorite.id === parkId)) {
        const updatedFavorites = favorites.filter((favorite) => favorite.id !== parkId);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        Toast.show({ type: 'info', text1: 'Removed from Wishlist', text2: `${parkDetails.name} has been removed from your wishlist.` });
        setIsFavorited(false);
      } else {
        favorites.push({ id: parkId, name: parkDetails.name, location: parkDetails.vicinity });
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        Toast.show({ type: 'success', text1: 'Added to Wishlist', text2: `${parkDetails.name} is now added to your wishlist!` });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error handling favorite status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update favorite status. Please try again later.',
      });
    }
  };

  const renderPhotos = () => {
    if (!parkDetails || !parkDetails.photos || parkDetails.photos.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderText, { color: text }]}>🌳 No photos available! Imagine the beauty of nature instead. 🌿</Text>
        </View>
      );
    }
    return (
      <View style={styles.imageContainer}>
        {parkDetails.photos.map((photo, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedImage({
                url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
              });
              setModalVisible(true);
            }}
            style={styles.imageWrapper}
          >
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
              }}
              style={styles.photo}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviews = () => {
    if (!parkDetails || !parkDetails.reviews || parkDetails.reviews.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderText, { color: text }]}>🌟 No reviews yet! Be the first to explore and share your experience. 📝</Text>
        </View>
      );
    }
    return parkDetails.reviews.slice(0, reviewsCount).map((review, index) => (
      <View key={index} style={[styles.reviewCard, { backgroundColor: cardBackground }]}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewAuthor, { color: text }]}>{review.author_name}</Text>
          <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>
        </View>
        <Text style={[styles.reviewText, { color: text }]}>{review.text}</Text>
      </View>
    ));
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome key={i} name="star" size={16} color={i < rating ? '#FFD700' : '#dcdcdc'} />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]}>
      {parkDetails ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: text }]}>{parkDetails.name}</Text>
          </View>
          <View style={styles.addressContainer}>
            <View style={styles.locationContainer}>
              <FontAwesome name="map-marker" size={20} color="#3b82f6" style={styles.mapIcon} />
              <Text style={[styles.address, { color: text }]}>{'  '}{parkDetails.vicinity}</Text>
            </View>
            <TouchableOpacity onPress={handleFavorite} style={styles.favoriteButton}>
              <FontAwesome name={isFavorited ? 'heart' : 'heart-o'} size={24} color="#e53e3e" />
            </TouchableOpacity>
          </View>

          {renderPhotos()}

          <Text style={[styles.header, { color: text }]}>Reviews</Text>
          {renderReviews()}

          <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
            <ImageViewer imageUrls={[{ url: selectedImage?.url }]} onSwipeDown={() => setModalVisible(false)} enableSwipeDown />
          </Modal>

          <Toast />
        </>
      ) : (
        <Text style={{ color: text }}>Loading park details...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 15,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mapIcon: {
    marginRight: 5,
  },
  address: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  favoriteButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    marginBottom: 15,
    width: '48%',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewCard: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    marginTop: 5,
    fontSize: 14,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#8e8e8e',
    textAlign: 'center',
  },
});

export default ParkDetailsScreen;
