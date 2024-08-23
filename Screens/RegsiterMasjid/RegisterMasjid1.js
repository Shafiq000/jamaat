import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import HeaderBackSteps from '../../Components/HeaderBackSteps';
import CurrentSteps1 from '../../Components/MasjidComponents/CurrentSteps1';
import CurrentStep2 from '../../Components/MasjidComponents/CurrentStep2';
import CurrentStep3 from '../../Components/MasjidComponents/CurrentStep3';
import { useAuthContext } from '../../Navigations/AuthContext';
import CurrentStep4 from '../../Components/MasjidComponents/CurrentStep4';
import CurrentStep5 from '../../Components/MasjidComponents/CurrentStep5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const RegisterMasjid1 = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showMap, setShowMap] = useState(true);
    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const { themeMode } = useAuthContext();
    const [showMasjidTypeOptions, setShowMasjidTypeOptions] = useState(false);
    const [masjidType, setMasjidType] = useState('');
    const { t } = useTranslation();

    const filePath = FileSystem.documentDirectory + 'Mosques.json';

    useEffect(() => {
        copyJsonFile();
        retrieveImages(); 
    }, []);

    const copyJsonFile = async () => {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
            await FileSystem.copyAsync({
                from: Asset.fromModule(require('../../assets/Mosques.json')).uri,
                to: filePath
            });
            console.log('File copied to writable directory');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const { uri } = result.assets[0];
            console.log('Selected image URI:', uri);
            await saveImageUri(uri); 
            setImages(prevImages => [...prevImages, uri]); 
        } else {
            console.log('Image selection was canceled.');
        }
    };
    
    const saveImageUri = async (uri) => {
        try {
            let storedImages = await AsyncStorage.getItem('images');
            let images = storedImages ? JSON.parse(storedImages) : [];
            images.push({ uri }); 
            await AsyncStorage.setItem('images', JSON.stringify(images));
            console.log('Images saved:', images); 
        } catch (error) {
            console.error('Failed to save image URI', error);
        }
    };
    
    
    const retrieveImages = async () => {
        try {
            const storedImages = await AsyncStorage.getItem('images');
            const imagesData = storedImages ? JSON.parse(storedImages) : [];
            console.log('Retrieved images:', imagesData); 
            setImages(imagesData);
        } catch (error) {
            console.error('Failed to retrieve image URIs', error);
        }
    };
    

    const handleMasjidTypePress = () => {
        setShowMasjidTypeOptions(true);
    };

    const handleMasjidTypeSelect = (type) => {
        setMasjidType(type);
        setShowMasjidTypeOptions(false);
    };

    const onNextStep = () => {
        if (currentStep === 1 && showMap) {
            setShowMap(false);
            setShowAddressDetails(true);
        } else if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);

            if (currentStep === 1) {
                setShowMap(true);
                setShowAddressDetails(false);
            }
        } else if (currentStep === steps.length - 1) {
            handleFinish(); // Call handleFinish on the last step
        }
    };

    const onPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);

            if (currentStep === 1) {
                setShowMap(true);
                setShowAddressDetails(false);
            }
        }
    };

    const handleBackToMap = () => {
        if (currentStep === 1) {
            setShowMap(true);
            setShowAddressDetails(false);
        }
    };

    const handleFinish = async () => {
        try {
            const masjidDetails = await AsyncStorage.getItem('allMosquesData');
            const location = await AsyncStorage.getItem('saveDataLocation');
            const admins = await AsyncStorage.getItem('admins');
            const jamaatTimes = await AsyncStorage.getItem('jamaatTimes');
            // const storedImages = await AsyncStorage.getItem('images');
             console.log("masjidDetails",masjidDetails);
             
            const masjidDetailsData = masjidDetails ? JSON.parse(masjidDetails) : [];
            const locationData = location ? JSON.parse(location) : {};
            const adminsData = admins ? JSON.parse(admins) : {};
            const jamaatTimesData = jamaatTimes ? JSON.parse(jamaatTimes) : [];
            const imagesData = masjidDetailsData.images ;
            console.log("imagesData",imagesData);
    
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            let dataToSave = { data: [] };
            if (fileInfo.exists) {
                const existingData = await FileSystem.readAsStringAsync(filePath);
                dataToSave = JSON.parse(existingData);
            }
    
            const newId = dataToSave.data.length > 0 ? dataToSave.data[dataToSave.data.length - 1].id + 1 : 1;
    
            const newMasjidData = {
                id: newId,
                mosque: {
                    title: masjidDetailsData.masjidName || "Unnamed Mosque",
                    location: {
                        latitude: locationData.latitude || 0,
                        longitude: locationData.longitude || 0,
                        address: locationData.address || "No Address",
                    },
                    image:  imagesData[0].uri 
                },
                timings: jamaatTimesData
            };
    
            dataToSave.data.push(newMasjidData);
            console.log("newMasjidData", newMasjidData);
    
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(dataToSave));
            await AsyncStorage.setItem('allMosquesData', JSON.stringify(dataToSave.data));
    
            navigation.navigate("Home");
            Alert.alert('Success', 'Your data has been upload successfully.');
        } catch (error) {
            console.error('Failed to save data', error);
            Alert.alert('Error', 'Failed to save data.');
        }
    };
    
    const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];

    return (
        <View style={styles.container}>
        <HeaderBackSteps title={t('masjid_register')} navigation={navigation} onPrevStep={onPrevStep} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
            {currentStep === 0 && (
                <CurrentSteps1
                    currentStep={currentStep}
                    images={images}
                    handleMasjidTypePress={handleMasjidTypePress}
                    handleMasjidTypeSelect={handleMasjidTypeSelect}
                    themeMode={themeMode}
                    pickImage={pickImage} 
                />
            )}
            {currentStep === 1 && (
                <CurrentStep2
                    currentStep={currentStep}
                    themeMode={themeMode}
                    showMap={showMap}
                    onNextStep={onNextStep}
                    showAddressDetails={showAddressDetails}
                    handleBackToMap={handleBackToMap} 
                />
            )}
            {currentStep === 2 && (
                <CurrentStep3
                    currentStep={currentStep}
                    themeMode={themeMode}
                />
            )}
            {currentStep === 3 && (
                <CurrentStep4
                    currentStep={currentStep}
                    themeMode={themeMode}
                />
            )}
            {currentStep === 4 && (
                <CurrentStep5
                    currentStep={currentStep}
                    themeMode={themeMode}
                />
            )}

            <Pressable style={styles.nextbutton} onPress={onNextStep}>
                <Text style={styles.buttonText}>
                    {currentStep === steps.length - 1 ? t('finish_button') : t('next_button')}
                </Text>
            </Pressable>
        </ScrollView>
    </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        justifyContent:'center',
        alignItems:'center',
       flex:1,
    //    paddingVertical:10
    },
    nextbutton: {
        height: 50,
        width: '90%',
        backgroundColor: '#0a9484',
        borderRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    navigationContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderTopColor: '#cbcbcb',
        borderTopWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RegisterMasjid1;
