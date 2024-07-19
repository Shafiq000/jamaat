import React, { useState } from "react";
import { StyleSheet, TextInput, View, Image, Pressable } from "react-native";

const SearchBar = ({ setSearchQuery }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
    setSearchQuery(text);
  };

  const handleClear = () => {
    setSearchText("");
    setSearchQuery("");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Pressable style={styles.searchButton}>
          <Image
            style={styles.searchImage}
            source={require("../../src/Images/search.png")}
          />
        </Pressable>
        <TextInput
          placeholder="Search for an answer"
          selectionColor={"#0a9484"}
          style={styles.input}
          onChangeText={handleSearch}
          value={searchText}
        />
        {searchText !== "" && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Image
              style={styles.clearImage}
              source={require("../../src/Images/close.png")}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 330,
    height: 43,
    backgroundColor: "#e7e7e7",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
  },
  clearButton: {
    padding: 8,
  },
  clearImage: {
    height: 25,
    width: 25,
  },
  searchImage: {
    height: 25,
    width: 25,
  },
});
