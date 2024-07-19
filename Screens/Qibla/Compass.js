import React, { useEffect, useState } from "react";
import CompassHeading from "react-native-compass-heading";
import { View, Text, StyleSheet,Animated } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useAuthContext } from "../../Navigations/AuthContext";
const Compass = () => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [heading, setHeading] = useState(0);
  const rotateValue = new Animated.Value(0);

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

  const rotateStyle = {
    transform: [{ rotate: `${-heading}deg` }],
  };

  // const getCardinalDirection = () => {
  //   const directions = [
  //     "NORTH",
  //     "NE",
  //     "EAST",
  //     "SE",
  //     "SOUTH",
  //     "SW",
  //     "WEST",
  //     "NW",
  //   ];
  //   const index = Math.round(heading / 45) % 8;
  //   return directions[index];
  // };
  const getQiblaImageSource = () => {
    if (themeMode === "dark") {
      return require("../../src/Images/editt.png"); // Dark theme ke liye image
    } else {
      return require("../../src/Images/kompas.png"); // Light theme ke liye image
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
          Lahore, Pakistan
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
          style={
            styles.compassImage}/>
        <Animated.Image
          source={require("../../src/Images/qiblaD.png")}
          style={[
            styles.qiblaImage,
            {
              transform: [{ rotate: "270deg" }],
            },
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
  flexDirection:"column"

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
    right: 200,
  },
});

export default Compass;
