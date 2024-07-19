import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllTitles from '../../Jsondata/AllTitles.json'
import { useAuthContext } from "../../Navigations/AuthContext";
import HeaderBack from "../HeaderBack";
const Library = ({ navigation }) => {
  const { themeMode } = useAuthContext();
  const [favoriteDuas, setFavoriteDuas] = useState([]);

  const fetchFavoritetitles = async () => {
    try {
      const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      let favoriteTitles = [];

      if (AllTitles && AllTitles.chapters && AllTitles.chapters.length > 0) {
        favoriteTitles = AllTitles.chapters.flatMap(title =>
          favorites
            .filter(fav => fav.chapterId === title.chapterId && fav.bookId === title.bookId)
            .map(fav => ({
              ...title,
              id: fav.id,
              favoriteDate: fav.favoriteDate
            }))
        );

        favoriteTitles = favoriteTitles.map(favorite => {
          const formattedDate = new Date(favorite.favoriteDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          return { ...favorite, favoriteDate: formattedDate };
        });
      }
      setFavoriteDuas(favoriteTitles);
    } catch (e) {
      console.error("Error retrieving favorites:", e);
    }
  };

  useEffect(() => {
    fetchFavoritetitles();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFavoritetitles();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToHadiths = (item) => {
    navigation.navigate("Hadiths", {
      item: item,
      isfavorite: true,
    });
  };

  const getRandomColor = () => {
    const colors = ['#F5E8C8', '#C8F5E8', '#E8C8F5', '#C8E8F5', '#E8F5C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderItem = ({ item }) => {
    const randomColor = getRandomColor();
    return (
      <View style={styles.bodyContainer}>
        <Pressable style={{ flexDirection: 'row' }}
          onPress={() => navigateToHadiths(item)}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.boxtxt, { backgroundColor: randomColor }]}>
              <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>{`${item.shortname}`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
              <Text style={[styles.duaTitle, themeMode == "dark" && { color: "#ffff" }]}>{`${item.book}`}</Text>
              <Text style={{ left: 100, top: 10, color: '#cbcbcb', fontSize:12 }}>{item.favoriteDate}</Text>
            </View>
            <View style={{ flexDirection: 'row', right: 45 }}>
              <Text style={[styles.SubText, themeMode == "dark" && { color: "#ffff" }]}>{`Book ${item.bookId},`}</Text>
              <Text style={[styles.SupText, themeMode == "dark" && { color: "#ffff" }]}>{`Hadith ${item.chapterId}`}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.mainContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
      <HeaderBack title={'Library'} navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={favoriteDuas}
        keyExtractor={(item, index) => item.id.toString() + index}
        renderItem={renderItem}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopColor: "#cbcbcb",
    borderTopWidth: 1,
  },
  duaTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  SubText: {
    left:5,
    fontSize: 12,
    color: '#cbcbcb',
  },
  SupText: {
    left: 10,
    fontSize: 12,
    color: '#cbcbcb',
  },
  boxtxt: {
    backgroundColor: '#F5E8C8',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 10,
  },
});

export default Library;
