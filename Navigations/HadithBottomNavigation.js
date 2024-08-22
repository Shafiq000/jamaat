import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';
import HomeIcon from 'react-native-vector-icons/Ionicons';
import LibraryIcon from 'react-native-vector-icons/Ionicons';
import Clipboard from 'react-native-vector-icons/MaterialCommunityIcons';
import Library from '../Components/DailyHadith/Library';
import Header from '../Components/Header'; // Import the Header component
import DailyHadith from '../Components/DailyHadith/DailyHadith';
import { useAuthContext } from './AuthContext';
import AppHomeHadith from '../Screens/DailyHadith/AppHomeHadith';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const HadithBottomNavigation = ({ navigation }) => {
    const windowHeight = useWindowDimensions().height;
    const { themeMode } = useAuthContext();
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#0a9484",
                    tabBarInactiveTintColor: themeMode == "dark" ? "#fff" : "#000",
                    tabBarStyle: {height: windowHeight * 0.090,   borderTopWidth: 0, backgroundColor: themeMode == "dark" ? "#26272C" : "#fff"},
                    tabBarLabelStyle: {
                        fontSize: 15,
                        marginBottom: 12,
                    },
                    tabBarShowLabel: true,
                }}
            >
                <Tab.Screen
                    name={t('home')}
                    component={AppHomeHadith}
                    options={{
                        headerLeft: () => <Header navigation={navigation} title={t('home')} />, 
                        tabBarLabel:t('home'),
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon name='home-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={t('library')}
                    component={Library}
                    options={{
                        tabBarLabel: t('library'),
                        tabBarIcon: ({ color, size }) => (
                            <LibraryIcon name='library-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={t('daily_hadith')}
                    component={DailyHadith}
                    options={{
                        tabBarLabel: t('daily_hadith'),
                        tabBarIcon: ({ color, size }) => (
                            <Clipboard name='clipboard-text-clock-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

export default HadithBottomNavigation;

const styles = StyleSheet.create({});
