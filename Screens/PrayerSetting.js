import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioComponent from '../Components/RadioComponent';
import { useAuthContext } from '../Navigations/AuthContext';
import HeaderBack from '../Components/HeaderBack';
const calculationData = [
    { key: 1, label: 'MWL', angle: '14º, 16º' },
    { key: 2, label: 'Isna', angle: '15º, 15º' },
    { key: 3, label: 'Egypt', angle: '19.5º, 17.5º' },
    { key: 4, label: 'Makkah', angle: '18.5º, 90º' },
    { key: 5, label: 'Karachi', angle: '18º, 18º' },
    { key: 6, label: 'Tehran', angle: '17.7º, 14º' },
    { key: 7, label: 'Jafri', angle: '16º, 14º' },
];
const juristicion = [
    { key: 1, label: 'Standard' },
    { key: 2, label: 'Hanafi' },
];
const latitude = [
    { key: 1, label: 'None' },
    { key: 2, label: 'Angle based' },
    { key: 3, label: 'One Seventh' },
    { key: 4, label: 'Night Middle' },
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

    const renderItem = ({ item, stateKey }) => (
        <RadioComponent
            item={item}
            stateKey={stateKey}
            handleOptionPress={calculationMethodOptionPress}
            selectedKey={calculationSelected}
            style={{fontSize:15}}
        />
    );

    const renderJuristicionItem = ({ item }) => (
        <RadioComponent
            item={item}
            stateKey={'juristicion'}
            handleOptionPress={juristicionOptionPress}
            selectedKey={juristicionSelected}
        />
    );

    const renderLatitudeItem = ({ item }) => (
        <RadioComponent
            item={item}
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
                    { key: 'calculationMethod', data: calculationData, title: 'Calculation Method', onPress: () => toggleRadioGroup('calculationMethod'), option: showRadioGroups.calculationMethod },
                    { key: 'juristicion', data: juristicion, title: 'Asr Juristicion', onPress: () => toggleRadioGroup('juristicion'), option: showRadioGroups.juristicion },
                    { key: 'latitude', data: latitude, title: 'High latitude Method', onPress: () => toggleRadioGroup('latitude'), option: showRadioGroups.latitude }
                ]}
                renderItem={({ item }) =>
                    item.key === 'header' ? (
                      <HeaderBack title={'Setting'} navigation={navigation} />
                    ) : (
                        <View style={{ flexDirection: "column" }}>
                            <Pressable onPress={item.onPress} style={styles.body}>
                                <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{item.title}</Text>
                                <Icon name="down" size={18} right={10} style={[themeMode === "dark" && { color: "#fff" }]} />
                            </Pressable>
                            {item.option && showRadioGroups[item.key] && (
                                <FlatList
                                    data={item.data}
                                    renderItem={item.key === 'juristicion' ? renderJuristicionItem : item.key === 'latitude' ? renderLatitudeItem : ({ item }) => renderItem({ item, stateKey: item.key })}
                                    keyExtractor={subItem => subItem.key}
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
