import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAuthContext } from "../../Navigations/AuthContext";

const data = [
  {
    id: 1,
    Arabic: "سُبْحَانَ ٱللَّٰهِ",
    English: "Subhanallah",
    Translation: "Glory to be Allah",
  },
  {
    id: 2,
    Arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    English: "Alhamdolillah",
    Translation: "Praise be to Allah",
  },
  {
    id: 3,
    Arabic: "ٱللَّٰهُ أَكْبَرُ",
    English: "Alllahu Akbar",
    Translation: "Allah is the Greatest",
  },
  {
    id: 4,
    Arabic: "لَا إِلَٰهَ إِلَّا اللهُ",
    English: "La ilaha illallah",
    Translation: "There is no God but Allah",
  },
  {
    id: 5,
    Arabic: "اللّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
    English: "Allahumma salli'ala Muhammad",
    Translation: "O Allah, bless Muhammad",
  },
  {
    id: 6,
    Arabic: "أَسْتَغْفِرُ اللّٰهَ",
    English: "Astaghfirullah",
    Translation: "I seek forgivness from Allah",
  },
  {
    id: 7,
    Arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ",
    English: "La hawla wala quwwata illa billah",
    Translation: "There is no power or might except with Allah",
  },
  {
    id: 8,
    Arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    English: "Subhaallah wa bihamdihi",
    Translation: "Glory be to Allah and praise Him",
  },
  {
    id: 9,
    Arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    English: "Astaghfirullah al-'azim",
    Translation: "I seek forgivness from Allah, the Mighty",
  },
  {
    id: 10,
    Arabic: "جَزاكَ اللهُ خَـيْراً",
    English: "Jazakallah khayran",
    Translation: "May Allah reward you with good",
  },
  {
    id: 11,
    Arabic: "اللهُمَّ لا سَهْلَ إلا مَا جَعَلتَهُ سَهْلا",
    English: "Allahumma la sahla illa ma ja'altahu sahla",
    Translation: "O Allah, there is no ease except in what You make easy",
  },
  {
    id: 12,
    Arabic: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ",
    English: "Hasbunallah Wani'mal Wakil",
    Translation:
      "Allah is sufficient for us, and He is the best Disposer of affairs",
  },
  {
    id: 13,
    Arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    English: "Allahumma inni a'udhu bika min al-hammi wal-hazan",
    Translation: "O Allah, I seek refuge in You from worry and grief",
  },
  {
    id: 14,
    Arabic:
      "اللّهُـمَّ إِنِّـي أَسْأَلُـكَ الجَـنَّةَ وأَعوذُ بِـكَ مِـنَ الـنّار",
    English: "Allahumma inni as'aluka al jannah waa'udhu bika minan-nar",
    Translation:
      "O Allah, I ask You for Paradise and seek refuge in You from the Fire",
  },
  {
    id: 15,
    Arabic:
      "اللَّهُمَّ أَعِنِّيْ عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    English: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatika",
    Translation:
      "O Allah, help me in remembering You, thanking You, and worshiping You..",
  },
  {
    id: 16,
    Arabic: "إنّ اللّهَ بِكُلّ شَيْءٍ عَلِيمٌ.",
    English: "Inallaha be-kull shaayeinn aleem",
    Translation: "Surely Allah is Cognizant of all things.",
  },
];

const BottomSheets = ({ onClose, onSelectItem }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const { themeMode } = useAuthContext();
  const snapPoints = ["73%", "100%"];
  const flatListRef = useRef(null);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback((props) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
  ), []);

  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={() => {
        onSelectItem(item);
        setSelectedItemIndex(index);
      }}>
      <View style={[styles.listItem,index === selectedItemIndex && styles.selectedItem,themeMode === "dark" && styles.darkModeListItem]}>
        <Text style={[styles.itemText,themeMode === "dark" && styles.darkModeText]}>
          {item.Arabic}
        </Text>
        <Text style={[styles.itemTranslation,themeMode === "dark" && styles.darkModeText]}>
          {item.English}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <BottomSheet
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleComponent={null}
      handleIndicatorStyle={{ display: "none" }}
      snapPoints={snapPoints}
      backgroundStyle={themeMode === "dark" ? { backgroundColor: "#282828", borderRadius: 0 } : null}
      onChange={handleSheetChanges}
    >
      <BottomSheetFlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedItemIndex}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 25,
  },
  selectedItem: {
    backgroundColor: "#f0f0f0",
  },
  darkModeListItem: {
    backgroundColor: "#282828",
    borderBottomColor: "#fff",
  },
  itemText: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },
  darkModeText: {
    color: "#fff",
  },
  itemTranslation: {
    flex: 1,
    alignSelf: "flex-end",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default BottomSheets;
