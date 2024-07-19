import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HeaderBack from '../Components/HeaderBack';
import { useAuthContext } from '../Navigations/AuthContext';

const Notification = ({ navigation }) => {
  const { user, isAuthenticated } = useAuthContext();
  const { themeMode } = useAuthContext();

  const getCurrentDate = () => {
    const date = new Date();
    const options = {
      // weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <View style={[styles.container,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      <HeaderBack title="Notification" navigation={navigation} />
      {isAuthenticated ? (
        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
          <View style={[styles.welcomContainer,themeMode === "dark" && { backgroundColor: "#363B33" }]}>
            <Text style={[styles.userInfoname,themeMode === "dark" && {color:'#fff'}]}>Welcome {user.displayName}!</Text>
            <Text style={[styles.userInfoDate,themeMode === "dark" && {color:'#fff'}]}>{getCurrentDate()}</Text>
            <Text style={[styles.userInfoText,themeMode === "dark" && {color:'#fff'}]}>You are all set up to start using our services</Text>
          </View>
        </View>
      ) : (
        <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' },themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
          <Text style={[{ fontSize: 15, fontWeight: '500' },themeMode === "dark" && { color:'#fff' }]}>No Logged-in User</Text>
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomContainer: {
    height: 100,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#FCF5E5',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  userInfoname: {
    fontSize: 16,
    fontWeight: '700',
  },
  userInfoDate: {
    fontSize: 16,
    fontWeight: '700',
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
