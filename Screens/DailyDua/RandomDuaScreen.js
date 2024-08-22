import { ActivityIndicator, StyleSheet, Text, View, FlatList, Pressable, Share, Clipboard,I18nManager } from 'react-native';
import React, { useState, useEffect, useCallback,memo } from 'react';
import HeaderBack from '../../Components/HeaderBack';
import { useAuthContext } from '../../Navigations/AuthContext';
import RefreshIcon from "react-native-vector-icons/Ionicons";
import ShareIcon from "react-native-vector-icons/AntDesign";
import duasData from '../../Jsondata/Duas.json';
import CopyIcon from "react-native-vector-icons/Feather";
import ToastAndroid from "react-native-root-toast";
import { useTranslation } from "react-i18next";

const RandomDuaScreen = ({ navigation, route }) => {
    const { themeMode } = useAuthContext();
    const [verse, setVerse] = useState(route.params?.verse || null);
    const [loading, setLoading] = useState(!route.params?.verse);
    const { t } = useTranslation();

    const fetchRandomDua = () => {
        try {
            const randomDua = duasData.data[Math.floor(Math.random() * duasData.data.length)];
            setVerse({
                duaArabic: randomDua.duaarabic,
                duaEnglish: randomDua.duaenglish,
                translation: randomDua.english,
                references: randomDua.references
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching the dua:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!verse) {
            fetchRandomDua(); // Fetch verse if none is passed
        }
    }, [fetchRandomDua, verse]);

    const handleCopy = (duaArabic) => {
        Clipboard.setString(duaArabic);
        ToastAndroid.show("Dua Copied", {
            position: -120,
            duration: ToastAndroid.durations.LONG,
        });
    };

    const handleShare = () => {
        if (verse) {
            Share.share({
                message: `${verse.duaArabic} - ${verse.translation}`
            })
                .then((result) => console.log(result))
                .catch((errorMsg) => console.error(errorMsg));
        } else {
            console.error("Nothing to share.");
        }
    };

    const renderItem = useCallback(() => {
        return (
            <View>
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                    <>
                        {verse && (
                            <View style={{ flex: 1 }}>
                                <View style={[styles.hadithContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
                                    <Text style={[styles.arabicText,{ textAlign: I18nManager.isRTL ? 'left' : 'right' }, themeMode == "dark" && { color: "#fff" }]}>{verse.duaArabic}</Text>
                                    <Text style={[styles.englishText,{ textAlign: I18nManager.isRTL ? 'right' : 'left' }, themeMode == "dark" && { color: "#fff" }]}>{verse.duaEnglish}</Text>
                                    <Text style={[styles.englishText,{ textAlign: I18nManager.isRTL ? 'right' : 'left' }, themeMode == "dark" && { color: "#fff" }]}>{verse.translation}</Text>
                                    <Text style={[styles.englishText,{ textAlign: I18nManager.isRTL ? 'right' : 'left' }, themeMode == "dark" && { color: "#fff" }]}>{verse.references}</Text>
                                </View>
                                <View style={styles.copyContainer}>
                                    <CopyIcon
                                        name="copy"
                                        size={28}
                                        style={[styles.copyicon, themeMode === "dark" && { color: "#fff" }]}
                                        onPress={() => handleCopy(`${verse.duaArabic}\n${verse.duaEnglish}\n ${verse.translation}`)}
                                    />
                                </View>
                            </View>
                        )}
                    </>
                )}
            </View>
        );
    }, [loading, verse, themeMode]);

    return (
        <View style={[{ flex: 1 }]}>
            <HeaderBack title={t('daily_dua')} navigation={navigation} />
            <View style={[styles.contentContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[verse]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>
            <View style={styles.refresh}>
                <RefreshIcon
                    name="refresh-sharp"
                    size={28}
                    style={{ color: '#fff' }}
                    onPress={fetchRandomDua}
                />
            </View>
            <View style={[styles.buttonContainer, themeMode == "dark" && { backgroundColor: "#3F4545" }]}>
                <Pressable style={{ alignItems: 'center', flexDirection: 'row' }} onPress={handleShare}>
                    <ShareIcon
                        name="sharealt"
                        size={20}
                        style={[styles.shareIcon, themeMode == "dark" && { color: "#fff" }]}
                    />
                    <Text style={[{ fontSize: 13, fontWeight: '500', color: '#0a9484', right: 5 }, themeMode == "dark" && { color: "#fff" }]}>{t('share')}</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default memo(RandomDuaScreen);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    hadithText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#F6F4F5',
        padding: 12,
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    hadithContainer: {
        marginHorizontal: 12,
        marginBottom: 20,
    },
    arabicText: {
        textAlign: 'right',
        fontSize: 18,
        fontWeight: '600',
    },
    englishText: {
        marginTop: 10,
        textAlign: 'left',
        fontSize: 15,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        marginTop: 22,
        marginBottom: 5,
        gap: 20,
    },
    refresh: {
        height: 55,
        width: 55,
        backgroundColor: '#0a9484',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        position: 'absolute',
        bottom: 20,
        left: 150,
        zIndex: 1111
    },
    shareIcon: {
        color: '#0a9484',
        right: 10
    },
    copyContainer: {
        flexDirection: "row",
        marginLeft: 22,
        marginTop: 22,
        marginBottom: 5,
        gap: 20,
    }
});
