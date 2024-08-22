import React, { useState, useEffect, memo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Clipboard, Share } from 'react-native';
import allDua from '../../Jsondata/AllHadiths.json'
import ToastAndroid from "react-native-root-toast";
import CopyIcon from "react-native-vector-icons/Feather";
import ShareIcon from "react-native-vector-icons/MaterialCommunityIcons";
import HeaderBack from '../../Components/HeaderBack';
import { Searchbar } from 'react-native-paper';
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

import _ from 'lodash';
const SearchHadith = ({ navigation }) => {
  const [hadithss, setHadithss] = useState([]);
  const [filteredHadiths, setFilteredHadiths] = useState([]);
  const { themeMode } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterId, setChapterId] = useState(null);
  const [bookId, setBookId] = useState(null);
  const { t } = useTranslation();

  const fetchDuas = async () => {
    setHadithss(allDua.hadiths);
    setFilteredHadiths([]);
  };

  useEffect(() => {
    fetchDuas();
  }, []);

  const handleCopy = (text) => {
    Clipboard.setString(text);
    ToastAndroid.show("Dua Copied", {
      position: -70,
      duration: ToastAndroid.durations.LONG,
    });
  };

  const handleShare = (text) => {
    Share.share({
      message: text,
    })
      .then((result) => console.log(result))
      .catch((errorMsg) => console.error(errorMsg));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = hadithss.filter((hadith) =>
        (chapterId === null || hadith.chapterId === chapterId) &&
        (bookId === null || hadith.bookId === bookId) &&
        (hadith.arabic.includes(query) ||
          hadith.english.narrator.includes(query) ||
          hadith.english.text.includes(query))
      );
      setFilteredHadiths(filteredData);
    } else {
      setFilteredHadiths([]);
    }
  };

  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 500), [hadithss, chapterId, bookId]);

  const handleChange = (query) => {
    setSearchQuery(query);
    debouncedHandleSearch(query);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlight}>
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={styles.hadithContainer}>
        <Text style={[styles.title, themeMode == "dark" && { color: "#fff" }]}>
          {index + 1} {item?.item}
        </Text>
        <Text style={[styles.arabicText, themeMode == "dark" && { color: "#fff" }]}>{highlightText(item.arabic, searchQuery)}</Text>
        <Text style={styles.englishNarrator}>{highlightText(item.english.narrator, searchQuery)}</Text>
        <Text style={[styles.englishText, themeMode == "dark" && { color: "#fff" }]}>{highlightText(item.english.text, searchQuery)}</Text>
        <View style={styles.iconContainer}>
          <CopyIcon
            name="copy"
            size={28}
            style={[styles.copyicon, themeMode == "dark" && { color: "#fff" }]}
            onPress={() => handleCopy(item.arabic + " " + item.english.narrator + " " + item.english.text)}
          />
          <ShareIcon
            name="share-outline"
            size={28}
            style={[styles.shareIcon, themeMode == "dark" && { color: "#fff" }]}
            onPress={() => handleShare(item.arabic + " " + item.english.narrator + " " + item.english.text)}
          />
        </View>
      </View>
    );
  }, [handleCopy, handleShare, searchQuery]);

  return (
    <View style={[styles.container, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
      <HeaderBack title={t('search_hadith')} navigation={navigation} />
      <View style={[styles.searchContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
        <Searchbar
          style={[{
            height: 43,
            width: '88%',
            borderColor: 'lightgray',
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#F6F4F5',
          }, themeMode == "dark" && { backgroundColor: "#3F4545" }]}
          inputStyle={[{
            minHeight: 0,
          }, themeMode == "dark" && { color: '#fff' }, themeMode != "dark" && { color: '#000' }]}

          iconColor={themeMode == "dark" ? "#fff" : "#000"}
          placeholderTextColor={themeMode == "dark" ? "#fff" : "#000"}
          autoFocus
          selectionColor={'#0a9484'}
          placeholder={t('search')}
          onChangeText={handleChange}
          value={searchQuery}
        />
      </View>
      {searchQuery.length > 0 ? (
        <FlatList
          data={filteredHadiths}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : null}
    </View>
  );
};

export default memo(SearchHadith);

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
  },
  arabicText: {
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold',
  },
  englishNarrator: {
    textAlign: 'left',
    marginTop: 10,
    color: 'gray',
    fontSize: 14,
  },
  englishText: {
    left: 5,
    marginTop: 10,
    textAlign: 'left',
    fontSize: 14,
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
  searchContainer: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 90,
    width: '100%',
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  highlight: {
    backgroundColor: '#009E60',
    fontWeight: '700',
    color: '#fff'
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 15,
    color: 'gray',
  },
});
