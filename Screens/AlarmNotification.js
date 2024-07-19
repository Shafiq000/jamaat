import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../Navigations/AuthContext';
import HeaderBack from '../Components/HeaderBack';

const AlarmNotification = ({ navigation, route }) => {
    const { alarmTime } = route?.params ?? { alarmTime: { hours: 19, minutes: 0 } }; // Default to 7:00 PM
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Adhan");
    const [sound, setSound] = useState(null);
    const [hasPlayed, setHasPlayed] = useState(false); // To track if the sound has played for the current minute
    const { themeMode } = useAuthContext();

    console.log("alarmTime", alarmTime);

    Sound.setCategory('Playback');

    useEffect(() => {
        loadSound();
        loadSettings();
        const intervalId = setInterval(checkPrayerTimeMatch, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        saveSettings();
    }, [selectedOption, isEnabled]);

    const loadSettings = async () => {
        try {
            const storedIsEnabled = await AsyncStorage.getItem('isEnabled');
            setIsEnabled(storedIsEnabled === 'true');
            const storedSelectedOption = await AsyncStorage.getItem('selectedOption');
            setSelectedOption(storedSelectedOption || 'Adhan');
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const loadSound = () => {
        const soundObject = new Sound(
            "azan.mp3",
            Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    console.log("Failed to load the sound", error);
                    return;
                }
                setSound(soundObject);
            }
        );
    };

    const checkPrayerTimeMatch = () => {
        if (!isEnabled) return; // Don't check if notifications are disabled

        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        console.log(`Current Time: ${currentHours}:${currentMinutes}`);

        // Get the alarm time from the passed parameters
        const { hours: alarmHours, minutes: alarmMinutes } = alarmTime;

        // Check if current time matches the alarm time and ensure the sound hasn't played already for this minute
        if (currentHours === alarmHours && currentMinutes === alarmMinutes && !hasPlayed && sound) {
            sound.play((success) => {
                if (success) {
                    console.log(`Playing sound at ${alarmHours}:${alarmMinutes}`);
                    setHasPlayed(true); // Mark sound as played for the current minute

                    // Stop the sound once it has played completely
                    sound.stop(() => {
                        console.log('Sound has stopped');
                        setHasPlayed(false); // Reset for the next alarm trigger
                    });
                } else {
                    console.log('Sound playback failed due to audio decoding errors');
                }
            });
        }

        // Reset the hasPlayed flag if the current minute is no longer the alarm minute
        if (currentMinutes !== alarmMinutes) {
            setHasPlayed(false);
        }
    };

    const toggleSwitch = async () => {
        setIsEnabled(!isEnabled);
        try {
            await AsyncStorage.setItem('isEnabled', (!isEnabled).toString());
        } catch (error) {
            console.error('Error saving isEnabled setting:', error);
        }
    };

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('isEnabled', isEnabled.toString());
            await AsyncStorage.setItem('selectedOption', selectedOption);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const handleOptionPress = (option) => {
        setSelectedOption(option);
    };

    return (
        <SafeAreaView style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22", color: "#fff" }]}>
            <HeaderBack title={'Setting'} navigation={navigation}/>
            <View style={{ flexDirection: "column" }}>
                <View style={styles.notifications}>
                    <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>Show Notifications</Text>
                    <Switch
                        trackColor={{ false: '#B2B2B2', true: '#5BB5AB' }}
                        thumbColor={isEnabled ? '#0a9484' : '#f4f3f4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={{ flexDirection: "column" }}>
                    <View style={styles.items}>
                        <RadioButton.Group
                            onValueChange={value => handleOptionPress(value)}
                            value={selectedOption}
                        >
                            <View style={styles.radioContainer}>
                                <RadioButton.Item
                                    value="Default"
                                    label="Default"
                                    color="#0a9484"
                                    disabled={!isEnabled}
                                    style={[styles.radioButton, themeMode === "dark" && { color: "#fff" }]}
                                    labelStyle={[{ fontSize: 15 }, themeMode === "dark" && { color: "#fff" }]}
                                />
                            </View>
                        </RadioButton.Group>
                    </View>
                    <View style={styles.items}>
                        <RadioButton.Group
                            onValueChange={value => handleOptionPress(value)}
                            value={selectedOption}
                        >
                            <View style={styles.radioContainer}>
                                <RadioButton.Item
                                    label="Adhan"
                                    value="Adhan"
                                    color="#0a9484"
                                    disabled={!isEnabled}
                                    style={[styles.radioButton, themeMode === "dark" && { color: "#fff" }]}
                                    labelStyle={[{ fontSize: 15 }, themeMode === "dark" && { color: "#fff" }]}
                                />
                            </View>
                        </RadioButton.Group>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AlarmNotification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    setting: {
        flexDirection: "row",
        gap: 110,
        justifyContent: 'flex-start',
        alignItems: "center",
        height: 60,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
    },
    settingIcon: {
        fontSize: 22,
        fontWeight: "700",
    },
    items: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 10
    },
    title: {
        fontSize: 14,
        fontWeight: "500",
        marginRight: 10,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    notifications: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 20
    },
    radioButton: {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-start',
    }
});
