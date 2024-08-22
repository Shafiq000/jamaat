import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, PermissionsAndroid, Image, ActivityIndicator, TextInput,I18nManager, Modal, FlatList } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MosqueIcons from "react-native-vector-icons/MaterialIcons";
import LocIcons from "react-native-vector-icons/Entypo";
import DownIcon from "react-native-vector-icons/AntDesign";
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const GOOGLE_API_KEY = "AIzaSyDZy9lBieXFt2KDcxhLub2QG-2XicbmSM0"; 

const CurrentStep2 = ({ currentStep, themeMode,showAddressDetails, showMap, handleBackToMap }) => {
    const navigation = useNavigation();
    const [location, setLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [isAddressInputFocused, setAddressInputFocused] = useState(false);
    const [isZipCodeInputFocused, setZipCodeInputFocused] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [currentField, setCurrentField] = useState('');
    const { t } = useTranslation();

    const mapCustomStyle = [
        {
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ];
    useEffect(() => {
        if (currentStep === 1) {
            getCurrentLocation();
        }
    }, [currentStep]);

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                debouncedGetAddress(latitude, longitude);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            },
            {
                TIMEOUT: 300,
                POSITION_UNAVAILABLE: 2,
                PERMISSION_DENIED: 1,
                message: "Location request timed out",
                ACTIVITY_NULL: 4,
                code: 3,
            }
        );
    };

    const getAddressFromCoordinates = async (latitude, longitude) => {
        setLoading(true);
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const addressComponent = data.results[0].formatted_address;
                const addressDetails = data.results[0].address_components;

                let country = '', region = '', city = '', zipcode = '';
                addressDetails.forEach(component => {
                    if (component.types.includes('country')) country = component.long_name;
                    if (component.types.includes('administrative_area_level_1')) region = component.long_name;
                    if (component.types.includes('locality')) city = component.long_name;
                    if (component.types.includes('postal_code')) zipcode = component.long_name;
                });

                setAddress(addressComponent);
                setCountry(country);
                setRegion(region);
                setCity(city);
                setZipcode(zipcode);
            } else {
                setAddress('Address not found');
            }
        } catch (error) {
            console.error(error);
            setAddress('Error fetching address');
        } finally {
            setLoading(false);
        }
    };

    const debouncedGetAddress = useCallback(debounce(getAddressFromCoordinates, 400), []);

    const handlePress = () => {
        getCurrentLocation();
    };


    const locationData = {
        Pakistan: {
            regions: ['Punjab', 'Balochistan', 'Sindh', 'Khyber Pakhtunkhwa'],
            cities: {
                Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi'],
                Balochistan: ['Quetta', 'Gwadar', 'Pishin'],
                Sindh: ['Karachi', 'Hyderabad', 'Sukkur'],
                Khyber_Pakhtunkhwa: ['Peshawar', 'Mardan', 'Swat']
            }
        },
        Canada: {
            regions: ['Nova Scotia', 'Alberta', 'Ontario'],
            cities: {
                Nova_Scotia: ['Halifax', 'Dartmouth'],
                Alberta: ['Calgary', 'Edmonton'],
                Ontario: ['Toronto', 'Ottawa']
            }
        },
        // Add more countries with their regions and cities
    };

    const openModal = (field) => {
        setCurrentField(field);
        let data = [];
        if (field === 'country') {
            data = Object.keys(locationData); // List of countries
        } else if (field === 'region') {
            data = locationData[country]?.regions || []; // Regions for selected country
        } else if (field === 'city') {
            // Update cities based on selected region
            data = locationData[country]?.cities[region] || []; // Cities for selected region
        }
        setModalData(data);
        setModalVisible(true);
    };

    const handleSelect = (item) => {
        if (currentField === 'country') {
            setCountry(item);
            setRegion(''); // Reset region when country changes
            setCity(''); // Reset city when country changes
        } else if (currentField === 'region') {
            setRegion(item);
            setCity(''); // Reset city when region changes
        } else if (currentField === 'city') {
            setCity(item);
        }
        setModalVisible(false);
    };

    useEffect(() => {
        if (location.latitude && location.longitude && address && country && region && city && zipcode) {
            saveDataLocation();
        }
    }, [location, address, country, region, city, zipcode]);

        // Save data to AsyncStorage
   const saveDataLocation = async () => {
    try {
        const data = {
            country,
            latitude: location.latitude,
            longitude: location.longitude,
            address,
            city,
            region,
            zipcode
        };
        await AsyncStorage.setItem('saveDataLocation', JSON.stringify(data));
        console.log("data", JSON.stringify(data,null,2));
    } catch (error) {
        console.error('Failed to save data to AsyncStorage', error);
    }
};
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={[styles.contentContainer,themeMode === "dark" && {  backgroundColor: "#1C1C22" }]}>
                <StepIndicator
                    customStyles={styles.stepIndicatorStyles}
                    currentPosition={currentStep}
                    stepCount={5}
                />

                {currentStep === 1 && showMap && (
                    <View style={styles.stepContainer}>
                        <Text style={[styles.stepCount,themeMode === "dark" && { color: "#fff" }]}>{currentStep + 1}/5 {t('location')}</Text>
                        <View style={{ paddingHorizontal: 5, paddingBottom: 15 }}>
                            <Text numberOfLines={2} style={[styles.subTitle,themeMode === "dark" && { color: "#fff" }]}>{t('location_subline')}.</Text>
                        </View>
                        <View style={styles.mapContainer}>
                            {location && (
                                <MapView
                                customMapStyle={themeMode === "dark" ? mapCustomStyle : []}
                                    provider={PROVIDER_GOOGLE}
                                    style={{ flex: 1 }}
                                    region={location}
                                    onRegionChangeComplete={(region) => {
                                        setLocation(region);
                                        debouncedGetAddress(region.latitude, region.longitude);
                                    }}
                                    onMapReady={() => setMapLoaded(true)}
                                >
                                    {mapLoaded && (
                                        <Marker coordinate={location}>
                                            <View style={styles.customMarkerMosque}>
                                                <Image
                                                    source={require('../../src/Images/pin.png')}
                                                    style={{ height: 35, width: 35 }}
                                                />
                                                <MosqueIcons name='mosque' size={15} color={'#fff'} right={25} bottom={3} />
                                            </View>
                                        </Marker>
                                    )}
                                </MapView>
                            )}
                        </View>
                        <Pressable style={styles.mylocationIcon} onPress={handlePress}>
                            <MaterialIcons name="my-location" size={30} color="#0a9484" />
                        </Pressable>
                        <View style={[styles.addressContainer,,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                            {loading ? <ActivityIndicator size="large" color="#0a9484" /> : <Text style={styles.addressText}>{address}</Text>}
                        </View>
                    </View>
                )}

                {currentStep === 1 && showAddressDetails && (
                    <View style={[styles.stepContainer,themeMode === "dark" && {  backgroundColor: "#1C1C22" }]}>
                        <Text style={[styles.stepCount,themeMode === "dark" && { color: "#fff" }]}>{currentStep + 1}/5 {t('address_detail')}</Text>
                        <View style={{ paddingHorizontal: 5, paddingBottom: 15 }}>
                        <Text numberOfLines={2} style={[styles.subTitle,,themeMode === "dark" && { color: "#fff" }]}>{t('address_detail_subline')}</Text>
                        </View>
                       
                            <View style={[styles.addressContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                                <Pressable onPress={handleBackToMap} style={styles.baKMapbtn}>
                                    <LocIcons name='location' size={20} color={'#fff'} />
                                    <Text style={{ color: '#fff' }}>{t('map_botton')}</Text>
                                </Pressable>
                                <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('address')}* </Text>
                                    </View>
                                    <TextInput
                                        multiline
                                        style={[
                                            styles.inputAddress,
                                            themeMode === "dark" && { backgroundColor: "#1C1C22" },
                                            isAddressInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                            { color: themeMode === "dark" ? '#fff' : '#000', textAlignVertical: 'center' }
                                        ]}
                                        value={address}
                                        onChangeText={text => setAddress(text)}
                                        // placeholder='Enter full name'
                                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                        onFocus={() => setAddressInputFocused(true)}
                                        onBlur={() => setAddressInputFocused(false)}
                                    />

                                </View>
                                <View style={styles.inputWrapper}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('select_country')}* </Text>
                                    </View>
                                    <Pressable onPress={() => openModal('country')}>
                                        <TextInput
                                            editable={false}
                                            style={[
                                                styles.inputdisablefield,
                                                { borderColor: themeMode === "dark" ? '#fff' : '#AAAAAA' },
                                                { color: themeMode === "dark" ? '#fff' : '#000' }
                                            ]}
                                            placeholder="Country"
                                            value={country}
                                            onFocus={() => openModal('country')}
                                        />
                                        <DownIcon name="down" size={20} style={[styles.dropdownIcon,themeMode === "dark" && { color: "#fff" }]} />
                                    </Pressable>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('select_region')}* </Text>
                                    </View>
                                    <Pressable onPress={() => openModal('region')}>
                                        <TextInput
                                            editable={false}
                                            style={[
                                                styles.inputdisablefield,
                                                { borderColor: themeMode === "dark" ? '#fff' : '#AAAAAA' },
                                                { color: themeMode === "dark" ? '#fff' : '#000' }
                                            ]}
                                            placeholder="region"
                                            value={region}
                                            onFocus={() => openModal('region')}
                                        />
                                        <DownIcon name="down" size={20} style={[styles.dropdownIcon,themeMode === "dark" && { color: "#fff" }]} />
                                    </Pressable>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('select_city')}* </Text>
                                    </View>
                                    <Pressable onPress={() => openModal('city')}>
                                        <TextInput
                                            editable={false}
                                            style={[
                                                styles.inputdisablefield,
                                                { borderColor: themeMode === "dark" ? '#fff' : '#AAAAAA' },
                                                { color: themeMode === "dark" ? '#fff' : '#000' }
                                            ]}
                                            placeholder="city"
                                            value={city}
                                            onFocus={() => openModal('city')}
                                        />
                                        <DownIcon name="down" size={20} style={[styles.dropdownIcon,themeMode === "dark" && { color: "#fff" }]} />
                                    </Pressable>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('select_lat_long')}* </Text>
                                    </View>

                                    <TextInput
                                        editable={false}
                                        style={[
                                            styles.inputlatilongfield,
                                            //  themeMode === "dark" && { backgroundColor: "#1C1C22" },
                                            { borderColor: themeMode === "dark" ? '#fff' : '#AAAAAA' },
                                            { color: themeMode === "dark" ? '#000' : '#AAAAAA' }
                                        ]}
                                        // placeholder="city"
                                        value={`${location.latitude}, ${location.longitude}`}

                                    />


                                </View>
                                <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('zipcode')}* </Text>
                                    </View>
                                    <TextInput
                                        multiline
                                        style={[
                                            styles.inputZipcode,
                                            isZipCodeInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                            { color: themeMode === "dark" ? '#fff' : '#000', textAlignVertical: 'center' }
                                        ]}
                                        value={zipcode}
                                        onChangeText={text => setZipcode(text)}
                                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                                        onFocus={() => setZipCodeInputFocused(true)}
                                        onBlur={() => setZipCodeInputFocused(false)}
                                    />

                                </View>

                            </View>
                    
                    </View>
                )}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent,themeMode === "dark" && {backgroundColor:'#1C1C22'}]}>
                        <FlatList
                            data={modalData}
                            renderItem={({ item }) => (
                                <Pressable style={styles.modalItem} onPress={() => handleSelect(item)}>
                                    <Text style={[styles.modalItemText,themeMode === "dark" && {color:'#fff'}]}>{item}</Text>
                                </Pressable>
                            )}
                            keyExtractor={(item) => item}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}


