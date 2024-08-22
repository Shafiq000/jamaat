import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioComponent from '../Components/RadioComponent';
import { useAuthContext } from '../Navigations/AuthContext';
import HeaderBack from '../Components/HeaderBack';
import { useTranslation } from "react-i18next";

const calculationData = [
    { key: 1, label: 'mwl', angle: '14º, 16º' },
    { key: 2, label: 'isna', angle: '15º, 15º' },
    { key: 3, label: 'egypt', angle: '19.5º, 17.5º' },
    { key: 4, label: 'makkah', angle: '18.5º, 90º' },
    { key: 5, label: 'karachi', angle: '18º, 18º' },
    { key: 6, label: 'tehran', angle: '17.7º, 14º' },
    { key: 7, label: 'jafri', angle: '16º, 14º' },
];
const juristicion = [
    { key: 1, label: 'standard' },
    { key: 2, label: 'hanafi' },
];
const latitude = [
    { key: 1, label: 'none' },
    { key: 2, label: 'anglebase' },
    { key: 3, label: 'oneseven' },
    { key: 4, label: 'nightmiddle' },
];

const PrayerSetting = ({ navigation }) => {
    const { themeMode } = useAuthContext();
    const [showRadioGroups, setShowRadioGroups] = useState({
        calculationMethod: false,
        juristicion: false,
        latitude: false
    });

    const [calculationSelected, setcalculationSelected] = useState('');
    const [juristicionSelected, setJuristicionSelected] = useState('');
    const [latitudeSelected, setlatitudeSelected] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        AsyncStorage.getItem('calculationMethod').then(value => {
            if (value !== null) {
                setcalculationSelected(JSON.parse(value));
            }
        }).catch(error => console.error('Error retrieving calculationMethod:', error));

        AsyncStorage.getItem('juristicion').then(value => {
            if (value !== null) {
                setJuristicionSelected(JSON.parse(value));
            }
        }).catch(error => console.error('Error retrieving juristicion:', error));

        AsyncStorage.getItem('latitude').then(value => {
            if (value !== null) {
                setlatitudeSelected(JSON.parse(value));
            }
        }).catch(error => console.error('Error retrieving latitude:', error));
    }, []);

    const calculationMethodOptionPress = (key, value) => {
        setcalculationSelected(value);
    };

    const juristicionOptionPress = (key, value) => {
        setJuristicionSelected(value);
    };
    const latitudeOptionPress = (key, value) => {
        setlatitudeSelected(value);
    };

    useEffect(() => {
        AsyncStorage.setItem('calculationMethod', JSON.stringify(calculationSelected));
        AsyncStorage.setItem('juristicion', JSON.stringify(juristicionSelected));
        AsyncStorage.setItem('latitude', JSON.stringify(latitudeSelected));
    }, [calculationSelected, juristicionSelected, latitudeSelected]);

    const toggleRadioGroup = (key) => {
        setShowRadioGroups(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const renderItem = ({ item }) => (
        <RadioComponent
            item={{ ...item, label: t(`prayeritem.${item.label}`) }}
            stateKey={'calculationMethod'}
            handleOptionPress={calculationMethodOptionPress}
            selectedKey={calculationSelected}
        />
    );

    const renderJuristicionItem = ({ item }) => (
        <RadioComponent
            item={{ ...item, label: t(`prayeritem.${item.label}`) }}
            stateKey={'juristicion'}
            handleOptionPress={juristicionOptionPress}
            selectedKey={juristicionSelected}
        />
    );

    const renderLatitudeItem = ({ item }) => (
        <RadioComponent
            item={{ ...item, label: t(`prayeritem.${item.label}`) }}
            stateKey={'latitude'}
            handleOptionPress={latitudeOptionPress}
            selectedKey={latitudeSelected}
        />
    );

    return (
        <SafeAreaView style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
            <FlatList
                data={[
                    { key: 'header' },
                    { key: 'calculationMethod', data: calculationData, title: t('calculationdata'), onPress: () => toggleRadioGroup('calculationMethod'), option: showRadioGroups.calculationMethod },
                    { key: 'juristicion', data: juristicion, title: t('asr_juristicion'), onPress: () => toggleRadioGroup('juristicion'), option: showRadioGroups.juristicion },
                    { key: 'latitude', data: latitude, title: t('high_latitude'), onPress: () => toggleRadioGroup('latitude'), option: showRadioGroups.latitude }
                ]}
                renderItem={({ item }) =>
                    item.key === 'header' ? (
                        <HeaderBack title={t('setting')} navigation={navigation} />
                    ) : (
                        <View style={{ flexDirection: "column" }}>
                            <Pressable onPress={item.onPress} style={styles.body}>
                                <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}> {t(`prayeritem.${item.title.toLowerCase()}`)}</Text>
                                <Icon name="down" size={18} right={10} style={[themeMode === "dark" && { color: "#fff" }]} />
                            </Pressable>
                            {item.option && showRadioGroups[item.key] && (
                                <FlatList
                                    data={item.data}
                                    renderItem={item.key === 'juristicion' ? renderJuristicionItem : item.key === 'latitude' ? renderLatitudeItem : renderItem}
                                    keyExtractor={subItem => subItem.key.toString()}
                                />
                            )}
                        </View>
                    )
                }
                keyExtractor={(item, index) => item.key + index}
            />
        </SafeAreaView>
    );
};

export default PrayerSetting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    setting: {
        flexDirection: "row",
        gap: 110,
        justifyContent: 'flex-start',
        alignItems: "center",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        height: 60
    },
    settingIcon: {
        fontSize: 22,
        fontWeight: "700",
        marginLeft: 10,
    },

    body: {
        flexDirection: "row",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 14,
        fontWeight: "500",
    },
});
