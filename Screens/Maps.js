import { StyleSheet, Text, View, Pressable, PermissionsAndroid, SafeAreaView, Alert, Image, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { Searchbar } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import mosques from '../Jsondata/Mosques.json';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MosqueIcons from "react-native-vector-icons/MaterialIcons";
import LocIcon from 'react-native-vector-icons/EvilIcons';
import haversine from 'haversine';
import { useAuthContext } from '../Navigations/AuthContext';
const Maps = ({ title, navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const mapViewRef = useRef(null);
    const [filteredMosques, setFilteredMosques] = useState(mosques.data);
    const { themeMode } = useAuthContext();

    const mapCustomStyle = [
        {
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ];

    useEffect(() => {
        requestCameraPermission();
        getCurrentLocation();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool Photo App Camera Permission",
                    message: "Cool Photo App needs access to your camera so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
                if (mapViewRef.current) {
                    mapViewRef.current.animateToRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    });
                }
                updateMosquesWithDistances(latitude, longitude);
            },
            
            (error) => console.log(error),
            {
                TIMEOUT: 3,
                POSITION_UNAVAILABLE: 2,
                PERMISSION_DENIED: 1,
                message: "Location request timed out",
                ACTIVITY_NULL: 4,
                code: 3,
            }
        );
    };

    const parseCoordinates = (location) => {
        return {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
        };
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const start = { latitude: parseFloat(lat1), longitude: parseFloat(lon1) };
        const end = { latitude: parseFloat(lat2), longitude: parseFloat(lon2) };
        const distance = haversine(start, end, { unit: 'meter' });
        return distance;
    };

    const updateMosquesWithDistances = (latitude, longitude) => {
        const updatedMosques = mosques.data.map((mosque) => {
            const distance = calculateDistance(
                latitude,
                longitude,
                mosque.mosque.location.latitude,
                mosque.mosque.location.longitude
            );
            mosque.distanceText = distance >= 1000 ? (distance / 1000).toFixed(1) + ' Km' : distance.toFixed(0) + ' M';
            return mosque;
        });
        setFilteredMosques(updatedMosques);
    };

    const filterMosques = (query) => {
        let filtered = mosques.data;
        if (query) {
            filtered = filtered.filter((mosque) =>
                mosque.mosque.title && mosque.mosque.title.toLowerCase().includes(query.toLowerCase())
            );
        }
        setFilteredMosques(filtered);
        setSearchQuery(query);
    };

    const handleItemPress = (item) => {
        navigation.navigate('MasjidDetails', { itemId: item.id });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Pressable hitSlop={20} onPress={() => navigation.goBack()} style={styles.icon}>
                    <Icon name='left' size={25} color={'#fff'} />
                </Pressable>
                <View style={styles.searchContainer}>
                    <Searchbar
                        style={[styles.searchBar,themeMode == "dark" && { backgroundColor: "#3F4545" }]}
                        iconColor={themeMode == "dark" ? "#fff" : "#000"}
                        placeholderTextColor={themeMode == "dark" ? "#fff" : "#000"}
                        inputStyle={{ minHeight: 0 }}
                        clearIcon={false}
                        searchIcon={false}
                        selectionColor={'#0a9484'}
                        placeholder="Search"
                        onChangeText={filterMosques}
                        value={searchQuery}
                    />
                </View>
            </View>
            <View style={[styles.mosqueListContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                <FlatList
                    data={filteredMosques}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={[]} onPress={() => handleItemPress(item)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10,paddingHorizontal:10}}>
                                <LocIcon name='location' size={25} color={'#000'} style={[themeMode === "dark" && { color:'#fff' }]} />
                                    <Text style={[styles.mosqueTitle,themeMode === "dark" && { color:'#fff' }]}>{item.mosque.title}</Text>
                                    <Text style={[styles.distanceText,themeMode === "dark" && { color:'#fff' }]}>{item.distanceText}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            </View>

            <MapView
            customMapStyle={themeMode === "dark" ? mapCustomStyle : []}
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={
                    currentLocation
                        ? {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }
                        : null
                }
            >
                {currentLocation && (
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="You are here"
                        pinColor="blue"
                    />
                )}
                {mosques.data.map((item, index) => {
                    const coordinates = parseCoordinates(item.mosque.location);
                    return (
                        <Marker
                            key={index}
                            coordinate={coordinates}
                            title={item.mosque.title}
                            description={item.mosque.location.address}>
                            <View style={styles.customMarkerMosque}>
                                <Image
                                    source={require('../src/Images/pin.png')}
                                    style={{ height: 50, width: 50 }}
                                />
                                <MosqueIcons name='mosque' size={20} color={'#fff'} right={35} bottom={5} />
                            </View>
                        </Marker>
                    );
                })}
            </MapView>
            <Pressable style={[styles.myLocationButton,themeMode === "dark" && { backgroundColor: "#1C1C22" }]} onPress={getCurrentLocation}>
                <MaterialIcons name="my-location" size={30} color="#0a9484" />
            </Pressable>
        </SafeAreaView>
    );
};

export default Maps;

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#0a9484',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        left: 8,
    },
    searchContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        width: '85%',
    },
    searchBar: {
        height: 35,
        width: '88%',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: '#F6F4F5',
    },
    map: {
        flex: 1,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
    },
    customMarker: {
        backgroundColor: '#0a9484',
        padding: 5,
        borderTopColor: 'red',
        borderStartStartRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },
    customMarkerMosque: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mosqueListContainer: {
        flex: .4,
        paddingHorizontal: 10,
    },
    mosqueTitle: {
        color: "#000",
        fontSize: 16,
        paddingHorizontal: 10,
        flex: 1,
        flexWrap: 'wrap'
    },
    distanceText: {
        color: "#000",
        fontSize: 14,
    }
});
