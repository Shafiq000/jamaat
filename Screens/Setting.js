import React, { useState, useRef, useCallback } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'; // Optional: If you want to restart the app after language change
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderBack from '../Components/HeaderBack';
import { useAuthContext } from '../Navigations/AuthContext';
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";

const Setting = ({ navigation }) => {
    const { themeMode, isAuthenticated } = useAuthContext();
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [pendingLanguage, setPendingLanguage] = useState(null); // Store selected language before confirmation
    const bottomSheetRef = useRef(null);
    const { t, i18n } = useTranslation();
    const selectedLanguageCode = i18n.language;

    const LANGUAGES = [
        { code: "en", label: "English" },
        { code: "ur", label: t('urdu') },
    ];
    
    const handleLanguageSelect = (languageCode) => {
        const selectedLangLabel = LANGUAGES.find(lang => lang.code === languageCode)?.label || 'English';
        setPendingLanguage({ code: languageCode, label: selectedLangLabel }); // Set pending language
    };

    const confirmLanguageChange = () => {
        if (pendingLanguage) {
            setSelectedLanguage(pendingLanguage.label);
            setLanguage(pendingLanguage.code);
            bottomSheetRef.current?.close();
        }
    };

    const setLanguage = async (code) => {
        // Handle RTL layout for Urdu
        I18nManager.forceRTL(code === "ur");

        // Change the language using i18n
        i18n.changeLanguage(code);

        // Optionally store the language in AsyncStorage
        await AsyncStorage.setItem('language', code);

        // Restart the app if needed to apply RTL changes
        if (Platform.OS !== "web") {
            RNRestart.Restart();
        }
    };

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ), []);

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    return (
        <SafeAreaView style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
            <HeaderBack title={t('setting')} navigation={navigation} />
            <View style={{ flexDirection: "column" }}>
                {isAuthenticated ? (
                    <Pressable onPress={() => navigation.navigate("Profile")}>
                        <View style={styles.items}>
                            <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{t('account_setting')}</Text>
                            <Icon name={I18nManager.isRTL ? "left" : "right"} size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                        </View>
                    </Pressable>
                ) : null}
                <Pressable onPress={() => navigation.navigate("PrayerSetting")}>
                    <View style={styles.items}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{t('prayer_setting')}</Text>
                        <Icon name={I18nManager.isRTL ? "left" : "right"} size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("AlarmNotification")}>
                    <View style={styles.items}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{t('notification')}</Text>
                        <Icon name={I18nManager.isRTL ? "left" : "right"} size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                    </View>
                </Pressable>
                <Pressable onPress={openBottomSheet}>
                    <View style={styles.items}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{t('language')}</Text>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>{selectedLanguage}</Text>
                    </View>
                </Pressable>
            </View>
            <BottomSheet
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                handleComponent={null}
                handleIndicatorStyle={{ display: "none" }}
                ref={bottomSheetRef}
                snapPoints={["30%"]}
                index={-1} // Ensure BottomSheet starts closed
            >
                <View style={[styles.bottomSheetContent,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                    {LANGUAGES.map((language) => (
                        <Pressable 
                            key={language.code} 
                            onPress={() => handleLanguageSelect(language.code)}
                            style={[
                                styles.languageOptionContainer,
                                pendingLanguage?.code === language.code && styles.selectedLanguageContainer
                            ]}
                        >
                            <Text style={[
                                styles.languageOption,
                                themeMode === "dark" && { color: "#fff" },
                                pendingLanguage?.code === language.code && { fontWeight: 'bold', color: '#0a9484' }
                            ]}>
                                {language.label}
                            </Text>
                            {pendingLanguage?.code === language.code && (
                                <Icon name="check" size={20} style ={themeMode === "dark" && { color: "#0a9484" }} />
                            )}
                        </Pressable>
                    ))}
                    <Pressable style={styles.confirmButton} onPress={confirmLanguageChange}>
                        <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
                    </Pressable>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    items: {
        flexDirection: "row",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 25
    },
    title: {
        fontSize: 14,
        fontWeight: "500"
    },
    bottomSheetContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    languageOptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedLanguageContainer: {
        borderColor: '#0a9484',
    },
    languageOption: {
        fontSize: 16,
    },
    confirmButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#0a9484',
        borderRadius: 5,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Setting;
