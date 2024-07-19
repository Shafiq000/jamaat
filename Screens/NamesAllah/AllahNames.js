import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator, Pressable, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/Entypo';
import * as Speech from 'expo-speech';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';

const data = [
    {
      id: "1",
      title: "اَلرَّحْمٰنُ",
      subtitle: "Ar-Rahman",
      description: "The Most Merciful, Ever-Merciful",
    },
    {
      id: "2",
      title: "اَلرَّحِیْمُ",
      subtitle: "Ar-Rahim",
      description: "The Most Merciful, Ever-Merciful",
    },
    {
      id: "3",
      title: "اَلْمَلِکُ",
      subtitle: "Al-Malik",
      description: "The King",
    },
    {
      id: "4",
      title: "اَلْقُدُّوْسُ",
      subtitle: "Al-Quddus",
      description: "The Holy, The Pure",
    },
    {
      id: "5",
      title: "اَلسَّلَامُ",
      subtitle: "Al-Sallam",
      description: "The Giver of Peace",
    },
    {
      id: "6",
      title: "اَلمُؤْمِنُ",
      subtitle: "Al-Mu'min",
      description: "The Guarontor, The Affirming",
    },
    {
      id: "7",
      title: "اَلْمُھَیْمِنُ",
      subtitle: "Al-Muhaymin",
      description: "The Guardian, The Controller",
    },
    {
      id: "8",
      title: "اَلْعَزِیْزُ",
      subtitle: "Al-Aziz",
      description: "The Almighty",
    },
    {
      id: "9",
      title: "اَلْجَبَّارُ",
      subtitle: "Al-Jabbar",
      description: "The Compeller",
    },
    {
      id: "10",
      title: "اَلْمُتَکَبِّرُ",
      subtitle: "Al-Mutakabiir",
      description: "The Tremendous",
    },
  
    {
      id: "11",
      title: "اَلْخَالِقُ",
      subtitle: "A-Khaliq",
      description: "The creator",
    },
    {
      id: "12",
      title: "اَلْبَارِیُ",
      subtitle: "Al-Bari'",
      description: "The Rightful, The Evalver",
    },
    {
      id: "13",
      title: "اَلْمُصَوِّرُ",
      subtitle: "Al-Mussawir",
      description: "The Fashioner of Forms",
    },
    {
      id: "14",
      title: "اَلْغَفَّارُ",
      subtitle: "Al-Ghaffar",
      description: "The Repeatedly Forgiving",
    },
    {
      id: "15",
      title: "اَلْقَہَّارُ",
      subtitle: "Al-Qahhar",
      description: "The All Compelling Subduer",
    },
    {
      id: "16",
      title: "اَلْوَھَابُ",
      subtitle: "Al-Wahaab",
      description: "The Bestower",
    },
    {
      id: "17",
      title: "اَلرَّزَّاقُ",
      subtitle: "Al-Razzaq",
      description: "The Ever Providing",
    },
    {
      id: "18",
      title: "اَلْفَّتَّاحُ",
      subtitle: "Al-Fattah",
      description: "The Opener, The Victory Giver",
    },
    {
      id: "19",
      title: "اَلْعَلِیْمُ",
      subtitle: "Al-Alim",
      description: "The Knowing ",
    },
    {
      id: "20",
      title: "اَلْقَابِضُ",
      subtitle: "Al-Qabizz",
      description: "The Withholder",
    },
    {
      id: "21",
      title: "اَلْبَاسِطُ",
      subtitle: "Al-Basit",
      description: "The Expander, Ever-Munificent",
    },
    {
      id: "22",
      title: "اَلْخَافِضُ",
      subtitle: "Al-Khafid",
      description: "The Abaser",
    },
    {
      id: "23",
      title: "اَلرَّافِعُ",
      subtitle: "Ar-Rafi",
      description: "The Exalter",
    },
    {
      id: "24",
      title: "اَلْمُعِزُّ",
      subtitle: "Al-Mu'izz",
      description: "The Giver of Honour",
    },
    {
      id: "25",
      title: "اَلْمُذِلُّ",
      subtitle: "Al-Mudhill",
      description: "The Giver of Dihonour",
    },
    {
      id: "26",
      title: "اَلسَّمِیْعُ",
      subtitle: "As-Sami",
      description: "The All-Hearing",
    },
    {
      id: "27",
      title: "اَلْبَصِیْرُ",
      subtitle: "Al-Baseer",
      description: "The All-Seeing",
    },
    {
      id: "28",
      title: "اَلْحَکَمُ",
      subtitle: "Al-Hakam",
      description: "The Judge, The Arbitrator",
    },
    {
      id: "29",
      title: "اَلْعَدَلُ",
      subtitle: "Al-Adll",
      description: "The Utterly Just",
    },
    {
      id: "30",
      title: "اَلَّطِیْفُ",
      subtitle: "Al-Latif",
      description: "The Gentle, The Subtly Kind",
    },
  
    {
      id: "31",
      title: "اَلْخَبِیْرُ",
      subtitle: "Al-Khabbir",
      description: "The All Aware",
    },
    {
      id: "32",
      title: "اَلْحَلِیْمُ",
      subtitle: "Al-Halim'",
      description: "The Forbeering, The Indelgent",
    },
    {
      id: "33",
      title: "اَلْعَظْیْمُ",
      subtitle: "Al-Azeem",
      description: "The Magnificent",
    },
    {
      id: "34",
      title: "اَلٌغَفُوٌرُ",
      subtitle: "Al-Ghaffor",
      description: "The All Forgiving",
    },
    {
      id: "35",
      title: "اَلشَّکُوْرُ",
      subtitle: "Ash-Shakur",
      description: "The Grateful",
    },
    {
      id: "36",
      title: "اَلْعَلِیُّ",
      subtitle: "Al-Aliyy",
      description: "The Most High",
    },
    {
      id: "37",
      title: "اَلْکَبِیْرُ",
      subtitle: "Al-Kabir",
      description: "The Great ",
    },
    {
      id: "38",
      title: "اَلْحَفِیْظُ",
      subtitle: "Al-Hafiz",
      description: "The Preserver",
    },
    {
      id: "39",
      title: "ٱلْمُقِيتُ",
      subtitle: "Al-Muqeet",
      description: "The Nourisher",
    },
    {
      id: "40",
      title: "ٱلْحَسِيبُ",
      subtitle: "Al-Haseeb",
      description: "The Reckoner",
    },
    {
      id: "41",
      title: "ٱلْجَلِيلُ",
      subtitle: "Al-Jaleel",
      description: "The Majestic",
    },
    {
      id: "42",
      title: "ٱلْكَرِيمُ",
      subtitle: "Al-Kareem",
      description: "The Most Generous",
    },
    {
      id: "43",
      title: "ٱلْرَّقِيبُ",
      subtitle: "Ar-Raqeeb",
      description: "The Watchful",
    },
    {
      id: "44",
      title: "ٱلْمُجِيبُ",
      subtitle: "Al-Mujeeb",
      description: "The Responsive One",
    },
    {
      id: "45",
      title: "ٱلْوَاسِعُ",
      subtitle: "Al-Waasi",
      description: "The All Encompassing",
    },
    {
      id: "46",
      title: "ٱلْحَكِيمُ",
      subtitle: "Al-Hakeem",
      description: "The All-Wise",
    },
    {
      id: "47",
      title: "ٱلْوَدُودُ",
      subtitle: "Al-Wadood",
      description: "The Most Loving",
    },
    {
      id: "48",
      title: "ٱلْمَجِيدُ",
      subtitle: "Al-Majeed",
      description: "The Glorious",
    },
  
    {
      id: "49",
      title: "ٱلْبَاعِثُ",
      subtitle: "A-Ba'ith",
      description: "The Resurrector",
    },
    {
      id: "50",
      title: "ٱلْشَّهِيدُ",
      subtitle: "As-Shaheed'",
      description: "The Witness",
    },
    {
      id: "51",
      title: "ٱلْحَقُّ",
      subtitle: "Al-Haqq",
      description: "The Absolute Truth",
    },
    {
      id: "52",
      title: "ٱلْوَكِيلُ	",
      subtitle: "Al-Wakeel",
      description: "The Trustee, The Dependable",
    },
    {
      id: "53",
      title: "ٱلْقَوِيُّ",
      subtitle: "Al-Qawiyy",
      description: "The All-Strong",
    },
    {
      id: "54",
      title: "ٱلْمَتِينُ",
      subtitle: "Al-Mateen",
      description: "The Firm, The Steadfast",
    },
    {
      id: "55",
      title: "ٱلْوَلِيُّ",
      subtitle: "Al-Waliyy",
      description: "The Protecting Associate",
    },
    {
      id: "56",
      title: "ٱلْحَمِيدُ",
      subtitle: "Al-Hameed",
      description: "The Praiseworthy",
    },
    {
      id: "57",
      title: "ٱلْمُحْصِيُ",
      subtitle: "Al-Muhsee",
      description: "The All-Enumerating ",
    },
    {
      id: "58",
      title: "ٱلْمُبْدِئُ",
      subtitle: "Al-Mubdi",
      description: "The Originator",
    },
    {
      id: "59",
      title: "ٱلْمُعِيدُ",
      subtitle: "Al-Mu'id",
      description: "The Restorer",
    },
    {
      id: "60",
      title: "ٱلْمُحْيِى",
      subtitle: "Al-Muhyee",
      description: "The Giver of Life",
    },
    {
      id: "61",
      title: "ٱلْمُمِيتُ",
      subtitle: "Al-Mumeet",
      description: "The Bringer of Death",
    },
    {
      id: "62",
      title: "ٱلْحَىُّ",
      subtitle: "Al-Hayy",
      description: "The Ever-Living",
    },
    {
      id: "63",
      title: "ٱلْقَيُّومُ",
      subtitle: "Al-Qayyum",
      description: "The Sustainer",
    },
    {
      id: "64",
      title: "ٱلْوَاجِدُ",
      subtitle: "Al-Wajid",
      description: "The Perceiver",
    },
    {
      id: "65",
      title: "ٱلْمَاجِدُ",
      subtitle: "Al-Majid",
      description: "The Illustrious",
    },
    {
      id: "66",
      title: "ٱلْوَاحِدُ",
      subtitle: "Al-Wahid",
      description: "The One",
    },
    {
      id: "67",
      title: "ٱلْأَحَد",
      subtitle: "Al-Ahad",
      description: "The Unique",
    },
    {
      id: "68",
      title: "ٱلْصَّمَدُ",
      subtitle: "As-Samad",
      description: "The Eternal",
    },
  
    {
      id: "69",
      title: "ٱلْقَادِرُ",
      subtitle: "Al-Qadir",
      description: "The Capable, The Powerful",
    },
    {
      id: "70",
      title: "ٱلْمُقْتَدِرُ",
      subtitle: "Al-Muqtadir'",
      description: "The Omnipotent",
    },
    {
      id: "71",
      title: "ٱلْمُقَدِّمُ",
      subtitle: "Al-Muqaddim",
      description: "The Expediter",
    },
    {
      id: "72",
      title: "ٱلْمُؤَخِّرُ",
      subtitle: "Al-Mu'Akhkhir",
      description: "The Delayer, The Retarder",
    },
    {
      id: "73",
      title: "ٱلأَوَّلُ",
      subtitle: "Al-Awwal",
      description: "The First",
    },
    {
      id: "74",
      title: "ٱلْآخِرُ",
      subtitle: "Al-Akhir",
      description: "The Last",
    },
    {
      id: "75",
      title: "ٱلْظَّاهِرُ	",
      subtitle: "Az-Zahiir",
      description: "The Ever Providing",
    },
    {
      id: "76",
      title: "ٱلْبَاطِنُ",
      subtitle: "Al-Baatin",
      description: "The Hidden One",
    },
    {
      id: "77",
      title: "ٱلْوَالِي",
      subtitle: "Al-Walii",
      description: "The Governor ",
    },
    {
      id: "78",
      title: "ٱلْمُتَعَالِي",
      subtitle: "Al-Muta'Ali",
      description: "The Self Exalted",
    },
    {
      id: "79",
      title: "ٱلْبَرُّ",
      subtitle: "Al-Barr",
      description: "The Source of Goodness",
    },
    {
      id: "80",
      title: "ٱلْتَّوَّابُ",
      subtitle: "Al-Tawwab",
      description: "The Ever-Pardoning",
    },
    {
      id: "81",
      title: "ٱلْمُنْتَقِمُ",
      subtitle: "Al-Muntaqim",
      description: "The Avenger",
    },
    {
      id: "82",
      title: "ٱلْعَفُوُّ",
      subtitle: "Al-Afuww",
      description: "The Pardoner",
    },
    {
      id: "83",
      title: "ٱلْرَّؤُفُ",
      subtitle: "Ar-Ra'oof",
      description: "The Most Kind",
    },
    {
      id: "84",
      title: "مَالِكُٱلْمُلْكُ",
      subtitle: "Malik-Ul-Mulk",
      description: "Master Of the Kingdom",
    },
    {
      id: "85",
      title: "ذُوٱلْجَلَالِوَٱلْإِكْرَامُ",
      subtitle: "Zul-JalalWal-Ikram",
      description: "Prossessor of Glory",
    },
    {
      id: "86",
      title: "ٱلْمُقْسِطُ",
      subtitle: "Al-Muqsit",
      description: "The Equitable",
    },
    {
      id: "87",
      title: "ٱلْجَامِعُ",
      subtitle: "Al-Jaami",
      description: "The Gatherer, The Uniter",
    },
  
    {
      id: "88",
      title: "ٱلْغَنيُّ",
      subtitle: "Al-Ghaniyy",
      description: "The Self-Sufficient",
    },
    {
      id: "89",
      title: "ٱلْمُغْنِيُّ",
      subtitle: "Al-Mughni",
      description: "The Enricher",
    },
    {
      id: "90",
      title: "ٱلْمَانِعُ",
      subtitle: "Al-Maani",
      description: "The WithHolder",
    },
    {
      id: "91",
      title: "ٱلْضَّارُ",
      subtitle: "Ad-Dharr",
      description: "The Distresser",
    },
    {
      id: "92",
      title: "ٱلْنَّافِعُ",
      subtitle: "An-Nafiy",
      description: "The Propitious",
    },
    {
      id: "93",
      title: "ٱلْنُّورُ",
      subtitle: "An-Noor",
      description: "The Light, The Illuminator",
    },
    {
      id: "94",
      title: "ٱلْهَادِي",
      subtitle: "Al-Haadi",
      description: "The Guide",
    },
    {
      id: "95",
      title: "ٱلْبَدِيعُ",
      subtitle: "Al-Badee",
      description: "The Incomparable Originator",
    },
    {
      id: "96",
      title: "ٱلْبَاقِي",
      subtitle: "Al-Baaqi",
      description: "The Ever-Surviving ",
    },
    {
      id: "97",
      title: "ٱلْوَارِثُ",
      subtitle: "Al-Wariss",
      description: "The Inheritor, The Heir",
    },
    {
      id: "98",
      title: "ٱلْرَّشِيدُ",
      subtitle: "Ar-Rasheed",
      description: "The Guide, Infallible Teache",
    },
    {
      id: "99",
      title: "ٱلْصَّبُورُ",
      subtitle: "As-Saboor",
      description: "The Forbearing, The Patient",
    },
  ];

