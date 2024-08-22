import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import LocIcon from 'react-native-vector-icons/EvilIcons';
import { useAuthContext } from '../Navigations/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mosquesJson from '../Jsondata/Mosques.json';

const Allmosques = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const { themeMode } = useAuthContext();
  const [mosquesData, setMosquesData] = useState([]);


  useEffect(() => {
    getMosquesData();
    requestLocationPermission();
    getCurrentLocation();
  }, []);

  const ensureUniqueIds = (data) => {
    const seenIds = new Set();
    return data.map(item => {
      while (seenIds.has(item.id)) {
        item.id += 'x';
      }
      seenIds.add(item.id);
      return item;
    });
  };

  const getMosquesData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('allMosquesData');
      let combinedData = mosquesJson.data;
      console.log("storedData", storedData);

      if (storedData) {
        const parsedStoredData = JSON.parse(storedData);
        console.log('Parsed Stored Data:',JSON.stringify(parsedStoredData,2,null));
        combinedData = [...combinedData, ...parsedStoredData];
      }

      combinedData = ensureUniqueIds(combinedData);
      // console.log('Combined Data:', combinedData);
      setMosquesData(combinedData);
    } catch (error) {
      console.error('Failed to load mosques data', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      }
    );
  };




  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const start = { latitude: parseFloat(lat1), longitude: parseFloat(lon1) };
    const end = { latitude: parseFloat(lat2), longitude: parseFloat(lon2) };
    const distance = haversine(start, end, { unit: 'meter' });
    return distance;
  };

  const renderItem = ({ item }) => {
    let distance = 0;
    let distanceText = '';

    if (currentLocation) {
      distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        item.mosque.location.latitude,
        item.mosque.location.longitude
      );

      if (distance >= 1000) {
        distanceText = (distance / 1000).toFixed(1) + ' Km';
      } else {
        distanceText = distance.toFixed(0) + ' M';
      }
    }

    const imageUri = item.mosque.image;
    // console.log('Item:', item); 
    // console.log('Image URI:', imageUri); 

    return (
      <Pressable
        key={item.id}
        style={[styles.itemContainer, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}
        onPress={() => navigation.navigate('MasjidDetails', { itemId: item.id })}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onError={() => console.log('Image load error')}
          />
        ) : (
          <View style={styles.image} />
        )}
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.mosque.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <LocIcon name='location' size={22} color={'#fff'} />
            <Text numberOfLines={1} style={styles.address}>{item.mosque.location.address}</Text>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{distanceText}</Text>
        </View>
      </Pressable>
    );
  };




  return (
    <View style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {mosquesData && mosquesData.map((item) => (
          renderItem({ item })
        ))}
      </ScrollView>
    </View>
  );
};

export default Allmosques;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    padding: 15,
    flexDirection: 'row',
  },
  itemContainer: {
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  image: {
    width: 270,
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    color: 'white',
    fontSize: 14,
  },
  distanceContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0a9484',
    borderRadius: 5,
    padding: 5,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
