import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  Animated,
  Modal,
  TextInput,
  Vibration,
} from "react-native";
import { Svg, Circle } from "react-native-svg";
import BottomSheets from "./BottomSheets";
import Sound from "react-native-sound";
import Cross from "react-native-vector-icons/Entypo";
import GestureRecognizer from "react-native-swipe-gestures";
import { useAuthContext } from "../../Navigations/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderBack from "../../Components/HeaderBack";
const TasbihMainScreen = ({ navigation }) => {
  const { themeMode, setThemeMode } = useAuthContext();
  const [info, setInfo] = useState(false);
  const [count, setCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedNumber, setEditedNumber] = useState(100);
  const animatedFill = useRef(new Animated.Value(0)).current;
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [mode, setMode] = useState("sound");
  const [selectedArabic, setSelectedArabic] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [showSelectedData, setshowSelectedData] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    loadAsyncData();
  }, []);

  useEffect(() => {
    saveAsyncData();
  }, [count, editedNumber, info, bottomSheetVisible]);

  const loadAsyncData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("tasbihStore");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCount(parsedData.count || 0);
        setEditedNumber(parsedData.editedNumber || "");
        setInfo(parsedData.info || false);
        setBottomSheetVisible(parsedData.bottomSheetVisible || false);
        setshowSelectedData(parsedData.showSelectedData || false);
        setSelectedArabic(parsedData.selectedArabic || false);
        setSelectedTranslation(parsedData.selectedTranslation || false);
        setMode(parsedData.mode || false);
      }
    } catch (error) {
      console.error("Error loading data from AsyncStorage:", error);
    }
  };
  const saveAsyncData = async () => {
    try {
      const dataToSave = {
        count,
        editedNumber,
        info,
        bottomSheetVisible,
        showSelectedData,
        selectedArabic,
        selectedTranslation,
        mode,
      };

      await AsyncStorage.setItem("tasbihStore", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  useEffect(() => {
    const loadSound = async () => {
      const soundObject = new Sound(
        "tiktik.mp3",
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            console.log("failed to load the sound", error);
            return;
          }
          setSound(soundObject);
        }
      );
    };
    loadSound();
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);
  const playSound = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          // console.log("Sound played successfully");
        } else {
          console.log("failed to play the sound");
        }
      });
    } else {
      console.log("Sound is not loaded yet");
    }
  };
  // const playSound = () => {
  //   var sound = new Sound("audio.mp3", Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log("failed to load the sound", error);
  //       return;
  //     }
  //     sound.play((success) => {
  //       if (success) {
  //       }
  //     });
  //   });
  // };
  const toggleMode = () => {
    if (mode === "sound") {
      setMode("silent");
    } else if (mode === "silent") {
      setMode("vibrate");
      Vibration.vibrate();
    } else if (mode === "vibrate") {
      setMode("sound");
      playSound();
    }
  };
  const cancelSelection = () => {
    setshowSelectedData(false);
    setSelectedArabic("");
    setSelectedTranslation("");
  };

  const handleCounter = () => {
    if (count < parseInt(editedNumber, 10)) {
      setCount(count + 1);
      if (mode === "sound") {
        playSound();
      } else if (mode === "vibrate") {
        Vibration.vibrate();
      }
    }
  };
  useEffect(() => {
    const validEditedNumber = parseInt(editedNumber, 10) || 1;
    Animated.timing(animatedFill, {
      toValue: (count / validEditedNumber) * 100,
      useNativeDriver: false,
    }).start();
  }, [count, editedNumber]);

  const infoDetail = () => {
    setInfo(!info);
  };
  const saveEditedNumber = () => {
    setCount(parseInt(count, 10) || 0);
    setCount(0);
    setModalVisible(false);
  };
  const handleReset = () => {
    setCount(0);
  };

  const circleRadius = 110;
  const strokeWidth = 10;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const animatedStrokeDashoffset = animatedFill.interpolate({
    inputRange: [0, 100],
    outputRange: [circleCircumference, 0],
  });

  const outerCircleColor = "#B9E5D8";
  const innerCircleColor = "#0a9484";

  const openEditModal = () => {
    setModalVisible(true);
    // setEditedNumber(String);
  };

  const onSelectItem = (item) => {
    setSelectedArabic(item.Arabic);
    setSelectedTranslation(item.Translation);
    setshowSelectedData(true);
    setBottomSheetVisible(false);
  };
  useEffect(() => {
    // onSwipeDown();
    onSwipeLeft();
  }, []);
  const onSwipeLeft = () => {
    if (count > 0) {
      setCount(count - 1);
      if (mode === "sound") {
        playSound();
      } else if (mode === "vibrate") {
        Vibration.vibrate();
      }
    }
  };
  // const onSwipeDown = () => {
  //   if (count > 0) {
  //     setCount(count + 1);
  //     if (mode === "sound") {
  //       playSound();
  //     } else if (mode === "vibrate") {
  //       Vibration.vibrate();
  //     }
  //   }
  // };
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#FFFFFF" }, themeMode == "dark" && { backgroundColor: "#000" }]}>
      <HeaderBack title={'Tasbih'} navigation={navigation} />
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        // onSwipeDown={onSwipeDown}
        config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 80 }} style={{ flex: 1 }}>

        <View style={styles.itemHeader}>
          <Pressable onPress={infoDetail}>
            <Image style={[{ height: 25, width: 25 }, themeMode == "dark" && { backgroundColor: "#000", tintColor: "#fff", }]}
              source={require("../../src/Images/info.png")} />
          </Pressable>

          <Pressable onPress={openEditModal} style={{ left: 40, flexDirection: "row" }}>
            <Text style={[{ marginRight: 10, fontSize: 20, fontWeight: "500" }, themeMode == "dark" && { color: "#fff" }]}>
              {editedNumber}
            </Text>
            <Image style={[{ height: 20, width: 20, top: 3 }, themeMode == "dark" && { backgroundColor: "#000", tintColor: "#fff", }]}
              source={require("../../src/Images/edit.png")}
            />
          </Pressable>
          <Pressable onPress={handleReset} style={{ left: 40 }}>
            <Image style={[{ height: 25, width: 25 }, themeMode == "dark" && { backgroundColor: "#000", tintColor: "#fff" }]}
              source={require("../../src/Images/refresh-arrow.png")}
            />
          </Pressable>

          <Pressable onPress={toggleMode}>
            <Image
              style={{ height: 30, width: 30, tintColor: "#0a9484" }}
              source={
                mode === "sound"
                  ? require("../../src/Images/volume.png")
                  : mode === "vibrate"
                    ? require("../../src/Images/vibrate.png")
                    : require("../../src/Images/silent.png")
              }
            />
          </Pressable>
        </View>
        {showSelectedData && (
          <View style={[styles.selectedData, themeMode == "dark" && { backgroundColor: "#282828", borderColor: "#fff", color: "#fff", }]}>
            <Pressable style={styles.cancel} onPress={cancelSelection}>
              <Cross
                name="cross"
                size={20}
                style={[themeMode == "dark" && { color: "#fff" }]}
              />
            </Pressable>
            <Text style={[styles.selectedItemText, themeMode == "dark" && { color: "#fff" },]}>
              {selectedArabic}
            </Text>
            <Text style={[styles.selectedItemText, themeMode == "dark" && { color: "#fff" },]}>
              {selectedTranslation}
            </Text>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, themeMode == "dark" && { backgroundColor: "#282828" }]}>
              <Text style={[styles.modalText, themeMode == "dark" && { color: "#fff" }]}>Set Counter</Text>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <TextInput
                  style={[styles.input, themeMode == "dark" && { color: "#fff", borderColor: "#fff" }]}
                  maxLength={6}
                  selectionColor="#000"
                  onChangeText={(text) => setEditedNumber(text)}
                  // value={editedNumber}
                  placeholder="Enter target Beads"
                  keyboardType="numeric"
                  placeholderTextColor={themeMode === "dark" ? "#686868" : "#cbcbcb"}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderTopColor: "#cbcbcb",
                    borderTopWidth: 1,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Pressable style={{ paddingVertical: 10, flex: 1, alignItems: "center", }} onPress={() => setModalVisible(false)}>
                    <Text style={[{ fontSize: 15, fontWeight: "600" }, themeMode == "dark" && { color: "#fff" }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      paddingVertical: 10,
                      flex: 1,
                      alignItems: "center",
                      borderLeftColor: "#eee",
                      borderLeftWidth: 1,
                    }}
                    onPress={saveEditedNumber}
                  >
                    <Text style={[{ fontSize: 15, fontWeight: "600" }, themeMode == "dark" && { color: "#fff" }]}>Set</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {info && (
          <View style={styles.infoBox}>
            <Text>
              Here are some tips to use Jamaat Tasbih app.{"\n"}1. Tap anywhere
              on the screen to go forward.{"\n"}2. Swipe right to left to move
              backward if you accidentally tap.
            </Text>
          </View>
        )}
        <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center", top: 50 }}>
          <Pressable
            onPress={handleCounter}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              //   alignItems: "center",
              //   justifyContent: "center",
              //   backgroundColor:'red'
            }}
          >
            <Svg style={{ top: 100, left: 50 }}>
              {/* Circle */}
              <Circle
                cx="130"
                cy="120"
                r="110"
                fill="transparent"
                stroke={outerCircleColor}
                strokeWidth={strokeWidth}
              />
              {/* Animated Circle */}
              <AnimatedCircle
                cx="130"
                cy="120"
                r="110"
                fill="transparent"
                stroke={innerCircleColor}
                strokeWidth={strokeWidth}
                strokeDasharray={[circleCircumference, circleCircumference]}
                strokeDashoffset={animatedStrokeDashoffset}
              />
              <Text style={[styles.counterNumber, themeMode == "dark" && { backgroundColor: "#000" },]}>
                {count}
              </Text>
            </Svg>
          </Pressable>
        </View>
        <Text style={{ alignSelf: "center", bottom: 90, color: "#E8E8E8" }}>
          Tap anywhere to Begin
        </Text>
        <Pressable
          style={[styles.bottomSheetBtn, themeMode == "dark" && { backgroundColor: "#282828", borderBottomColor: "#EAEAEA", borderBottomWidth: 1 }]}
          onPress={() => setBottomSheetVisible(true)}
        >
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#0a9484" }}>
            View all Dikhar
          </Text>
        </Pressable>
        {bottomSheetVisible && (
          <BottomSheets
            onClose={() => setBottomSheetVisible(false)}
            onSelectItem={onSelectItem}
            selectedArabic={selectedArabic}
            selectedTranslation={selectedTranslation}
            bottomSheetVisible={bottomSheetVisible}
          />
        )}
      </GestureRecognizer>
    </SafeAreaView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fcba03",
    alignItems: "center",
    height: 55,
  },
  toptext: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,

  },
  itemHeader: {
    flex: 0.1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 10,

  },
  infoBox: {
    alignItems: "center",
    height: 75,
    width: 320,
    backgroundColor: "#eee",
    top: 70,
    marginHorizontal: 10,
    borderRadius: 5,
    position: "absolute",
  },
  counterNumber: {
    fontSize: 55,
    fontWeight: "500",
    color: "#0a9484",
    position: "absolute",
    transform: [{ translateX: -50 }, { translateY: 85 }],
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    position: "absolute",
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    minWidth: "50%",
    maxWidth: 330,
    minHeight: "28%",
    maxHeight: 200,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    fontSize: 17
  },
  bottomSheetBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    height: 50,
    borderRadius: 20,
    borderTopColor: "#E8E8E8",
    borderTopWidth: 1,
    borderLeftColor: "#E8E8E8",
    borderLeftWidth: 1,
    borderRightColor: "#E8E8E8",
    borderRightWidth: 1,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
    top: 61,
  },
  selectedData: {
    backgroundColor: "#eee",
    borderWidth: 1,
    height: 76,
    position: "absolute",
    width: "90%",
    justifyContent: "space-evenly",
    borderRadius: 8,
    borderColor: "#cbcbcb",
    alignItems: "flex-start",
    marginHorizontal: 15,
    top: 70,
  },
  selectedItemText: {
    marginHorizontal: 15,
    fontSize: 15,
    fontWeight: "400",
    bottom: 12,
  },
  cancel: {
    marginHorizontal: 8,
    alignSelf: "flex-end",
    top: 8,
  },
});

export default TasbihMainScreen;
