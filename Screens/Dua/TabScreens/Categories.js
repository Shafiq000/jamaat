import React, { memo, useCallback, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, FlatList,I18nManager } from "react-native";
import SearchBar from "../SearchBar";
import { allTitles } from "./CatagoryList/components/DuaAzkarData";
import { useAuthContext } from "../../../Navigations/AuthContext";
import { useTranslation } from "react-i18next";

const Categories = ({ navigation }) => {
  const [filteredData, setFilterData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { themeMode } = useAuthContext();
  const { t } = useTranslation();

  const data = [
    {
      id: 1,
      title:t("all"),
      imageSource: require("../../../src/Images/dua.png"),
      backgroundColor: "#E0E0E0",
    },
    {
      id: 2,
      title: t("morning_evening"),
      imageSource: require("../../../src/Images/day-and-night.png"),
      backgroundColor: "#E7C7F5",
    },
    {
      id: 3,
      title: t("dua"),
      imageSource: require("../../../src/Images/prayer.png"),
      backgroundColor: "#E1F8DC",
    },
    {
      id: 4,
      title: t("food_drinks"),
      imageSource: require("../../../src/Images/drink.png"),
      backgroundColor: "#F5ECF5",
    },
    {
      id: 5,
      title: t("hajj_umrah"),
      imageSource: require("../../../src/Images/hajj.png"),
      backgroundColor: "#FFEFBD",
    },
    {
      id: 6,
      title: t("travel"),
      imageSource: require("../../../src/Images/car.png"),
      backgroundColor: "#E2E0E0",
    },
    {
      id: 7,
      title: t("nature"),
      imageSource: require("../../../src/Images/nature.png"),
      backgroundColor: "#E1F8DC",
    },
    {
      id: 8,
      title: t("praising_allah"),
      imageSource: require("../../../src/Images/allah.png"),
      backgroundColor: "#E2C7D2",
    },
    {
      id: 9,
      title: t("sickness_death"),
      imageSource: require("../../../src/Images/medicine.png"),
      backgroundColor: "#FFD6AC",
    },
    {
      id: 10,
      title: t("joy_distress"),
      imageSource: require("../../../src/Images/friend.png"),
      backgroundColor: "#ECFDAA",
    },
    {
      id: 11,
      title: t("home_family"),
      imageSource: require("../../../src/Images/house.png"),
      backgroundColor: "#D1DACE",
    },
    {
      id: 12,
      title: t("good_etiquette"),
      imageSource: require("../../../src/Images/handshake.png"),
      backgroundColor: "#FFEFBD",
    },
  ];

  useEffect(() => {
    setFilterData(data); 
  }, []);

  useEffect(() => {
    const titles = allTitles.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    let filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilterData(filtered);
  }, [searchQuery]);

  const renderItems = useCallback(
    ({ item }) => (
      <Pressable style={styles.Container} onPress={() => navigation.navigate("DuaTitles", { item })}>
        <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>
          <Text style={styles.cardText} numberOfLines={3}>
            {item.title}
          </Text>
          <Image style={styles.cardSideImage} source={item.imageSource} />
          <Text style={styles.counterText}>
            {item.id === 1 ? allTitles.length : allTitles.filter(title => title.category_id === item.id).length} {t('chapters')}
          </Text>
        </View>
      </Pressable>
    ),
    [navigation, filteredData]
  );

  return (
    <View style={[{ flex: 1, backgroundColor: "#FFFFFF" }, themeMode == "dark" && { backgroundColor: "#000" }]}>
      <SearchBar setSearchQuery={setSearchQuery} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={renderItems}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginHorizontal: 10,
    margin: 10,
  },
  card: {
    // justifyContent:'center',
    flexDirection: "row",
    height: 95,
    width: 158,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "400",
    // textAlign:I18nManager.isRTL ? 'right' : 'left',
    marginBottom: 10,
    // paddingLeft: 13,
    paddingHorizontal:10,
    marginTop: 10,
  },
  cardSideImage: {
    paddingVertical:10,
    justifyContent:'center',
    // alignContent:'flex-start',
    alignItems:'center',
    height: 50,
    width:  50,
    marginTop: 25,
    marginRight: 12,
  },
  counterText: {
    position: "absolute",
    bottom: 10,
    left: 13,
    fontSize: 13,
  },
});
