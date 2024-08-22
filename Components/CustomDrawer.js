// CustomDrawer.js
import React, { useState, memo } from 'react';
import { StyleSheet, View, Linking, Text, Switch, Share, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AboutIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PrivacyIcon from 'react-native-vector-icons/MaterialIcons';
import ToggleIcon from 'react-native-vector-icons/Feather';
import SettingIcon from 'react-native-vector-icons/Ionicons';
import ShareIcon from 'react-native-vector-icons/AntDesign';
import LogoutIcon from 'react-native-vector-icons/Feather';
import RegisterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthContext } from '../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const CustomDrawer = ({ navigation, ...props }) => {
  const aboutUsURL = 'https://mslm.io/jamaat/about';
  const privacyUsURL = 'https://mslm.io/jamaat/privacy-policy';
  const { themeMode, toggleThemeMode, isAuthenticated, signOut } = useAuthContext();
  const { t } = useTranslation();
  const aboutUs = () => {
    Linking.openURL(aboutUsURL);
  };

  const privacy = () => {
    Linking.openURL(privacyUsURL);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Masjid https://play.google.com/store/apps/details?id=com.mslm.masjid',
      });
      if (result.action === Share.sharedAction) {
        // Handle share success
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={[{ flex: 1 }, themeMode === "dark" && { backgroundColor: "#26272C" }]}>
      <DrawerContentScrollView {...props}>
        <View style={{ marginTop: 10 }}>
          <DrawerItem
            icon={() => <SettingIcon name='settings-outline' size={25} color={'#0a9484'} />}
            label={t('setting')}
            labelStyle={[styles.txtcolor, themeMode === "dark" && { color: "#fff" }]}
            onPress={() => navigation.navigate('Setting')}
          />
          {isAuthenticated ? (
            <DrawerItem
              icon={() => <RegisterIcon name='clipboard-text-play-outline' size={25} color={'#0a9484'} />}
              label={t('register_masjid')}
              labelStyle={[styles.txtcolor, themeMode === 'dark' && { color: '#fff' }]}
              onPress={() => {navigation.navigate('RegisterMasjid1');}}/>
          ) : null}
          <DrawerItem
            icon={() => <AboutIcon name='message-alert-outline' size={25} color={'#0a9484'} />}
            label={t('about_us')}
            labelStyle={[styles.txtcolor, themeMode === "dark" && { color: "#fff" }]}
            onPress={aboutUs}
          />
          <DrawerItem
            icon={() => <PrivacyIcon name='privacy-tip' size={25} color={'#0a9484'} />}
            label={t('privacy_policy')}
            labelStyle={[styles.txtcolor, themeMode === 'dark' && { color: '#fff' }]}
            onPress={privacy}
          />
          <DrawerItem
            icon={() => <ShareIcon name='sharealt' size={25} color={'#0a9484'} />}
            label={t('share_app')}
            labelStyle={[styles.txtcolor, themeMode === 'dark' && { color: '#fff' }]}
            onPress={onShare}
          />
          <View style={styles.drawerItem}>
            <ToggleIcon name='eye' size={25} color={'#0a9484'} />
            <View style={styles.drawerItemLabelContainer}>
              <Text style={[styles.drawerItemLabel, themeMode === "dark" && { color: "#fff" }]}>{t('dark_mode')}</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#0C8A7C' }}
                thumbColor={themeMode === "dark" ? '#0a9484' : '#f4f3f4'}
                onValueChange={toggleThemeMode}
                value={themeMode === "dark"}
              />
            </View>
          </View>
          {isAuthenticated ? (
            <DrawerItem
              icon={() => <LogoutIcon name='log-out' size={25} color={'#0a9484'} />}
              label={t('log_out')}
              labelStyle={[styles.txtcolor, themeMode === 'dark' && { color: '#fff' }]}
              onPress={async () => {
                await signOut();
                navigation.navigate('Home');
              }}
            />
          ) : null}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default memo(CustomDrawer);

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 10,
  },
  drawerItemLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  drawerItemLabel: {
    fontSize: 13,
    color: '#000',
    marginLeft: 32,
    fontWeight: '500',
  },
  txtcolor: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
  },
});
