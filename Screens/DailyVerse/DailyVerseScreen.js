import { ActivityIndicator, StyleSheet, Text, View, FlatList, Pressable, Share } from 'react-native';
import React, { useState, useEffect, useCallback, memo } from 'react';
import HeaderBack from '../../Components/HeaderBack';
import { useAuthContext } from '../../Navigations/AuthContext';
import RefreshIcon from "react-native-vector-icons/Ionicons";
import ShareIcon from "react-native-vector-icons/AntDesign";

const DailyVerseScreen = ({ navigation, route }) => {
    const { themeMode } = useAuthContext();
    const [verse, setVerse] = useState(route.params?.verse || null);
    const [loading, setLoading] = useState(!route.params?.verse);
    const fetchRandomVerse = useCallback(() => {
        setLoading(true);
        fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json')
            .then(response => response.json())
            .then(data => {
                const randomChapter = data[Math.floor(Math.random() * data.length)];
                const firstVerse = randomChapter.verses[0];
                setVerse({
                    transliteration: randomChapter.transliteration,
                    translation: firstVerse.translation,
                    text: firstVerse.text
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching the verse:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!verse) {
            fetchRandomVerse(); // Fetch verse if none is passed
        }
    }, [fetchRandomVerse, verse]);

    const handleShare = () => {
        if (verse) {
            Share.share({
                message: `${verse.text} - ${verse.translation}`
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
                            <View style={[styles.hadithContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
                                <Text style={[styles.arabicText, themeMode == "dark" && { color: "#fff" }]}>{verse.text}</Text>
                                <Text style={[styles.englishText, themeMode == "dark" && { color: "#fff" }]}>{verse.translation}</Text>
                                {/* <Text style={[styles.englishText, themeMode == "dark" && { color: "#fff" }]}>jhjdbhbv{'\n'}jhbhvhj</Text> */}
                            </View>
                        )}
                    </>
                )}
            </View>
        );
    }, [loading, verse, themeMode]);

    return (
        <View style={[{ flex: 1 }]}>
            <HeaderBack title={'Daily Ayah'} navigation={navigation} />
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
                    onPress={fetchRandomVerse}
                />
            </View>
            <View style={[styles.buttonContainer, themeMode == "dark" && { backgroundColor: "#3F4545" }]}>
                <Pressable style={{ alignItems: 'center', flexDirection: 'row' }} onPress={handleShare}>
                    <ShareIcon
                        name="sharealt"
                        size={20}
                        style={[styles.shareIcon, themeMode == "dark" && { color: "#fff" }]}
                    />
                    <Text style={[{ fontSize: 13, fontWeight: '500', color: '#0a9484', right:5 }, themeMode == "dark" && { color: "#fff" }]}>Share</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default memo(DailyVerseScreen);

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
        left: 5,
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
    }
});
