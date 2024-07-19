import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Clipboard,
  Share,
} from "react-native";
import LeftAerow from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allDua } from "../../../../Dua/TabScreens/CatagoryList/components/DuaAzkarData";
import { useAuthContext } from "../../../../../Navigations/AuthContext";
import ToastAndroid from "react-native-root-toast";

const DuasData = ({ navigation, route }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [filteredDuas, setFilteredDuas] = useState([]);
  const [isFavorite, setIsFavorite] = useState([]);

  const item = route.params?.item;
  const fetchDuas = async () => {
    const filteredData = allDua.filter(
      (duaItem) =>
        duaItem.title_id === item.id && duaItem.category_id === item.category_id
    );
    setFilteredDuas(filteredData);
    const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];

    setIsFavorite(favorites);
  };

  const fetchFavorites = async () => {
    let favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    let filteredFavs = favorites.filter(
      (duaItem) =>
        duaItem.title_id === item.id && duaItem.category_id === item.category_id
    );
    setFilteredDuas(filteredFavs);
    setIsFavorite(favorites);
  };
  useEffect(() => {
    if (route.params?.isfavorite) {
      fetchFavorites();
      return;
    }

    fetchDuas();
  }, [item]);

  const handleFavorite = async (dua) => {
    try {
      let favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const isAlreadyFavorite = favorites.some(
        (favorite) =>
          favorite.id === dua.id &&
          favorite.title_id === dua.title_id &&
          favorite.category_id === dua.category_id
      );

      if (isAlreadyFavorite) {
        favorites = favorites.filter(
          (favorite) =>
            !(favorite.id === dua.id &&
              favorite.title_id === dua.title_id &&
              favorite.category_id === dua.category_id)
        );
        ToastAndroid.show("Removed from favorites", {
          position: -80,
          duration: ToastAndroid.durations.LONG,
        });
      } else {
        // Add to favorites
        favorites.push(dua);
        ToastAndroid.show("Added to favorites", {
          position: -80,
          duration: ToastAndroid.durations.LONG,
        });
      }

      setIsFavorite(favorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("favorites", favorites);

    } catch (e) {
      console.error("Error updating favorites:", e);
    }
  };

  // console.log(isFavorite);
  const handleCopy = (duaArabic) => {
    Clipboard.setString(duaArabic);
    ToastAndroid.show("Dua Copied", {
      position: -80,
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

  const renderDuaItem = ({ item, index }) => (
    <View
      style={[
        styles.bodyContainer,
        themeMode == "dark" && { backgroundColor: "#000" },
      ]}
    >
      <View style={styles.duaContainer}>
        <Pressable onPress={() => item}>
          <Text
            style={[
              styles.duaArabic,
              themeMode == "dark" && {
                backgroundColor: "#000",
                color: "#FFFF",
              },
            ]}
          >
            {item.duaarabic}
          </Text>
        </Pressable>
        <Text
          style={[
            styles.duaenglish,
            themeMode == "dark" && { backgroundColor: "#000", color: "#FFFF" },
          ]}
        >
          {item.duaenglish}
        </Text>
        <Text
          style={[
            styles.english,
            themeMode == "dark" && { backgroundColor: "#000", color: "#FFFF" },
          ]}
        >
          {item.english}
        </Text>
        <Text
          style={[
            styles.duaReferences,
            themeMode == "dark" && { backgroundColor: "#000", color: "#FFFF" },
          ]}
        >
          <Text
            style={[
              styles.titleRef,
              themeMode == "dark" && {
                backgroundColor: "#000",
                color: "#FFFF",
              },
            ]}
          >
            Reference:
          </Text>{" "}
          {item.references}
        </Text>
        <View style={styles.iconContainer}>
          <Icon
            name="copy"
            size={25}
            style={[
              styles.icon,
              themeMode == "dark" && {
                backgroundColor: "#000",
                color: "#FFFF",
              },
            ]}
            onPress={() =>
              handleCopy(
                item.duaarabic +
                item.duaenglish +
                item.english +
                item.references
              )
            }
          />
          <Icon
            name={
              isFavorite?.some(
                (favorite) =>
                  favorite.id === item.id &&
                  favorite.title_id === item.title_id &&
                  favorite.category_id === item.category_id
              )
                ? "heart"
                : "heart-o"
            }
            size={25}
            style={[
              styles.hearticon,

              themeMode == "dark" && {
                backgroundColor: "#000",

              },
            ]}
            color={
              isFavorite?.some(
                (favorite) =>
                  favorite.id === item.id &&
                  favorite.title_id === item.title_id &&
                  favorite.category_id === item.category_id
              )
                ? "#ff0000"
                : themeMode == "dark"
                  ? "#FFF"
                  : "#000"
            }
            onPress={() => handleFavorite(item)}
          />
          <Icon
            name="share"
            size={25}
            style={[
              styles.icon,
              themeMode == "dark" && {
                backgroundColor: "#000",
                color: "#ffff",
              },
            ]}
            onPress={() =>
              handleShare(
                item.duaarabic +
                item.duaenglish +
                item.english +
                item.references
              )
            }
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeMode == "dark" && { backgroundColor: "#000", color: "#FFFF" },
      ]}
    >
      <View style={styles.mainHeader}>
        <Pressable onPress={() => navigation.goBack()}>
          <LeftAerow name="chevron-left" size={25} color={'#fff'} />
        </Pressable>
        <View style={styles.mainText}>
          <Text numberOfLines={1} style={styles.headerText}>{item.title}</Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredDuas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDuaItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainHeader: {
    flexDirection: "row",
    height: 53,
    backgroundColor: "#0a9484",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    textAlign: 'center'
  },
  mainText: {
    flex: 1,
  },
  bodyContainer: {
    borderBottomColor: "#cbcbcb",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 13,
  },
  duaContainer: {
    marginBottom: 10,
    marginTop: 5,
  },
  duaArabic: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: "700",
    textAlign: "justify",
    alignSelf: "flex-end",
    fontFamily: "OswaldBold",
  },
  duaenglish: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: "justify",
  },
  english: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "800",
    textAlign: "justify",
    fontFamily: "OswaldBold",
  },
  duaReferences: {
    fontSize: 14,
    color: "gray",
    textAlign: "justify",
  },
  titleRef: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 22,
    marginBottom: 5,
    gap: 20,
  },
  icon: {
    marginHorizontal: 5,
  },
  hearticon: {
    marginHorizontal: 5,
  },
});

export default DuasData;
