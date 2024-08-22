import React, { useState, useEffect, useCallback,memo } from 'react';
import { StyleSheet, Text, View, FlatList, Clipboard, Share, Image, Pressable,I18nManager } from 'react-native';
import allDua from '../../Jsondata/AllHadiths.json'
import CopyIcon from "react-native-vector-icons/Feather";
import ShareIcon from "react-native-vector-icons/AntDesign"
import ToastAndroid from "react-native-root-toast";
import FavIcon from "react-native-vector-icons/FontAwesome";
import RefreshIcon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../../Navigations/AuthContext';
import HeaderBack from '../HeaderBack';
import { useTranslation } from "react-i18next";

const DailyHadith = ({ route, navigation }) => {
  const [isFavorite, setIsFavorite] = useState([]);
  const { themeMode } = useAuthContext();
  const [currentHadith, setCurrentHadith] = useState(route.params?.hadith || null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentHadith) {
      fetchRandomHadith();
    }
  }, []);

  const fetchRandomHadith = useCallback(() => {
    const allHadiths = allDua.hadiths;
    const randomHadith = allHadiths[Math.floor(Math.random() * allHadiths.length)];
    setCurrentHadith(randomHadith);
  });

  const navigateToAllHadiths = () => {
    if (currentHadith) {
      navigation.navigate('Hadiths', {
        item: {
          chapterId: currentHadith.chapterId,
          bookId: currentHadith.bookId,
          english: "Hadiths"
        },
        isfavorite: false,
      });
    }
  };

  const handleCopy = (duaArabic) => {
    Clipboard.setString(duaArabic);
    ToastAndroid.show("Dua Copied", {
      position: -120,
      duration: ToastAndroid.durations.LONG,
    });
  };

  const handleShare = (hadith) => {
    if (hadith) {
      Share.share({
        message: hadith.arabic + hadith.english.narrator + hadith.english.text
      })
        .then((result) => console.log(result))
        .catch((errorMsg) => console.error(errorMsg));
    } else {
      console.error("Nothing to share.");
    }
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
        // Add to favorites along with current date
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

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={[styles.hadithContainer,themeMode == "dark" && { backgroundColor: "#26272C" }]}>
        <Text style={[styles.arabicText, { textAlign: I18nManager.isRTL ? 'left' : 'right' }, themeMode == "dark" && { color: "#fff" }]}>{item.arabic}</Text>
        <Text style={[styles.englishNarrator, { textAlign: I18nManager.isRTL ? 'right' : 'left' },]}>{item.english.narrator}</Text>
        <Text style={[styles.englishText, { textAlign: I18nManager.isRTL ? 'right' : 'left' }, themeMode == "dark" && { color: "#fff" }]}>{item.english.text}</Text>
        <View style={styles.iconContainer}>
          <CopyIcon
            name="copy"
            size={28}
            style={[styles.copyicon, themeMode == "dark" && { color: "#fff" }]}
            onPress={() => handleCopy(item.arabic + item.english.narrator + item.english.text)}
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
            style={[
              styles.hearticon,
              themeMode == "dark" && {
                backgroundColor: "#26272C",
              },
            ]}
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
  }, [isFavorite, themeMode, handleCopy, handleFavorite]);

  return (
    <View style={[{ flex: 1 }]}>
      <HeaderBack title={t('daily_hadith')} navigation={navigation} />
      <View style={[styles.contentContainer,themeMode == "dark" && { backgroundColor: "#26272C" }]}>
        {currentHadith ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[currentHadith]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <View style={styles.refresh}>
        <RefreshIcon
          name="refresh-sharp"
          size={28}
          style={{ color: '#fff' }}
          onPress={fetchRandomHadith}
        />
      </View>
      <View style={[styles.buttonContainer, themeMode == "dark" && { backgroundColor: "#3F4545" }]}>
        <Pressable onPress={navigateToAllHadiths}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
            <Image
              source={require('../../src/Images/book.png')}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[{ textAlign: 'center', fontSize: 13, fontWeight: '500', left: 8 }, themeMode == "dark" && { color: "#fff" }]}>{t('read')}</Text>
          </View>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
          <Pressable style={{ alignItems: 'center', flexDirection: 'row' }} onPress={() => handleShare(currentHadith)}>
            <ShareIcon
              name="sharealt"
              size={20}
              style={[styles.shareIcon, themeMode == "dark" && { color: "#fff" }]}
            />
            <Text style={[{ textAlign: 'center', fontSize: 13, fontWeight: '500', left: 8 }, themeMode == "dark" && { color: "#fff" }]}>{t('share')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default memo(DailyHadith);

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#A2A499',
    padding: 10,
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
    fontSize: 15,
    fontWeight: '600',
  },
  englishNarrator: {
    textAlign: 'left',
    marginTop: 10,
    color: 'gray',
    fontSize: 15,
  },
  englishText: {
    left: 4,
    marginTop: 10,
    textAlign: 'left',
    fontSize: 15,
    fontWeight: '600',
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
    color: '#0a9484'
  }
});
