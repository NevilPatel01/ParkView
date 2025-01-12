import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Animated, 
  Dimensions 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from "@expo/vector-icons";

const GOOGLE_PLACES_API_KEY = ''; 

const ParksScreen = ({ navigation }) => {
  const { background, cardBackground, text } = useTheme();
  const [region, setRegion] = useState(null);
  const [filteredParks, setFilteredParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 


  const mapHeight = useRef(new Animated.Value(0.7 * Dimensions.get('window').height)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use this app.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      loadParks(location.coords.latitude, location.coords.longitude);
    })();
  }, []);


  const loadParks = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=park&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const parkList = data.results.map((result, index) => ({
      id: index.toString(),
      name: result.name,
      address: result.vicinity,
      coordinate: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      },
      placeId: result.place_id,
      rating: result.rating, // Include rating here
    }));

    setFilteredParks(parkList);
  } catch (error) {
    Alert.alert('Error', 'Unable to fetch parks data.');
  }
};


  const handleSearch = async (query) => {
    if (!query) {
      Alert.alert('Error', 'Please enter a valid city or location.');
      return;
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.results.length === 0) {
        Alert.alert('Error', 'Unable to fetch location for the entered query.');
        return;
      }

      const { lat, lng } = data.results[0].geometry.location;

      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      loadParks(lat, lng);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch city data.');
    }
  };


  const handleScroll = (e) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    const maxHeight = Dimensions.get('window').height * 0.7;
    const minHeight = Dimensions.get('window').height * 0.3;

    Animated.timing(mapHeight, {
      toValue: Math.max(minHeight, maxHeight - scrollY),
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

const zoomIn = () => {
  setRegion((prevRegion) => ({
    ...prevRegion,
    latitudeDelta: Math.max(prevRegion.latitudeDelta / 2, 0.002),
    longitudeDelta: Math.max(prevRegion.longitudeDelta / 2, 0.002),
  }));
};

const zoomOut = () => {
  setRegion((prevRegion) => ({
    ...prevRegion,
    latitudeDelta: Math.min(prevRegion.latitudeDelta * 2, 2),
    longitudeDelta: Math.min(prevRegion.longitudeDelta * 2, 2),
  }));
};


const renderPark = ({ item }) => (
  <TouchableOpacity
    style={[styles.listItem, {backgroundColor: cardBackground}]}
    onPress={() => navigation.navigate('ParkDetails', { parkId: item.placeId })}
  >
    <View style={styles.parkContainer}>
      <Text style={[styles.parkName, {color: text}]}>{item.name}</Text>
      <Text style={[styles.parkAddress, {color: text}]}>📍 {item.address}</Text>
      <Text style={styles.parkRating}>Rating: ⭐ {item.rating || 'N/A'}</Text>
    </View>
  </TouchableOpacity>
);


  return (
    <View style={[styles.container, { backgroundColor: background }]}>
            <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for parks..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity
          onPress={() => handleSearch(searchQuery)} 
          style={[styles.searchButton, { backgroundColor: searchQuery ? '#007AFF' : '#aaa' }]}
          disabled={!searchQuery}
        >
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
        {region && (
          <MapView style={styles.map} region={region}>
            {filteredParks.map((park) => (
              <Marker
                key={park.id}
                coordinate={park.coordinate}
                title={park.name}
                description={park.address}
              />
            ))}
          </MapView>
        )}
        {/* Zoom Controls within Map */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.zoomText}>-</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>


      <FlatList
        data={filteredParks}
        ListHeaderComponent={<Text style={[styles.header, { color: text }]}>Nearby Parks</Text>}
        renderItem={renderPark}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   searchContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 15,
    alignItems: "center",
  },
   searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 5,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  mapContainer: {
    width: '95%',
    alignContent: 'center',
    overflow: 'hidden',
    height: 300,
    marginTop: 10,
    marginHorizontal: "2.5%",
  borderRadius: 20,
  },
    zoomControls: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 100,
    },
    zoomButton: {
      width: 40,
      height: 40,
      backgroundColor: '#4CAF50',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 5,
    },
    zoomText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
  map: {
    flex: 1,
  },
   listItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  parkContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  parkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  parkAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  parkRating: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
  },
});

export default ParksScreen;
