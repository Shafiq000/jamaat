import React, { useState, useEffect, useRef, memo } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Dimensions, SafeAreaView, I18nManager } from 'react-native';
import { Switch } from 'react-native-paper';
import ToastAndroid from "react-native-root-toast";
import Feather from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const windowWidth = Dimensions.get("window").width;
const daysToFetch = 7;
const PrayerTable = () => {
    const [prayerData, setPrayerData] = useState([]);
    const [switchStates, setSwitchStates] = useState([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [dates, setDates] = useState([]);
    const [enable, isEnabled] = useState(false);
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');
    const [currentPrayerIndex, setCurrentPrayerIndex] = useState();
    const flatlistRef = useRef();
    const [today, setToday] = useState(new Date());
    const { themeMode } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {

        fetchPrayerData();
        loadSwitchStates();

    }, []);

    const fetchPrayerData = async () => {
        try {
            setLoading(true);
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const date = currentDate.getDate();
            const fetchedDates = [];
            const fetchedPrayerData = [];
            let filteredPrayers = [];

            for (let i = 0; i < daysToFetch; i++) {
                const targetDate = new Date(year, month - 1, date + i);
                const response = await fetchPrayerDataForDate(targetDate);
                const prayerDataForDate = await response.json();
                const currentTime = new Date().getTime();
                const prayerTimes = prayerDataForDate.data[targetDate.getDate() - 1].timings;

                // Filter out unnecessary prayers
                filteredPrayers = Object.entries(prayerTimes)
                    .filter(([prayerName, _]) => !["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayerName))
                    .map(([prayerName, prayerTime]) => {
                        const formattedTime = formatTimeAMPM(prayerTime);
                        return { prayerName, prayerTime: formattedTime };
                    });

                fetchedPrayerData.push(filteredPrayers);
                fetchedDates.push(targetDate);

                // Store fetched prayer data in AsyncStorage
                await AsyncStorage.setItem(`prayerData_${(targetDate)}`, JSON.stringify(filteredPrayers));

                // Store fetched dates in AsyncStorage
                await AsyncStorage.setItem('fetchedDates', JSON.stringify(fetchedDates));

                // Set current index for prayer data
                const currentindex = findCurrentPrayerIndex(prayerTimes, currentTime);
                if (currentindex > 0) {
                    setPrayerData(prevState =>
                        prevState.map((item, idx) =>
                            idx === currentindex ? [item[0], item[1], true] : item
                        )
                    );
                }
            }
            setDates(fetchedDates);
            setPrayerData(fetchedPrayerData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            setLoading(false);
        }

    };
    useEffect(() => {
        // Load switch states from AsyncStorage
        loadSwitchStates();

        // Load prayer data and dates from AsyncStorage
        loadPrayerData();
    }, []);

    const loadPrayerData = async () => {
        try {
            // Load prayer data
            const fetchedDatesString = await AsyncStorage.getItem('fetchedDates');
            const fetchedDates = fetchedDatesString ? JSON.parse(fetchedDatesString) : [];
            const fetchedPrayerData = [];

            // Iterate through fetched dates and load prayer data for each date
            for (const date of fetchedDates) {
                const prayerDataString = await AsyncStorage.getItem(`prayerData_${(date)}`);
                const prayerData = prayerDataString ? JSON.parse(prayerDataString) : [];
                fetchedPrayerData.push(prayerData);
            }

            // Set the loaded prayer data and dates
            setDates(fetchedDates);
            setPrayerData(fetchedPrayerData);
        } catch (error) {
            console.error('Error loading prayer data:', error);
        }

    };


    const fetchPrayerDataForDate = async (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        try {
            const response = await fetch(
                `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`
            );
            return response;
        } catch (error) {
            console.error("Error fetching prayer data:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.aladhan.com/v1/gToHCalendar/${today.getMonth() + 1}/${today.getFullYear()}`
                );
                const data = await response.json();
                const currentDateData = data.data.find(
                    (item) => item.gregorian.date === formatDate(today)
                );
                if (currentDateData) {
                    const hijriMonthEn = currentDateData.hijri.month.en;
                    const translatedHijriMonth = t(`month_name.${hijriMonthEn}`);
                    setHijriDate(
                        `${currentDateData.hijri.day} ${translatedHijriMonth} ${currentDateData.hijri.year}`
                    );

                    // Get the translation for Gregorian month and day
                    const gregorianMonth = t(`month_name_gregorian.${currentDateData.gregorian.month.en}`);
                    const gregorianDay = t(`day_name_gregorian.${currentDateData.gregorian.weekday.en}`);

                    setGregorianDate(
                        `${gregorianDay}, ${currentDateData.gregorian.day} ${gregorianMonth}`
                    );
                }
            } catch (error) {
                console.error('Error fetching prayer times:', error);
            }
        };

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        fetchData();
    }, [today]);

    const loadSwitchStates = async () => {
        try {
            const allStatesString = await AsyncStorage.getItem('switchStates');
            const loadedStates = allStatesString ? JSON.parse(allStatesString) : [];
            // console.log("get item", loadedStates);
            setSwitchStates(loadedStates);
        } catch (error) {
            console.error('Error loading switch states:', error);
        }
    };

    // Test for notification.........................................

    // Helper function to parse time string "HH:MM" to [HH, MM]
    // const parseTime = (timeStr) => {
    //     let time = timeStr.split(":").map(Number);
    //     console.log(time);
    // };

    const parseTime = (timeStr) => {
        // console.log(timeStr);
        // Split the time string by ":" and convert each part to a number
        const [hourStr, minuteStr] = timeStr.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        // Check if hour and minute are valid numbers
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            console.error("Invalid time format:", timeStr);
            return [NaN, NaN]; // Return NaN values if parsing fails
        }
        return [hour, minute];
    };

    const sendNotification = async (index) => {
        try {
            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: "default1",
                name: "Default Channel1",
                importance: AndroidImportance.HIGH,
                sound: "default1",
            });

            if (!channelId) {
                console.error("Failed to create notification channel.");
                return;
            }

            const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const prayerName = prayerNames[index];
            const date = new Date(Date.now());

            const response = await fetchPrayerDataForDate(date);
            const prayerDataForDate = await response.json();
            const prayerTimes = prayerDataForDate.data[date.getDate() - 1]?.timings;

            if (!prayerTimes) {
                console.error(`Prayer times not found for ${prayerName} on ${date.toDateString()}`);
                return;
            }

            const [prayerHour, prayerMinute] = parseTime(prayerTimes[prayerName]);

            // Get the current time
            const currentTime = new Date();

            // Create a new date object for the current day with the prayer time
            const notificationTime = new Date();
            notificationTime.setHours(prayerHour);
            notificationTime.setMinutes(prayerMinute);
            notificationTime.setSeconds(0);
            notificationTime.setMilliseconds(0);
            // If the notification time is in the past, set it for the next occurrence
            if (notificationTime <= currentTime) {
                notificationTime.setDate(notificationTime.getDate() + 1);
            }

            // Get the timestamp for the notification time
            const desiredTime = notificationTime.getTime();
            // Format the notification time to a localized time string
            const localizedTime = notificationTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            await notifee.createTriggerNotification({
                title: `Prayer Time`,
                body: `${prayerName} prayer time has started at ${localizedTime}`,
                android: { channelId },
            }, {
                type: TriggerType.TIMESTAMP,
                timestamp: desiredTime,
            });

        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };



    const toggleSwitch = async (index) => {

        const updatedStates = [...switchStates];
        updatedStates[index] = !updatedStates[index];
        setSwitchStates(updatedStates);
        const prayerNames = ["FAJIR", "SUNRISE", "DHUHR", "ASR", "MAGHRIB", "ISHA"];
        try {
            console.log(JSON.stringify(updatedStates));
            await AsyncStorage.setItem(`switchStates`, JSON.stringify(updatedStates));
            if (updatedStates[index]) {
                sendNotification(index, updatedStates,);
                showToast(`Notifications scheduled for ${prayerNames[index]}`);
            }
        } catch (error) {
            console.error('Error saving switch state:', error);
        }
    };


    const updateDate = (index) => {
        setCurrentDateIndex(index);
        setToday(dates[index]);
    };

    const goToPreviousDate = () => {
        if (currentDateIndex > 0) {
            const newIndex = currentDateIndex - 1;
            flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
        }
    };

    const goToNextDate = () => {
        if (currentDateIndex < daysToFetch - 1) {
            const newIndex = currentDateIndex + 1;
            setCurrentDateIndex(newIndex);
            flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
        }
    };

    const findCurrentPrayerIndex = (prayerTimes, currentTime) => {
        const prayerTimesInMs = Object.values(prayerTimes).map(time => {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.getTime();
        });

        const currentindex = prayerTimesInMs.findIndex((time, idx, arr) => {
            const nextTime = idx < arr.length - 1 ? arr[idx + 1] : arr[0];
            return currentTime >= time && currentTime < nextTime;
        });

        // console.log("current index", currentindex);
        setCurrentPrayerIndex(currentindex);
        return currentindex;
    };


    const showToast = (message) => {
        ToastAndroid.show(message, {
            position: -120,
            duration: ToastAndroid.durations.LONG,
            opacity: 0.9,
            delay: 0,

        });
    };

    const formatTimeAMPM = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={{ justifyContent: "space-between", top: 30 }}>
                    <View style={styles.body}>
                        <Text style={[{ right: 7 }, themeMode === "dark" && { color: "#fff" }]}>{t('prayer_time')}</Text>
                        <Text style={[themeMode === "dark" && { color: "#fff" }]}>{t('time')}</Text>
                        <Text style={[themeMode === "dark" && { color: "#fff" }]}>{t('alert')}</Text>
                    </View>
                    <View style={{ borderTopColor: "#C7C7C7", borderTopWidth: 1, margin: 10 }}>
                    </View>
                </View>
                {item.map(({ prayerName, prayerTime }, index) => {
                    return (
                        <View key={index} style={styles.tabBody}>
                            <Text style={[{ textAlignVertical: "center", width: 57 }, themeMode === "dark" && { color: "#fff" }, currentPrayerIndex === index && { color: '#0a9484', fontWeight: "600", fontSize: 14 },]}>{t(`prayer.${prayerName.toLowerCase()}`)}</Text>
                            <Text style={[{ textAlignVertical: "center", textAlign: "left", }, themeMode === "dark" && { color: "#fff" }, currentPrayerIndex === index && { color: '#0a9484', fontWeight: "600", fontSize: 14 }]}>{prayerTime}</Text>

                            <Switch
                                trackColor={{ false: '#B2B2B2', true: '#5BB5AB' }}
                                thumbColor={isEnabled ? '#0a9484' : '#f4f3f4'}
                                value={switchStates[index]}
                                onValueChange={() => toggleSwitch(index)}
                            />
                        </View>
                    );
                })}
            </View>
        );
    };


    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / windowWidth);

        // Adjust index for RTL mode
        const adjustedIndex = I18nManager.isRTL ? daysToFetch - 1 - index : index;
        updateDate(adjustedIndex);
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 55 }}>
            {loading ? (
                <View style={[styles.loadingContainer, { backgroundColor: themeMode === "dark" ? "#1C1C22" : "#FFFFFF" }]}>
                    <ActivityIndicator animating={true} size="large" color={themeMode === "dark" ? "#FFFFFF" : "#0a9484"} />
                    <Text style={[styles.loadingText, { color: themeMode === "dark" ? "#FFFFFF" : "#000000" }]}>Loading...!</Text>
                </View>
            ) : (
                <>
                    <View style={styles.dateSetting}>
                        <Pressable hitSlop={30} onPress={goToPreviousDate}>
                            <Feather name={I18nManager.isRTL ? 'right' : 'left'} size={22} style={[themeMode === "dark" && { color: "#fff" }]} />
                        </Pressable>
                        <View style={styles.timechanger}>
                            <Text style={[{ fontSize: 18, fontWeight: '600' }, themeMode === "dark" && { color: "#fff" }]}>{gregorianDate}</Text>
                            <Text style={[{ fontSize: 16, fontWeight: '400' }, themeMode === "dark" && { color: "#fff" }]}>{hijriDate}</Text>
                        </View>
                        <Pressable hitSlop={30} onPress={goToNextDate}>
                            <Feather name={I18nManager.isRTL ? 'left' : 'right'} size={22} style={[themeMode === "dark" && { color: "#fff" }]} />
                        </Pressable>
                    </View>

                    <FlatList
                        ref={flatlistRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        data={prayerData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onScroll={handleScroll}
                    // extraData={switchStates}
                    />
                </>
            )}

        </SafeAreaView>
    );
};

export default memo(PrayerTable);

const styles = StyleSheet.create({
    body: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
    },
    tabBody: {
        width: windowWidth,
        top: 35,
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        alignItems: "center",
    },
    dateSetting: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    timechanger: {
        flexDirection: 'column',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
});
