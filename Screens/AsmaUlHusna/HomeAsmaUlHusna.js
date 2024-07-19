import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity, AppState
} from "react-native";
import Sound from "react-native-sound";
import { useAuthContext } from "../../Navigations/AuthContext";
import HeaderBack from "../../Components/HeaderBack";
const NAME_SEEK_TIME = {
  0: 11000,
  1: 13000,
  2: 15000,
  3: 17000,
  4: 18000,
  5: 20000,
  6: 21000,
  7: 22000,
  8: 24000,
  9: 25000,
  10: 28000,
  11: 30000,
  12: 32000,
  13: 33000,
  14: 34900,
  15: 36000,
  16: 37500,
  17: 39000,
  18: 40900,
  19: 42800,
  20: 44700,
  21: 46000,
  22: 48400,
  23: 50000,
  24: 51200,
  25: 52000,
  26: 53500,
  27: 55000,
  28: 56000,
  29: 57100,
  30: 58100,
  31: 60000,
  32: 61000,
  33: 63000,
  34: 64000,
  35: 66000,
  36: 67000,
  37: 68000,
  38: 69000,
  39: 71000,
  40: 72200,
  41: 73400,
  42: 75100,
  43: 76700,
  44: 78100,
  45: 80100,
  46: 81200,
  47: 82100,
  48: 84100,
  49: 85600,
  50: 87200,
  51: 88200,
  52: 89700,
  53: 90900,
  54: 92700,
  55: 94000,
  56: 95400,
  57: 96900,
  58: 97900,
  59: 99100,
  60: 100000,
  61: 101100,
  62: 102100,
  63: 103900,
  64: 105100,
  65: 107100,
  66: 107900,
  67: 108900,
  68: 109700,
  69: 111700,
  70: 113300,
  71: 114700,
  72: 116400,
  73: 117300,
  74: 118500,
  75: 120500,
  76: 121500,
  77: 122800,
  78: 124600,
  79: 125600,
  80: 126600,
  81: 128800,
  82: 129700,
  83: 130700,
  84: 133700,
  85: 136900,
  86: 137900,
  87: 139300,
  88: 140900,
  89: 142100,
  90: 144100,
  91: 148100,
  92: 150100,
  93: 151100,
  94: 152100,
  95: 153100,
  96: 154100,
  97: 155100,
  98: 156100,
  99: 158000,
};
const NAME_PLAY_TIME = {
  0: 1200,
  1: 1500,
  2: 1400,
  3: 1500,
  4: 1500,
  5: 1400,
  6: 1500,
  7: 1700,
  8: 1600,
  9: 1800,
  10: 1600,
  11: 1500,
  12: 1400,
  13: 1500,
  14: 1500,
  15: 1600,
  16: 1500,
  17: 1500,
  18: 1900,
  19: 1500,
  20: 1500,
  21: 1500,
  22: 1500,
  23: 1500,
  24: 1300,
  25: 1300,
  26: 1300,
  27: 1300,
  28: 1000,
  29: 1200,
  30: 1200,
  31: 1200,
  32: 1200,
  33: 1200,
  34: 1200,
  35: 1200,
  36: 1200,
  37: 1200,
  38: 1200,
  39: 1300,
  40: 1300,
  41: 1200,
  42: 1200,
  43: 1300,
  44: 1300,
  45: 1200,
  46: 1300,
  47: 1300,
  48: 1500,
  49: 1800,
  50: 1300,
  51: 1300,
  52: 1300,
  53: 1300,
  54: 1300,
  55: 1400,
  56: 1200,
  57: 1100,
  58: 1100,
  59: 1400,
  60: 1100,
  61: 900,
  62: 1000,
  63: 1100,
  64: 1100,
  65: 1100,
  66: 500,
  67: 1200,
  68: 1300,
  69: 1300,
  70: 1300,
  71: 1300,
  72: 1300,
  73: 1300,
  74: 1300,
  75: 1300,
  76: 1300,
  77: 1300,
  78: 1300,
  79: 1300,
  80: 1300,
  81: 1300,
  82: 1100,
  83: 2000,
  84: 3200,
  85: 1400,
  86: 1400,
  87: 1500,
  88: 1400,
  89: 1600,
  90: 3300,
  91: 1700,
  92: 1500,
  93: 1500,
  94: 1500,
  95: 1500,
  96: 1500,
  97: 1500,
  98: 1500,
  99: 1500,
};
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
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
export var sound = new Sound("audio.mp3", Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log("failed to load the sound", error);
  }
});


