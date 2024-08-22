import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator, Pressable, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/Entypo';
import * as Speech from 'expo-speech';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const DailyVerseOnHomeScreen = () => {
    const [verse, setVerse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullTranslation, setShowFullTranslation] = useState(false);
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json')
            .then(response => response.json())
            .then(data => {
                // Get a random chapter and its first verse for demonstration
                const randomChapter = data[Math.floor(Math.random() * data.length)];
                const firstVerse = randomChapter.verses[0]; // Get the first verse of the chapter
                setVerse({
                    transliteration: randomChapter.transliteration,
                    translation: firstVerse.translation,
                    text: firstVerse.text
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching the verse:", error);
                setLoading(false);
            });
    }, []);

    //    useEffect(() =>{
    //     const getdata = async ()=>{
    //      let response = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json')
    //      let data = await response.json();
    //      console.log("data",JSON.stringify(data[1],null,2));
    //     }
    //     getdata();
    //    })


    const handlePlayPause = () => {
        if (verse) {
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

                Speech.speak(verse.translation, SpeechOptions);
            }
        }
    };

    const handleShare = () => {
        if (verse) {
            const shareOptions = {
                message: `${verse.transliteration}\n${verse.translation}\n${verse.text}`,
                title: 'Daily Verse',
            };
            Share.open(shareOptions)
                .then(res => console.log(res))
                .catch(err => console.error(err));
        }
    };

    const toggleShowFullTranslation = () => {
        setShowFullTranslation(!showFullTranslation);
    };

    return (
        <Pressable onPress={() => navigation.navigate('DailyVerseScreen', { verse })}>
            <ImageBackground
                source={require('../../src/Images/Dailyverse.jpg')}
                style={styles.background}
                imageStyle={{ borderRadius: 6 }}
            >
                <LinearGradient
                    colors={['rgba(10, 148, 132, 0.8)', 'rgba(0,0,0,0.4)']}
                    style={styles.overlay}
                >
                    <View style={styles.container}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#ffffff" />
                        ) : (
                            <>
                                <Text style={styles.title}>{t('daily_verse')}</Text>
                                {verse && (
                                    <View style={styles.verseContainer}>
                                        <Text style={styles.verseText}>{verse.transliteration}</Text>
                                        <View style={styles.translationContainer}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text
                                                    style={[
                                                        styles.verseTranslation,
                                                        showFullTranslation ? styles.fullTranslation : styles.truncatedTranslation
                                                    ]}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {verse.translation}
                                                </Text>
                                                <Pressable onPress={toggleShowFullTranslation}>
                                                    <Text style={styles.seeMore}>{t('see_more')}</Text>
                                                </Pressable>
                                            </View>
                                        </View>
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
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    );
};

export default memo(DailyVerseOnHomeScreen);

const styles = StyleSheet.create({
    background: {
        width: 320,
        height: 150,
        resizeMode: "center",
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
        bottom: 15
    },
    verseContainer: {
        alignItems: 'flex-start',
        width: '100%',
    },
    verseText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'left',
        width: '100%',
        bottom: 10
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
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
