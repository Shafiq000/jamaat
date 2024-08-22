import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const FeatureComponent = () => {
    const navigation = useNavigation();
    const { themeMode } = useAuthContext();
    const { t } = useTranslation();

    // const handletoTest = () =>{
    //     navigation.navigate('Test')
    // }

    return (
        <View style={[styles.mainContainer, themeMode == "dark" && { backgroundColor: "#282828" }]}>
            <Text style={[{fontSize:20,fontWeight:'600',alignSelf:'flex-start',margin:10,left:10}, themeMode == "dark" && { color: "#fff" }]}>{t('feature')}</Text>
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
                <Text numberOfLines={2} style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('prayer_time')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('qibla')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('allah_name')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('tasbih')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('islamic_calendar')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('dua')}</Text>
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
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('hadith')}</Text>
               </View>
               <View style={{flexDirection:'column'}}>
               <View style={styles.imageBox}>
                    <Pressable onPress={() => navigation.navigate('QuestionTitles')}>
                        <Image
                            source={require('../src/Images/QandA.png')}
                            style={styles.image}
                        />
                    </Pressable>
                 
                </View>
                <Text style={[styles.subText,themeMode == "dark" && { color: "#fff" }]}>{t('q_a')}</Text>
               </View>
              
            </View>
            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Pressable style={styles.nextbutton} onPress={handletoTest}>
                    <Text style={{color:'#fff'}}>Test </Text>
                </Pressable>
            </View> */}
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
        fontWeight:'700'
    },
    nextbutton: {
        height: 50,
        width: 190,
        backgroundColor: '#0a9484',
        borderRadius: 5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
});
