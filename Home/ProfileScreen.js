import React, { useLayoutEffect, useState, useCallback, useEffect, use } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './components/CustomButton';
import { useUser } from '../Home/globalContext/UserContext';
import { supabase } from '../server/supabase.js';
import Calendar from './components/Calendar.js';
import ProfileCalendar from './profileTabs/ProfileCalendar';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  RefreshControl
} from 'react-native'

const ProfileScreen = ({ navigation }) => {
  const SERVICE_COLOR = '#001B5B'; // dark blue
  const REQUEST_COLOR = 'maroon';
  
  const [refreshing, setRefreshing] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const { username } = useUser();

  const fetchCalendarEvents = useCallback(async () => {
    setRefreshing(true);

    // 1. Listings accepted by the user (as a request)
    const { data: acceptedByMe, error: error1 } = await supabase
      .from('Listings')
      .select('*')
      .eq('accepted_by', username)
      .eq('accepted', true);

    // 2. Listings created by the user, accepted by someone else (as a service)
    const { data: myServices, error: error2 } = await supabase
      .from('Listings')
      .select('*, Users!inner(username)')
      .eq('Users.username', username)
      .eq('accepted', true)

    if (error1 || error2) {
      console.error('Error fetching calendar events:', error1 || error2);
      setRefreshing(false);
      return;
    }

    // Build markedDates object for multi-dot
    const dotsByDate = {};
    const tasks = {};

    // Red dot for requests (accepted by me)
    acceptedByMe?.forEach((item, idx) => {
      if (item.selected_date) {
        const dateStr = dayjs(item.selected_date).format('YYYY-MM-DD');
        if (!dotsByDate[dateStr]) dotsByDate[dateStr] = [];
        dotsByDate[dateStr].push({ key: `request-${idx}`, color: REQUEST_COLOR });
        if (!tasks[dateStr]) tasks[dateStr] = [];
        tasks[dateStr].push({ ...item, typeLabel: 'REQUEST' });
      }
    });

    // Blue dot for services (my listing accepted)
    myServices?.forEach((item, idx) => {
      if (item.selected_date) {
        const dateStr = dayjs(item.selected_date).format('YYYY-MM-DD');
        if (!dotsByDate[dateStr]) dotsByDate[dateStr] = [];
        dotsByDate[dateStr].push({ key: `service-${idx}`, color: SERVICE_COLOR });
        if (!tasks[dateStr]) tasks[dateStr] = [];
        tasks[dateStr].push({ ...item, typeLabel: 'SERVICE' });
      }
    });
    
    // Convert to markedDates format
    const marked = {};
    Object.entries(dotsByDate).forEach(([date, dots]) => {
      if (date && typeof date === 'string') {
        marked[date] = { dots };
      }
    });

    setMarkedDates(marked);
    setTasksByDate(tasks);
    // If a date is already selected, update the tasks for that date
    if (selectedDate) {
      setTasksForSelectedDate(tasks[selectedDate] || []);
    }

    setRefreshing(false);
  }, [username, selectedDate]);

  useEffect(() => {
    setTasksForSelectedDate(tasksByDate[selectedDate] || []);
  }, [selectedDate, tasksByDate]);

  const handleLogout = async () => {
    navigation.replace('Login');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() =>
            Alert.alert(
              'Confirm Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: handleLogout },
              ]
            )
          }
        >
          <Icon name="logout" size={24} color="maroon" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
  setRefreshing(true);
  await fetchCalendarEvents();
  setRefreshing(false);
}, [fetchCalendarEvents]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 20, alignSelf: 'flex-start', marginLeft:'5%', color: 'black'
       }}> Welcome, {username} </Text>
      
      <CustomButton
        color={"gray"}
        text="Completed Listings"
        onPress={() => navigation.navigate('CompletedListing')}  
      />
      <CustomButton
        color={"gray"}
        text="My Reviews"
        onPress={() => null}  
        />
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 50, alignSelf: 'center', color: 'black' }}>
        Calendar</Text>
      <ProfileCalendar
        markedDates={
          selectedDate && typeof selectedDate === 'string'
            ? {
                ...markedDates,
                [selectedDate]: {
                  ...(markedDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: 'orange',
                },
              }
            : markedDates
        }
        selectedDate={typeof selectedDate === 'string' ? selectedDate : undefined}
        onSelectDate={date => {
          if (typeof date === 'string') setSelectedDate(date);
        }}
        calendarWidth={Dimensions.get('window').width - 40}
      />
      <View style={{ width: '90%', marginTop: 20 }}>
      {selectedDate && (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
            Tasks for {dayjs(selectedDate).format('dddd, DD MMMM YYYY')}:
          </Text>
          {tasksForSelectedDate.length === 0 ? (
            <Text style={{ color: 'gray' }}>No tasks for this day.</Text>
          ) : (
            tasksForSelectedDate.map((task, idx) => (
              <Text key={idx} style={{ fontSize: 16, marginBottom: 5 }}>
                {task.typeLabel} - {task.type} - {task.title}
              </Text>
            ))
          )}
        </>
      )}
      </View>
    </ScrollView>
    
  );

}

export default ProfileScreen

const styles = StyleSheet.create({
  text: {
    color: 'black',
  }
})