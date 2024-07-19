import { Pressable, StyleSheet, Text, View,Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import HeaderBack from '../Components/HeaderBack'
import CircleIcon from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import { useAuthContext } from '../Navigations/AuthContext';

const Profile = ({ navigation }) => {
    const { user, signOut } = useAuthContext(); // Ensure this hook is used properly
    const [password, setPassword] = useState('******'); // Initially masked
    const [showPassword, setShowPassword] = useState(false);
    const { themeMode } = useAuthContext();

    useEffect(() => {
        if (showPassword) {
        } else {
            setPassword('******');
        }
    }, [showPassword]);

    const handleToFullname = () => {
        navigation.navigate('Fullname')
    }
    const handleToEmail = () => {
        // navigation.navigate('Email')
        Alert.alert("Email could not changed")
    }
    const handleToUpdatePassowrd = () => {
        setShowPassword(!showPassword);
        navigation.navigate('UpdatePassowrd')
    }

    return (
        <View style={styles.mainContainer}>
            <HeaderBack title={'Profile'} navigation={navigation} />
           <View style={[{flex:1},themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
           <View style={styles.container}>
                <Pressable onPress={handleToFullname} style={[styles.boxItem,themeMode === "dark" && { backgroundColor: "#363B33" }]}>
                    <View style={{ marginHorizontal: 10, marginVertical: 8 }}>
                        <Text style={{ color: '#B0A695' }}>Fullname</Text>
                        <CircleIcon name='rightcircleo' size={25} style={[styles.icon,themeMode === "dark" && {color:'#fff' }]} />
                        <Text style={[styles.userStyle,themeMode === "dark" && {color:'#fff' }]}>{user?.displayName}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={styles.container}>
                <Pressable onPress={handleToEmail}  style={[styles.boxItem,themeMode === "dark" && { backgroundColor: "#363B33" }]}>
                    <View style={{ marginHorizontal: 10, marginVertical: 8 }}>
                        <Text style={{ color: '#B0A695' }}>Email</Text>
                        <CircleIcon name='rightcircleo' size={25} style={[styles.icon,themeMode === "dark" && {color:'#fff' }]} />
                        <Text style={[styles.userStyle,themeMode === "dark" && {color:'#fff' }]}>{user?.email}</Text>
                    </View>
                </Pressable>
            </View>
            <View style={styles.container}>
                <Pressable onPress={handleToUpdatePassowrd}  style={[styles.boxItem,themeMode === "dark" && { backgroundColor: "#363B33" }]}>
                    <View style={{ marginHorizontal: 10, marginVertical: 8 }}>
                        <Text style={{ color: '#B0A695' }}>Password</Text>
                        <CircleIcon name='rightcircleo' size={25} style={[styles.icon,themeMode === "dark" && {color:'#fff' }]}/>
                        <Text style={[styles.userStyle,themeMode === "dark" && {color:'#fff' }]}>{password}</Text>
                    </View>
                </Pressable>
            </View>
            <Pressable onPress={async () => {
                await signOut();
                navigation.navigate('Home');
            }}>
                <View style={styles.deactiveAcnt}>
                    <DeleteIcon name='delete' size={20} style={styles.deleticon} />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: 'red' }}>Deactivate Account</Text>
                </View>
            </Pressable>
           </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    boxItem: {
        height: 80,
        width: '90%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        backgroundColor: '#E3E6E8'
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: 20
    },
    userStyle: {
        fontSize: 15,
        fontWeight: '700',
        top: 15
    },
    deactiveAcnt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    deleticon: {
        color: 'red',
        right: 10
    }
});
