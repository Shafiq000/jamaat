import React, { useState,useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderBack from '../Components/HeaderBack';
import { useAuthContext } from '../Navigations/AuthContext';
const Setting = ({ navigation }) => {
    const { themeMode,isAuthenticated } = useAuthContext();

    return (
        <SafeAreaView style={[styles.container, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
            <HeaderBack title={'Setting'} navigation={navigation} />
            <View style={{ flexDirection: "column" }}>
            {isAuthenticated ? (
                    <Pressable onPress={() => navigation.navigate("Profile")}>
                        <View style={styles.items}>
                            <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>Account Setting</Text>
                            <Icon name="right" size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                        </View>
                    </Pressable>
                ) : null}
                <Pressable onPress={() => navigation.navigate("PrayerSetting")}>
                    <View style={styles.items}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>Prayer Setting</Text>
                        <Icon name="right" size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                    </View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("AlarmNotification")}>
                    <View style={styles.items}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>Notifications</Text>
                        <Icon name="right" size={18} color="#000" style={[styles.icon, themeMode === "dark" && { color: "#fff" }]} />
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};
export default Setting;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    setting: {
        flexDirection: "row",
        gap: 115,
        justifyContent: 'flex-start',
        alignItems: "center",
        height: 60,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
    },
    settingIcon: {
        fontSize: 22,
        fontWeight: "700",
    },
    items: {
        flexDirection: "row",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 25
    },
    title: {
        fontSize: 14,
        fontWeight: "500"
    },

});
