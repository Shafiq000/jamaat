import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useEffect, memo } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Location_Pin from 'react-native-vector-icons/Entypo';
import PrayerTime from '../PrayerTime/PrayerTime'
import PrayerTable from '../PrayerTime/PrayerTable';
import { useAuthContext } from '../../Navigations/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckInternet from './CheckInternet';
import HeaderBack from '../../Components/HeaderBack';
const MainScreen = ({ navigation, route }) => {
    const [today, setToday] = useState(new Date());
    const country = route.params?.country
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');
    const { themeMode } = useAuthContext();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isConnected, setIsConnected] = useState(false)
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
                    setHijriDate(
                        `${currentDateData.hijri.day} ${currentDateData.hijri.month.en}, ${currentDateData.hijri.year}`
                    );
                    setGregorianDate(
                        `${currentDateData.gregorian.weekday.en}, ${currentDateData.gregorian.day} ${currentDateData.gregorian.month.en}`
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
            <HeaderBack title={'Prayer Time'} navigation={navigation}/>
            <View style={{ flex: 1 }}>
                {isConnected ? (
                    <>
                        <View style={styles.dateSetting}>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={[{ fontSize: 18, fontWeight: "600", left: 20 }, themeMode === "dark" && { color: "#fff" }]}>{hijriDate}</Text>
                                <Text style={[{ fontSize: 16, fontWeight: "400", left: 20 }, themeMode === "dark" && { color: "#fff" }]}>{gregorianDate}</Text>
                            </View>
                        </View>
                        {/* <View style={styles.mainContent}>
                            <View style={styles.innerContent}>
                                <Location_Pin name='location-pin' size={25} style={[themeMode === "dark" && { color: "#fff" }]} />
                                <Text style={[{ fontSize: 15, fontWeight: "400", width: "40%" }, themeMode === "dark" && { color: "#fff" }]}>{[country || selectedCountry]}</Text>
                                <Pressable hitSlop={30} onPress={() => navigation.navigate('Setlocation')}>
                                    <Text style={styles.location}>Change Location</Text>
                                </Pressable>
                            </View>
                        </View> */}
                        <View style={{ flex: 1 }}>
                            <PrayerTime />
                            {/* <PrayerTimeChanged/> */}
                            <PrayerTable />
                        </View>
                    </>
                ) : (<CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />)}


            </View>
        </SafeAreaView>
    )
}

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
