import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Masjid from '../Components/Masjid';
import PrayerTime from '../Components/PrayerTime';
import { useAuthContext } from './AuthContext';
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();

const TopTabNavigation = () => {
  const { t } = useTranslation();
  const { themeMode } = useAuthContext();

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: "transparent"
      }}
      screenOptions={{
        tabBarPressColor: 'transparent',
        tabBarStyle: {
          elevation: 0,
          // borderTopWidth: 0,
        },
        tabBarPressColor: 'transparent',
        tabBarGap: 38,
        swipeEnabled: false,
        animationEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        tabBarContentContainerStyle: [{ backgroundColor: 'transparent', }, themeMode === "dark" && { backgroundColor: "#1C1C22" }],
        tabBarItemStyle: { width: 85, height: 40 },
      }}
    >
      <Tab.Screen
        name="Masjid"
        component={Masjid}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#fff' : '#000', backgroundColor: focused ? '#0a9484' : '#EFEFEF', left: 15, padding: 15, height: 50, borderRadius: 10, textAlign: 'center', width: '100%', fontWeight: '600' }}>
              {t('iqama_time')}
            </Text>
          )
        }}
      />
      <Tab.Screen
        name="Prayer Time"
        component={PrayerTime}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#fff' : '#000', backgroundColor: focused ? '#0a9484' : '#EFEFEF', padding: 15, height: 50, borderRadius: 10, textAlign: 'center', width: '100%', fontWeight: '600' }}>
             {t('prayer_time')}
            </Text>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TopTabNavigation;

const styles = StyleSheet.create({});
