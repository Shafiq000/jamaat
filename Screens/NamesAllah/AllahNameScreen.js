// import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View, FlatList, Pressable, Dimensions, Platform } from 'react-native';
// import HeaderBack from '../../Components/HeaderBack';
// import { useAuthContext } from '../../Navigations/AuthContext';
// import NavIcon from "react-native-vector-icons/MaterialIcons";
// import PlayIcon from 'react-native-vector-icons/Entypo';
// import * as Speech from 'expo-speech';
// const windowWidth = Dimensions.get("window").width;
// const AllahNameScreen = ({ navigation, route }) => {
//     const { themeMode } = useAuthContext();
//     const [data, setData] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(route.params?.index || 0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const flatListRef = useRef(null);

//     const fetchNames = useCallback(() => {
//         setLoading(true);
//         fetch('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/religi/islam/asmaulhusna.json')
//             .then(response => response.json())
//             .then(data => {
//                 setData(data);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error("Error fetching the names:", error);
//                 setLoading(false);
//             });
//     }, []);
  
//     useEffect(() => {
//         fetchNames();
//     }, [fetchNames]);
//     const handleNavigation = (direction) => {
//         setCurrentIndex(prevIndex => {
//             const newIndex = prevIndex + direction;
//             if (newIndex < 0) return 0;
//             if (newIndex >= data.length) return data.length - 1;
//             flatListRef.current.scrollToIndex({ animated: true, index: newIndex });
//             return newIndex;
//         });
//     };

//     const handleScroll = (event) => {
//         const offsetX = event.nativeEvent.contentOffset.x;
//         const itemIndex = Math.round(offsetX / windowWidth);
//         if (itemIndex === currentIndex) {
//             return;
//         }
//         setCurrentIndex(itemIndex);
//     };

//     const handlePlayPause = async () => {
//         // const availableVoices = await Speech.getAvailableVoicesAsync();
//         // console.log("availableVoices",JSON.stringify(availableVoices,null,2));
//         if (data[currentIndex]) {
//             if (isPlaying) {
//                 Speech.stop();
//                 setIsPlaying(false);
//             } else {
//                 const SpeechOptions  = {
//                     // voice: 'he-il-x-hed-local',
//                     // voice: 'it-it-x-itc-local',
//                     voice: 'ar-language',
//                     pitch:0.9,
//                     rate:0.3,
//                     language: 'ar',
//                     onStart: () => setIsPlaying(true),
//                     onDone: () => setIsPlaying(false),
//                     onStopped: () => setIsPlaying(false),
//                 };

//                 Speech.speak(data[currentIndex].arabic, SpeechOptions );
//             }
//         }
//     };
    

//     const renderItem = ({ item, index }) => {
//         return (
//             <View style={styles.mainContainer}>
//                 <View style={styles.count}>
//                     <Text style={[styles.indexText, themeMode == "dark" && { color: "#fff" }]}>{`${index + 1}/${data.length}`}</Text>
//                 </View>
//                 <View style={[styles.hadithContainer, themeMode == "dark" && { backgroundColor: "#26272C" }]}>
//                     <Text style={[styles.latinText, themeMode == "dark" && { color: "#fff" }]}>{item.latin}</Text>
//                     <Text style={[styles.arabicTextCenter, themeMode == "dark" && { color: "#0a9484" }]}>{item.arabic}</Text>
//                     <Text style={[styles.arabicText, themeMode == "dark" && { color: "#fff" }]}>{item.arabic}</Text>
//                     <Text style={[styles.englishText, themeMode == "dark" && { color: "#fff" }]}>{item.translation_en}</Text>
//                 </View>
//                 <View style={styles.playIconContainer}>
//                     <Pressable onPress={handlePlayPause} style={styles.icon}>
//                         <PlayIcon name={isPlaying ? "controller-paus" : "controller-play"} size={45} color="#0a9484" />
//                     </Pressable>
//                 </View>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <View style={[styles.contentContainer, { backgroundColor: themeMode == "dark" ? "#26272C" : "#FFFFFF" }]}>
//                 <ActivityIndicator size="large" color="#ffffff" />
//             </View>
//         );
//     }

//     return (
//         <View style={{ flex: 1 }}>
//             <HeaderBack title={'99 Names of Allah'} navigation={navigation} />
//             <View style={[styles.contentContainer, { backgroundColor: themeMode == "dark" ? "#26272C" : "#FFFFFF" }]}>
//                 <FlatList
//                     ref={flatListRef}
//                     pagingEnabled
//                     horizontal
//                     scrollEnabled={true}
//                     showsHorizontalScrollIndicator={false}
//                     getItemLayout={(data, index) => ({
//                         length: windowWidth,
//                         offset: windowWidth * index,
//                         index,
//                     })}
//                     initialScrollIndex={currentIndex}
//                     data={data}
//                     renderItem={renderItem}
//                     keyExtractor={(item, index) => index.toString()}
//                     onScroll={handleScroll}
//                     contentContainerStyle={styles.flatListContent}
//                 />
//             </View>
//             <View style={styles.iconContainer}>
//                 <Pressable onPress={() => handleNavigation(-1)} style={styles.navIcon}>
//                     <NavIcon name="navigate-before" size={40} style={[{ right: 10 },themeMode == "dark" && { color: "#fff" }]} />
//                 </Pressable>
//                 <Pressable onPress={() => handleNavigation(1)} style={styles.navIcon}>
//                     <NavIcon name="navigate-next" size={40} style={[{ left: 10 },themeMode == "dark" && { color: "#fff" }]} />
//                 </Pressable>
//             </View>
//         </View>
//     );
// };

// export default memo(AllahNameScreen);

// const styles = StyleSheet.create({
//     mainContainer: {
//         width: windowWidth,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//     },
//     contentContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     flatListContent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     hadithContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     arabicText: {
//         textAlign: 'center',
//         fontSize: 35,
//         fontWeight: '700',
//         top: 25
//     },
//     arabicTextCenter: {
//         textAlign: 'center',
//         fontSize: 60,
//         fontWeight: '700',
//         color: '#0a9484',
//         bottom: 10
//     },
//     englishText: {
//         textAlign: 'center',
//         fontSize: 20,
//         top: 30
//     },
//     latinText: {
//         textAlign: 'center',
//         fontSize: 30,
//         fontWeight: '700',
//         bottom: 80
//     },
//     indexText: {
//         textAlign: 'center',
//         fontSize: 14,
//         bottom: 100
//     },
//     iconContainer: {
//         flexDirection: "row",
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         width: '100%',
//         paddingHorizontal: 20,
//     },
//     navIcon: {
//         padding: 10,
//         borderRadius: 20,
//     },
//     playIconContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         top: 80
//     }
// });