const AllahNames = () => {
    const [verse, setVerse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // Select a random verse from the custom data array
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomName = data[randomIndex];
        setVerse({
            title: randomName.title,
            subtitle: randomName.subtitle,
            description: randomName.description,
            index: randomIndex,
        });
        setLoading(false);
    }, []);

    const handlePlayPause = () => {
        if (verse) {
            if (isPlaying) {
                Speech.stop();
                setIsPlaying(false);
            } else {
                const SpeechOptions = {
                    voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.siri_male_en-US_compact' : 'en_us_male', 
                    pitch: 0.8,
                    rate: 0.7,
                    language: 'ar-SA',
                    onStart: () => setIsPlaying(true),
                    onDone: () => setIsPlaying(false),
                    onStopped: () => setIsPlaying(false),
                };

                Speech.speak(verse.title, SpeechOptions);
            }
        }
    };

    const handleShare = () => {
        if (verse) {
            const shareOptions = {
                message: `${verse.title}\n ${verse.subtitle}\n${verse.description}`,
                title: 'Name of Allah',
            };
            Share.open(shareOptions)
                .then(res => console.log(res))
                .catch(err => console.error(err));
        }
    };

    return (
        <Pressable onPress={() => navigation.navigate('TextScrol', { verse, index: verse.index })}>
            <ImageBackground
                source={require('../../src/Images/DailyHadith.jpg')}
                style={styles.background}
                imageStyle={{ borderRadius: 6 }}
            >
                <LinearGradient
                    colors={['rgba(10, 148, 132, 0.9)', 'rgba(0,0,0,0.8)']}
                    style={styles.overlay}
                >
                    <View style={styles.container}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#ffffff" />
                        ) : (
                            <>
                                <Text style={styles.title}>Names of Allah</Text>
                                {verse && (
                                    <View style={styles.verseContainer}>
                                        <Text style={styles.verseText}>{verse.title}</Text>
                                        <View style={styles.translationContainer}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={styles.verseTextSub}>{verse.subtitle}</Text>
                                                <Text style={styles.verseTranslation}>{verse.description}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.translationContainer}>
                                            <View style={styles.iconContainer}>
                                                <Pressable onPress={handlePlayPause} style={styles.icon}>
                                                    <PlayIcon name={isPlaying ? "controller-paus" : "controller-play"} size={24} color="#0a9484" />
                                                    <Text style={styles.iconText}>{isPlaying ? "Pause" : "Play"}</Text>
                                                </Pressable>
                                                <Pressable onPress={handleShare} style={styles.shareicon}>
                                                    <Icon name="share-social" size={24} color="#ffffff" />
                                                    <Text style={{ color: '#fff' }}>Share</Text>
                                                </Pressable>
                                            </View>
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

export default memo(AllahNames);

const styles = StyleSheet.create({
    background: {
        width: 320,
        height: 230,
        resizeMode: "center",
        justifyContent: "center",
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
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        alignSelf: 'center',
        bottom: 20,
    },
    verseContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    verseText: {
        fontSize: 40,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    translationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        top: 10,
    },
    verseTranslation: {
        fontSize: 13,
        color: '#fff',
        textAlign: 'center',
        top: 20,
    },
    iconContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
        top: 20,
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        color: '#ffffff',
    },
    shareicon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verseTextSub: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        top: 15,
    },
});
