import React, { memo} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuthContext } from "../Navigations/AuthContext";
import MainHeader from "../Components/MainHeader";
import TopTabNavigation from "../Navigations/TopTabNavigation";
import Allmosques from '../Components/Allmosques';
import DailyVerseOnHomeScreen from "./DailyVerse/DailyVerseOnHomeScreen";
import DailyDuaOnHome from "./DailyDua/DailyDuaOnHome";
import FeatureComponenet from "../Components/FeatureComponenet";
import DailyHadithOnHome from "./DailyHadith/DailyHadithOnHome";
import Compass from "../Components/Compass";
import AllahNames from "./NamesAllah/AllahNames";
import { useTranslation } from "react-i18next";

const Home = ({ navigation,route }) => {
  const { themeMode } = useAuthContext();
const item = route.params
const { t } = useTranslation();

  const handlemove = () =>{
    navigation.navigate('NearbyMasjid')
   }
  
  return (
    <View style={[{ backgroundColor: '#FFFFFF', flex: 1 }]}>
      <MainHeader title={'Jamaat Hadith'} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container,themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
        <TopTabNavigation />
      </View>
      <FeatureComponenet />
      <View style={[{flexDirection:'column',alignItems:'center'},themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
       <View style={{gap:10,marginVertical:20}}>
       <DailyVerseOnHomeScreen />
       <DailyHadithOnHome />
       <DailyDuaOnHome/>
       <AllahNames/>
       <Compass/>
       </View>
        </View>
      <View style={[{ borderTopColor: '#cbcbcb', borderTopWidth: 1 },themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15 }}>
          <Text style={[{ fontSize: 20, fontWeight: '600' },themeMode === "dark" && { color:'#ffff' }]}>{t('masjid_nearby')}</Text>
          <Pressable style = {styles.seeStyle} onPress={handlemove}>
            <Text style={[{ fontSize: 15, fontWeight: '500',color:'#fff'},themeMode === "dark" && { color:'#ffff' }]}>{t('see_all')}</Text>
          </Pressable>
        </View>
        <Allmosques navigation={navigation} item = {item}/>
      </View>
      </ScrollView>
    </View>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  allMosquesContainer: {
    paddingHorizontal: 12,
    backgroundColor:'red'
  },
  container: {
    flex: .5,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  itemContainer:{
    flex:1
  },
  seeStyle:{
    height:33,
    width:80,
    backgroundColor:'#0a9484',
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  }
});
