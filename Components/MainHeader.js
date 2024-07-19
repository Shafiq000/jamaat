import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import SearchIcon from 'react-native-vector-icons/Feather';
import NotifyIcon from 'react-native-vector-icons/Ionicons';

const MainHeader = ({ title, navigation }) => {
    const openDrawer = () => {
        navigation.toggleDrawer();
    }
    const [hijriDate, setHijriDate] = useState('');
    const [today, setToday] = useState(new Date());

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
                        `${currentDateData.hijri.day} ${currentDateData.hijri.month.en} ${currentDateData.hijri.year}`
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
   
    const handletoNotification =() =>{
        navigation.navigate('Notification')
    }
    const handleMaps =() =>{
        navigation.navigate('Maps')
    }


    return (
        <View style={styles.headerContainer}>
            <Pressable hitSlop={20} onPress={openDrawer} style={styles.icon}>
                <Icon name='navicon' size={30} color={'#fff'} />
            </Pressable>
            <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff', left: 30,textAlign:'center' }}>{hijriDate}</Text>
            <Pressable onPress={handleMaps}>
                <SearchIcon name='search' size={25} color={'#fff'} left={20} />
            </Pressable>
            <Pressable onPress={handletoNotification}>
                <NotifyIcon name='notifications-outline' size={25} color={'#fff'} left={10} />
            </Pressable>
        </View>
    );
};

export default MainHeader;

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#0a9484',
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    title: {

        fontSize: 20,
        fontWeight: '500',
        color: "#fff",
        letterSpacing: 1,
    },
    icon: {
        position: "absolute",
        left: 20
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: 'center',
    }
});
