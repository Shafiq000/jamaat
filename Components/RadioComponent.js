import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import { useAuthContext } from '../Navigations/AuthContext';
const RadioComponent = ({ handleOptionPress, item, stateKey, selectedKey }) => {
    const { themeMode } = useAuthContext();
    return (
        <View style={[styles.items, themeMode === "dark" && { backgroundColor: "#1C1C22", color: "#fff" }]}>
            <RadioButton.Group
                onValueChange={value => handleOptionPress(item.key, value, stateKey)}
                value={selectedKey}
            >
                <View style={styles.radioContainer}>
                    <RadioButton.Item
                        value={item.key}
                        label={item.label}
                        color="#0a9484"
                        style={styles.radioButton}
                        labelStyle={[{ color: "#000" ,fontSize:15}, themeMode === "dark" && { color: "#fff" }]}
                    />
                </View>
            </RadioButton.Group>
            <Text style={[styles.angleText, themeMode === "dark" && { color: "#fff" }]}>
                {item.angle}
            </Text>
        </View>
    )
}

export default RadioComponent

const styles = StyleSheet.create({
    items: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 10,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    radioButton: {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-start'
    },
    angleText: {
        color: "#000",
        fontSize: 15,
        right: 15
    },
})