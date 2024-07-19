import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigation from './DrawerNavigation';
import NearbyMasjid from '../Screens/NearbyMasjid'
import MasjidDetails from '../Screens/MasjidDetails';
import Notification from '../Screens/Notification';
import Maps from '../Screens/Maps';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import Setting from '../Screens/Setting';
import PrayerSetting from '../Screens/PrayerSetting';
import AlarmNotification from '../Screens/AlarmNotification';
import Profile from '../Screens/Profile';
import Fullname from '../Screens/Fullname';
import Email from '../Screens/Email';
import UpdatePassowrd from '../Screens/UpdatePassowrd';
import PhoneVerification from '../Screens/PhoneVerification';
import DailyVerseOnHomeScreen from '../Screens/DailyVerse/DailyVerseOnHomeScreen';
import DailyVerseScreen from '../Screens/DailyVerse/DailyVerseScreen';
import DailyDuaOnHome from '../Screens/DailyDua/DailyDuaOnHome';
import RandomDuaScreen from '../Screens/DailyDua/RandomDuaScreen';
import HadithBottomNavigation from './HadithBottomNavigation';
import DailyHadithOnHome from '../Screens/DailyHadith/DailyHadithOnHome';
import DailyHadith from '../Components/DailyHadith/DailyHadith';
import Hadiths from '../Screens/DailyHadith/Hadiths';
import SearchHadith from '../Components/DailyHadith/SearchHadith';
import Titles from '../Screens/DailyHadith/Titles';
import MainScreen from '../Screens/PrayerTime/MianScreen';
import QiblaHome from '../Screens/Qibla/QiblaHome';
import HomeAsmaUlHusna from '../Screens/AsmaUlHusna/HomeAsmaUlHusna';
import TextScrol from '../Screens/AsmaUlHusna/TextScrol';
import TasbihMainScreen from '../Screens/Tasbih/TasbihMainScreen';
import CalendarMainScreen from '../Screens/Calendar/CalendarMainScreen';
import DuaMainScreen from '../Screens/Dua/DuaMainScreen';
import DuaTitles from '../Screens/Dua/TabScreens/CatagoryList/DuaTitles';
import DuasData from '../Screens/Dua/TabScreens/CatagoryList/components/DuasData';
const Stack = createNativeStackNavigator();

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="NearbyMasjid" component={NearbyMasjid} />
            <Stack.Screen name="MasjidDetails" component={MasjidDetails} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Maps" component={Maps} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="PrayerSetting" component={PrayerSetting} />
            <Stack.Screen name="AlarmNotification" component={AlarmNotification} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Fullname" component={Fullname} />
            <Stack.Screen name="Email" component={Email} />
            <Stack.Screen name="UpdatePassowrd" component={UpdatePassowrd} />
            <Stack.Screen name="PhoneVerification" component={PhoneVerification} />
            <Stack.Screen name="DailyVerseOnHomeScreen" component={DailyVerseOnHomeScreen} />
            <Stack.Screen name="DailyVerseScreen" component={DailyVerseScreen} />
            <Stack.Screen name="DailyDuaOnHome" component={DailyDuaOnHome} />
            <Stack.Screen name="RandomDuaScreen" component={RandomDuaScreen} />
            <Stack.Screen name="HadithBottomNavigation" component={HadithBottomNavigation} />
            <Stack.Screen name="DailyHadithOnHome" component={DailyHadithOnHome} />
            <Stack.Screen name="DailyHadith" component={DailyHadith} />
            <Stack.Screen name="Hadiths" component={Hadiths} />
            <Stack.Screen name="SearchHadith" component={SearchHadith} />
            <Stack.Screen name="Titles" component={Titles} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="QiblaHome" component={QiblaHome} />
            <Stack.Screen name="HomeAsmaUlHusna" component={HomeAsmaUlHusna} />
            <Stack.Screen name="TextScrol" component={TextScrol} />
            <Stack.Screen name="TasbihMainScreen" component={TasbihMainScreen} />
            <Stack.Screen name="CalendarMainScreen" component={CalendarMainScreen} />
            <Stack.Screen name="DuaMainScreen" component={DuaMainScreen} />
            <Stack.Screen name="DuaTitles" component={DuaTitles} />
            <Stack.Screen name="DuasData" component={DuasData} />

        </Stack.Navigator>
    );
}

export default AppStack;
