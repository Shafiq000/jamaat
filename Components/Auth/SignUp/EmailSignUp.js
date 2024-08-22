import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Pressable, Alert, ScrollView,ActivityIndicator,I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthContext } from '../../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const EmailSignUp = ({ navigation }) => {
  const [valueMail, setValueMail] = useState('');
  const [name, setName] = useState('');
  const [valuePswrd, setValuePswrd] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confrmpasswordVisibility, setConfrmPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [confrmrightIcon, setConfrmRightIcon] = useState('eye');
  const [ismailInputFocused, setMailInputFocused] = useState(false);
  const [isNameInputFocused, setNameInputFocused] = useState(false);
  const [isPswrdInputFocused, setPswrdInputFocused] = useState(false);
  const [isPswrdConfrmInputFocused, setPswrdConfrmInputFocused] = useState(false);
  const [confrmpassword, setConfrmPassword] = useState('');
  const { signUpWithEmail, signInWithGoogle, facebookSignIn, user,themeMode } = useAuthContext();
  const [loading, setLoading] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    GoogleSignin.configure({ webClientId: '783668382478-0tvj9ga3j9kis2129pb686rcrf925o7t.apps.googleusercontent.com' });
  }, []);

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

  const handleConfrmPasswordVisibility = () => {
    setConfrmRightIcon(confrmrightIcon === 'eye' ? 'eye-with-line' : 'eye');
    setConfrmPasswordVisibility(!confrmpasswordVisibility);
  };

  const handleToLogin = () => {
    navigation.navigate('Login');
  };

  const createUser = async () => {
    setLoading(false);
    // Validation for empty fields
    if (!name.trim()) {
      Alert.alert('Name is required');
      return;
    }
    if (!valueMail.trim()) {
      Alert.alert('Email is required');
      return;
    }
    if (!valuePswrd.trim()) {
      Alert.alert('Password is required');
      return;
    }
    if (!confrmpassword.trim()) {
      Alert.alert('Confirm Password is required');
      return;
    }

    // Password match check000000
    if (valuePswrd !== confrmpassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    try {
      await signUpWithEmail(valueMail, valuePswrd, name);
      navigation.navigate('Home', { name, email: valueMail });
      // navigation.navigate('Notification', { name, email: valueMail });
    } catch (error) {
      console.error("Error creating user:", error);
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
    }finally{
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(false);
    try {
      await facebookSignIn();
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFFFFF' }, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      {loading ? (
         <ActivityIndicator size="large" color="#0a9484" />
      ):(
        <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', paddingVertical: 10 }}>
          <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
            <View style={{ paddingHorizontal: 17, paddingVertical: 10 }}>
              <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('fullname')}:</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                isNameInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                { color: themeMode === "dark" ? '#fff' : '#000' }
              ]}
              value={name}
              onChangeText={setName}
              placeholder={t('fullname')}
              placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
              onFocus={() => setNameInputFocused(true)}
              onBlur={() => setNameInputFocused(false)}
            />
          </View>
          <View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
            <View style={{ paddingHorizontal: 17, paddingVertical: 10 }}>
              <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('email')}:</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                ismailInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                { color: themeMode === "dark" ? '#fff' : '#000' }
              ]}
              value={valueMail}
              onChangeText={setValueMail}
              placeholder='name@email.com'
              placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
              onFocus={() => setMailInputFocused(true)}
              onBlur={() => setMailInputFocused(false)}
            />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 25 }}>
              <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('password')}:</Text>
            </View>
            <TextInput
              secureTextEntry={passwordVisibility}
              style={[
                styles.inputPassword,
                isPswrdInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                { color: themeMode === "dark" ? '#fff' : '#000' }
              ]}
              value={valuePswrd}
              onChangeText={setValuePswrd}
              placeholder={t('type_password')}
              placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
              onFocus={() => setPswrdInputFocused(true)}
              onBlur={() => setPswrdInputFocused(false)}
            />
            <Pressable style={{ position: 'absolute', right: 35, bottom: 8 }} onPress={handlePasswordVisibility}>
              <Icon name={rightIcon} size={23} color={'#AAAAAA'} />
            </Pressable>
          </View>
          <View style={{ justifyContent: 'center', paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 25 }}>
              <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('confirm_password')}:</Text>
            </View>
            <TextInput
              secureTextEntry={confrmpasswordVisibility}
              style={[
                styles.inputPassword,
                { marginLeft: I18nManager.isRTL ? 25 : '7%' },
                isPswrdConfrmInputFocused && { borderColor: themeMode === "dark" ? '#fff' : '#000' },
                { color: themeMode === "dark" ? '#fff' : '#000' }
              ]}
              value={confrmpassword}
              onChangeText={setConfrmPassword}
              placeholder={t('confirm_password')}
              placeholderTextColor={themeMode === "dark" ? '#fff' : '#AAAAAA'}
              onFocus={() => setPswrdConfrmInputFocused(true)}
              onBlur={() => setPswrdConfrmInputFocused(false)}
            />
            <Pressable style={{ position: 'absolute', right: 35, bottom: 13 }} onPress={handleConfrmPasswordVisibility}>
              <Icon name={confrmrightIcon} size={23} color={'#AAAAAA'} />
            </Pressable>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Pressable onPress={createUser} style={[{ height: 40, width: '87%', backgroundColor: '#000', justifyContent: 'center', borderRadius: 5 },themeMode === 'dark' && {backgroundColor:'#fff'}]}>
              <Text style={[{ color: '#fff', textAlign: 'center', fontSize: 15, fontWeight: '700' },themeMode === "dark" && { color: '#000' }]}>{t('sign_up')}</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
            <Text style={[themeMode === "dark" && { color: '#fff' }]}>{t('already_account')}</Text>
            <Pressable onPress={handleToLogin}>
              <Text style={[{ fontSize: 15, fontWeight: '700' }, themeMode === "dark" && { color: '#fff' }]}>{t('log_in')}</Text>
            </Pressable>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 50, gap: 10 }}>
            <View style={{ borderBottomColor: '#AAAAAA', borderBottomWidth: 1, height: 5, width: 80 }}></View>
            <Text style={[themeMode === "dark" && { color: '#fff' }]}> {t('or')} </Text>
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

export default EmailSignUp;

const styles = StyleSheet.create({
  image: {
    height: 45,
    width: 45,
  },
  input: {
    height: 40,
    width: '90%',
    marginLeft: '5%',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    borderColor: '#AAAAAA',
    textAlign:I18nManager.isRTL ? 'right' :'left'
  },
  inputPassword: {
    height: 40,
    width: '86%',
    marginLeft: '7%',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    borderColor: '#AAAAAA',
    textAlign:I18nManager.isRTL ? 'right' :'left'

  },
});
