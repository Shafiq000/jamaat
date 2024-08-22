import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Modal, TextInput, Pressable,I18nManager,PermissionsAndroid, Platform } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import UploadIcon from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
import { useAuthContext } from '../../Navigations/AuthContext';
const CurrentSteps1 = ({ currentStep }) => {
    const [showMasjidTypeOptions, setShowMasjidTypeOptions] = useState(false);
    const [masjidType, setMasjidType] = useState('');
    const [masjidName, setMasjidName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [emailInputFocused, setEmailInputFocused] = useState(false);
    const [phoneInputFocused, setPhoneInputFocused] = useState(false);
    const [masjidInputFocused, setMasjidInputFocused] = useState(false);
    const [masjidTypeInputFocused, setMasjidTypeInputFocused] = useState(false);
    const [images, setImages] = useState([]);
    const { themeMode } = useAuthContext();
    const { t } = useTranslation();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        saveData();
    }, [images, masjidName, email, phone]);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            selectionLimit: 5,
        };

        launchImageLibrary(options, handleResponse);
    };

    const handleCameraLaunch = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
            const options = {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 2000,
                maxWidth: 2000,
            };
            
            launchCamera(options, handleResponse);
        } else {
            console.log('Camera permission denied');
        }
    };
    
    const requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "App needs camera permission",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const handleResponse = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
            // Ensure response.assets is defined before accessing it
            if (response.assets.length > 0) {
                const newImages = response.assets.map(asset => {
                    if (asset.uri) {
                        return { uri: asset.uri };
                    } else {
                        console.error('Asset URI is missing');
                        return null;
                    }
                }).filter(Boolean); // Filter out any null values
                setImages(prevImages => [...prevImages, ...newImages]);
                console.log("newImages",newImages);
                
            } else {
                console.warn('No assets returned by the ImagePicker');
            }
        } else {
            console.warn('Unexpected response format', response);
        }
    };
    

    const removeImage = (index) => {
        // Filter out the image at the specified index
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleMasjidTypePress = () => {
        setShowMasjidTypeOptions(true);
    };

    const handleMasjidTypeSelect = (type) => {
        setMasjidType(type);
        setShowMasjidTypeOptions(false);
    };

    const saveData = async () => {
        try {
            const data = {
                images,
                masjidName,
                email,
                phone,
            };
            await AsyncStorage.setItem('allMosquesData', JSON.stringify(data));
            console.log("Data saved:", JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Failed to save data to AsyncStorage', error);
        }
    };
    

    const loadData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('allMosquesData');
            if (storedData) {
                const { images, masjidName, email, phone } = JSON.parse(storedData);
                setImages(images || []);
                setMasjidName(masjidName || '');
                setEmail(email || '');
                setPhone(phone || '');
            }
        } catch (error) {
            console.error('Failed to load data from AsyncStorage', error);
        }
    };

    

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={[styles.contentContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                <StepIndicator
                    customStyles={styles.stepIndicatorStyles}
                    currentPosition={currentStep}
                    stepCount={5}
                />

                {currentStep === 0 && (
                    <View style={styles.stepContainer}>
                        <Text style={[styles.stepCount,themeMode === "dark" && { color: "#fff" },{}]}>{currentStep + 1}/5 {t('masjid_detail')}</Text>
                        <View style={{ paddingHorizontal: 5, paddingBottom: 15 }}>
                            <Text numberOfLines={2} style={[styles.subTitle,themeMode === "dark" && { color: "#fff" }]}>{t('sublines')}</Text>
                        </View>

                        <Text style={[styles.masjidTitle,themeMode === "dark" && { color: "#fff" }]}>{t('upload_pic')}</Text>

                        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.uploadimagescontainer} horizontal>
                            {images.map((image, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.uploadedImage}
                                    />
                                    <Pressable style={styles.removeImageIcon} onPress={() => removeImage(index)}>
                                        <Text style={styles.removeImageText}>✕</Text>
                                    </Pressable>
                                </View>
                            ))}
                            {images.length < 5 && (
                                <Pressable style={[styles.uploadContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]} onPress={() => setModalVisible(true)}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <UploadIcon name='plussquareo' size={40} color={'#BDB6A8'} />
                                        <Text style={[styles.uploadText,themeMode === "dark" && { color: "#fff" }]}>{t('upload_pic')}</Text>
                                    </View>
                                </Pressable>
                            )}
                        </ScrollView>
                        <Text style={[styles.uploadimagesText,themeMode === "dark" && { color: "#fff" }]}>{t('maximum_pic')}</Text>
                        <View style={{ justifyContent: 'center' }}>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('masjid_name')}* </Text>
                            </View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {textAlign: I18nManager.isRTL ? 'right':'left'},
                                    masjidInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                    { color: themeMode === "dark" ? '#fff' : '#000' }
                                ]}
                                value={masjidName}
                                onChangeText={setMasjidName}
                                placeholder={t('enter_masjid_name')}
                                placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                onFocus={() => setMasjidInputFocused(true)}
                                onBlur={() => setMasjidInputFocused(false)}
                            />
                        </View>

                        <Pressable onPress={handleMasjidTypePress}>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('sect')}* </Text>
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {textAlign: I18nManager.isRTL ? 'right':'left'},
                                        masjidTypeInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                        { color: themeMode === "dark" ? '#fff' : '#000' }
                                    ]}
                                    value={masjidType}
                                    editable={false}
                                    placeholder={t('select_sect')}
                                    placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                    onFocus={() => setMasjidTypeInputFocused(true)}
                                    onBlur={() => setMasjidTypeInputFocused(false)}
                                />
                            </View>
                        </Pressable>
                        {showMasjidTypeOptions && (
                            <View style={[styles.masjidTypeOptions,themeMode === "dark" && {  backgroundColor: "#1C1C22" }]}>
                                <Text style={[styles.option,themeMode === "dark" && { color: '#fff'}]} onPress={() => handleMasjidTypeSelect('Sunni')}>Sunni</Text>
                                <Text style={[styles.option,themeMode === "dark" && { color: '#fff' }]} onPress={() => handleMasjidTypeSelect('Shia')}>Shia</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'column', justifyContent: 'center', paddingVertical: 10 }}>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('email')}:</Text>
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {textAlign: I18nManager.isRTL ? 'right':'left'},
                                        emailInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                        { color: themeMode === "dark" ? '#fff' : '#000' }
                                    ]}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder={t('enter_email_masjid')}
                                    keyboardType='email-address'
                                    placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                    onFocus={() => setEmailInputFocused(true)}
                                    onBlur={() => setEmailInputFocused(false)}
                                />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('phone')}:</Text>
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {textAlign: I18nManager.isRTL ? 'right':'left'},
                                        phoneInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                        { color: themeMode === "dark" ? '#fff' : '#000' }
                                    ]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder={t('enter_phone_masjid')}
                                    keyboardType="phone-pad"
                                    placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                    onFocus={() => setPhoneInputFocused(true)}
                                    onBlur={() => setPhoneInputFocused(false)}
                                />
                            </View>
                        </View>
                    </View>
                )}
                {/* Other steps can be handled similarly */}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select an option</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                handleCameraLaunch();
                            }}
                        >
                            <Text style={styles.textStyle}>Take Photo</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                openImagePicker();
                            }}
                        >
                            <Text style={styles.textStyle}>Choose from Gallery</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CurrentSteps1;

