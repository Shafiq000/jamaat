import React, { useState, useEffect, useCallback, memo } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Clipboard, Share } from 'react-native';
import allDua from '../../Jsondata/AllHadiths.json'
import ToastAndroid from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavIcon from "react-native-vector-icons/FontAwesome";
import CopyIcon from "react-native-vector-icons/Feather";
import ShareIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from '../../Navigations/AuthContext';
import HeaderBack from '../../Components/HeaderBack';
const Hadiths = ({ navigation, route }) => {
    const [hadithss, setHadithss] = useState([]);
    const [isFavorite, setIsFavorite] = useState([]);
    const { themeMode } = useAuthContext();
    const { item, isfavorite } = route.params;

    const fetchDuas = async () => {
        const filteredData = allDua.hadiths.filter(
            (hadith) => hadith.chapterId === item.chapterId && hadith.bookId === item.bookId
        );

        if (isfavorite) {
            const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
            const favoriteFilteredData = filteredData.filter(hadith =>
                favorites.some(fav =>
                    fav.id === hadith.id && fav.chapterId === hadith.chapterId && fav.bookId === hadith.bookId
                )
            );
            setHadithss(favoriteFilteredData);
        } else {
            setHadithss(filteredData);
        }

        const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
        setIsFavorite(favorites);
    };

    useEffect(() => {
        fetchDuas();
    }, [item, isfavorite]);

    const handleCopy = (duaArabic) => {
        Clipboard.setString(duaArabic);
        ToastAndroid.show("Dua Copied", {
            position: -70,
            duration: ToastAndroid.durations.LONG,
        });
    };

    const handleShare = (duaArabic) => {
        Share.share({
            message: duaArabic,
        })
            .then((result) => console.log(result))
            .catch((errorMsg) => console.error(errorMsg));
    };

    const handleFavorite = async (dua) => {
        try {
            let favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
            const currentDate = new Date().getTime();

            const isAlreadyFavorite = favorites.some(
                (favorite) =>
                    favorite.id === dua.id &&
                    favorite.chapterId === dua.chapterId &&
                    favorite.bookId === dua.bookId
            );

            if (isAlreadyFavorite) {
                favorites = favorites.filter(
                    (favorite) =>
                        !(favorite.id === dua.id &&
                            favorite.chapterId === dua.chapterId &&
                            favorite.bookId === dua.bookId)
                );
                ToastAndroid.show("Removed from favorites", {
                    position: -80,
                    duration: ToastAndroid.durations.LONG,
                });
            } else {
                favorites.push({ ...dua, favoriteDate: currentDate });
                ToastAndroid.show("Added to favorites", {
                    position: -80,
                    duration: ToastAndroid.durations.LONG,
                });
            }

            setIsFavorite(favorites);
            await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        } catch (e) {
            console.error("Error updating favorites:", e);
        }
    };

    const renderItem = useCallback(({ item, index }) => {
        return (
            <View style={styles.hadithContainer}>
                <Text style={[styles.title, themeMode == "dark" && { color: "#fff" }]}>
                    {index + 1} {item?.item}
                </Text>
                <Text style={[styles.arabicText, themeMode == "dark" && { color: "#fff" }]}>{item.arabic}</Text>
                <Text style={styles.englishNarrator}>{item.english.narrator}</Text>
                <Text style={[styles.englishText, themeMode == "dark" && { color: "#fff" }]}>{item.english.text}</Text>
                <View style={styles.iconContainer}>
                    <CopyIcon
                        name="copy"
                        size={28}
                        style={[styles.copyicon, themeMode == "dark" && { color: "#fff" }]}
                        onPress={() => handleCopy(item.arabic + item.english.narrator + item.english.text)}
                    />
                    <ShareIcon
                        name="share-outline"
                        size={28}
                        style={[styles.shareIcon, themeMode == "dark" && { color: "#fff" }]}
                        onPress={() => handleShare(item.arabic + item.english.narrator + item.english.text)}
                    />
                    <FavIcon
                        name={
                            isFavorite?.some(
                                (favorite) =>
                                    favorite.id === item.id &&
                                    favorite.chapterId === item.chapterId &&
                                    favorite.bookId === item.bookId
                            )
                                ? "bookmark"
                                : "bookmark-o"
                        }
                        size={28}
                        style={[styles.hearticon, themeMode == "dark" && { backgroundColor: "#26272C", }]}
                        color={
                            isFavorite?.some(
                                (favorite) =>
                                    favorite.id === item.id &&
                                    favorite.chapterId === item.chapterId &&
                                    favorite.bookId === item.bookId
                            )
                                ? "#0a9484"
                                : themeMode == "dark"
                                    ? "#FFF"
                                    : "#000"
                        }
                        onPress={() => handleFavorite(item)}
                    />
                </View>
            </View>
        );
    }, [isFavorite, themeMode]);

    return (
        <View style={[styles.container, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
            <HeaderBack title={item?.english} navigation={navigation} />
            <FlatList
                data={hadithss}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default memo(Hadiths);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    hadithContainer: {
        borderBottomColor: "#cbcbcb",
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        // padding: 15,
    },
    arabicText: {

        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold',
    },
    englishNarrator: {
        textAlign: 'left',
        marginTop: 10,
        color: 'gray',
        fontSize: 15,
    },
    englishText: {
        left: 5,
        marginTop: 10,
        textAlign: 'left',
        fontSize: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '700'
    },
    icon: {
        position: "absolute",
        left: 16
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        marginTop: 22,
        marginBottom: 5,
        gap: 20,
    },
    shareIcon: {
        marginHorizontal: 5,
    },
    hearticon: {
        marginHorizontal: 5,
    },
});
