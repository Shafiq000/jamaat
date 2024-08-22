import { SafeAreaView, StyleSheet, Text, View, Pressable, I18nManager } from 'react-native';
import React, { useState, useEffect, memo } from 'react';
import PrayerTime from '../PrayerTime/PrayerTime';
import PrayerTable from '../PrayerTime/PrayerTable';
import { useAuthContext } from '../../Navigations/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckInternet from './CheckInternet';
import HeaderBack from '../../Components/HeaderBack';
import { useTranslation } from "react-i18next";

const MainScreen = ({ navigation, route }) => {
    const [today, setToday] = useState(new Date());
    const country = route.params?.country;
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');
    const { themeMode } = useAuthContext();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        loadSelectedCountry();
    }, []);

    const loadSelectedCountry = async () => {
        try {
            const savedCountry = await AsyncStorage.getItem('selectedCountry');
            setSelectedCountry(savedCountry);
        } catch (error) {
            console.error('Error loading selected country:', error);
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

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: "#FFFFFF" }, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
            <HeaderBack title={t('prayer_time')} navigation={navigation} />
            <View style={{ flex: 1 }}>
                {isConnected ? (
                    <>
                        <View style={styles.dateSetting}>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={[{ fontSize: 18, fontWeight: "600", left: 20 }, themeMode === "dark" && { color: "#fff" }]}>{hijriDate}</Text>
                                <Text style={[{ fontSize: 16, fontWeight: "400", left: 20 }, themeMode === "dark" && { color: "#fff" }]}>{gregorianDate}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <PrayerTime />
                            <PrayerTable />
                        </View>
                    </>
                ) : (<CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />)}
            </View>
        </SafeAreaView>
    );
};

export default memo(MainScreen);

const styles = StyleSheet.create({
    dateSetting: {
        flex: 0.1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    mainContent: {
        flexDirection: "row",
        borderTopColor: "#C7C7C7",
        borderTopWidth: 1,
        margin: 20,
        alignItems: "center"
    },
    innerContent: {
        top: 20,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    location: {
        fontSize: 15,
        fontWeight: "600",
        left: 30,
        color: "#0a9484",
    }
});
