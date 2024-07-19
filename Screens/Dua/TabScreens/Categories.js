import React, { memo, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import SearchBar from "../SearchBar";
import { allTitles } from "./CatagoryList/components/DuaAzkarData";
import { useAuthContext } from "../../../Navigations/AuthContext";
const data = [
  {
    id: 1,
    title: "All",
    imageSource: require("../../../src/Images/dua.png"),
    backgroundColor: "#E0E0E0",
  },
  {
    id: 2,
    title: "Morning & Evening",
    imageSource: require("../../../src/Images/day-and-night.png"),
    backgroundColor: "#E7C7F5",
  },

  {
    id: 3,
    title: "Prayer",
    imageSource: require("../../../src/Images/prayer.png"),
    backgroundColor: "#E1F8DC",
  },
  {
    id: 4,
    title: "Food & Drinks",
    imageSource: require("../../../src/Images/drink.png"),
    backgroundColor: "#F5ECF5",
  },
  {
    id: 5,
    title: "Hajj & Umrah",
    imageSource: require("../../../src/Images//hajj.png"),
    backgroundColor: "#FFEFBD",
  },
  {
    id: 6,
    title: "Travel",
    imageSource: require("../../../src/Images/car.png"),
    backgroundColor: "#E2E0E0",
  },
  {
    id: 7,
    title: "Nature",
    imageSource: require("../../../src/Images/nature.png"),
    backgroundColor: "#E1F8DC",
  },
  {
    id: 8,
    title: "Praising Allah",
    imageSource: require("../../../src/Images/allah.png"),
    backgroundColor: "#E2C7D2",
  },

  {
    id: 9,
    title: "Sickness & Death",
    imageSource: require("../../../src/Images/medicine.png"),
    backgroundColor: "#FFD6AC",
  },

  {
    id: 10,
    title: "Joy and Distress",
    imageSource: require("../../../src/Images/friend.png"),
    backgroundColor: "#ECFDAA",
  },
  {
    id: 11,
    title: "Home and Family",
    imageSource: require("../../../src/Images/house.png"),
    backgroundColor: "#D1DACE",
  },

  {
    id: 12,
    title: "Good Etiquette",
    imageSource: require("../../../src/Images/handshake.png"),
    backgroundColor: "#FFEFBD",
  },
];

const NameCard = memo(({ navigation, item }) => {
  const [count, setCount] = useState()
  const handlePress = () => {
    navigation.navigate("DuaTitles", { item });
  };

  useEffect(() => {
    if(item.id==1){
     setCount(allTitles.length)
     return
    }
 let categorytitlesCount = allTitles.filter((title,index)=>title.category_id===item.id).length
setCount(categorytitlesCount)

  }, [])
  
    return (
    <Pressable style={styles.Container} onPress={handlePress}>
      <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>
        <Text style={styles.cardText} numberOfLines={2}>
          {item.title}
        </Text>
        <Image style={styles.cardSideImage} source={item.imageSource} />
        { <Text style={styles.counterText}>{count} Chapters</Text>}
      </View>
    </Pressable>
  );
});

const Categories = ({ navigation}) => {
  const [filteredData, setFilterData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const { themeMode, setThemeMode } = useAuthContext();
  useEffect(() => {
    const titles = allTitles.filter((item) => item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1)
    let filtered = data.filter(
      (item) => item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    );
    setFilterData(filtered,titles);
  }, [searchQuery]);
  const renderItems = useCallback(
    ({ item, index }) => (
      <NameCard
        navigation={navigation}
        item={item}
        index={index}
      />
    ),
    [navigation, filteredData]
  );
  return (
    <View style={[{ flex: 1,backgroundColor:"#FFFFFF"},themeMode == "dark" && { backgroundColor: "#000" }]}>
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
    textAlign: "left",
    marginBottom: 10,
    paddingLeft: 13,
    marginTop: 10,
  },
  cardSideImage: {
    height: 50,
    width: 50,
    marginTop: 25,
    marginRight: 12,
  },
  counterText: {
    position: "absolute",
    bottom: 10,
    left: 13,
    fontSize: 13,
  },
  image: {
    height: 75,
    width: 75,
  },
});
