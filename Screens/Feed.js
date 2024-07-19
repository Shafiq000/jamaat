import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderBack from '../Components/HeaderBack'
import { useAuthContext } from '../Navigations/AuthContext'
const Feed = ({navigation}) => {
  const { themeMode } = useAuthContext();

  return (
    <View style={[{flex:1},themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
      <HeaderBack title={'Feed'} navigation={navigation} />
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <Text style={[{fontSize:15,fontWeight:'600'},themeMode === "dark" && { color:'#ffff' }]}>No Update in Feed</Text>
     </View>
    </View>
  )
}

export default Feed

const styles = StyleSheet.create({})