export default CurrentStep2;

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        width: '100%',
        height: 380,
    },
    mylocationIcon: {
        position: "absolute",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        right: 30,
        height: "8%",
        width: "12%",
        bottom: 70,
        borderRadius: 35,
    },
    subTitle: {
        fontSize: 15,
        color: '#000',
        left: 5
    },
    stepCount: {
        alignSelf: 'flex-start',
        margin: 10,
        left: 15,
        fontSize: 20,
        fontWeight: '700'
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
    markerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#0a9484',
        borderWidth: 1,
    },
    addressContainer: {
        backgroundColor: '#ffff',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 10,
        // paddingHorizontal: 15
        width: '100%',
        padding: 20,
    },
    addressText: {
        fontSize: 16,
        color: '#91908C',
    },
    customMarkerMosque: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
    },
    nextButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#0a9484',
        borderRadius: 5,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        // height: 40,
        // width: '90%',
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: '#AAAAAA',
    },
    bodyContainer: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    inputAddress: {
        height: 60,
        width: 300,
        // marginLeft: '5%',
        borderWidth: 2,
        borderRadius: 5,
        // paddingLeft: 10,
        borderColor: '#AAAAAA',
        textAlign: 'center'
    },
    inputdisablefield: {
        height: 40,
        width: 300,
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#AAAAAA',
        textAlign:I18nManager.isRTL ? 'right' : 'left'
    },
    inputZipcode: {
        height: 40,
        width: 300,
        // marginLeft: '5%',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#AAAAAA',
        textAlign:I18nManager.isRTL ? 'right' : 'left'

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalItemText: {
        fontSize: 16,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',

    },
    dropdownIcon: {
        position: 'absolute',
        right: 7,
        bottom: 9
    },
    inputlatilongfield: {
        height: 40,
        width: 300,
        // borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        // borderColor: '#AAAAAA',
        backgroundColor: '#E9E8E5',
        textAlign:I18nManager.isRTL ? 'right' : 'left'
    },
    baKMapbtn: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 25,
        backgroundColor: '#0a9484',
        borderRadius: 5,
        marginBottom: 10,
        width: '90%',
        height: 50
    }
});
