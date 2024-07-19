import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import HeaderBack from '../Components/HeaderBack';
import { useAuthContext } from '../Navigations/AuthContext';

const Fullname = ({ navigation }) => {
    const { user, updateUserProfile, themeMode } = useAuthContext();
    const [isNameInputFocused, setNameInputFocused] = useState(false);
    const [name, setName] = useState(user?.displayName || '');

    useEffect(() => {
        // Ensure the local name state matches the context user displayName
        if (user && user.displayName !== name) {
            setName(user.displayName);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await updateUserProfile({ displayName: name });
            Alert.alert("Success", "Name updated successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update name. Please try again.");
        }
    };

    return (
        <View style={[styles.container, themeMode === "dark" && styles.darkContainer]}>
            <HeaderBack title={'Fullname'} navigation={navigation} />
            <View style={styles.inputContainer}>
                <Text style={[styles.nameStyle, themeMode === "dark" && styles.darkText]}>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.textInput,
                        isNameInputFocused && styles.focusedInput,
                        themeMode === "dark" && styles.darkTextInput,
                        themeMode === "dark" && isNameInputFocused && styles.darkFocusedInput
                    ]}
                    placeholder='Enter full name'
                    placeholderTextColor={themeMode === "dark" ? "#AAAAAA" : "#888888"}
                    onFocus={() => setNameInputFocused(true)}
                    onSubmitEditing={() => setNameInputFocused(false)}
                    onEndEditing={() => setNameInputFocused(false)}
                />
            </View>
            <View style={styles.saveButtonContainer}>
                <Pressable
                    style={[styles.saveButton,themeMode === "dark" && { backgroundColor: "#fff" }]}
                    onPress={handleSave}
                >
                    <Text style={[styles.saveButtonText,themeMode === "dark" && {color:'#000' }]}>Save</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Fullname;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    darkContainer: {
        backgroundColor: '#1C1C22',
    },
    inputContainer: {
        justifyContent: 'center',
        paddingVertical: 20,
    },
    nameStyle: {
        left: 30,
        bottom: 10,
    },
    darkText: {
        color: '#FFFFFF',
    },
    textInput: {
        height: 40,
        width: '90%',
        marginLeft: '5%',
        borderColor: '#AAAAAA',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        color: '#000000',
    },
    darkTextInput: {
        backgroundColor: '#363B33',
        borderColor: '#555555',
        color: '#FFFFFF',
    },
    focusedInput: {
        borderColor: '#000000',
    },
    darkFocusedInput: {
        borderColor: '#FFFFFF',
    },
    saveButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButton: {
        height: 40,
        width: '87%',
        backgroundColor: '#000000',
        justifyContent: 'center',
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
    }
});
