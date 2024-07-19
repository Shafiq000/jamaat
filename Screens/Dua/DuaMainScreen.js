import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Categories from "./TabScreens/Categories";
import Favorites from "./TabScreens/Favorites";
import { useAuthContext } from '../../Navigations/AuthContext';
import HeaderBack from '../../Components/HeaderBack';
const Tab = createMaterialTopTabNavigator();

const DuaMainScreen = ({ navigation }) => {
  const { themeMode, setThemeMode } = useAuthContext();

  return (
    <View style={{ flex: 1, backgroundColor: themeMode === "dark" ? '#000' : '#0a9484' }}>
      <HeaderBack title={'Dua'} navigation={navigation}/>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: themeMode === "dark" ? '#0a9484' : '#0a9484',
          tabBarInactiveTintColor: themeMode === "dark" ? '#fff' : '#000000',
          tabBarLabelStyle: { fontSize: 15, fontWeight: "500" },
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: themeMode === "dark" ? '#000' : '#fff',
          },
          tabBarIndicatorStyle: {
            backgroundColor:'#0a9484' ,
          },
        }}
      >
        <Tab.Screen name="Categories" component={Categories} />
        <Tab.Screen name="Favorites" component={Favorites} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: "row",
    height: 55,
    backgroundColor: "#fcba03",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  toptext: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    fontFamily: "Gilroy",
  },
});

export default memo(DuaMainScreen);
