import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
import { useAuthContext } from '../Navigations/AuthContext';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get("window").width;

const PrayerTime = () => {
  const [prayerData, setPrayerData] = useState([]);
  const { themeMode } = useAuthContext();
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [remainingTime, setRemainingTime] = useState('');
  const [intervalId, setIntervalId] = useState(null); // Define intervalId state
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState();

  useEffect(() => {
    fetchPrayerData();
    // Clear interval when component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const fetchPrayerData = async () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const fetchedPrayerData = [];
      const targetDate = new Date(year, month - 1, date);
      const response = await fetchPrayerDataForDate(targetDate);
      const prayerDataForDate = await response.json();
      const prayerTimes = prayerDataForDate.data[targetDate.getDate() - 1].timings;
      const todayPrayerTimes = prayerDataForDate.data[currentDate.getDate() - 1].timings;

        // console.log("todayPrayerTimes",todayPrayerTimes);      
      let foundNextPrayer = false;
      for (const [prayer, time] of Object.entries(todayPrayerTimes)) {
        if (!["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayer)) {
          const currentTime = moment().format('HH:mm:ss');
          if (time > currentTime) {
            setNextPrayer({ name: prayer, time: time });
            calculateRemainingTime(time);
            foundNextPrayer = true;
            break;
          }
        }
      }
      if (!foundNextPrayer && prayerDataForDate.data.length > 1) {
        const nextDayPrayerTimes = prayerDataForDate.data[1].timings;
        const fajrTimeNextDay = nextDayPrayerTimes.Fajr;
        setNextPrayer({ name: 'Fajr', time: fajrTimeNextDay });
        calculateRemainingTime(fajrTimeNextDay);
      }
      const filteredPrayers = Object.entries(prayerTimes)
        .filter(([prayerName, _]) => !["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayerName))
        .map(([prayerName, prayerTime]) => {
          const formattedTime = formatTimeAMPM(prayerTime);
          return { prayerName, prayerTime: formattedTime };
        });

      fetchedPrayerData.push(filteredPrayers);
      setPrayerData(fetchedPrayerData);
      const currentTime = currentDate.getTime();
      const currentindex = findCurrentPrayerIndex(prayerTimes, currentTime);
      setCurrentPrayerIndex(currentindex);
      // console.log("currentTime", currentTime);
      let nextPrayerTime = null;
      let currentPrayerName = null;

      for (let i = 0; i < filteredPrayers.length; i++) {
        const prayer = filteredPrayers[i];
        const prayerTime = new Date(year, month - 1, date, ...prayer.prayerTime.split(':')).getTime();
        if (prayerTime > currentTime) {
          nextPrayerTime = prayerTime;
          currentPrayerName = prayer.prayerName;
          break;
        }
      }

      if (nextPrayerTime && currentPrayerName) {
        const timeDifference = nextPrayerTime - currentTime;
        const remainingHours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        setNextPrayer({ name: currentPrayerName, time: `${remainingHours}h ${remainingMinutes}m` });

        // Update remaining time every second
        const id = setInterval(() => {
          const updatedTimeDifference = nextPrayerTime - new Date().getTime();
          const updatedRemainingHours = Math.floor((updatedTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const updatedRemainingMinutes = Math.floor((updatedTimeDifference % (1000 * 60 * 60)) / (1000 * 60));
          setRemainingTime(`${updatedRemainingHours}h ${updatedRemainingMinutes}m`);
        }, 1000);

        setIntervalId(id);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const fetchPrayerDataForDate = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`
      );
      return response;
    } catch (error) {
      console.error("Error fetching prayer data:", error);
      throw error;
    }
  };

  const findCurrentPrayerIndex = (prayerTimes, currentTime) => {
    const prayerTimesInMs = Object.values(prayerTimes).map(time => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.getTime();
    });

    const currentindex = prayerTimesInMs.findIndex((time, idx, arr) => {
      const nextTime = idx < arr.length - 1 ? arr[idx + 1] : arr[0];
      return currentTime >= time && currentTime < nextTime;
    });
    return currentindex;
  };
  
  const calculateRemainingTime = (prayerTime) => {
    const current = new Date().getTime();
    const prayer = moment(prayerTime, 'HH:mm:ss');
    let difference = prayer.diff(current);
    if (difference < 0) {
      difference += 24 * 60 * 60 * 1000;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    const newIntervalId = setInterval(() => {
      difference -= 1000;
      if (difference < 0) {
        clearInterval(newIntervalId);
        fetchPrayerData();
      }

      const duration = moment.duration(difference);
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setRemainingTime(formattedTime);
    }, 1000);

    setIntervalId(newIntervalId);
  };

  const formatTimeAMPM = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return moment(date).format('h:mm A');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
     <LinearGradient 
      colors={['rgba(10, 150, 135, 0.8)', 'rgba(10, 148, 132, 1)']}
      style={styles.prayerContainer}
     >
     <View style={styles.prayerContainer}>
        <Text style={{ right: 106 ,color:'#fff'}}>Next Prayer</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 15, top: 5 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' ,color:'#FFA500'}}>{nextPrayer.name}</Text>
          <Text style={ {fontSize: 20, fontWeight: '700',color:'#fff'}}>- {remainingTime}</Text>
        </View>
        {prayerData.map((prayers, index) => (
          <View key={index} style={styles.prayerItem}>
            {prayers.map(({ prayerName, prayerTime }, index) => (
              <View  key={index}>
                <Text style={[
                  styles.prayerName,
                  // currentPrayerIndex === index && {borderColor:'#FFA500',borderWidth:1, color: '#FFA500' }
                  currentPrayerIndex === index && {color: '#FFA500' }
                ]}>
                  {prayerName}
                </Text>
                <Text style={[styles.prayerTime, currentPrayerIndex === index && { color: '#FFA500' }]}>
                  {prayerTime.split(' ')[0]}
                  {'\n'}
                  {prayerTime.split(' ')[1]}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
     </LinearGradient>
    </SafeAreaView>
  );
};

export default PrayerTime;

const styles = StyleSheet.create({
  prayerContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:7,
    // borderColor: '#DCDCDC',
    // borderWidth: 1,
  },
  prayerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 15,
  },
  prayerName: {
    fontSize: 13,
    // fontWeight: "700",
    textAlign: 'center',
    color:'#fff'
  },
  prayerTime: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: 'center',
    color:'#fff'
  },
  remainingTimeStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
});
