import React, { useEffect, useState } from "react";
import CompassHeading from "react-native-compass-heading";
import { View, Text, StyleSheet, Animated, I18nManager } from "react-native";
import { useAuthContext } from "../Navigations/AuthContext";
import { useTranslation } from "react-i18next";

const Compass = () => {
    const { themeMode } = useAuthContext();
    const [heading, setHeading] = useState(0);
    const rotateValue = new Animated.Value(0);
    const { t } = useTranslation();

    useEffect(() => {
        const degreeUpdateRate = 1;
        CompassHeading.start(degreeUpdateRate, ({ heading }) => {
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
        return themeMode === "dark"
            ? require('../src/Images/editt.png')
            : require('../src/Images/kompas.png');
    };

       
    return (
        <View style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
            <Text style={[styles.text, themeMode === "dark" && { color: "#fff" }]}>{t('qibla')}</Text>
            <View style={[styles.compassContainer, rotateStyle, themeMode === "dark" && { backgroundColor: "black" }]}>
                <Animated.Image
                    source={getQiblaImageSource()}
                    style={styles.compassImage} />
                <Animated.Image
                    source={require('../src/Images/qiblaaa.png')}
                    style={[
                        styles.qiblaImage,
                        I18nManager.isRTL ? { transform: [{ rotate: '90deg' }] } : { transform: [{ rotate: '270deg' }] },
                    ]}
                />
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
        marginVertical: 20,
    },
    text: {
        alignSelf: 'flex-start',
        bottom: 20,
        fontSize: 25,
        fontWeight: '700',
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
        flexDirection: "column",
    },
    compassImage: {
        width: "110%",
        height: "110%",
    },
    qiblaImage: {
        position: "absolute",
        width: "40%",
        height: "60%",
        bottom: 30,
        right: I18nManager.isRTL ? undefined : 200,
        left: I18nManager.isRTL ? 200 : undefined,
    },
});

export default Compass;
