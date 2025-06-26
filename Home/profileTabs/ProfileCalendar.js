import React from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { TouchableOpacity, Text } from 'react-native';

const ProfileCalendar = ({
  markedDates = {},
  selectedDate,
  onSelectDate,
  calendarWidth,
}) => {
  return (
    <RNCalendar
      markedDates={markedDates}
      markingType="multi-dot"
      onDayPress={day => onSelectDate && onSelectDate(day.dateString)}
      current={selectedDate}
      style={{
        width: calendarWidth,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
      }}
      theme={{
        selectedDayBackgroundColor: 'orange', // highlight selected day in orange
        todayTextColor: '#4A90E2',
        dotColor: '#4A90E2',
        arrowColor: '#4A90E2',
        textDayFontWeight: 'bold',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: 'bold',
      }}
    />
  );
};

export default ProfileCalendar;