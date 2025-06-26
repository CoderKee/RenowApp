import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { supabase } from '../../server/supabase';
import { useUser } from '../globalContext/UserContext';
import AlertModal from '../components/AlertModal';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import Calendar from '../components/Calendar';
import dayjs from 'dayjs';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import ItemReceipt from '../profileTabs/ItemReceipt';

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
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);

    const insets = useSafeAreaInsets();

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
        if (item.accepted && item.accepted_by && !item.completed) {
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
                        ? item.accepted && posterUsername === username ? 'maroon'
                        : item.accepted || posterUsername === username || selectedDate === null
                            ? '#997570'
                            : 'maroon'
                        : item.accepted && posterUsername === username ? '#001B5B'
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
    
    //Change 'Write a Review' to review.written ? 'Review Written' : 'Write a Review'
    const textReturn = () => {
        if (item.accepted) {
            return posterUsername === username ? "Mark as completed" : "Accepted";
        }
        if (posterUsername === username) return "Cannot accept your own listing";
        if (item.completed) return "Write a Review";
        return selectedDate === null ? "Please Select Date" : "Accept";
    };

    const handleComplete = () => {
        setConfirmVisible(true);
    }

    const handleReview = () => {
    }

    const completion = item.completed;
    
    function formatDate(timeStamp) {
        const date = new Date(timeStamp);
        return date.toLocaleDateString('en-GB', dateFormat);
    }

    const onScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / 370);
        setCurrentIndex(index);
    };

    const accepted = item.accepted;
    return (
        <SafeAreaView style={styles.container}>
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
                {!completion && (
                    <>
                        {accepted && (
                            <Text style={{ textAlign: 'flex-start', fontSize: 18, color: 'black', fontWeight: 'bold' }}>
                                This listing has been accepted by {item.accepted_by}
                            </Text>
                        )}

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

                                    <View style={styles.pagination}>
                                        {item.images.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.dot,
                                                    currentIndex === index ? styles.activeDot : null,
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
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                            <Text style={styles.font}>Listed By {posterUsername}</Text>
                            <Text style={styles.font}>On {formatDate(item.created_at)}</Text>
                            <Text style={styles.description}>Description</Text>
                            <Text style={styles.font}>{item.description}</Text>
                        </View>

                        <View style={{ marginVertical: 20 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8, justifyContent: 'center' }}>
                                Available Dates
                            </Text>
                            <Calendar
                                availableDates={
                                item.accepted && item.selected_date
                                    ? [item.selected_date] // Only highlight the accepted date
                                    : availableDates
                                }
                                selectedDate={
                                item.accepted && item.selected_date
                                    ? item.selected_date
                                    : selectedDate
                                }
                                onSelectDate={
                                item.accepted
                                    ? () => {} // Disable selection if accepted
                                    : setSelectedDate
                                }
                            />
                            {item.accepted && item.selected_date && (
                                <Text style={{ marginTop: 10, color: '#4A90E2' }}>
                                Selected: {dayjs(item.selected_date).format('dddd, D MMMM YYYY')}
                                </Text>
                            )}
                            {!item.accepted && selectedDate && (
                                <Text style={{ marginTop: 10, color: '#4A90E2' }}>
                                Selected: {dayjs(selectedDate).format('dddd, D MMMM YYYY')}
                                </Text>
                            )}
                        </View>
                    </>
                )}
                {completion && (
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                            <Image 
                                source={require("../../assets/Renow.png")} 
                                style={{ width: 100, height: 100}}
                                resizeMode='contain'
                            />
                            <Text style={{ flex: 1, textAlign: 'left', fontSize: 28, color: 'black', fontWeight: 'bold', marginLeft: 10 }}>
                                Proof of Completion
                            </Text>
                        </View>
                        <Text style={{ textAlign: 'flex-start', fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 20 }}>Listing title: {item.title}</Text>
                        <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>Price: ${item.price}</Text>
                        <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginTop: 10}}>Listing description:</Text>
                        <View style={{
                            height: 300,
                            alignContent: 'center',
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: 'gray',
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                        }}>
                        <Text style={styles.font}>{item.description}</Text>
                        </View>
                        
                        <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>Service received by: {item.request ? posterUsername : item.accepted_by}</Text>
                        <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>Service provided by: {item.request ? item.accepted_by : posterUsername}</Text>
                        
                        <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>
                            Completed on {formatDate(item.completed_on)}
                        </Text>
                    </View>
                )}
            </ScrollView>
                
            <View style={styles.accept}>
                <CustomButton 
                    text={textReturn()}
                    color={ styleColour }
                    onPress={ (
                        item.completed ? handleReview : item.accepted && posterUsername === username ? handleComplete
                        : item.accepted || selectedDate === null || posterUsername === username ? null : acceptTask) 
                    }
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
            <AlertModal
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onConfirm={async () => {
                    try {
                        const {data, error} = await supabase
                            .from("Listings")
                            .update({ completed: true, completed_on: new Date() })
                            .eq("listing_id", item.listing_id)

                        if (error) {
                            Alert.alert("Error", error.message);
                        } else {
                            Alert.alert("Success", "Task is marked as completed.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            navigation.navigate("CompletedListing");
                                        }
                                    }
                                ]
                            );
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "An unexpected error has occurred.");
                    } finally {
                        setConfirmVisible(false);
                    }
                }}
                alertText="Are you sure you want to mark as completed?"
                confirmOption="Confirm"
            />
        </SafeAreaView>
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
    font: {
        color: 'black',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
    },
    price: {
        color: 'green'
    },
    font: {
        color: 'black',
    },
    description: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },

    accept: {
        minHeight: '10%',
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

