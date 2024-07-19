import React, { useEffect, useState } from "react";
import CompassHeading from "react-native-compass-heading";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { useAuthContext } from "../Navigations/AuthContext";
const Compass = () => {
    const { themeMode } = useAuthContext();
    const [heading, setHeading] = useState(0);
    const rotateValue = new Animated.Value(0);
    useEffect(() => {
        const degreeUpdateRate = 1;
        CompassHeading.start(degreeUpdateRate, ({ heading, accuracy }) => {
            // console.log("CompassHeading: ", heading, accuracy);
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

    const getQiblaImageSource = () => {
        if (themeMode === "dark") {
            return require('../src/Images/editt.png'); 
        } else {
            return require('../src/Images/kompas.png'); 
        }
    };
    // useEffect (()=> {
    //     const getData =async () =>{
    //     let response = await fetch('https://openlibrary.org/people/mekBot/books/want-to-read.json')
    //     let data = response.json();
    //      console.log("data",JSON.stringify(data[1],null,2));
    //     }
    //     getData();
    //     },[]);
    return (
        <View style={[styles.container,themeMode == "dark" && { backgroundColor: "#1C1C22" }]}>
                <Text style={[styles.text, themeMode == "dark" && { color: "#fff" }]}>Qibla</Text>
            <View style={[styles.compassContainer,rotateStyle,themeMode == "dark" && { backgroundColor: "black" }, ]}>
                <Animated.Image
                    source={getQiblaImageSource()}
                    style={styles.compassImage} />
                <Animated.Image
                    source={require('../src/Images/qiblaaa.png')}
                    style={[styles.qiblaImage,{transform: [{ rotate: "270deg" }]}]}/>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 330,
        width: 'auto',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderTopColor: '#cbcbcb',
        borderTopWidth: 1,
        marginVertical:20,
    },
    text: {
        alignSelf: 'flex-start',
        // margin: 10,
        bottom: 20,
        fontSize: 25,
        fontWeight: '700'
    },
    compassContainer: {
        width: 210,
        height: 210,
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
        bottom: 30,
        right: 200,
    },
});

export default Compass;
