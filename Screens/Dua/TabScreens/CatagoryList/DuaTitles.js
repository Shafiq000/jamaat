import React, { memo, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  FlatList,
} from "react-native";
import LeftAerow from "react-native-vector-icons/Feather";
import SearchBar from "../../SearchBar";
import { allTitles } from "./components/DuaAzkarData";
import { useAuthContext } from "../../../../Navigations/AuthContext";
const NameCard = memo(({ navigation, item, categoryId }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const handlePress = () => {
    navigation.navigate("DuasData", { item, categoryId });
  };
  return (
    <View style={[styles.bodyContainer, themeMode == "dark" && { backgroundColor: "#000" }]}>
      <Pressable onPress={handlePress}>
        <Text style={[styles.duaTitle, themeMode == "dark" && { backgroundColor: "#000", color: "#FFFF" }]}>{item.title}</Text>
      </Pressable>
    </View>
  );
});

const DuaTitles = ({ navigation, route }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [filteredData, setFilterData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const item = route.params?.item;
  const categoryId = route.params?.item.id;

  useEffect(() => {
    if (categoryId === 1) {
      setFilterData(allTitles.filter(val => val.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      let data = allTitles.filter((val) => item.id === val.category_id);
      let filteredData = data.filter(
        (val) => val.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilterData(filteredData);
    }
  }, [searchQuery, categoryId, item.id]);



  const renderItems = useCallback(
    ({ item, index }) => (
      <NameCard
        navigation={navigation}
        item={item}
        categoryId={categoryId}
        index={index}
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={[styles.container, themeMode == "dark" && { backgroundColor: "#000" }]}>
      <View style={styles.mainHeader}>
        <Pressable onPress={() => navigation.goBack()}>
          <LeftAerow name="chevron-left" size={25} color={'#fff'} />
        </Pressable>
        <View style={styles.mainText}>
          <Text style={styles.headerText}>{item.title}</Text>
        </View>
      </View>

      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={renderItems}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default DuaTitles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainHeader: {
    flexDirection: "row",
    height: 55,
    backgroundColor: "#0a9484",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 15,
  },
  mainText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  bodyContainer: {
    borderTopColor: "#cbcbcb",
    borderTopWidth: 1,
    paddingVertical: 18,
  },
  duaTitle: {
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '600',
  },
});
