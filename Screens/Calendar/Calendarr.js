import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import eventData from '../../Jsondata/events.json';
import Events from '../Calendar/Events';
import { useAuthContext } from '../../Navigations/AuthContext';
// import moment from 'moment-hijri';
// import HijriDate from 'hijri-date';
const Calendarr = () => {
  const { themeMode } = useAuthContext();
  const scrollViewRef = useRef();
  const calendarRef = useRef(); // Define a ref for the Calendar component
  const INITIAL_DATE = new Date();
  const [date, setDate] = useState(CalendarUtils.getCalendarDateString(INITIAL_DATE));
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [markedDates, setMarkedDates] = useState({});
  const CALENDAR_HEIGHT = 300;
  const getDate = () => {
    return CalendarUtils.getCalendarDateString(INITIAL_DATE);
  };
  useEffect(() => {
    const marked = {};
    for (const year in eventData) {
      for (const event in eventData[year]) {
        const gregorianDate = eventData[year][event].gregorianDate;
        marked[gregorianDate] = { marked: true, dotColor: '#0A9484' };
      }
    }
    setMarkedDates(marked);
  }, []);

  const onDateChange = useCallback((selectedDate) => {
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      // Calculate the difference in months between the selected date and the initial date
      const monthDiff = (selectedYear - INITIAL_DATE.getFullYear()) * 12 + (selectedMonth - INITIAL_DATE.getMonth())
      // Calculate the scroll offset based on the difference in months
      const scrollOffset = monthDiff * CALENDAR_HEIGHT;
      // Scroll the calendar to the new month and year
      if (calendarRef.current) {
        calendarRef.current.scrollTo({ x: scrollOffset, animated: true });
      }
      const formattedDate = CalendarUtils.getCalendarDateString(selectedDate);
      setDate(formattedDate);
      setSelectedDate(formattedDate);
      setOpen(false);
    }
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (scrollViewRef.current) {
      const markedDatePosition = Object.keys(markedDates).findIndex(date => date === day.dateString);
      if (markedDatePosition) {
        scrollViewRef.current.scrollTo({ y: markedDatePosition * 50, animated: true, duration: 100 });
      }
    }
    setDate(day.dateString);
  };
  const LEFT_ICON = { name: "left", size: 22, color: themeMode === "dark" ? "#fff" : "#000" };
  const RIGHT_ICON = { name: "right", size: 22, color: themeMode === "dark" ? "#fff" : "#000" };
  const IconContainer = ({ iconObject }) => {
    return (
      <View >
        <Icon style={{ marginTop: 10 }} name={iconObject.name} size={iconObject.size} color={iconObject.color} />
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, flexDirection: "column" }} ref={scrollViewRef} >
      <Calendar
        //  style={[themeMode === "dark" && {backgroundColor:"#1C1C22" }]}
        // theme={theme}
        key={themeMode}
        theme={themes[themeMode]}
        ref={calendarRef}
        initialDate={selectedDate}
        onDateChanged={onDateChange}
        arrowsHitSlop={30}
        showControls={true}
        renderArrow={(direction) => direction == 'left' ? <IconContainer iconObject={LEFT_ICON} /> : <IconContainer iconObject={RIGHT_ICON} />}
        onDayPress={onDayPress}
        // renderHeader={renderHeader}
        hideExtraDays={true}
        enableSwipeMonths={true}
        markedDates={{
          ...markedDates,
          [getDate(INITIAL_DATE)]: { selected: true, dotColor: '#000', selectedColor: '#0A9484', selectedTextColor: '#fff' },
          [selectedDate]: { selected: true, dotColor: 'green', selectedColor: "#DCF2EF" ,selectedTextColor: '#000'}
        }}
        monthFormat={"MMM, yyyy "}
        scrollEnabled={true}
      />
      <DatePicker
        theme={themeMode === "dark" ? "dark" : "light"}
        androidVariant='nativeAndroid'
        onDateChange={(currentDate) => {
          setDate(currentDate);
        }}
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          onDateChange(selectedDate);
        }}
        mode="date"
        modal
        open={open}
        date={new Date(date)}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <View style={{ position: "absolute" }}>
        <RenderHeader setOpen={setOpen} />
      </View>
      <Events selectedDate={selectedDate} />
    </ScrollView>
  );
};
const RenderHeader = ({ setOpen }) => {
  const { themeMode } = useAuthContext();
  // const [open, setOpen] = useState(false);
  // const gregorianDate = moment(date.dateString).format('MMMM, YYYY');
  return (
    <View style={{ marginTop: 22, }}>
      {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: "center" }}>
        <Text style={{ color: "#000", fontSize: 23, fontWeight: "700", top: 10 }}>{gregorianDate}</Text>
        <Text style={{ color: "#000", fontSize: 15, fontWeight: "700", top: 10 }}>{hijriDate}</Text>
      </View> */}
      <Pressable hitSlop={30} onPress={() => { setOpen(true) }}>
        <Text style={{ marginLeft: 125 }}>
          <Icon name="caretdown" color="#000" size={15} style={[themeMode === "dark" && { color: "#fff" }]} />
        </Text>
      </Pressable>
    </View>
  );
};
const themes = {
  light: {
    calendarBackground: 'white',
    dayTextColor: 'black',
    monthTextColor: 'black',
    textDisabledColor: 'grey',
    textDayFontWeight: "700",
    textMonthFontWeight: "800",
    textDayHeaderFontWeight: "800",
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textSectionTitleColor: "#000",
    selectedDayTextColor: "white",
    textDayHeaderFontSize: 15,
    textDayHeaderColor: "#000",
    TouchableOpacity: 0.5,
    'stylesheet.calendar.header': {
      headerContainer: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        left: 10,
        gap: 20,

      },
      dayTextAtIndex0: { color: "red" },
      dayTextAtIndex6: { color: "red" },
      header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 6,
        alignItems: 'center',
      },
      dayHeader: {
        padding: 10,
        textAlign: 'center',
        fontWeight: "600"
      },
    },
    'stylesheet.calendar.main': {
      dayContainer: {
        flex: 1,
        padding: 10,
      },
      emptyDayContainer: {
        flex: 1,
        padding: 11,
      },
      week: {
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    },
  },
  dark: {
    calendarBackground: '#1C1C22',
    dayTextColor: 'white',
    monthTextColor: 'white',
    textDisabledColor: 'grey',
    textDayFontWeight: "700",
    textMonthFontWeight: "800",
    textDayHeaderFontWeight: "800",
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textSectionTitleColor: "#fff",
    selectedDayTextColor: "white",
    textDayHeaderFontSize: 15,
    textDayHeaderColor: "#fff",
    TouchableOpacity: 0.5,
    'stylesheet.calendar.header': {
      headerContainer: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        left: 10,
        gap: 20,

      },
      dayTextAtIndex0: { color: "red" },
      dayTextAtIndex1: { color: "white" },
      dayTextAtIndex2: { color: "white" },
      dayTextAtIndex3: { color: "white" },
      dayTextAtIndex4: { color: "white" },
      dayTextAtIndex5: { color: "white" },
      dayTextAtIndex6: { color: "red" },
      header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 6,
        alignItems: 'center',
      },
      dayHeader: {
        padding: 10,
        textAlign: 'center',
        fontWeight: "600"
      },
    },
    'stylesheet.calendar.main': {
      dayContainer: {
        flex: 1,
        padding: 10,
      },
      emptyDayContainer: {
        flex: 1,
        padding: 11,
      },
      week: {
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    },

  }
}
export default memo(Calendarr);
