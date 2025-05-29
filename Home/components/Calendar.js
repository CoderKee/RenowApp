import React from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { TouchableOpacity, Text } from 'react-native';

const Calendar = ({
  availableDates = [],
  selectedDate,
  onSelectDate,
  highlightColor = '#B3D8FD',
  selectedColor = '#4A90E2',
  ...props
}) => {
  // Build markedDates object
  const markedDates = {};
  availableDates.forEach(date => {
    markedDates[date] = {
      selected: selectedDate === date,
      selectedColor: selectedDate === date ? selectedColor : highlightColor,
      disabled: false,
      disableTouchEvent: false,
    };
  });

  return (
    <RNCalendar
      markedDates={markedDates}
      markingType="simple"
      disableAllTouchEventsForDisabledDays={true}
      dayComponent={({ date }) => {
        const isAvailable = availableDates.includes(date.dateString);
        const isSelected = selectedDate === date.dateString;
        return (
          <TouchableOpacity
            disabled={!isAvailable}
            onPress={() => isAvailable && onSelectDate(date.dateString)}
            style={{
              backgroundColor: isSelected
                ? selectedColor
                : isAvailable
                ? highlightColor
                : 'transparent',
              borderRadius: 16,
              padding: 4,
            }}
          >
            <Text
              style={{
                color: isAvailable ? (isSelected ? 'white' : '#222') : '#ccc',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {date.day}
            </Text>
          </TouchableOpacity>
        );
      }}
      {...props}
    />
  );
};

export default Calendar;