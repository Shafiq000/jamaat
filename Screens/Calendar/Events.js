import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import eventData from '../../Jsondata/events.json';
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const Events = ({ selectedDate }) => {
    const { themeMode } = useAuthContext();
    const { t } = useTranslation();
    const renderEvents = (events) => {
        return Object.keys(events).map((eventName, index) => {
            const event = events[eventName];
            const gregorianDate = new Date(event.gregorianDate);
            const day = gregorianDate.getDate();
            const year = gregorianDate.getFullYear();
            const monthName = gregorianDate.toLocaleString('en-US', { month: 'long' }); // Extract the month name
    
            // Translate the month name
            const translatedMonth = t(`month_name_gregorian.${monthName}`);
            const formattedDateUr = `${translatedMonth} ${day}, ${year}`;
    
            // Translate the event name
            const formattedEventName = t(`events_months.${eventName}`);
    
            return (
                <View 
                    style={[
                        styles.item, 
                        themeMode === "dark" && { backgroundColor: "#1C1C22" }, 
                        event.gregorianDate === selectedDate ? styles.selectedEvent(themeMode) : null
                    ]} 
                    key={index}
                >
                    <View style={{ flexDirection: "column" }}>
                        <Text style={[styles.title, themeMode === "dark" && { color: "#fff" }]}>
                            {formattedEventName}
                        </Text>
                    </View>
                    <Text style={[styles.gregorianDate, themeMode === "dark" && { color: "#fff" }]}>
                        {formattedDateUr}
                    </Text>
                </View>
            );
        });
    };
    
    
    
    const events2023 = eventData["2023"];
    const events2024 = eventData["2024"];
    const events2025 = eventData["2025"];
    const events = {...events2023,...events2024,...events2025 };
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.item, { borderTopColor: '#DCDCDC', borderTopWidth: 1 }, themeMode === "dark" && { backgroundColor: "#1C1C22" }]}>
                <Text style={[{ fontSize: 25, fontWeight: "500" }, themeMode === "dark" && { color: "#fff" }]}>{t('events')}</Text>
            </View>
            {renderEvents(events)}
        </SafeAreaView>
    );
}
export default Events;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        padding: 19,
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
    },
    gregorianDate: {
        fontSize: 17,
        fontWeight: "600",
    },
    hijriDate: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "left"
    },
    selectedEvent: (themeMode) => ({
        backgroundColor: themeMode === "dark" ? '#91CDC7' : '#DCF2EF',
    })
});
