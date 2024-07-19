import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import Compass from '../Qibla/Compass';
import Map from '../Qibla/Map';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const TopBar = () => {
  const navigation = useNavigation();

  // const goBack = () => {
  //   navigation.goBack();
  // };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
      {/* <Pressable hitSlop={10}  onPress={() => navigation.goBack()} style={styles.icon}>
        <Icon name='left' size={25} color={'#fff'} />
      </Pressable> */}
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          tabBarPressColor: false,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#fff',
          swipeEnabled: false,
          tabBarAndroidRipple: { borderless: false },
          tabBarStyle: {
            borderRadius: 1,
            width: "55%",
            backgroundColor: '#0a9484',
            height: 110,
            paddingTop: 10,
            left: 70,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#fff',
            height: '28%',
            borderRadius: 30,
            marginBottom: 60,
          },
          tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
        }}
      >
        <Tab.Screen name="Compass" component={Compass} />
        <Tab.Screen name="Map" component={Map} />
      </Tab.Navigator>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 15,
    top: 23,
    bottom: 0,
    right: 0,
  },
});
