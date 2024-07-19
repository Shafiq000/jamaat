import React, { memo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useAuthContext } from "../../Navigations/AuthContext";
import { Searchbar } from 'react-native-paper';
import HeaderBack from "../../Components/HeaderBack";
const data = [
  {
    id: 1,
    title: "SB",
    urdu: 'صحيح البخار',
    english: 'Sahih Al-Bukhari',
    backgroundColor: "#F5C9CA",
  },
  {
    id: 2,
    title: "SM",
    urdu: 'صحیح مسلم',
    english: 'Sahih Muslim',
    backgroundColor: "#E3E6F9",
  },

  {
    id: 3,
    title: "N",
    urdu: 'سنن نسائی',
    english: 'Sunan an Nasai',
    backgroundColor: "#DEE9EB",
  },
  {
    id: 4,
    title: "AD",
    urdu: 'سنن ابی داؤد',
    english: 'Sunan Abi Dawud',
    backgroundColor: "#F5E8C8",
  },
  {
    id: 5,
    title: "T",
    urdu: 'جامع الترمذي',
    english: 'Jami at Tirmidhi',
    backgroundColor: "#F5E8C8",
  },
  {
    id: 6,
    title: "SM",
    urdu: 'سُنن ابن ماجه',
    english: 'Sunan Ibn Majah',
    backgroundColor: "#E3F9ED",
  },

];

const NameCard = memo(({ navigation, item }) => {
  const { themeMode } = useAuthContext();
  const handlePress = () => {
    navigation.navigate("Titles", { item });
  };

  return (
    <View style={[styles.Container, themeMode == "dark" && { backgroundColor: "#3F4545" }]}>
      <Pressable onPress={handlePress} style={{ alignItems: 'center' }}>
        <View style={[styles.innerBoxTittle, { backgroundColor: item.backgroundColor }]}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
        </View>
        <Text style={[{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 10 }, themeMode == "dark" && { color: "#fff" }]}>{item.urdu}</Text>
        <Text style={[{ fontSize: 16, fontWeight: '500', textAlign: 'center' }, themeMode == "dark" && { color: "#fff" }]}>{item.english}</Text>
      </Pressable>
    </View>
  );
});

const AppHomeHadith = ({ navigation }) => {
  const { themeMode } = useAuthContext();
  const renderItems = useCallback(
    ({ item, index }) => (
      <NameCard
        navigation={navigation}
        item={item}
        index={index}
      />
    ),
    [navigation]
  );
  const handleSearchPress = () => {
    navigation.navigate('SearchHadith');
  };
  return (
    <View style={[{ backgroundColor: '#FFFFFF', flex: 1 }]}>
      <HeaderBack title={'Jamaat Hadith'} navigation={navigation} />
      <View style={[styles.searchContainer, themeMode == "dark" && { backgroundColor: "#26272C", borderBottomColor: '#fff', borderWidth: 1 }]}>
        <Pressable onPress={handleSearchPress} style={styles.searchPressable}>
          <Searchbar
            style={[{
              height: 43,
              width: '88%',
              borderColor: 'lightgray',
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: '#F6F4F5',
            }, themeMode == "dark" && { backgroundColor: "#3F4545", borderColor: '#fff' }]}
            inputStyle={{
              minHeight: 0,

            }}
            iconColor={themeMode == "dark" ? "#fff" : "#000"}
            placeholderTextColor={themeMode == "dark" ? "#fff" : "#000"}
            selectionColor={'#0a9484'}
            placeholder="Search"
            editable={false}
          />
        </Pressable>
      </View>
      <View style={[styles.flatlistcontainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItems}
          numColumns={2}
        />
      </View>
    </View>
  );
};

export default memo(AppHomeHadith);

const styles = StyleSheet.create({
  Container: {
    height: 170,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#F6F4F5',
    marginHorizontal: 8,
    marginTop: 15,
    borderRadius: 10,
    // marginVertical:5
   
  },
  innerBoxTittle: {
    height: 50,
    width: 50,
    backgroundColor: '#E3E6F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  searchContainer: {
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
  searchPressable: {
    width: '100%',
    alignItems: 'center',
  },
  flatlistcontainer: {
    paddingHorizontal:12,
    // paddingVertical:10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

});
