import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../Navigations/AuthContext';
const FeatureComponent = () => {
    const navigation = useNavigation();
    const { themeMode } = useAuthContext();

    return (
        <View style={[styles.mainContainer, themeMode == "dark" && { backgroundColor: "#282828" }]}>
            <Text style={[{fontSize:20,fontWeight:'600',alignSelf:'flex-start',margin:10,left:10}, themeMode == "dark" && { color: "#fff" }]}>Features</Text>
            <View style={styles.rowContainer}>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('MainScreen')}>
                        <Image
                            source={require('../src/Images/pray.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Prayer{'\n'}Time</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('QiblaHome')}>
                        <Image
                            source={require('../src/Images/qiblaa.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Qibla</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('HomeAsmaUlHusna')}>
                        <Image
                            source={require('../src/Images/allahname.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Names of{'\n'}Allah</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('TasbihMainScreen')}>
                        <Image
                            source={require('../src/Images/tasbihh.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Tasbih</Text>
               </View>
            </View>
            <View style={styles.rowContainer}>
            <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('CalendarMainScreen')}>
                        <Image
                            source={require('../src/Images/calendarr.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Islamic{'\n'}Calendar</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('DuaMainScreen')}>
                        <Image
                            source={require('../src/Images/dua-hands.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Dua</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('HadithBottomNavigation')}>
                        <Image
                            source={require('../src/Images/alhadiths.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Hadith</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable>
                        <Image
                            source={require('../src/Images/QandA.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>Q&A</Text>
               </View>
            </View>
        </View>
    );
};

export default FeatureComponent;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // margin:10,
        borderBottomWidth:1,
        borderBottomColor:'#cbcbcb',
        borderTopColor: '#cbcbcb',
        borderTopWidth: 1,
        paddingVertical:10,
        // marginBottom:20
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
       gap:15
    },
    imageBox: {
        height: 60,
        width: 60,
        borderRadius: 10,
        backgroundColor: '#0a9484',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 50,
        width: 50,
        resizeMode: 'cover',
        tintColor: '#fff',
    },
    subText:{
        textAlign:'center',
        fontSize:13,
        fontWeight:'700'}
});
