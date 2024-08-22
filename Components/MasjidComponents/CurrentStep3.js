import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable,I18nManager } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import UserIcons from "react-native-vector-icons/Entypo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const CurrentStep3 = ({ currentStep, themeMode }) => {
    const [isNameInputFocused, setNameInputFocused] = useState(false);
    const [isAddressInputFocused, setAddressInputFocused] = useState(false);
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [admins, setAdmins] = useState([]);
    const { t } = useTranslation();

    const addAdmin = () => {
        if (name && emailAddress) {
            setAdmins([...admins, { name, emailAddress }]);
            setName('');
            setEmailAddress('');
            setNameInputFocused(false);
            setAddressInputFocused(false);
        }
    };

    const removeAdmin = (index) => {
        const newAdmins = admins.filter((_, i) => i !== index);
        setAdmins(newAdmins);
    };
    useEffect(() =>{
        saveDataAdmins();
    })
        // Save data to AsyncStorage
        const saveDataAdmins = async () => {
            try {
                await AsyncStorage.setItem('admins', JSON.stringify(admins));
            } catch (error) {
                console.error('Failed to save data to AsyncStorage', error);
            }
        };
        

    return (
        <View style={[{ flex: 1 },themeMode === "dark" && {backgroundColor:'#1C1C22'}]}>
            <StepIndicator
                customStyles={styles.stepIndicatorStyles}
                currentPosition={currentStep}
                stepCount={5}
            />

            {currentStep === 2 && (
                <View style={styles.stepContainer}>
                    <Text style={[styles.stepCount,themeMode === "dark" && {color:'#fff'}]}>{currentStep + 1}/5 {t('admin')}</Text>
                    <View style={{ paddingHorizontal: 5, paddingBottom: 15 }}>
                        <Text numberOfLines={2} style={[styles.subTitle,themeMode === "dark" && {color:'#fff'}]}>{t('admin_subline')}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('admin_fullname')}* </Text>
                        </View>
                        <TextInput
                            multiline
                            style={[
                                styles.inputAddress,
                                isNameInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                { color: themeMode === "dark" ? '#fff' : '#000', }
                            ]}
                            value={name}
                            onChangeText={text => setName(text)}
                            placeholder={t('admin_fullname')}
                            placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                            onFocus={() => setNameInputFocused(true)}
                            onBlur={() => setNameInputFocused(false)}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('admin_email')}* </Text>
                        </View>
                        <TextInput
                            keyboardType='email-address'
                            style={[
                                styles.inputAddress,
                                isAddressInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                                { color: themeMode === "dark" ? '#fff' : '#000', }
                            ]}
                            value={emailAddress}
                            onChangeText={text => setEmailAddress(text)}
                            placeholder={t('admin_email')}
                            placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                            onFocus={() => setAddressInputFocused(true)}
                            onBlur={() => setAddressInputFocused(false)}
                        />
                    </View>
                </View>
            )}
            <View style={styles.btnContainer}>
                <Pressable
                    onPress={addAdmin}
                    style={[
                        styles.addBtnContainer,
                        { backgroundColor: name && emailAddress ? '#0a9484' : '#E0E0E0' }
                    ]}
                >
                    <Text style={themeMode === "dark"? '#000' : "#fff"}>{t('admin_add_button')}</Text>
                </Pressable>
            </View>
            <View style={styles.lineContainer} />
            {admins.length > 0 ? (
                <View style={styles.adminContainer}>
                    <Text style={[{ alignSelf: 'flex-start', fontSize: 15, fontWeight: '600', bottom: 10, marginLeft: 15 },{color: themeMode === "dark"? "#fff":"#000"}]}>{t('admin_list_line')}</Text>
                    {admins.map((admin, index) => (
                        <View key={index} style={styles.adminDetails}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[{ alignSelf: 'flex-start', fontSize: 15, fontWeight: '600' },{color:themeMode === "dark" ? "#fff" : "#000"}]}>{admin.name}</Text>
                                <Pressable style={styles.removeImageIcon} onPress={() => removeAdmin(index)}>
                                    <Text style={styles.removeImageText}>✕</Text>
                                </Pressable>
                            </View>
                            <Text style={[{ alignSelf: 'flex-start', },{color:themeMode === "dark" ? "#fff" : "#000"}]}>{admin.emailAddress}</Text>

                        </View>
                    ))}
                </View>
            ) : (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                    <Text style={[{ alignSelf: 'flex-start', fontSize: 15, fontWeight: '600', bottom: 25, marginLeft: 15 },{color: themeMode === "dark"? "#fff":"#000"}]}>{t('admin_list_line')} </Text>
                    <UserIcons name='users' size={70} color={themeMode === "dark" ? '#fff' : '#E0E0E0'} />
                    <Text style={{ color: themeMode === "dark" ? '#fff' : '#000', marginVertical: 10 }}>{t('no_admin_added')}</Text>
                </View>
            )}
        </View>
    );
}

export default CurrentStep3;

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
    inputAddress: {
        height: 40,
        width: 300,
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#AAAAAA',
        textAlign:I18nManager.isRTL ? 'right' : 'left'

    },
    addBtnContainer: {
        height: 40,
        width: 300,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'#0a9484'
    },
    btnContainer: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineContainer: {
        marginTop: 20,
        borderBottomColor: '#AAAAAA',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminContainer: {
        marginTop: 20,
        marginLeft: 10,
        width: 360,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminDetails: {
        paddingVertical: 10,
        top: 10,
        right: 35,
        marginBottom: 10,
        // position: 'relative',
    },
    removeImageIcon: {
        // position: 'absolute',
        left: 40,
        backgroundColor: '#000',
        borderRadius: 13,
        width: 17,
        height: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: 'white',
        fontSize: 14,
    },
});
