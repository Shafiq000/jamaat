import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator, Pressable, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/Entypo';
import * as Speech from 'expo-speech';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import duasData from '../../Jsondata/Duas.json';

const DailyDuaOnHome = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRandomDua();
  }, []);

  const fetchRandomDua = () => {
    try {
      const randomDua = duasData.data[Math.floor(Math.random() * duasData.data.length)];
      setVerse({
        duaArabic: randomDua.duaarabic,
        duaEnglish: randomDua.duaenglish,
        translation: randomDua.english,
        references: randomDua.references
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the dua:", error);
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (verse) {
      if (isPlaying) {
        Speech.stop();
        setIsPlaying(false);
      } else {

        const SpeechOptions = {
          // voice: 'sv-se-x-cmh-local',
          voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.siri_male_en-US_compact' : 'en_us_male', 
            pitch: 1.0,
            rate: 1.0,
            language: 'ar-SA',
          onStart: () => setIsPlaying(true),
          onDone: () => setIsPlaying(false),
          onStopped: () => setIsPlaying(false),
      };


        Speech.speak(verse.translation, SpeechOptions);
      }
    }
  };

  const handleShare = () => {
    if (verse) {
      const shareOptions = {
        message: `${verse.transliteration}\n${verse.translation}\n${verse.arabic}`,
        title: 'Daily Verse',
      };
      Share.open(shareOptions)
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }
  };

  const toggleShowFullTranslation = () => {
    setShowFullTranslation(!showFullTranslation);
  };

  return (
    <Pressable onPress={() => navigation.navigate('RandomDuaScreen', { verse })}>
      <ImageBackground
        source={require('../../src/Images/Dailydua.jpg')}
        style={styles.background}
        imageStyle={{ borderRadius: 6 }}
      >
        <LinearGradient
          colors={['rgba(10, 148, 132, 0.8)', 'rgba(0, 0, 0,0.8)']}
          style={styles.overlay}
        >
          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.title}>Daily Dua</Text>
                {verse && (
                  <View style={styles.verseContainer}>
                    <View style={styles.translationContainer}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text
                          style={[
                            styles.verseTranslation,
                            showFullTranslation ? styles.fullTranslation : styles.truncatedTranslation
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {verse.translation}
                        </Text>
                        <Pressable onPress={toggleShowFullTranslation}>
                          <Text style={styles.seeMore}>See More</Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.iconContainer}>
                      <Pressable onPress={handlePlayPause} style={styles.icon}>
                        <PlayIcon name={isPlaying ? "controller-paus" : "controller-play"} size={24} color="#0a9484" />
                        <Text style={styles.iconText}>{isPlaying ? "Pause" : "Play"}</Text>
                      </Pressable>
                      <Pressable onPress={handleShare} style={styles.shareIcon}>
                        <Icon name="share-social" size={24} color="#ffffff" />
                        <Text style={{ color: '#fff', marginLeft: 5 }}>Share</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

export default memo(DailyDuaOnHome);

const styles = StyleSheet.create({
  background: {
    width: 320,
    height: 150,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 6,
    overflow: "hidden",
    
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    alignSelf: 'flex-start',
    bottom: 25
  },
  verseContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  translationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    bottom: 10

  },
  verseTranslation: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'left',
    flexShrink: 1,
    bottom: 10,
  },
  truncatedTranslation: {
    maxWidth: '70%',
  },
  fullTranslation: {
    maxWidth: '100%',
  },
  seeMore: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    marginRight: 10, // Space between icons
  },
  iconText: {
    color: '#ffffff',
    marginLeft: 5,
  },
  shareIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 'auto',
    left: 40
  }
});
