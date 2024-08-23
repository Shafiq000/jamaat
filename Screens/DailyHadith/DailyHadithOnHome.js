import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ImageBackground, Pressable,Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import allDua from '../../Jsondata/AllHadiths.json';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/Entypo';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const DailyHadithOnHome = () => {
    const [currentHadith, setCurrentHadith] = useState(null);
    const [showFullTranslation, setShowFullTranslation] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        fetchRandomHadith();
    }, []);

    const fetchRandomHadith = useCallback(() => {
        const allHadiths = allDua.hadiths;
        const randomHadith = allHadiths[Math.floor(Math.random() * allHadiths.length)];
        setCurrentHadith(randomHadith);
    }, []);

    const handlePlayPause = () => {
        if (currentHadith) {
            if (isPlaying) {
                Speech.stop();
                setIsPlaying(false);
            } else {
                const SpeechOptions = {
                    // voice: 'sv-se-x-cmh-local',
                    voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.siri_male_en-US_compact' : 'en_us_male', 
                    pitch: 1.0,
                    rate: 1.0,
                    language: 'ar-SA',
                    onStart: () => setIsPlaying(true),
                    onDone: () => setIsPlaying(false),
                    onStopped: () => setIsPlaying(false),
                };

                Speech.speak(currentHadith.english.text, SpeechOptions);
            }
        }
    };

    const handleShare = (hadith) => {
        if (hadith) {
            Share.share({
                message: hadith.english.text
            })
                .then((result) => console.log(result))
                .catch((errorMsg) => console.error(errorMsg));
        } else {
            console.error("Nothing to share.");
        }
    };

    const toggleShowFullTranslation = () => {
        setShowFullTranslation(!showFullTranslation);
    }

    const navigateToDailyHadith = () => {
        if (currentHadith) {
            navigation.navigate('DailyHadith',{ hadith: currentHadith });
        }
    };
    return (
        <Pressable onPress={navigateToDailyHadith}>
            <ImageBackground
                source={require('../../src/Images/DailyHadiths.jpg')}
                style={styles.background}
                imageStyle={{ borderRadius: 6 }}
            >
                <LinearGradient
                    colors={['rgba(0, 10, 100, 0.5)', 'rgba(0,0,0,10)']}
                    style={styles.overlay}
                >
                    <View style={styles.container}>
                        {currentHadith ? (
                            <>
                                <Text style={styles.title}>{t('daily_hadith')}</Text>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.hadithText}>{currentHadith.english.text}</Text>
                                <Pressable onPress={toggleShowFullTranslation}>
                                    <Text style={styles.seeMore}>{t('see_more')}</Text>
                                </Pressable>
                                <View style={styles.translationContainer}>
                                    <View style={styles.iconContainer}>
                                        <Pressable onPress={handlePlayPause} style={styles.icon}>
                                            <PlayIcon name={isPlaying ? "controller-paus" : "controller-play"} size={24} color="#0a9484" />
                                            <Text style={styles.iconText}>{isPlaying ? t('pause') : t('play')}</Text>
                                        </Pressable>
                                        <Pressable onPress={handleShare} style={styles.shareicon}>
                                            <Icon name="share-social" size={24} color="#ffffff" />
                                            <Text style={{ color: '#fff' }}>{t('share')}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <Text style={{ color: '#fff' }}>Loading...</Text>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    background: {
        width: 320,
        height: 150,
        resizeMode: "cover",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 5,
        borderRadius: 6,
        overflow: "hidden",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        alignSelf: 'flex-start',
        bottom: 15,
    },
    hadithText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'left',
        width: '100%',
        bottom: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 10,
    },
    shareIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    refreshIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    translationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align items to the start
        alignItems: 'center',
        width: '100%',
        top: 10
    },
    verseTranslation: {
        fontSize: 13,
        color: '#fff',
        textAlign: 'left',
        width: '70%',
        bottom: 7
    },
    truncatedTranslation: {
        maxWidth: '70%',  // Limit width to 70%
    },
    fullTranslation: {
        maxWidth: '100%', // Full width when expanded
    },
    seeMore: {
        color: '#fff',
        textDecorationLine: 'underline',
        bottom: 7
    },
    icon: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center',
        marginRight: 10, // Space between icons
    },
    iconText: {
        color: '#ffffff',
        marginLeft: 5,
    },
    shareicon: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center',
        left: 40
    }
});

export default DailyHadithOnHome;
