import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import HeaderBack from '../Components/HeaderBack';
import mosques from '../Jsondata/Mosques.json';
import haversine from 'haversine';
import LocIcon from 'react-native-vector-icons/EvilIcons';
import { useAuthContext } from '../Navigations/AuthContext';
const NearbyMasjid = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const { themeMode } = useAuthContext();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show nearby mosques.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }
      getCurrentLocation();
    };

    requestLocationPermission();
  }, []);

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
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const start = { latitude: parseFloat(lat1), longitude: parseFloat(lon1) };
    const end = { latitude: parseFloat(lat2), longitude: parseFloat(lon2) };
    const distance = haversine(start, end, { unit: 'meter' });
    return distance;
  };

  const handleItemPress = (item) => {
    navigation.navigate('MasjidDetails', { itemId: item.id });
  };

  const renderItem = ({ item }) => {
    let distanceText = '';

    if (currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        item.mosque.location.latitude,
        item.mosque.location.longitude
      );
      // console.log("distance",distance);
      if (distance >= 1000) {
        distanceText = (distance / 1000).toFixed(1) + ' Km';
      } else {
        distanceText = distance.toFixed(0) + ' M';
      }
    }

    return (
      <Pressable style={styles.itemContainer} onPress={() => handleItemPress(item)}>
        <Image source={{ uri: item.mosque.image }} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.mosque.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <LocIcon name='location' size={22} color={'#fff'} />
            <Text style={styles.address}>{item.mosque.location.address}</Text>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{distanceText}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      <HeaderBack title={'Nearby Masjids'} navigation={navigation} />
      <FlatList
        data={mosques.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default memo(NearbyMasjid);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    padding: 15,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
