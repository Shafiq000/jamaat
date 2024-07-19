import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';

const Header = ({ title, navigation }) => {
    const openDrawer = () => {
        navigation.toggleDrawer();
    }

    return (
        <View style={styles.headerContainer}>
            <Pressable hitSlop={20} onPress={openDrawer} style={styles.icon}>
                <Icon name='navicon' size={30} color={'#fff'} />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#0a9484',
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        
        fontSize: 20,
        fontWeight: '500',
        color: "#fff",
        letterSpacing: 1,
    },
    icon: {
        position: "absolute",
        left: 16
    }
});
