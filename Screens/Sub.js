import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../Components/HeaderBack';
import LocIcon from 'react-native-vector-icons/EvilIcons';
import { useAuthContext } from '../Navigations/AuthContext';
const Sub = ({ navigation }) => {
  const [subMosque, setSubMosque] = useState([]);
  const { themeMode } = useAuthContext();

  const fetchSubscribedMosques = async () => {
    try {
      const Subscribe = JSON.parse(await AsyncStorage.getItem("Subscribe")) || [];
      setSubMosque(Subscribe);
    } catch (e) {
      console.error("Error retrieving subscriptions:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSubscribedMosques();
    });
    return unsubscribe;
  }, [navigation]);

  const handleItemPress = (item) => {
    navigation.navigate('MasjidDetails', { itemId: item.id });
  };

  return (
    <View style={[{ flex:1 }]}>
      <HeaderBack title={'Subscribed Masjids'} navigation={navigation} />
      <ScrollView style={[styles.container,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
        {subMosque.length > 0 ? (
          subMosque.map((mosque, index) => (
            <View key={index} style={[styles.mosqueContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
              <Pressable onPress={() => handleItemPress(mosque)} style={styles.itemContainer}>
                <Image source={{ uri: mosque.image }} style={styles.image} />
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{mosque.title}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <LocIcon name='location' size={22} color={'#fff'} />
                    <Text style={styles.address}>{mosque.address}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.noSubscriptionText}>No Subscribed Masjids</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Sub;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  mosqueContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: 'gray',
  },
  noSubscriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
    marginTop: 50,
  },
  itemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  address: {
    color: 'white',
    fontSize: 14,
  },
});
