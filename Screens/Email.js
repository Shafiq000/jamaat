import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import HeaderBack from '../Components/HeaderBack';
import { useAuthContext } from '../Navigations/AuthContext';

const Email = ({ navigation }) => {
    const { user, updateUserEmail, themeMode } = useAuthContext(); // Destructure updateUserProfile and themeMode
    const [isMailInputFocused, setMailInputFocused] = useState(false);
    const [valueMail, setValueMail] = useState(user?.email || '');

    useEffect(() => {
        setValueMail(user?.email || ''); // Update valueMail when user email changes
    }, [user?.email]);

    const handleSave = async () => {
        try {
            await updateUserEmail(valueMail);
            Alert.alert("Success", "Email updated successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Error updating email: ", error);
            Alert.alert("Error", "Failed to update email. Please try again.");
        }
    };

    return (
        <View style={[styles.container, themeMode === "dark" && styles.darkContainer]}>
            <HeaderBack title={'Email'} navigation={navigation} />
            <View style={styles.inputContainer}>
                <Text style={[styles.nameStyle, themeMode === "dark" && styles.darkText]}>Email</Text>
                <TextInput
                    value={valueMail}
                    onChangeText={setValueMail}
                    style={[
                        styles.textInput,
                        isMailInputFocused && styles.focusedInput,
                        themeMode === "dark" && styles.darkTextInput,
                        themeMode === "dark" && isMailInputFocused && styles.darkFocusedInput
                    ]}
                    placeholder='Enter email'
                    placeholderTextColor={themeMode === "dark" ? "#AAAAAA" : "#888888"}
                    onFocus={() => setMailInputFocused(true)}
                    onSubmitEditing={() => setMailInputFocused(false)}
                    onEndEditing={() => setMailInputFocused(false)}
                />
            </View>
            <View style={styles.saveButtonContainer}>
                <Pressable
                    style={[
                        styles.saveButton,
                        themeMode === "dark" && styles.darkSaveButton
                    ]}
                    onPress={handleSave}
                >
                    <Text style={[
                        styles.saveButtonText,
                        themeMode === "dark" && styles.darkSaveButtonText
                    ]}>Save</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Email;

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
    darkSaveButton: {
        backgroundColor: '#FFFFFF',
    },
    saveButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
    },
    darkSaveButtonText: {
        color: '#000000',
    }
});
