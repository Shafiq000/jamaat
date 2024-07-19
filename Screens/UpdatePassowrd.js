import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import HeaderBack from '../Components/HeaderBack';
import Icon from 'react-native-vector-icons/Entypo';
import { useAuthContext } from '../Navigations/AuthContext';

const UpdatePassword = ({ navigation }) => {
    const { updateUserPassword, themeMode } = useAuthContext(); // Destructure themeMode
    const [isPswrdInputFocused, setPswrdInputFocused] = useState(false);
    const [isNewPswrdInputFocused, setNewPswrdInputFocused] = useState(false);
    const [isPswrdConfrmInputFocused, setPswrdConfrmInputFocused] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(true);
    const [confrmpasswordVisibility, setConfrmPasswordVisibility] = useState(true);
    const [confrmpassword, setConfrmPassword] = useState('');
    const [valuePswrd, setValuePswrd] = useState('');
    const [valueCurrentPswrd, setValueCurrentPswrd] = useState('');
    const [rightIcon, setRightIcon] = useState('eye');
    const [confrmrightIcon, setConfrmRightIcon] = useState('eye');
    const [NewrightIcon, setNewRightIcon] = useState('eye');

    const handlePasswordVisibility = () => {
        setRightIcon(rightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setPasswordVisibility(!passwordVisibility);
    };

    const handleNewPasswordVisibility = () => {
        setNewRightIcon(NewrightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setCurrentPasswordVisibility(!currentPasswordVisibility);
    };

    const handleConfrmPasswordVisibility = () => {
        setConfrmRightIcon(confrmrightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setConfrmPasswordVisibility(!confrmpasswordVisibility);
    };

    const handleSave = async () => {
        try {
            if (valuePswrd !== confrmpassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }
            await updateUserPassword(valueCurrentPswrd, valuePswrd);
            Alert.alert("Success", "Password updated successfully!");
            navigation.goBack();
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert("Error", "Failed to update password. Please try again.");
        }
    };

    return (
        <View style={[styles.container, themeMode === 'dark' && styles.darkContainer]}>
            <HeaderBack title={'Password'} navigation={navigation} />
            <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                    <Text style={[styles.label, themeMode === 'dark' && styles.darkText]}>Current Password:</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        secureTextEntry={currentPasswordVisibility}
                        value={valueCurrentPswrd}
                        onChangeText={value => setValueCurrentPswrd(value)}
                        style={[
                            styles.textInput,
                            themeMode === 'dark' && styles.darkTextInput,
                            isNewPswrdInputFocused && styles.focusedInput,
                            themeMode === 'dark' && isNewPswrdInputFocused && styles.darkFocusedInput
                        ]}
                        placeholder='Type your current password'
                        placeholderTextColor={themeMode === 'dark' ? '#AAAAAA' : '#888888'}
                        onFocus={() => setNewPswrdInputFocused(true)}
                        onSubmitEditing={() => setNewPswrdInputFocused(false)}
                        onEndEditing={() => setNewPswrdInputFocused(false)}
                    />
                    <Pressable style={styles.iconWrapper} onPress={handleNewPasswordVisibility}>
                        <Icon name={NewrightIcon} size={23} color={themeMode === 'dark' ? '#FFFFFF' : '#AAAAAA'} />
                    </Pressable>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                    <Text style={[styles.label, themeMode === 'dark' && styles.darkText]}>New Password:</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        secureTextEntry={passwordVisibility}
                        value={valuePswrd}
                        onChangeText={value => setValuePswrd(value)}
                        style={[
                            styles.textInput,
                            themeMode === 'dark' && styles.darkTextInput,
                            isPswrdInputFocused && styles.focusedInput,
                            themeMode === 'dark' && isPswrdInputFocused && styles.darkFocusedInput
                        ]}
                        placeholder='Type your new password'
                        placeholderTextColor={themeMode === 'dark' ? '#AAAAAA' : '#888888'}
                        onFocus={() => setPswrdInputFocused(true)}
                        onSubmitEditing={() => setPswrdInputFocused(false)}
                        onEndEditing={() => setPswrdInputFocused(false)}
                    />
                    <Pressable style={styles.iconWrapper} onPress={handlePasswordVisibility}>
                        <Icon name={rightIcon} size={23} color={themeMode === 'dark' ? '#FFFFFF' : '#AAAAAA'} />
                    </Pressable>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                    <Text style={[styles.label, themeMode === 'dark' && styles.darkText]}>Confirm Password:</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        secureTextEntry={confrmpasswordVisibility}
                        value={confrmpassword}
                        onChangeText={value => setConfrmPassword(value)}
                        style={[
                            styles.textInput,
                            themeMode === 'dark' && styles.darkTextInput,
                            isPswrdConfrmInputFocused && styles.focusedInput,
                            themeMode === 'dark' && isPswrdConfrmInputFocused && styles.darkFocusedInput
                        ]}
                        placeholder='Confirm your password'
                        placeholderTextColor={themeMode === 'dark' ? '#AAAAAA' : '#888888'}
                        onFocus={() => setPswrdConfrmInputFocused(true)}
                        onSubmitEditing={() => setPswrdConfrmInputFocused(false)}
                        onEndEditing={() => setPswrdConfrmInputFocused(false)}
                    />
                    <Pressable style={styles.iconWrapper} onPress={handleConfrmPasswordVisibility}>
                        <Icon name={confrmrightIcon} size={23} color={themeMode === 'dark' ? '#FFFFFF' : '#AAAAAA'} />
                    </Pressable>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[
                        styles.saveButton,
                        themeMode === 'dark' && styles.darkSaveButton
                    ]}
                    onPress={handleSave}
                >
                    <Text style={[
                        styles.saveButtonText,
                        themeMode === 'dark' && styles.darkSaveButtonText
                    ]}>Save</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default UpdatePassword;

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
        paddingVertical: 5,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    label: {
        color: '#000000',
    },
    darkText: {
        color: '#FFFFFF',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 40,
        width: '85%',
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
    iconWrapper: {
        position: 'absolute',
        right: 40,
        bottom: 8,
    },
    buttonContainer: {
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
