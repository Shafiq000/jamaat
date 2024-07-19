import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, Image, PermissionsAndroid } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../../Navigations/AuthContext";
const Map = () => {
  const { themeMode, setThemeMode } = useAuthContext();
  const mapViewRef = useRef(null);
  const {
    currentLocation,
    setCurrentLocation,
    pickedLocation,
    setPickedLocation,
  } = useAuthContext();

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
          message:
            "Cool Photo App needs access to your camera so you can take awesome pictures.",
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
        setPickedLocation({ latitude, longitude }); 
        if (mapViewRef.current) {
          mapViewRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
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

  const handlePress = (location) => {
    if (location === "kaaba") {
      if (mapViewRef.current) {
        mapViewRef.current.animateToRegion({
          latitude: 21.422527833115584, // Kaaba latitude
          longitude: 39.826186353745136, // Kaaba longitude
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } else if (location === "myLocation") {
      getCurrentLocation();
    }
  };

  const handleRegionChangeComplete = (region) => {
    if (pickedLocation && currentLocation && region) {
      if (
        pickedLocation.latitude !== region.latitude ||
        pickedLocation.longitude !== region.longitude
      ) {
        setPickedLocation(region);
        setCurrentLocation(region);
      }
    }
  };

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
  return (
    <View style={{ flex: 1 }}>
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
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {currentLocation && pickedLocation && (
          <Polyline
            coordinates={[
              pickedLocation,
              currentLocation,
              { latitude: 21.422527833115584, longitude: 39.826186353745136 },
            ]}
            strokeColor="#fcba03"
            strokeWidth={3}
            lineDashPattern={[20,10]}
            lineCap={'butt'}
          />
        )}

        <Marker
          coordinate={{
            latitude: 21.4217,
            longitude: 39.8261,
            
          }}
          image={require("../../src/Images/qiblaD.png")}
        />
      </MapView>
      {pickedLocation && currentLocation && (
        <View
          style={[
            styles.circle,
            {
              left: pickedLocation === currentLocation.longitude,
              top: pickedLocation === currentLocation.latitude,
              right:pickedLocation === currentLocation.longitude,
              bottom:pickedLocation === currentLocation.latitude,
            },
          ]}
        />
      )}
      <Pressable
        style={styles.qiblaLocation}
        onPress={() => handlePress("kaaba")}
      >
        <Image
          source={require("../../src/Images/qiblaD.png")}
          style={styles.imageStyle}
        />
      </Pressable>
      <Pressable
        style={styles.mylocationIcon}
        onPress={() => handlePress("myLocation")}
      >
        <MaterialIcons name="my-location" size={35} color="#fcba03" />
      </Pressable>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  mylocationIcon: {
    position: "absolute",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    right: 40,
    height: "8%",
    width: "14%",
    bottom: 40,
    borderRadius: 30,
  },
  qiblaLocation: {
    position: "absolute",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    right: 40,
    height: "8%",
    width: "14%",
    bottom: 110,
    borderRadius: 30,
  },
  imageStyle: {
    height: 90,
    width: 60,
    bottom: 7,
  },
  circle: {
    position: "absolute",
    width: 20, // Adjust the width and height as needed for the size of the circle
    height: 20,
    borderRadius: 20 / 2, // To make it a circle
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "#fcba03",
    marginHorizontal:170,
    marginVertical: 315,
  },
});
