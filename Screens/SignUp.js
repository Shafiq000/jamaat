import { StyleSheet, Text, View,ScrollView } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EmailSignUp from '../Components/Auth/SignUp/EmailSignUp';
import PhoneSignUp from '../Components/Auth/SignUp/PhoneSignUp';
import MosqueIcon from 'react-native-vector-icons/FontAwesome5';
import EmailIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import { useAuthContext } from '../Navigations/AuthContext';

const Tab = createMaterialTopTabNavigator();

const SignUp = () => {
    const { themeMode } = useAuthContext();

    return (
        <ScrollView style={[
            { flex: 1, backgroundColor: '#FFFFFF' },
            themeMode === "dark" && { backgroundColor: "#1C1C22" }
        ]}>
            <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', marginVertical: 50 }}>
                <MosqueIcon name='mosque' size={40} color={themeMode === "dark" ? "#fff" : "#000"} />
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[
                        { fontSize: 25, fontWeight: '800' },
                        themeMode === "dark" && { color: '#fff' }
                    ]}>Let's Get Started</Text>
                    <Text style={themeMode === "dark" && { color: '#AAAAAA' }}>Sign up for your account</Text>
                </View>
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarContentContainerStyle: [
                        { backgroundColor: 'transparent' },
                        themeMode === "dark" && { backgroundColor: "#1C1C22" }
                    ],
                    tabBarPressColor: 'transparent',
                    tabBarStyle: {
                        elevation: 0,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: themeMode === "dark" ? '#fff' : '#000',
                    },
                }}>
                <Tab.Screen name="Email" component={EmailSignUp}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <View style={styles.tabTitleStyle}>
                                <EmailIcon
                                    name='email-outline'
                                    size={25}
                                    style={[
                                        {right:10, color: focused ? (themeMode === "dark" ? '#fff' : '#000') : '#AAAAAA' }
                                    ]}
                                />
                                <Text style={[
                                    { textAlign: 'center', fontSize: 20, fontWeight: '600' },
                                    { color: focused ? (themeMode === "dark" ? '#fff' : '#000') : '#AAAAAA' }
                                ]}>
                                    Email
                                </Text>
                            </View>
                        )
                    }}
                />
                <Tab.Screen name="Phone" component={PhoneSignUp}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <View style={styles.tabTitleStyle}>
                                <PhoneIcon
                                    name='phone'
                                    size={25}
                                    style={[
                                        { right:10, color: focused ? (themeMode === "dark" ? '#fff' : '#000') : '#AAAAAA' }
                                    ]}
                                />
                                <Text style={[
                                    { textAlign: 'center', fontSize: 20, fontWeight: '600' },
                                    { color: focused ? (themeMode === "dark" ? '#fff' : '#000') : '#AAAAAA' }
                                ]}>
                                    Phone
                                </Text>
                            </View>
                        )
                    }}
                />
            </Tab.Navigator>
        </ScrollView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    tabTitleStyle: {
        flexDirection: 'row',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
