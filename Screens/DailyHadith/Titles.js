import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper';
import HeaderBack from '../../Components/HeaderBack';
import AllTitles from '../../Jsondata/AllTitles.json'
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const Titles = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTitles, setFilteredTitles] = useState([]);
    const item = route.params?.item;
    const bookId = item?.id;
    const { themeMode } = useAuthContext();
    const { t } = useTranslation();

    useEffect(() => {
        if (bookId) {
            let data = AllTitles.chapters.filter((chapter) => chapter.bookId === bookId);
            if (searchQuery) {
                data = data.filter((chapter) =>
                    chapter.english.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setFilteredTitles(data);
        } else {
            let data = AllTitles.chapters;
            if (searchQuery) {
                data = data.filter((chapter) =>
                    chapter.english.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setFilteredTitles(data);
        }
    }, [bookId, searchQuery]);

    const handlePressToDuas = (item, bookId) => {
        navigation.navigate('Hadiths', { item, bookId });
    };

    const renderItem = ({ item, index }) => {
        return (
            <Pressable onPress={() => handlePressToDuas(item)}>
                <View style={[styles.titleItem, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
                    <Text numberOfLines={1} style={[styles.title, themeMode == "dark" && { color: "#fff" }]}>
                        {/* {index + 1}.  {item.english} */}
                        {`${index + 1}. ${t(`english.${item.english}`)}`}
                    </Text>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={[styles.container, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
            <HeaderBack title= {t(`book.${item?.english}`)} navigation={navigation} />
            <View style={[styles.searchContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
                <Searchbar
                    style={[styles.searchBar, themeMode == "dark" && { backgroundColor: "#3F4545" }]}
                    iconColor={themeMode == "dark" ? "#fff" : "#000"}
                    placeholderTextColor={themeMode == "dark" ? "#fff" : "#000"}
                    inputStyle={[{
                        minHeight: 0,
                    }, themeMode == "dark" && { color: '#fff' }, themeMode != "dark" && { color: '#000' }]}

                    selectionColor={'#0a9484'}
                    placeholder={t('search')}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredTitles}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default memo(Titles);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    titleItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
    title: {
        fontSize: 15,
        fontWeight: '600'
    },
    searchBar: {
        height: 43,
        width: '88%',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#F6F4F5',
    },

});
