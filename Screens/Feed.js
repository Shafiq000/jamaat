import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderBack from '../Components/HeaderBack'
import { useAuthContext } from '../Navigations/AuthContext'
import { useTranslation } from "react-i18next";

const Feed = ({navigation}) => {
  const { themeMode } = useAuthContext();
  const { t } = useTranslation();

  return (
    <View style={[{flex:1},themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      <HeaderBack title={t('feed')} navigation={navigation} />
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <Text style={[{fontSize:15,fontWeight:'600'},themeMode === "dark" && { color:'#ffff' }]}>{t('feed_update')}</Text>
     </View>
    </View>
  )
}

export default Feed

const styles = StyleSheet.create({})