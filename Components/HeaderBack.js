import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';

const HeaderBack = ({ title, navigation }) => {
    return (
        <View style={styles.headerContainer}>
            <Pressable hitSlop={20} onPress={() => navigation.goBack()} style={styles.icon}>
                <Icon name='left' size={25} color={'#fff'} />
            </Pressable>
            <Text numberOfLines={1}   style={styles.title}>{title}</Text>
        </View>
    )
}

export default HeaderBack

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#0a9484',
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginLeft:10,
        textAlign:'center',
        fontSize: 20,
        fontWeight: '500',
        color: "#fff",
        letterSpacing: 0,
    },
    icon: {
        position: "absolute",
        left:8
        
    }
})