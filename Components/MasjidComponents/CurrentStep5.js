import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView,I18nManager,Image } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const CurrentStep5 = ({ currentStep, themeMode }) => {
    const [masjidDetails, setMasjidDetails] = useState({});
    const [saveDataLocation, setSaveDataLocation] = useState({});
    const [saveDataAdmin, setSaveDataAdmin] = useState({});
    const [jamaatTimes, setJamaatTimes] = useState({});
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {
        fetchDataLocation();
        fetchDatamasjidDetails();
        fetchDataAdmins();
        fetchJamaatTimes();
    }, []);

    const fetchDatamasjidDetails = async () => {
        try {
            const data = await AsyncStorage.getItem('allMosquesData');
            if (data !== null) {
                setMasjidDetails(JSON.parse(data));
            }
            // console.log("dataaaa",JSON.stringify(data,null,2));
            
        } catch (error) {
            console.error('Failed to load data from AsyncStorage', error);
        }
    };

    const fetchDataLocation = async () => {
        try {
            const data = await AsyncStorage.getItem('saveDataLocation');
            if (data !== null) {
                setSaveDataLocation(JSON.parse(data));
            }
        } catch (error) {
            console.error('Failed to load data from AsyncStorage', error);
        }
    };

    const fetchDataAdmins = async () => {
        try {
            const data = await AsyncStorage.getItem('admins');
            if (data !== null) {
                setSaveDataAdmin(JSON.parse(data));
            }
        } catch (error) {
            console.error('Failed to load data from AsyncStorage', error);
        }
    };

    const fetchJamaatTimes = async () => {
        try {
            const data = await AsyncStorage.getItem('jamaatTimes');
            if (data !== null) {
                setJamaatTimes(JSON.parse(data));
            }
        } catch (error) {
            console.error('Failed to load jamaatTimes from AsyncStorage', error);
        }
    };

    // const handleToMasjidDetail = () => {
    //     navigation.navigate('CurrentSteps1', { currentStep });
    // };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={[styles.contentContainer,themeMode === "dark" && {  backgroundColor: "#1C1C22" }]}>
                <StepIndicator
                    customStyles={styles.stepIndicatorStyles}
                    currentPosition={currentStep}
                    stepCount={5}
                />
                {currentStep === 4 && (
                    <View style={styles.stepContainer}>
                        <Text style={[styles.stepCount,themeMode === "dark" && {color: "#fff" }]}>{currentStep + 1}/5 {t('summary')}</Text>
                        <View style={styles.summaryContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ fontSize: 18, fontWeight: '700' },{color: themeMode === "dark" ? "#fff" : "#000"}]}>{t('masjid_detail')}</Text>
                                {/* <Pressable  style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </Pressable> */}
                            </View>
                            <Text style={[styles.summaryItem,themeMode === "dark" && {color: "#fff" }]}>{t('masjid_name')}: {masjidDetails.masjidName}</Text>
                            <Text style={[styles.summaryItem,themeMode === "dark" && {color: "#fff" }]}>{t('email')}: {masjidDetails.email}</Text>
                            <Text style={[styles.summaryItem,themeMode === "dark" && {color: "#fff" }]}>{t('phone')}: {masjidDetails.phone}</Text>

                            {masjidDetails.images && masjidDetails.images.length > 0 && (
                                <View style={styles.imageContainer}>
                                    {masjidDetails.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: image.uri }}
                                            style={styles.uploadedImage}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.summaryContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ fontSize: 18, fontWeight: '700' },{color : themeMode === "dark" ? "#fff": "#000"}]}>{t('location')}</Text>
                                <Pressable style={styles.editButton}>
                                    {/* <Text style={styles.editButtonText}>Edit</Text> */}
                                </Pressable>
                            </View>
                            <Text style={[styles.summaryItem,{color : themeMode === "dark" ? "#fff": "#000"}, {textAlign:I18nManager.isRTL ? 'right' : 'left'}]}>{t('address')}: {saveDataLocation.address}</Text>
                            <View style={styles.locationBody}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.locatioItem,themeMode === "dark" && {color: "#fff" }]}>{t('city')}</Text>
                                    <Text style ={[themeMode === "dark" && {color: "#fff" }]}>{saveDataLocation.city}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.locatioItem,themeMode === "dark" && {color: "#fff" }]}>{t('country')}</Text>
                                    <Text style ={[themeMode === "dark" && {color: "#fff" }]}>{saveDataLocation.country}</Text>
                                </View>
                            </View>
                            <View style={styles.locationBody}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.locatioItem,themeMode === "dark" && {color: "#fff" }]}>{t('region')}</Text>
                                    <Text style ={[themeMode === "dark" && {color: "#fff" }]}>{saveDataLocation.region}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.locatioItem,themeMode === "dark" && {color: "#fff" }]}>{t('zipcode')}</Text>
                                    <Text style ={[themeMode === "dark" && {color: "#fff" }]}>{saveDataLocation.zipcode}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.summaryContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ fontSize: 18, fontWeight: '700' },themeMode === "dark" && {color: "#fff" }]}>{t('admin')}</Text>
                                <Pressable  style={styles.editButton}>
                                    {/* <Text style={styles.editButtonText}>Edit</Text> */}
                                </Pressable>
                            </View>
                            {saveDataAdmin.length > 0 ? (
                                saveDataAdmin.map((admin, index) => (
                                    <View key={index} style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <Text style={[styles.locatioItem,themeMode === "dark" && {color: "#fff" }]}>{admin.name}</Text>
                                        <Text style={[{ textAlign:I18nManager.isRTL ? 'left' : 'right'},themeMode === "dark" && {color: "#fff" }]}>{admin.emailAddress}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style ={[themeMode === "dark" && {color: "#fff" }]}>{t('no_admin_added')}.</Text>
                            )}
                        </View>

                        <View style={styles.summaryContainerPrayer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ fontSize: 18, fontWeight: '700' },themeMode === "dark" && {color: "#fff" }]}>{t('jamaat_time')}</Text>
                            </View>
                            {Object.keys(jamaatTimes).map((prayer, index) => (
                                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15,paddingHorizontal:10 }}>
                                    <Text style={[styles.summaryItem,themeMode === "dark" && {color: "#fff" }]}> {t(`prayer.${prayer.toLowerCase()}`)}</Text>
                                    <Text style={[styles.summaryItem,themeMode === "dark" && {color: "#fff" }]}>{jamaatTimes[prayer]}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default CurrentStep5;

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryContainer: {
        borderBottomColor: '#cbcbcb',
        borderBottomWidth: 1,
        width: '100%',
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 20,
    },
    summaryContainerPrayer: {
        width: '100%',
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 20,
    },
    summaryItem: {
        fontSize: 16,
         textAlign:I18nManager.isRTL ? 'left' : 'right'
    },
    stepCount: {
        alignSelf: 'flex-start',
        margin: 10,
        left: 15,
        fontSize: 20,
        fontWeight: '700',
    },
    stepIndicatorStyles: {
        stepIndicatorSize: 20,
        currentStepIndicatorSize: 20,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 2,
        stepStrokeCurrentColor: '#0a9484',
        stepStrokeWidth: 2,
        stepStrokeFinishedColor: '#0a9484',
        stepStrokeUnFinishedColor: '#B9E5D8',
        separatorFinishedColor: '#0a9484',
        separatorUnFinishedColor: '#B9E5D8',
        stepIndicatorFinishedColor: '#0a9484',
        stepIndicatorUnFinishedColor: '#B9E5D8',
        stepIndicatorCurrentColor: '#0a9484',
        stepIndicatorLabelFontSize: 13,
        currentStepLabelColor: '#B9E5D8',
        labelColor: '#B9E5D8',
        labelSize: 13,
        currentStepLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#0a9484',
        stepIndicatorLabelFinishedColor: '#0a9484',
        stepIndicatorLabelUnFinishedColor: '#B9E5D8',
    },
    editButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#0a9484',
        fontSize: 15,
        fontWeight: '600',
    },
    locationBody: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 50,
        alignItems: "center"
    },
    locatioItem: {
        fontSize: 15,
        fontWeight: '700',
         textAlign:I18nManager.isRTL ? 'left' : 'right'
    },
    uploadedImage: {
        height: 160,
        width: 250,
    },
});
