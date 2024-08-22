import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';
import Home from '../Screens/Home';
import HomeIcon from 'react-native-vector-icons/Ionicons';
import FeedIcon from 'react-native-vector-icons/FontAwesome6';
import SubIcon from 'react-native-vector-icons/AntDesign';
import Header from '../Components/Header'; 
import { useAuthContext } from './AuthContext';
import Feed from '../Screens/Feed';
import Sub from '../Screens/Sub';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const BottomTabNavigation = ({ navigation }) => {
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
                        fontSize: 13,
                        marginBottom: 12,
                    },
                    tabBarShowLabel: true,
                }}
            >
                <Tab.Screen
                    name={t('home')}
                    component={Home}
                    options={{
                        headerLeft: () => <Header navigation={navigation} title="Home" />, 
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon name='home-outline' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={t('feed')}
                    component={Feed}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FeedIcon name='square-rss' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={t('sub')}
                    component={Sub}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <SubIcon name='staro' style={{ fontSize: size, color: color }} />
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="More Apps"
                    component={MoreApps}
                    options={{
                        tabBarLabel: 'More Apps',
                        tabBarIcon: ({ color, size }) => (
                            <AppIcon name='appstore-o' style={{ fontSize:  size, color: color }} />
                        ),
                    }}
                /> */}
            </Tab.Navigator>

        </View>
    );
}

export default BottomTabNavigation;

const styles = StyleSheet.create({});