const NameCard = memo(
  ({
    navigation,
    item,
    index,
    isSelected,
  }) => {
    const { themeMode, setThemeMode } = useAuthContext();

    const onClick = () => {
      navigation.navigate("TextScrol", {
        item,
        index,
      });
    };
    return (
      <Pressable
        onPress={onClick}
        style={[
          styles.mainContainer,
          isSelected && { backgroundColor: "#C0C0C0" },
        ]}
      >
        <View style={[styles.box, themeMode == "dark" && { backgroundColor: "#0a9484" }]}>
          <Text style={[styles.id, themeMode == "dark" && { color: "#fff" }]}>
            {item.id}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.bottomConatiner}>
            <Text
              style={[styles.title, themeMode == "dark" && { color: "#FFF" }]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.subtitle,
                themeMode == "dark" && { color: "#FFF" },
              ]}
            >
              {item.subtitle}
            </Text>
            <Text
              style={[
                styles.description,
                themeMode == "dark" && { color: "#FFF" },
              ]}
            >
              {item.description}
            </Text>
          </View>

          <Text style={[
            styles.leftHeadTitle,
            themeMode == "dark" && { color: "#0a9484" },
          ]}>{item.title}</Text>
        </View>
      </Pressable>
    );
  }
);
const HomeAsmaUlHusna = ({ navigation }) => {
  const { themeMode, setThemeMode, isAutoPlayActive, setIsAutoPlayActive } = useAuthContext();
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [headerText, setHeaderText] = useState(data[0].title);
  const [headerTextSubTitle, setheaderTextSubTitle] = useState(
    data[0].subtitle
  );
  const [headerTextDescription, setheaderTextDescription] = useState(
    data[0].description
  );
  const [appState, setAppState] = useState(AppState.currentState);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const itemIndex = Math.ceil(offsetY / 75);
    setSelectedItemIndex(itemIndex);
    if (itemIndex == currentIndex) {
      return;
    }
    setCurrentIndex(itemIndex);
    if (data[itemIndex]) {
      setHeaderText(data[itemIndex].title);
      setheaderTextSubTitle(data[itemIndex].subtitle);
      setheaderTextDescription(data[itemIndex].description);
    }
  };
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/active/) && nextAppState === 'background') {
        sound.stop();
        setIsAutoPlayActive(false);
      }
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sound.stop();
      sound.release();
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  useEffect(() => {
    if (!isAutoPlayActive) {
      return;
    }
    handleAutoPlay();
  }, [currentIndex, isAutoPlayActive]);

  const handleAutoPlay = async () => {
    if (currentIndex >= 99) {
      sound.stop();
      return;
    }
    if (currentIndex > data.length) {
      return;
    }
    flatListRef.current.scrollToIndex({
      index: currentIndex,
      animated: true,
    });
    if (data[currentIndex]) {
      setHeaderText(data[currentIndex].title);
      setheaderTextSubTitle(data[currentIndex].subtitle);
      setheaderTextDescription(data[currentIndex].description);
    }
    await delay(NAME_PLAY_TIME[currentIndex]);
    setCurrentIndex(currentIndex + 1);
  };

  const autoPlayToggal = async () => {
    setIsAutoPlayActive(!isAutoPlayActive);
    if (!isAutoPlayActive) {
      sound.setCurrentTime(Number(NAME_SEEK_TIME[currentIndex] / 1000));
      sound.play();
      return;
    }
    sound.stop();
  };
  const renderItems = useCallback(
    ({ item, index }) => (
      <NameCard
        navigation={navigation}
        item={item}
        index={index}
        isSelected={index === selectedItemIndex}
      />
    ),
    [selectedItemIndex]
  );
  return (
    <SafeAreaView style={[styles.container, themeMode == "dark" && { backgroundColor: "black" },]}>
      <HeaderBack title={'99 Names of Allah'} navigation={navigation}/>
      <View style={styles.bodyContainer}>
        <Text
          style={[styles.headerTextSubTitle, themeMode == "dark" && { color: "#FFF" },]}>
          {headerTextSubTitle}
        </Text>
        <Text style={[styles.headerText, themeMode == "dark" && { color: "#0a9484" }]}>{headerText}</Text>
        <Text style={[styles.text, themeMode == "dark" && { color: "#FFF" }]}>
          {headerTextDescription}
        </Text>
        <TouchableOpacity onPress={autoPlayToggal}>
          <Text style={[styles.autoBtn, themeMode == "dark" && { color: "#0a9484", fontWeight: "600", fontSize: 18 }]}>
            Auto Play: {isAutoPlayActive ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ flexGrow: 0 }}
        scrollEnabled={!isAutoPlayActive}
        data={data}
        getItemLayout={(data, index) => ({
          length: 75,
          offset: 75 * index,
          index,
        })}
        renderItem={renderItems}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        ref={flatListRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainHeader: {
    flexDirection: "row",
    height: 55,
    backgroundColor: "#fcba03",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerimage: {
    height: 25,
    width: 25,
  },
  bodyContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomColor: "#cbcbcb",
    borderBottomWidth: 1,
    height: 312,
  },
  box: {
    alignItems: "center",
    backgroundColor: "#0a9484",
    justifyContent: "center",
    height: 55,
    width: 55,
    borderRadius: 4,
  },
  id: {
    fontSize: 25,
    fontWeight: "800",
    color: "#fff",
  },
  toptext: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    fontFamily: "Gilroy",
  },
  mainContainer: {
    flexDirection: "row",
    height: 71,
    borderBottomColor: "#cbcbcb",
    borderBottomWidth: 1,
    padding: 10,
    marginVertical: 2,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  bottomConatiner: {
    flex: 1,
    gap: -2,
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 6,
    fontFamily: "Poppins",
    color:'#000'
  },
  subtitle: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "400",
  },
  leftHeadTitle: {
    fontSize: 30,
    fontWeight: "500",
    color: "#0a9484",
    marginRight: 5,
  },
  headerTextSubTitle: {
    fontSize: 25,
    fontWeight: "700",
  },
  headerText: {
    fontSize: 50,
    fontWeight: "700",
    color: "#0a9484",
    fontFamily: "Montserrat-Regular",
  },
  autoBtn: {
    fontSize: 20,
    color: "#0a9484",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default memo(HomeAsmaUlHusna);
