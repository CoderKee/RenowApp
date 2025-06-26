import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import CustomButton from './CustomButton';

// Helper functions for period marking
const splitIntoConsecutiveRanges = (dates) => {
  if (!dates || dates.length === 0) return [];
  const sorted = [...dates].sort((a, b) => new Date(a) - new Date(b));
  const ranges = [];
  let range = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1]);
    const curr = dayjs(sorted[i]);
    if (curr.diff(prev, 'day') === 1) {
      range.push(sorted[i]);
    } else {
      ranges.push(range);
      range = [sorted[i]];
    }
  }
  ranges.push(range);
  return ranges;
};

const getPeriodMarkedDates = (dates) => {
  const ranges = splitIntoConsecutiveRanges(dates);
  const marked = {};
  ranges.forEach(range => {
    range.forEach((date, idx) => {
      const key = dayjs(date).format('YYYY-MM-DD');
      if (range.length === 1) {
        marked[key] = { startingDay: true, endingDay: true, color: '#007AFF', textColor: 'white' };
      } else if (idx === 0) {
        marked[key] = { startingDay: true, color: '#007AFF', textColor: 'white' };
      } else if (idx === range.length - 1) {
        marked[key] = { endingDay: true, color: '#007AFF', textColor: 'white' };
      } else {
        marked[key] = { color: '#007AFF', textColor: 'white' };
      }
    });
  });
  return marked;
};

const DateSelector = ({ value = [], onChange }) => {
  const [selectedDates, setSelectedDates] = useState(value);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelectedDates(value);
  }, [value]);

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    let newDates;
    if (selectedDates.includes(dateString)) {
      newDates = selectedDates.filter(d => d !== dateString);
    } else {
      newDates = [...selectedDates, dateString];
    }
    setSelectedDates(newDates);
    setSaved(false); // Hide "Saved!" when user changes selection
  };

  const handleClear = () => {
    setSelectedDates([]);
    setSaved(false);
  };

  const handleSave = () => {
    const sorted = [...selectedDates].sort((a, b) => new Date(a) - new Date(b));
    onChange(sorted);
    setSaved(true);
  };

  const markedDates = getPeriodMarkedDates(selectedDates);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Available Dates</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="period"
        minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
        theme={{
          selectedDayBackgroundColor: '#007AFF',
          todayTextColor: '#007AFF',
          arrowColor: '#007AFF',
        }}
      />
      <View style={styles.buttonRow}>
        <View style={styles.buttonLeft}>
          <CustomButton text="Clear Dates" color={selectedDates.length === 0  ? "gray" : "maroon"} onPress={handleClear} />
        </View>
        <View style={styles.buttonRight}>
          <CustomButton text="Save Dates" color={"#007AFF"} onPress={handleSave} />
        </View>
      </View>
      {saved && (
        <Text style={styles.savedText}>Saved!</Text>
      )}
      {selectedDates.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Selected Dates:</Text>
          {selectedDates
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => (
              <Text key={date}>{dayjs(date).format('dddd, DD MMMM YYYY')}</Text>
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 8, color: 'maroon', fontSize: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  buttonLeft: {
    width: '50%',
  },
  buttonRight: {
    width: '50%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  savedText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default DateSelector;