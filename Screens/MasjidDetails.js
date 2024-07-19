import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View, Image, Switch, Share, ScrollView, Pressable, Linking, Alert, Modal, Dimensions } from 'react-native';
import mosques from '../Jsondata/Mosques.json';
import EditIcon from 'react-native-vector-icons/Feather';
import LocIcon from 'react-native-vector-icons/EvilIcons';
import HeaderBack from '../Components/HeaderBack';
import FeedIcon from 'react-native-vector-icons/FontAwesome6';
import ShareIcon from 'react-native-vector-icons/Entypo';
import DirecIcon from 'react-native-vector-icons/FontAwesome';
import MinusIcon from 'react-native-vector-icons/AntDesign';
import PlusIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from '../Navigations/AuthContext';
const deviceWidth = Dimensions.get("window").width;

const MasjidDetails = ({ navigation, route }) => {
  const { itemId } = route.params;
  const [masjid, setMasjid] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editableTimes, setEditableTimes] = useState({});
  const [editableAlarms, setEditableAlarms] = useState({});
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [newAlarmTime, setNewAlarmTime] = useState(10);
  const { isAuthenticated } = useAuthContext();
  const [isPlaySound, setIsPlaySound] = useState(false);
  const [alarmSounds, setAlarmSounds] = useState({});
  const { themeMode } = useAuthContext();

   console.log(newAlarmTime);
  // console.log(editableAlarms);
  useEffect(() => {
    const loadMasjidData = async () => {
      const selectedMasjid = mosques.data.find(item => item.id === itemId);
      if (selectedMasjid) {
        setMasjid(selectedMasjid.mosque);
        const initialEditMode = {};
        const initialEditableTimes = {};
        const initialEditableAlarms = {};

        if (selectedMasjid.timings) {
          Object.keys(selectedMasjid.timings).forEach((prayerName, index) => {
            initialEditMode[prayerName] = false;
            initialEditableTimes[prayerName] = convertTo12Hour(selectedMasjid.timings[prayerName]);
            initialEditableAlarms[prayerName] = alarmtime[index];
            initialEditableAlarms[prayerName] = false; // Initialize alarm sound state
          });
        }

        setEditMode(initialEditMode);
        setEditableTimes(initialEditableTimes);
        setEditableAlarms(initialEditableAlarms);
        setAlarmSounds(initialEditableAlarms); // Initialize alarmSounds state
      }

      checkSubscriptionStatus();
      checkHomeStatus();
      checkPlaySoundStatus();
    };

    loadMasjidData();
  }, [itemId]);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedAlarms = await AsyncStorage.getItem("Alarms");
        if (storedAlarms) {
          setEditableAlarms(JSON.parse(storedAlarms));
          const alarms = JSON.parse(storedAlarms);
          if (alarms[itemId]) {
            setAlarmSounds({ ...alarmSounds, [itemId]: alarms[itemId] });
          }
        }
        const storedPlaySound = await AsyncStorage.getItem("PlaySound");
        if (storedPlaySound) {
          const { isPlaySound, alarmSounds } = JSON.parse(storedPlaySound);
          setIsPlaySound(isPlaySound || false); // Default to false if undefined
          // setAlarmSounds(alarmSounds || {}); // Default to empty object if undefined
        }
      } catch (error) {
        console.error("Error loading persisted data:", error);
      }
    };

    loadPersistedData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // If the user is not authenticated, clear the home mosque and subscriptions
      setIsHome(false);
      setIsSubscribe(false);
      handleClearHomeMosque();
      handleClearSubscriptions();
    }
  }, [isAuthenticated]);

  const handleClearHomeMosque = async () => {
    try {
      await AsyncStorage.removeItem("HomeMasjid");
      setIsHome(false);
    } catch (e) {
      console.error("Error clearing home mosque:", e);
    }
  };

  const handleClearSubscriptions = async () => {
    try {
      await AsyncStorage.removeItem("Subscribe");
      setIsSubscribe(false);
    } catch (e) {
      console.error("Error clearing subscriptions:", e);
    }
  };

  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(':');
    let hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    const period = hourNum >= 12 ? 'PM' : 'AM';

    if (hourNum > 12) {
      hourNum -= 12;
    } else if (hourNum === 0) {
      hourNum = 12;
    }

    return `${hourNum}:${minuteNum < 10 ? '0' : ''}${minuteNum} ${period}`;
  };


  const convertTo24Hour = (time) => {
    const [timePart, period] = time.split(' ');
    let [hour, minute] = timePart.split(':').map(Number);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
  };
  const alarmtime = ["4:55 AM", "1:20 PM", "4:50 PM", "6:50 PM", "7:50 PM", "1:30 PM"];

  const handleAlarmChange = (prayerName, newAlarm) => {
    setEditableAlarms(prevState => ({
      ...prevState,
      [prayerName]: newAlarm
    }));
    saveAlarmToStorage(prayerName, newAlarm);
  };

  const handleShare = (mosqueTitle) => {
    Share.share({
      message: mosqueTitle,
    })
      .then((result) => console.log(result))
      .catch((errorMsg) => console.error(errorMsg));
  };

  const handleSubscription = async () => {
    if (isAuthenticated) {
      try {
        let Subscribe = JSON.parse(await AsyncStorage.getItem("Subscribe")) || [];
        const isAlreadySubscribed = Subscribe.some(sub => sub.id === itemId);
        if (!isAlreadySubscribed) {
          Subscribe.push({ id: itemId, image: masjid.image, title: masjid.title, address: masjid.location.address });
          setIsSubscribe(true);
        } else {
          Subscribe = Subscribe.filter(sub => sub.id !== itemId);
          setIsSubscribe(false);
        }

        await AsyncStorage.setItem("Subscribe", JSON.stringify(Subscribe));
      } catch (e) {
        console.error("Error updating subscription:", e);
      }
    } else {
      // Show an alert to the user to log in first
      Alert.alert(
        "Authentication Required",
        "Please log in to subscribe this mosque.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Log In",
            onPress: () => navigation.navigate('Login')
          }
        ],
        { cancelable: false }
      );
    }
  };

  const handleSetHome = async () => {
    if (isAuthenticated) {
      try {
        let homeMasjid = JSON.parse(await AsyncStorage.getItem("HomeMasjid"));
        if (!homeMasjid || homeMasjid.id !== itemId) {
          homeMasjid = {
            id: itemId,
            image: masjid.image,
            title: masjid.title,
            address: masjid.location.address,
            prayerTimes: editableTimes
          };
          setIsHome(true);
        } else {
          homeMasjid = null;
          setIsHome(false);
        }

        await AsyncStorage.setItem("HomeMasjid", JSON.stringify(homeMasjid));
      } catch (e) {
        console.error("Error setting home masjid:", e);
      }
    } else {
      // Show an alert to the user to log in first
      Alert.alert(
        "Authentication Required",
        "Please log in to set this mosque as your home mosque.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Log In",
            onPress: () => navigation.navigate('Login')
          }
        ],
        { cancelable: false }
      );
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      let Subscribe = JSON.parse(await AsyncStorage.getItem("Subscribe")) || [];
      const isSubscribed = Subscribe.some(sub => sub.id === itemId);
      setIsSubscribe(isSubscribed);
    } catch (e) {
      console.error("Error checking subscription status:", e);
    }
  };

  const checkHomeStatus = async () => {
    try {
      let homeMasjid = JSON.parse(await AsyncStorage.getItem("HomeMasjid"));
      setIsHome(homeMasjid && homeMasjid.id === itemId);
    } catch (e) {
      console.error("Error checking home status:", e);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('Feed', { itemId: item.id });
  };

  const handleMaps = () => {
    if (masjid.location.latitude && masjid.location.longitude) {
      const url = `http://maps.google.com/maps?q=${masjid.location.latitude},${masjid.location.longitude}`;
      Linking.openURL(url);
    } else {
      console.error("Error: Invalid mosque location data");
    }
  };

  const openModal = (prayerName) => {
    if (isAuthenticated) {
      setSelectedPrayer(prayerName);
      // setNewAlarmTime(10);
      // if (selectedPrayer) {
      //   setNewAlarmTime(prev => ({ ...prev, [selectedPrayer]:10 }));
      // }
      setModalVisible(true);
    } else {
      // Show an alert to the user to log in first
      Alert.alert(
        "Authentication Required",
        "Please log in to set this mosque as your home mosque.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Log In",
            onPress: () => navigation.navigate('Login')
          }
        ],
        { cancelable: false }
      );
    }
  };


  const closeModal = () => {
    setModalVisible(false);
    setSelectedPrayer(null);
  };

  const handleModalSave = () => {
    // if (selectedPrayer) {
    //   setNewAlarmTime(prev => ({ ...prev, [selectedPrayer]: tempAlarmTime }));
    // }
    setModalVisible(false);
    setSelectedPrayer(null);
  }

  const handleCancelAlarm = () => {
    // setTempAlarmTime(10); // Reset the temporary alarm time
    setModalVisible(false);
  };

  const saveAlarmToStorage = async (prayerName, newAlarm) => {
    try {
      const storedAlarms = await AsyncStorage.getItem("Alarms");
      let alarms = storedAlarms ? JSON.parse(storedAlarms) : {};
      alarms[prayerName] = newAlarm;
      await AsyncStorage.setItem("Alarms", JSON.stringify(alarms));
    } catch (error) {
      console.error("Error saving alarm to storage:", error);
    }
  };

  const handleAlarmAdjustment = (adjustment) => {
    setAndPersistNewAlarmTime(prev => {
      const newTime = Math.max(Math.min(prev + adjustment, 60), 0);
      const currentPrayerTime = convertTo24Hour(editableTimes[selectedPrayer]);
      const [currentHour, currentMinute] = currentPrayerTime.split(':').map(Number);
      const alarmHour = currentHour;
      const alarmMinute = currentMinute - newTime;

      let adjustedAlarmHour = alarmHour;
      let adjustedAlarmMinute = alarmMinute;
      if (adjustedAlarmMinute < 0) {
        adjustedAlarmHour -= 1;
        adjustedAlarmMinute += 60;
      }

      if (adjustedAlarmHour < 0) {
        adjustedAlarmHour += 24;
      }

      const newAlarm = `${adjustedAlarmHour}:${adjustedAlarmMinute < 10 ? '0' : ''}${adjustedAlarmMinute}`;
      handleAlarmChange(selectedPrayer, convertTo12Hour(newAlarm));
      AsyncStorage.setItem("NewAlarmTime", newTime.toString());
      return newTime;
    });
  };
  const handlePlaySoundToggle = async (prayerName, value) => {
    setIsPlaySound(value); // Update local state immediately
  
    try {
      // Update alarmSounds state for the current mosque only
      setAlarmSounds(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], [prayerName]: value }
      }));
  
      // Save current mosque's alarm sound to AsyncStorage
      const storedAlarms = await AsyncStorage.getItem("Alarms");
      let alarms = storedAlarms ? JSON.parse(storedAlarms) : {};
      alarms[itemId] = { ...alarms[itemId], [prayerName]: value };
      await AsyncStorage.setItem("Alarms", JSON.stringify(alarms));
    } catch (error) {
      console.error("Error saving play sound setting:", error);
    }
  };

  const checkPlaySoundStatus = async () => {
    try {
      const storedAlarms = await AsyncStorage.getItem("Alarms");
      if (storedAlarms) {
        const alarms = JSON.parse(storedAlarms);
        if (alarms[itemId]) {
          setAlarmSounds(alarms[itemId]);
        }
      }
    } catch (e) {
      console.error("Error checking play sound status:", e);
    }
  };



  const setAndPersistNewAlarmTime = async (time) => {
    try {
      setNewAlarmTime(time);
      await AsyncStorage.setItem("NewAlarmTime", time.toString());
    } catch (error) {
      console.error("Error saving new alarm time:", error);
    }
  };
  // const checkPlaySoundStatus = async () => {
  //   try {
  //     const storedPlaySound = await AsyncStorage.getItem("PlaySound");
  //     if (storedPlaySound !== null) {
  //       setIsPlaySound(JSON.parse(storedPlaySound));
  //     }
  //   } catch (e) {
  //     console.error("Error checking play sound status:", e);
  //   }
  // };

  const renderPrayerTimings = () => {
    if (!masjid || !editableTimes) return null;
    return Object.keys(editableTimes).map(prayerName => (
      <View key={prayerName} >
        <View style={[styles.prayerContainer,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
          <View style={styles.prayerInfo}>
            <Text style={[styles.prayerName,themeMode === "dark" && {color:'#ffff' }]}>{prayerName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.alarmText,themeMode === "dark" && { color:'#ffff' }]}>Alarm</Text>
              <Switch
                trackColor={{ false: '#B2B2B2', true: '#5BB5AB' }}
                // thumbColor={isEnabled ? '#0a9484' : '#f4f3f4'}
                value={alarmSounds[itemId] && alarmSounds[itemId][prayerName]}
                onValueChange={value => handlePlaySoundToggle(prayerName, value)}
              />


            </View>
          </View>
          <View style={styles.editContainer}>
            <Text style={[styles.prayerTime,themeMode === "dark" && { color:'#ffff' }]}>{editableTimes[prayerName]}</Text>
            <Pressable onPress={() => openModal(prayerName)} >
              <View style={styles.editalarm}>
                <Text style={{ fontSize: 18, fontWeight: '600', right: 10 }}>{editableAlarms[prayerName]}</Text>
                <EditIcon name='edit-3' size={20} left={15} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBack title={'Masjid Details'} navigation={navigation} />
      <ScrollView style={styles.container}>
        {masjid ? (
          <View style={[{ flex: 1 },themeMode === "dark" && { backgroundColor: "#363B33" }]}>
            <View style={[styles.content,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
              <Text style={[styles.title,themeMode === "dark" && { color:'#ffff'}]}>{masjid.title}</Text>
              {masjid.location && (
                <View style={{ flexDirection: 'row' }}>
                  <LocIcon name='location' size={25} style={[themeMode === "dark" && { color:'#fff' }]}/>
                  <Text style={[styles.address,themeMode === "dark" && { color:'#fff' }]}>{masjid.location.address}</Text>
                </View>
              )}
              <Image source={{ uri: masjid.image }} style={styles.image} />
              <View style={styles.btncontainer}>
                <Pressable
                  onPress={handleSetHome}
                  style={[
                    styles.btnstyle,
                    isHome ? styles.homeButtonActive : styles.homeButtonInactive,
                  ]}
                >
                  <Text style={[styles.textstyle, isHome ? styles.activetext : styles.inActiveText]}>{isHome ? 'Unset Home' : 'Set Home'}</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubscription}
                  style={[
                    styles.btnstyle,
                    isSubscribe ? styles.subscribedButton :
                      styles.unsubscribedButton,
                  ]}
                >
                  <Text style={[styles.textstyle, isSubscribe ? styles.activetext : styles.inActiveText]}>{isSubscribe ? 'Unsubscribe' : 'Subscribe'}</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 15 }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                  <Pressable onPress={handleItemPress} style={styles.otherFeed}>
                    <FeedIcon name='square-rss' size={20} />
                    <Text>Feed</Text>
                  </Pressable>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                  <Pressable onPress={() => handleShare(masjid.title + masjid.location.address)} style={styles.otherFeed}>
                    <ShareIcon name='share' size={20} />
                    <Text>Share</Text>
                  </Pressable>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                  <Pressable onPress={handleMaps} style={styles.otherFeed}>
                    <DirecIcon name='location-arrow' size={20} />
                    <Text>Direction</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={{ marginHorizontal: 15, marginVertical: 20, justifyContent: 'center' }}>
              <Text style={[{ fontSize: 20, fontWeight: '500' },themeMode === "dark" && {color:'#ffff' }]}>Jamaat Time</Text>
            </View>
            {renderPrayerTimings()}
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
        <View style={styles.centeredView}>
          <Modal
            deviceWidth={deviceWidth}
            // onRequestClose={() => {setModalVisible(false)}}        
            backdropColor='red'
            closeOnClick={true}
            backdropOpacity={0.7}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Set Alarm</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>{selectedPrayer} Jamaat</Text>
                    <Text style={{ fontSize: 20, fontWeight: '700' }}> {editableTimes[selectedPrayer]}</Text>
                  </View>
                  <View style={{
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>New Alarm </Text>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#5CEE72' }}>{editableAlarms[selectedPrayer]}</Text>
                  </View>
                </View>
                <Text style={{ textAlign: 'center' }}>Before Jamaat</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 15 }}>
                  <Pressable onPress={() => handleAlarmAdjustment(-1)}>
                    <MinusIcon name='minus' size={35} />
                  </Pressable>
                  <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 100, backgroundColor: 'lightgray' }}>
                    <Text style={{ fontSize: 22, fontWeight: '700' }}>{newAlarmTime}</Text>
                  </View>
                  <Pressable onPress={() => handleAlarmAdjustment(1)}>
                    <PlusIcon name='plus' size={35} />
                  </Pressable>
                </View>
                <View style={styles.modalButtons}>
                  <Pressable onPress={handleCancelAlarm} style={styles.modalButtonCancel}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={handleModalSave} style={styles.modalButtonSave}>
                    <Text style={styles.modalButtonText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

    </View>
  );
};

export default memo(MasjidDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  prayerContainer: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  prayerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  prayerTime: {
    fontWeight: '600',
    fontSize: 18,
    marginRight: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  alarmText: {
    fontSize: 18,
    marginRight: 10,
  },
  editableTime: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 100,
  },
  loadingText: {
    fontSize: 18,
    color: 'black',
    // textAlign:'center'
  },
  editalarm: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    backgroundColor: '#DDF1EF',
    borderRadius: 10,
    alignItems: 'center'
  },
  btncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a9484',
    width: 150,
    height: 35,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  textstyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center'
  },
  otherFeed: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDF1EF',
    width: 105,
    height: 55,
  },
  subscribedButton: {
    backgroundColor: '#DDF1EF',
  },
  unsubscribedButton: {
    backgroundColor: '#0a9484',
  },
  homeButtonActive: {
    backgroundColor: '#DDF1EF',
  },
  homeButtonInactive: {
    backgroundColor: '#0a9484',
  },
  activetext: {
    color: '#000'
  },
  inActiveText: {
    color: '#fff'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',

  },
  modalView: {
    height: 330,
    width: 310,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyleModel: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20

  },
  modalButtonSave: {
    height: 35,
    width: 70,
    // textAlign:'center',
    backgroundColor: '#0a9484',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff'
  },
  modalButtonCancel: {
    height: 35,
    width: 70,
    // textAlign:'center',
    backgroundColor: '#B2DDD8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  }

});