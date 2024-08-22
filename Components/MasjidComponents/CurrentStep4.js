import { StyleSheet, Text, View, Modal, Pressable,I18nManager } from 'react-native';
import React, { useState } from 'react';
import StepIndicator from 'react-native-step-indicator';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const CurrentStep4 = ({ currentStep, themeMode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [jamaatTimes, setJamaatTimes] = useState({
        Fajr: '--/--',
        Dhuhr: '--/--',
        Asr: '--/--',
        Maghrib: '--/--',
        Isha: '--/--'
    });
    const [currentPrayer, setCurrentPrayer] = useState('');
    const { t } = useTranslation();

    const handleConfirm = async () => {
        const hours = selectedTime.getHours();
        if (currentPrayer === 'Fajr' && hours >= 12) {
            alert('Fajr time must be in the AM.');
            return;
        }
        const updatedJamaatTimes = {
            ...jamaatTimes,
            [currentPrayer]: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setJamaatTimes(updatedJamaatTimes);
        await AsyncStorage.setItem('jamaatTimes', JSON.stringify(updatedJamaatTimes));
        setModalVisible(false);
    }

    const openModal = (prayer) => {
        setCurrentPrayer(prayer);
        setModalVisible(true);
    }

    return (
        <View style={[{ flex: 1 },themeMode === "dark" && {backgroundColor:'#1C1C22'}]}>
            <StepIndicator
                customStyles={styles.stepIndicatorStyles}
                currentPosition={currentStep}
                stepCount={5}
            />
            {currentStep === 3 && (
                <View style={styles.stepContainer}>
                    <Text style={[styles.stepCount,themeMode === "dark" && {color:'#fff'}]}>{currentStep + 1}/5 {t('jamaat_time')}</Text>
                    <View style={{ paddingHorizontal: 5, paddingBottom: 15 }}>
                        <Text numberOfLines={3} style={[styles.subTitle,themeMode === "dark" && {color:'#fff'}]}>{t('jamaat_time_subline')}.</Text>
                    </View>
                    <View style={styles.jamatContainer}>
                        {Object.keys(jamaatTimes).map((prayer, index) => (
                            <View key={index} style={styles.jamatBody}>
                                <Text style={[styles.prayerName,themeMode === "dark" && {color:'#fff'}]}>{t(`prayer.${prayer.toLowerCase()}`)}</Text>
                                <Text style={[styles.prayerTime,themeMode === "dark" && {color:'#fff'}]}>{jamaatTimes[prayer]}</Text>
                                <Pressable onPress={() => openModal(prayer)} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>{t('edit')}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <View style={[styles.datePickerContainer,themeMode === "dark" && {backgroundColor:'#1C1C22'}]}>
                            <Text style={[{fontSize:18,fontWeight:'700'},{color: themeMode === "dark"? "#fff" : "#000"}]}>{t('set_time')}</Text>
                            <DatePicker
                                dividerColor='#0a9484'
                                theme={themeMode === "dark" ? "dark" : "light"}
                                style={styles.dateTimePicker}
                                textColor={'#000'}
                                date={selectedTime}
                                mode="time"
                                is24hourSource="locale"
                                onDateChange={setSelectedTime}
                            />
                            <View style={styles.modalButtons}>
                                <Pressable style={{ paddingHorizontal: 10 }} onPress={() => setModalVisible(false)}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#0a9484' }}>{t('cancel')}</Text>
                                </Pressable>
                                <Pressable style={{ paddingHorizontal: 10, backgroundColor:'#0a9484', paddingVertical:6, borderRadius:7 }} onPress={handleConfirm}>
                                    <Text style={{ fontSize: 17, fontWeight: '500', color: '#fff' }}>{t('confirm')}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    )
}

export default CurrentStep4

const styles = StyleSheet.create({
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
    jamatContainer: {
        
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical:10,
    },
    jamatBody: {
        flexDirection:"row",
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10,
        paddingVertical:8,
       
    },
    prayerName: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        // textAlign:I18nManager.isRTL ? 'left':'right'
        alignSelf:I18nManager.isRTL ? 'flex-end' :'flex-start'
    },
    prayerTime: {
        flex: 1,
        fontSize: 16,
        fontWeight:'500',
        color: '#000',
        textAlign:I18nManager.isRTL ? 'left':'center'
    },
    editButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    editButtonText: {
        color: '#0a9484',
        fontSize: 15,
        fontWeight: '600'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
    datePickerContainer: {
        paddingVertical:40,

        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginTop: 20,
        paddingHorizontal:10,
    },
    dateTimePicker: {
        width: 250,
        height: 200,
    },
});
