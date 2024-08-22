import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, memo } from 'react';
import moment from 'moment';
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const PrayerTime = () => {
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [remainingTime, setRemainingTime] = useState('');
  const [intervalId, setIntervalId] = useState(null); // Define intervalId state
  const { themeMode } = useAuthContext();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const response = await fetch(
          `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`
        );
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const todayPrayerTimes = data.data[currentDate.getDate() - 1].timings;
          const currentTime = moment().format('HH:mm:ss');
          let foundNextPrayer = false;

          for (const [prayer, time] of Object.entries(todayPrayerTimes)) {
            if (!["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayer)) {
              if (time > currentTime) {
                setNextPrayer({ name: prayer, time: time });
                calculateRemainingTime(time);
                foundNextPrayer = true;
                break;
              }
            }
          }

          if (!foundNextPrayer && data.data.length > 1) {
            const nextDayPrayerTimes = data.data[1].timings;
            const fajrTimeNextDay = nextDayPrayerTimes.Fajr;
            setNextPrayer({ name: 'Fajr', time: fajrTimeNextDay });
            calculateRemainingTime(fajrTimeNextDay);
          }
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchData();
  }, []);

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
        fetchData();
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

  const fetchData = async () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`
      );
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const currentDateData = data.data[currentDate.getDate() - 1];
        const currentTime = moment().format('HH:mm:ss');
        let foundNextPrayer = false;

        for (const [prayer, prayerTime] of Object.entries(currentDateData.timings)) {
          if (!["Sunset", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayer)) {
            if (prayerTime > currentTime) {
              setNextPrayer({ name: prayer, time: prayerTime });
              calculateRemainingTime(prayerTime);
              foundNextPrayer = true;
              break;
            }
          }
        }

        if (!foundNextPrayer && data.data.length > 1) {
          const nextDayPrayerTimes = data.data[1].timings;
          const fajrTimeNextDay = nextDayPrayerTimes.Fajr;
          setNextPrayer({ name: 'Fajr', time: fajrTimeNextDay });
          calculateRemainingTime(fajrTimeNextDay);
        }
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
      <View style={[styles.mainContainer, themeMode === "dark" && { backgroundColor: "#1C1C22", borderColor: "#fff" }]}>
        <Text style={[styles.prayerTime, themeMode === "dark" && { color: "#fff" }]}>{t('next_jamaat')}</Text>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[{ fontSize: 20, textAlign: 'left', bottom: 15 }, themeMode === "dark" && { color: "#fff" }]}> {t(`prayer.${nextPrayer.name.toLowerCase()}`)}</Text>
            <Text style={[{ fontSize: 22, textAlign: 'right', bottom: 15 }, themeMode === "dark" && { color: "#fff" }]}>- {remainingTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(PrayerTime);

const styles = StyleSheet.create({
  mainContainer: {
    height: 90,
    width: '90%',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 5,
    borderColor: '#C7C7C7',
    borderWidth: 1,
  },
  prayerTime: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
});
