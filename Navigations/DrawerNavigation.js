import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation from './BottomTabNavigation';
import CustomDrawer from '../Components/CustomDrawer';
import { useAuthContext } from './AuthContext';
const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }) => {
  const { user, isAuthenticated } = useAuthContext();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../src/Images/masjid.png')} style={styles.image} />
              <Text style={styles.title}>Masjid</Text>
            </View>
            <View style={styles.authContainer}>
              {isAuthenticated && user ? (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.userInfoname}>{user.displayName}</Text>
                  <Text style={styles.userInfomail}>{user.email}</Text>
                </View>
              ) : (
                <>
                  <Pressable hitSlop={20} onPress={() => navigation.navigate('Login')}>
                    <View style={styles.logContainer}>
                      <Text style={styles.logText}>Login</Text>
                    </View>
                  </Pressable>
                  <Text style={styles.orText}>or</Text>
                  <Pressable hitSlop={20} onPress={() => navigation.navigate('SignUp')}>
                    <View style={styles.regContainer}>
                      <Text style={styles.regText}>Sign Up</Text>
                    </View>
                  </Pressable>
                </>
              )}
            </View>
          </View>
          <CustomDrawer {...props} />
        </SafeAreaView>
      )}
    >
      <Drawer.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
    </Drawer.Navigator>
  );
};


export default DrawerNavigation;

const styles = StyleSheet.create({
  mainContainer: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a9484',
  },
  image: {
    height: 90,
    width: 80,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  authContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 5,
  },
  logContainer: {
    height: 40,
    width: 250,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
  },
  logText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  orText: {
    color: '#fff',
  },
  regContainer: {
    height: 40,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    margin: 10,
  },
  regText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  userInfoname: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '700',
  },
  userInfomail: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
