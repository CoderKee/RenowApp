import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { supabase } from '../../server/supabase';
import { useUser } from '../globalContext/UserContext';
import AlertModal from '../components/AlertModal';
import { Icon } from '@rneui/themed';
import Calendar from '../components/Calendar';
import dayjs from 'dayjs';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    Image,
    Alert,
    RefreshControl,
    TouchableOpacity,
} from 'react-native'

const ItemDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const { username } = useUser();
    const [posterUsername, setPosterUsername] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [unacceptedModalVisible, setUnacceptedModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchPosterUserName = useCallback(async () => {
        if (!item.user_id) return;
        const { data, error } = await supabase
            .from('Users')
            .select('username')
            .eq('user_id', item.user_id)
            .single();
        if (error) {
            console.error('Error fetching poster username', error);
        } else if (data) {
            setPosterUsername(data.username)
        }
    }, [item.user_id]);

    useLayoutEffect(() => {
        if (item.accepted && item.accepted_by) {
            navigation.setOptions({ 
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={unAcceptTask}
                    >
                        <Icon name="cancel" size={30} color='maroon'/> 
                    </TouchableOpacity>
                )
            });
        } else {
            //navigation.setOption({ headerRight: undefined});
        }
    }, [navigation, item.accepted, item.accepted_by, username]);  

    const availableDates = item.available_dates || [];

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPosterUserName();
        setRefreshing(false);
    }, [fetchPosterUserName]);

    useFocusEffect(
        useCallback(() => {
            handleRefresh();
        }, [handleRefresh])
    );

    useEffect(() => {
        fetchPosterUserName();
    }, [fetchPosterUserName]);

    const styleColour = item.request 
                        ? item.accepted || posterUsername === username || selectedDate === null
                            ? '#997570'
                            : 'maroon'
                        : item.accepted || posterUsername === username || selectedDate === null 
                            ? '#7393B3'
                            : '#001B5B';

    const dateFormat = {day: 'numeric', month: 'long', year: 'numeric'};

    const acceptTask = async () => {
        setModalVisible(true);
    };

    const unAcceptTask = () => {
        setUnacceptedModalVisible(true);
    };

    function formatDate(timeStamp) {
        const date = new Date(timeStamp);
        return date.toLocaleDateString('en-GB', dateFormat);
    }

    const onScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / 370);
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            {/* Image scroll might be buggy */}
            <ScrollView 
                contentContainerStyle={styles.contentContainer}
                styles={styles.scrollArea}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <View style={styles.imageContainer}>
                    {item.images && item.images.length > 0 ? (
                        <>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            snapToInterval={370} 
                            snapToAlignment="center"
                            decelerationRate="fast"
                            showsHorizontalScrollIndicator={false}
                            style={styles.carouselContainer}
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                        >
                            {item.images.map((imgName, index) => {
                                const { data, error } = supabase.storage
                                    .from('images')
                                    .getPublicUrl(imgName);

                                return (
                                    <Image
                                        key={index}
                                        source={{ uri: data.publicUrl }}
                                        style={styles.carouselImage}
                                    />
                                );
                            })}
                        </ScrollView>
                        {/* pagination dots */}
                        <View style={styles.pagination}>
                            {item.images.map((_, index) => (
                                <View 
                                    key={index} 
                                    style={[
                                        styles.dot, 
                                        currentIndex === index ? styles.activeDot : null
                                    ]} 
                                />
                            ))}
                        </View>
                        </>
                    ) : (
                        <Image
                            source={require('../../assets/image.png')}
                            style={styles.carouselImage}
                        />
                    )}
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.title}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text>Listed By {posterUsername}</Text>
                    <Text>On {formatDate(item.created_at)}</Text>
                    <Text style={styles.description}>Description</Text>
                    <Text>{item.description}</Text>
                </View>
                <View style={{ marginVertical: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, justifyContent: 'center' }}>Available Dates</Text>
                    <Calendar
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                    {selectedDate && (
                        <Text style={{ marginTop: 10, color: '#4A90E2' }}>
                            Selected: {dayjs(selectedDate).format('dddd, D MMMM YYYY')}
                        </Text>
                    )}
                </View>
            </ScrollView>
            
            <View style={styles.accept}>
                <CustomButton 
                    text={ posterUsername === username ? "Cannot Accept Your Own Listing"
                                                    : item.accepted ? "Accepted" 
                                                        : selectedDate === null ?  "Please Select Date" : "Accept"
                        }
                    color={ styleColour }
                    onPress={ item.accepted || selectedDate === null || posterUsername === username ? null : acceptTask }
                />
            </View>
            <AlertModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={async () => {
                    try {
                        const {data, error} = await supabase
                            .from("Listings")
                            .update({ accepted_by: username, accepted: true, selected_date: selectedDate })
                            .eq("listing_id", item.listing_id)

                        if (error) {
                            Alert.alert("Error", error.message);
                        } else {
                            Alert.alert("Success", "Task accepted successfully.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            navigation.navigate("MainTabs", {
                                                screen: "Listing",
                                                params: { screen: "Accepted Listing" }
                                            });
                                        }
                                    }
                                ]
                            );
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "An unexpected error has occurred.");
                    } finally {
                        setModalVisible(false);
                    }
                }}
                alertText="Are you sure you want to accept this task on the following day?"
                confirmOption="Accept"
                selectedDate={selectedDate}
            />
            <AlertModal
                visible={unacceptedModalVisible}
                onCancel={() => setUnacceptedModalVisible(false)}
                onConfirm={async () => {
                    try {
                        const { error } = await supabase
                            .from("Listings")
                            .update({ accepted_by: null, accepted: false, selected_date: null })
                            .eq("listing_id", item.listing_id);

                        if (error) {
                            Alert.alert("Error", error.message);
                        } else {
                            Alert.alert("Success", "Task unaccepted successfully.");
                            navigation.goBack(); // Go back to Accepted Listing screen
                        }
                    } catch (err) {
                        Alert.alert("Error", "An unexpected error has occurred.");
                    } finally {
                        setUnacceptedModalVisible(false);
                    }
                }}
                alertText="Are you sure you want to un-accept this task on the following day?"
                confirmOption="Undo Accept"
                selectedDate={selectedDate}
            />
        </View>
    )
}

export default ItemDetails

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },

    scrollArea: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 80
    },

    imageContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#eee',
        position: 'relative', 
    },

    image: {
        flex: 1,
        resizeMode: "contain",
        width: '100%',
        height: 200,
        color: '#333'
    },

    descriptionContainer: {
        flex: 4, 
        padding: 10,
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    price: {
        color: 'green'
    },

    description: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    accept: {
        height: '10%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingBottom: 10
    },
    carouselContainer: {
        flex: 1,
        backgroundColor: '#eee',
    },

    carouselImage: {
        width: 360,
        height: 330,
        resizeMode: 'contain',
        marginHorizontal: 5,
        alignSelf: 'center'
    },

    pagination: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },

    activeDot: {
        backgroundColor: 'white',
    }
});

