import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Categories from "./TabScreens/Categories";
import Favorites from "./TabScreens/Favorites";
import { useAuthContext } from '../../Navigations/AuthContext';
import HeaderBack from '../../Components/HeaderBack';
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();

const DuaMainScreen = ({ navigation }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: themeMode === "dark" ? '#000' : '#0a9484' }}>
      <HeaderBack title={t('dua')} navigation={navigation}/>
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
        <Tab.Screen name={t("categories")} component={Categories} />
        <Tab.Screen name={t("favorites")} component={Favorites} />
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