const styles = StyleSheet.create({
 
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadContainer: {
        height: 160,
        width: 300,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
        backgroundColor: '#E1E2E2',

    },
 
    uploadText: {
        fontSize: 16,
        color: '#555',
    },
    imageContainer: {
        position: 'relative',
        margin: 5,
    },
    uploadedImage: {
        height: 160,
        width: 250,
    },
    removeImageIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 13,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: 300,
        // marginLeft: '5%',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#AAAAAA',
        paddingHorizontal: 10,
        marginBottom: 10,
        // textAlign:'right'
    },
    masjidTypeOptions: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        borderColor:'#fff',
        borderWidth: 1,
        elevation: 6,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        height: 100,
        width: 290,
        borderRadius: 7,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginLeft: 15,
        marginVertical:5,
        bottom: 10,
    },
    option: {
        alignSelf: 'flex-start',
        padding: 8,
        fontSize: 16,
        color: '#000',
    },
    stepCount: {
        alignSelf: 'flex-start',
        margin: 10,
        left: 15,
        fontSize: 20,
        fontWeight: '700'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    uploadimagescontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,

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
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '90%',
        alignItems: 'center'
    },
    button: {
        height: 50,
        width: '50%',
        backgroundColor: '#0a9484',
        borderRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical:10,
    },
   
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        fontSize: 18,
    },
    uploadimagesText: {
        fontSize: 10,
        alignSelf: 'flex-start',
        left: 25,
        bottom: 15
    },
    subTitle: {
        fontSize: 15,
        color: '#000',
        left: 5
    },
    masjidTitle: {
        alignSelf: 'flex-start',
        left: 25,
        fontSize: 16,
        fontWeight: '500',
        bottom: 10
    },

})