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
const Tab = createBottomTabNavigator();

const HadithBottomNavigation = ({ navigation }) => {
    const windowHeight = useWindowDimensions().height;
    const { themeMode } = useAuthContext();

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
                    name="Home"
                    component={AppHomeHadith}
                    options={{
                        headerLeft: () => <Header navigation={navigation} title="Home" />, 
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon name='home-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Library"
                    component={Library}
                    options={{
                        tabBarLabel: 'Library',
                        tabBarIcon: ({ color, size }) => (
                            <LibraryIcon name='library-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="DailyHadith"
                    component={DailyHadith}
                    options={{
                        tabBarLabel: 'Daily Hadith',
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
