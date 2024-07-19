import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthContextProvider from "./Navigations/AuthContext";
import AppStack from './Navigations/AppStack';
import AuthProvider from './Navigations/AuthContext';
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContextProvider>
          <StatusBar
            animated={true}
            backgroundColor="#0A9484"
            barStyle={"light-content"}
          />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppStack />
          </GestureHandlerRootView>
        </AuthContextProvider>
      </NavigationContainer>
    </AuthProvider>

  );
};

