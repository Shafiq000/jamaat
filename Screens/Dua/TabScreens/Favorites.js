import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../Navigations/AuthContext";
import { allTitles } from "./CatagoryList/components/DuaAzkarData";
import { useTranslation } from "react-i18next";

const Favorites = ({ navigation, route }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteDuas, setFavoriteDuas] = useState([]);
  const { t } = useTranslation();

  const fetchFavoritetitles = async () => {
    try {
      const favorites =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      // console.log("favorites",favorites);

      let favoriteTitles = allTitles.filter(title => favorites.some(fav => fav.title_id == title.id && fav.category_id == title.category_id))
      const filteredDuas = favoriteTitles.filter(
        (item) =>
          (item.title ?? "").toLowerCase().includes(
            (searchQuery ?? "").toLowerCase()
          )
      );

      setFavoriteDuas(filteredDuas);
    } catch (e) {
      console.error("Error retrieving favorites:", e);
    }
  };


  useEffect(() => {
    fetchFavoritetitles();
    // console.log("Component mounted");
    const unsubscribe = navigation.addListener("focus", () => {
      // console.log("Component focused");
      fetchFavoritetitles();
    });

    return unsubscribe;
  }, [navigation, searchQuery]);

  return (
    <View style={[styles.mainContainer, themeMode == "dark" && { backgroundColor: "#000" }]}>
      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={favoriteDuas}
        keyExtractor={(item, index) => item.id.toString() + index}
        renderItem={({ item, index }) => (
          <View style={styles.bodyContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate("DuasData", {
                  item: item,
                  isfavorite: true
                })
              }
            >
              <Text style={[styles.duaTitle, themeMode === "dark" && { backgroundColor: "#000", color: "#fff" }]}>
                {`${index + 1}. ${t(`title.${item.title}`)}`}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bodyContainer: {
    flex: 1,
    paddingVertical: 18,
    borderTopColor: "#cbcbcb",
    borderTopWidth: 1,
  },
  duaTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 15,
  },
});

export default Favorites;
