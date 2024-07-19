import React, { createContext, useState, useEffect, useContext } from "react";
import { Appearance } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [isAutoPlayActive,setIsAutoPlayActive]=useState()

  useEffect(() => {
    GoogleSignin.configure({ webClientId: '783668382478-0tvj9ga3j9kis2129pb686rcrf925o7t.apps.googleusercontent.com' });
  }, []);

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem("themeMode");
      if (storedTheme) {
        setThemeMode(storedTheme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setThemeMode(systemTheme || "light");
      }
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    const newThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newThemeMode);
  };

  const signUpWithEmail = async (email, password, name) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;
      await user.updateProfile({ displayName: name });
      const userData = {
        email: user.email,
        displayName: name,
        uid: user.uid,
      };
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error signing up with email: ", error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const { user } = userCredential;
      const userData = {
        email: user.email,
        displayName: user.displayName || 'User',
        uid: user.uid,
      };
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData; // Return userData for further use in navigation
    } catch (error) {
      console.error("Error signing in with email: ", error);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile(updates);
        await currentUser.reload();
        const updatedUser = auth().currentUser;
        const updatedUserData = {
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          uid: updatedUser.uid,
        };
        setUser(updatedUserData);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
        console.log("User profile updated successfully:", updatedUserData);
      }
    } catch (error) {
      console.error("Error updating user profile: ", error);
      throw error;
    }
  };

  const updateUserEmail = async (newEmail) => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateEmail(newEmail);
        await currentUser.reload();
        const updatedUser = auth().currentUser;
        const updatedUserData = {
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          uid: updatedUser.uid,
        };
        setUser(updatedUserData);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
        console.log("User profile updated successfully:", updatedUserData);
      }
    } catch (error) {
      console.error("Error updating email: ", error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
      console.log("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { user } = userInfo;
      const userData = {
        email: user.email,
        displayName: user.name,
        uid: user.id,
      };
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services are not available or outdated');
            break;
          case statusCodes.DEVELOPER_ERROR:
            console.log('Developer error. Check your configuration');
            break;
          default:
            console.log('Some other error happened', error);
            break;
        }
      } else {
        console.log('An error occurred not related to Google Sign-In', error);
      }
    }
  };

  const facebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        console.log("User cancelled the login process");
        return;
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.error("Failed to get access token");
        return;
      }
      const response = await fetch(`https://graph.facebook.com/v10.0/me?fields=id,name,email&access_token=${data.accessToken}`);
      const user = await response.json();
      if (user) {
        const { name, email, id } = user;
        const userData = {
          email,
          displayName: name,
          uid: id,
        };
        setUser(userData);
        setIsAuthenticated(true);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
      }
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signUpWithPhoneNumber = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log("Confirmation:", confirmation);
      setConfirm(confirmation);
      return confirmation;
    } catch (error) {
      console.error('Error during phone sign-up:', error);
      throw error;
    }
  };

  const confirmCodeForSignUp = async (code) => {
    try {
      await confirm.confirm(code);
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userData = {
          phoneNumber: currentUser.phoneNumber,
          uid: currentUser.uid,
        };
        setUser(userData);
        setIsAuthenticated(true);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error confirming code for sign-up:', error);
      throw error;
    }
  };

  useEffect(() => {
    getCurrentLocation();

    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => console.log(error),
      { 
        TIMEOUT: 3,
        POSITION_UNAVAILABLE: 2,
        PERMISSION_DENIED: 1,
        message: 'Location request timed out',
        ACTIVITY_NULL: 4,
        code: 3
      }
    );
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (setCurrentLocation && setPickedLocation) {
      setCurrentLocation({ latitude, longitude });
      setPickedLocation({ latitude, longitude });
    }
  };

  const handleRegionChangeComplete = (region) => {
    if (pickedLocation.latitude !== region.latitude || pickedLocation.longitude !== region.longitude) {
      setPickedLocation(region);
      setCurrentLocation(region);
    }
  };
  


  const value = {
    themeMode,
    toggleThemeMode,
    isAuthenticated,
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    facebookSignIn,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    signUpWithPhoneNumber,
    confirmCodeForSignUp, // New function for confirming code during sign-up
    setCurrentLocation,
    currentLocation,
    handleMapPress,
    pickedLocation,
    setPickedLocation,
    handleRegionChangeComplete,
    isAutoPlayActive,
    setIsAutoPlayActive
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
