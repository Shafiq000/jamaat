import React, { useEffect, useState, useCallback } from "react";
import CompassHeading from "react-native-compass-heading";
import { View, Text, StyleSheet, Animated, I18nManager } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useAuthContext } from "../../Navigations/AuthContext";
import Geolocation from "@react-native-community/geolocation";
import debounce from 'lodash.debounce';
import { useTranslation } from "react-i18next";

const GOOGLE_API_KEY = "AIzaSyDZy9lBieXFt2KDcxhLub2QG-2XicbmSM0";

const Compass = () => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [heading, setHeading] = useState(0);
  const rotateValue = new Animated.Value(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const { t } = useTranslation();

  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const degreeUpdateRate = 1;

    CompassHeading.start(degreeUpdateRate, ({ heading, accuracy }) => {
      console.log("CompassHeading: ", heading, accuracy);
      setHeading(heading);

      Animated.timing(rotateValue, {
        toValue: heading,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const addressComponent = data.results[0].formatted_address;
        const addressDetails = data.results[0].address_components;

        let country = '', city = '';
        addressDetails.forEach(component => {
          if (component.types.includes('country')) country = component.long_name;
          if (component.types.includes('locality')) city = component.long_name;
        });

        setAddress(addressComponent);
        setCountry(country);
        setCity(city);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error(error);
      setAddress('Error fetching address');
    } finally {
    }
  };

  const debouncedGetAddress = useCallback(debounce(getAddressFromCoordinates, 400), []);

  const rotateStyle = {
    transform: [{ rotate: `${-heading}deg` }],
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        debouncedGetAddress(latitude, longitude);
      },
      (error) => {
        console.log(error);
      },
      {
        TIMEOUT: 300,
        POSITION_UNAVAILABLE: 2,
        PERMISSION_DENIED: 1,
        message: "Location request timed out",
        ACTIVITY_NULL: 4,
        code: 3,
      }
    );
  };

  const getQiblaImageSource = () => {
    if (themeMode === "dark") {
      return require("../../src/Images/editt.png"); // Dark theme image
    } else {
      return require("../../src/Images/kompas.png"); // Light theme image
    }
  };

  return (
    <View
      style={[
        styles.container,
        themeMode == "dark" && { backgroundColor: "#282828" },
      ]}
    >
      <View style={styles.textBody}>
        <EvilIcons
          name="location"
          size={30}
          style={[themeMode == "dark" && { color: "#fff" }]}
        />
        <Text style={[styles.text, themeMode == "dark" && { color: "#fff" }]}>
          {(`${city},${country}`)}
        </Text>
      </View>
      <View
        style={[
          styles.compassContainer,
          rotateStyle,
          themeMode == "dark" && { backgroundColor: "black" },
        ]}
      >
        <Animated.Image
          source={getQiblaImageSource()}
          style={styles.compassImage} />
        <Animated.Image
          source={require("../../src/Images/qiblaD.png")}
          style={[
            styles.qiblaImage,
            I18nManager.isRTL ? { transform: [{ rotate: '90deg' }] } : { transform: [{ rotate: '270deg' }] },
          ]}
        />
      </View>
      {/* <View style={{top:70}}>
        <Text
        style={styles.headingValue}
      >{`Heading: ${heading.toFixed()}°`}</Text>
      <Text
        style={styles.cardinalDirection}
      >{`Direction: ${getCardinalDirection()}`}</Text>
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  textBody: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 70,
  },
  text: {
    alignItems: "center",
    fontSize: 18,
    color: '#000'
  },
  compassContainer: {
    width: 230,
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 125,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: "column"
  },
  compassImage: {
    width: "110%",
    height: "110%",
  },
  headingValue: {
    fontSize: 18,
    color: "#fcba03",
    fontWeight: "500",
  },
  cardinalDirection: {
    fontSize: 18,
    color: "#fcba03",
    fontWeight: "500",
  },
  qiblaImage: {
    position: "absolute",
    width: "60%",
    height: "60%",
    bottom: 27,
    right: I18nManager.isRTL ? undefined : 200,
    left: I18nManager.isRTL ? 200 : undefined,
  },
});

export default Compass;
