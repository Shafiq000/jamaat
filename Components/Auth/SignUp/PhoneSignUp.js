import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Pressable, ScrollView, Alert,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useAuthContext } from '../../../Navigations/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const PhoneSignUp = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPhoneInputFocused, setPhoneInputFocused] = useState(false);
    const [isNameInputFocused, setNameInputFocused] = useState(false);
    const [isPasswordInputFocused, setPasswordInputFocused] = useState(false);
    const [isConfirmPasswordInputFocused, setConfirmPasswordInputFocused] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');
    const [confirmRightIcon, setConfirmRightIcon] = useState('eye');
    const { signInWithGoogle,facebookSignIn, themeMode } = useAuthContext();
    const [loading, setLoading] = useState();

    const handlePasswordVisibility = () => {
        setRightIcon(rightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setPasswordVisibility(!passwordVisibility);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmRightIcon(confirmRightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setConfirmPasswordVisibility(!confirmPasswordVisibility);
    };

    const handleToLogin = () => {
        navigation.navigate('Login');
    };

    // const signInWithPhoneNumber = async (mobile) => {
    //     try {
    //         const confirmation = await auth().signInWithPhoneNumber(mobile);
    //         setConfirm(confirmation);
    //         // Navigate to verification screen or proceed with code verification
    //     } catch (error) {
    //         console.error('Error during phone sign-in', error);
    //         Alert.alert('Error', 'Failed to sign in with phone number');
    //     }
    // };

    const handleSignUp = async () => {
        setLoading(false);
        if (!phone.trim()) {
          Alert.alert('Phone number is required');
          return;
        }
        if (!name.trim()) {
          Alert.alert('Name is required');
          return;
        }
        if (!password.trim()) {
          Alert.alert('Password is required');
          return;
        }
        if (!confirmPassword.trim()) {
          Alert.alert('Confirm Password is required');
          return;
        }
      
        if (password !== confirmPassword) {
          Alert.alert('Passwords do not match');
          return;
        }
      
        try {
        //   await signInWithPhoneNumber(phone);
        //   // Navigate to verification screen or proceed with code verification
        //   const confirmation = await auth().signInWithPhoneNumber(mobile);
        //           setConfirm(confirmation);
        //   navigation.navigate('PhoneVerification', { phone });
        Alert.alert('Use Mail for SignUp')
        } catch (error) {
          Alert.alert('Error', 'Failed to sign in with phone number');
        } finally{
            setLoading(false);
        }
      };
      
      const googlesignin = async () => {
        setLoading(false);
        try {
            await signInWithGoogle();
            const userInfo = await GoogleSignin.signIn();
            const { user } = userInfo;
            const { name, email } = user;
            navigation.navigate('Home', { name, email });
        } catch (error) {
            console.error("Error signing in with Google:", error);
        } finally{
            setLoading(false);
        }
    };

    const handleFacebookSignIn = async () => {
        setLoading(false);
        try {
            await facebookSignIn();
        } catch (error) {
            console.error("Error signing in with Facebook:", error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFFFFF' }, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
           {loading ? (
             <ActivityIndicator size="large" color="#ffffff" />
           ):(
            <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                    <View style={{ paddingHorizontal: 17, paddingVertical: 10 }}>
                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>Phone Number:</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ height: 40, width: 65, backgroundColor: '#AAAAAA', borderRadius: 5, alignItems: 'center', justifyContent: 'center',marginRight:10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
                                <Image source={require('../../../src/Images/pakistan.png')} style={styles.logoimage} />
                                <Text style={themeMode === "dark" && { color: '#fff' }}>+92</Text>
                            </View>
                        </View>
                        <TextInput
                            keyboardType='phone-pad'
                            maxLength={13}
                            value={phone}
                            onChangeText={setPhone}
                            style={[
                                styles.input,
                                isPhoneInputFocused && {  borderColor: themeMode === "dark" ? '#fff' : '#000'},
                                { width: '65%' },
                                themeMode === "dark" && { color: '#fff' }
                            ]}
                            placeholder='+92 333 1122333'
                            placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                            // placeholderTextColor={themeMode === "dark" ? "#AAAAAA" : "#000000"}
                            onFocus={() => setPhoneInputFocused(true)}
                            onBlur={() => setPhoneInputFocused(false)}
                        />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                    <View style={{ paddingHorizontal: 17, paddingVertical: 10 }}>
                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>Name:</Text>
                    </View>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={[
                            styles.input,
                            isNameInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                            { width: '90%', marginLeft: '5%' },
                            themeMode === "dark" && { color: '#fff' }
                        ]}
                        placeholder='Enter full name'
                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                        onFocus={() => setNameInputFocused(true)}
                        onBlur={() => setNameInputFocused(false)}
                    />
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 25 }}>
                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>Password:</Text>
                    </View>
                    <TextInput
                        secureTextEntry={passwordVisibility}
                        value={password}
                        onChangeText={setPassword}
                        style={[
                            styles.input,
                            isPasswordInputFocused && {  borderColor: themeMode === "dark" ? '#fff' : '#000' },
                            { width: '86%', marginLeft: '7%' },
                            themeMode === "dark" && { color: '#fff' }
                        ]}
                        placeholder='type your password'
                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                        onFocus={() => setPasswordInputFocused(true)}
                        onBlur={() => setPasswordInputFocused(false)}
                    />
                    <Pressable style={{ position: 'absolute', right: 35, bottom: 8 }}
                        onPress={handlePasswordVisibility}>
                        <Icon name={rightIcon} size={23} color={'#AAAAAA'} />
                    </Pressable>
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 25 }}>
                        <Text style={[themeMode === "dark" && { color: '#fff' }]}>Confirm Password:</Text>
                    </View>
                    <TextInput
                        secureTextEntry={confirmPasswordVisibility}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={[
                            styles.input,
                            isConfirmPasswordInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                            { width: '86%', marginLeft: '7%' },
                            themeMode === "dark" && { color: '#fff' }
                        ]}
                        placeholder='type your password'
                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                        onFocus={() => setConfirmPasswordInputFocused(true)}
                        onBlur={() => setConfirmPasswordInputFocused(false)}
                    />
                    <Pressable style={{ position: 'absolute', right: 35, bottom: 13 }}
                        onPress={handleConfirmPasswordVisibility}>
                        <Icon name={confirmRightIcon} size={23} color={'#AAAAAA'} />
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                    <Pressable onPress={handleSignUp} style={[{ height: 40, width: '87%', backgroundColor: '#000', justifyContent: 'center', borderRadius: 5 }, themeMode === "dark" && { backgroundColor: '#fff' }]}>
                        <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 15, fontWeight: '700' }, themeMode === "dark" && { color: '#000' }]}>Sign Up</Text>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={[themeMode === "dark" && { color: '#fff' }]}>Don't have an account? </Text>
                    <Pressable onPress={handleToLogin}>
                        <Text style={[{ fontSize: 15, fontWeight: '700' }, themeMode === "dark" && { color: '#fff' }]}>Log In</Text>
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 50, gap: 10 }}>
                    <View style={{ borderBottomColor: '#AAAAAA', borderBottomWidth: 1, height: 5, width: 80 }}></View>
                    <Text style={[themeMode === "dark" && { color: '#fff' }]}> or </Text>
                    <View style={{ borderBottomColor: '#AAAAAA', borderBottomWidth: 1, height: 5, width: 80 }}></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 20 }}>
                    <Pressable onPress={googlesignin}>
                        <Image source={require('../../../src/Images/google.png')} style={styles.image} />
                    </Pressable>
                    <Pressable onPress={handleFacebookSignIn}>
                        <Image source={require('../../../src/Images/facebook.png')} style={styles.image} />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
            </>
           )}
        </SafeAreaView>
    );
};

export default PhoneSignUp;

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#AAAAAA',
    },
    image: {
        height: 45,
        width: 45,
    },
    logoimage: {
        height: 30,
        width: 30,
    },
});
