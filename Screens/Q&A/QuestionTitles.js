import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import questionTitles from '../../Jsondata/QuestionAndAnswer.json';
import HeaderBack from '../../Components/HeaderBack';
import { Searchbar } from 'react-native-paper';
import { useAuthContext } from '../../Navigations/AuthContext';
import _ from 'lodash';
import { useTranslation } from "react-i18next";

const QuestionTitles = ({ navigation }) => {
    const { themeMode } = useAuthContext();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (questionTitles.data) {
            setData(questionTitles.data);
            setFilteredData(questionTitles.data);
        }
    }, []);

    const handleSearch = (query) => {
        if (data) {
            const filtered = data.filter(item => item.question.toLowerCase().includes(query.toLowerCase()));
            setFilteredData(filtered);
        }
    };

    const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 500), [data]);

    const handleChange = (query) => {
        setSearchQuery(query);
        debouncedHandleSearch(query);
    };

    const renderItem = ({ item }) => (
        <Pressable style={[styles.itemContainer, themeMode === 'dark' && { backgroundColor: '#3F4545' }]} onPress={() => navigation.navigate('QuestionAnswerScreen', { item })}>
            <Text numberOfLines={2} style={[styles.itemTitle, themeMode === 'dark' && { color: '#fff' }]}>{item.question}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.container,themeMode === 'dark' && { backgroundColor: '#1C1C22' }]}>
            <HeaderBack title={t('question_answer')} navigation={navigation} />
            <View style={styles.searchContainer}>
                <Searchbar
                    style={[
                        {
                            height: 43,
                            width: '88%',
                            borderColor: 'lightgray',
                            borderWidth: 1,
                            borderRadius: 7,
                            backgroundColor: '#E3E3E4',
                        },
                        themeMode === 'dark' && { backgroundColor: '#3F4545' },
                    ]}
                    inputStyle={[
                        {
                            minHeight: 0,
                        },
                        themeMode === 'dark' && { color: '#fff' },
                        themeMode !== 'dark' && { color: '#000' },
                    ]}
                    iconColor={themeMode === 'dark' ? '#fff' : '#000'}
                    placeholderTextColor={themeMode === 'dark' ? '#fff' : '#000'}
                    selectionColor={'#0a9484'}
                    placeholder={t('search_answer')}
                    onChangeText={handleChange}
                    value={searchQuery}
                />
            </View>
            <View style={styles.answerContent}>
                <Text style={[styles.answerTitle,themeMode === 'dark' && { color: '#fff' }]}>{t('new_answers')}</Text>
            </View>
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
};

export default QuestionTitles;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    searchContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 20,

    },
    itemContainer: {
        // padding: 15,
        // borderBottomWidth: 1,
        // borderColor: '#ccc',
        marginHorizontal: 18,
        paddingHorizontal: 8,
        justifyContent: 'center',
        height: 60,
        width: '90%',
        backgroundColor: '#E3E3E4',
        borderRadius: 5,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    itemTitle: {
        fontWeight: '700',
        fontSize: 15,
    },
    answerContent: {
        paddingVertical: 10,
        marginHorizontal: 15
    },
    answerTitle: {
        fontWeight: '700',
        fontSize: 20,
        marginBottom: 15,
    }
});
