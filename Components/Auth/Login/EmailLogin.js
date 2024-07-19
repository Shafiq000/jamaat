import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Pressable, Alert,ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { useAuthContext } from '../../../Navigations/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const EmailLogin = ({ navigation }) => {
    const [valueMail, setValueMail] = useState('');
    const [valuePswrd, setValuePswrd] = useState('');
    const [ismailInputFocused, setMailInputFocused] = useState(false);
    const [isPswrdInputFocused, setPswrdInputFocused] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');
    const { signInWithEmail, user, signInWithGoogle, isAuthenticated, facebookSignIn, themeMode } = useAuthContext();
    const [loading, setLoading] = useState();

    useEffect(() => {
        GoogleSignin.configure({ webClientId: '783668382478-0tvj9ga3j9kis2129pb686rcrf925o7t.apps.googleusercontent.com' });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate('Home', { name: user.displayName, email: user.email });
        }
    }, [isAuthenticated, navigation, user]);

    useEffect(() => {
        if (user) {
            const { displayName, email } = user;
            navigation.navigate('Home', { name: displayName, email });
        }
    }, [user, navigation]);

    const handlePasswordVisibility = () => {
        setRightIcon(rightIcon === 'eye' ? 'eye-with-line' : 'eye');
        setPasswordVisibility(!passwordVisibility);
    };

    const handleToSignup = () => {
        navigation.navigate('SignUp');
    };

    const handleLogin = async () => {
        setLoading(false);
        try {
            const userData = await signInWithEmail(valueMail, valuePswrd);
            navigation.navigate('Home', { email: userData.email, name: userData.displayName });
        } catch (error) {
            Alert.alert('Login failed', 'Please check your credentials and try again.');
            console.error("Error logging in: ", error);
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
        <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFFFFF' },themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
           {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
           ):(
            <>
             <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
                    <View style={{ paddingHorizontal: 17, paddingVertical: 10 }}>
                        <Text style={themeMode === "dark" && { color: '#fff' }}>Email:</Text>
                    </View>
                    <TextInput
                        value={valueMail}
                        onChangeText={value => setValueMail(value)}
                        style={[
                            styles.inputEmail,
                            { borderColor: ismailInputFocused ? '#000' : '#AAAAAA' },
                            themeMode === "dark" && { borderColor: '#fff', color: '#fff' }
                        ]}
                        placeholder='name@email.com'
                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                        onFocus={() => setMailInputFocused(true)}
                        onSubmitEditing={() => setMailInputFocused(false)}
                        onEndEditing={() => setMailInputFocused(false)}
                    />
                </View>
                <View style={{ justifyContent: 'center', marginVertical: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 25 }}>
                        <Text style={themeMode === "dark" && { color: '#fff' }}>Password:</Text>
                        <Pressable>
                            <Text style={themeMode === "dark" && { color: '#fff' }}>Forgot Password ?</Text>
                        </Pressable>
                    </View>
                    <TextInput
                        secureTextEntry={passwordVisibility}
                        value={valuePswrd}
                        onChangeText={value => setValuePswrd(value)}
                        style={[
                            styles.input,
                            { borderColor: isPswrdInputFocused ? '#000' : '#AAAAAA' },
                            themeMode === "dark" && { borderColor: '#fff', color: '#fff' }
                        ]}
                        placeholder='type your password'
                        placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
                        onFocus={() => setPswrdInputFocused(true)}
                        onSubmitEditing={() => setPswrdInputFocused(false)}
                        onEndEditing={() => setPswrdInputFocused(false)}
                    />
                    <Pressable style={{ position: 'absolute', right: 35, bottom: 8 }} onPress={handlePasswordVisibility}>
                        <Icon name={rightIcon} size={23} color={themeMode === "dark" ? '#fff' : '#AAAAAA'} />
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }}>
                    <Pressable
                        onPress={handleLogin}
                        style={[
                            styles.loginButton,
                            themeMode === "dark" && { backgroundColor: '#fff' }
                        ]}
                    >
                        <Text style={[
                            styles.loginButtonText,
                            themeMode === "dark" && { color: '#000' }
                        ]}>
                            Log in
                        </Text>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={themeMode === "dark" && { color: '#fff' }}>Don't have an account? </Text>
                    <Pressable onPress={handleToSignup}>
                        <Text style={[styles.signUpText, themeMode === "dark" && { color: '#fff' }]}>Sign Up</Text>
                    </Pressable>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 50, gap: 10 }}>
                    <View style={[
                        styles.divider,
                        themeMode === "dark" && { borderBottomColor: '#fff' }
                    ]}></View>
                    <Text style={themeMode === "dark" && { color: '#fff' }}> or </Text>
                    <View style={[
                        styles.divider,
                        themeMode === "dark" && { borderBottomColor: '#fff' }
                    ]}></View>
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
            </>
           )}
        </SafeAreaView>
    );
}

export default EmailLogin;

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '90%',
        marginLeft: '5%',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10
    },
    inputEmail: {
        height: 40,
        width: '94%',
        marginLeft: '3%',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 8
    },
    loginButton: {
        height: 40,
        width: '87%',
        backgroundColor: '#000',
        justifyContent: 'center',
        borderRadius: 5
    },
    loginButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700'
    },
    signUpText: {
        fontSize: 15,
        fontWeight: '700'
    },
    divider: {
        borderBottomColor: '#AAAAAA',
        borderBottomWidth: 1,
        height: 5,
        width: 80
    },
    image: {
        height: 45,
        width: 45
    }
});
