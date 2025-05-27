import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { supabase } from '../../server/supabase';
import { useUser } from '../globalContext/UserContext';
import { MaterialIcons } from '@expo/vector-icons'; 
import  AlertModal  from '../components/AlertModal';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    Image,
    Alert,
    RefreshControl,
    TouchableOpacity, 
    
} from 'react-native'
import { Icon } from '@rneui/themed';

const ItemDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const { username } = useUser();
    const [posterUsername, setPosterUsername] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [unacceptedModalVisible, setUnacceptedModalVisible] = useState(false);

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
                        ? item.accepted || posterUsername === username
                            ? '#997570'
                            : 'maroon'
                        : item.accepted || posterUsername === username
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

    const { data, error } = supabase
      .storage
      .from('images')
      .getPublicUrl(item.images[0]);

    return (
        <View style={styles.container}>
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
            <View
            style={styles.imageContainer}
            >
                {item.images.length > 0 ? (
                    <Image
                    source={{ uri: data.publicUrl }} // Display the first image
                    style={styles.image}
                    />
                ) : (
                    <Image
                    source={require('../../assets/image.png')} // Default image if no image uploaded
                    style={styles.image}
                    />
                )}
            </View>
            <View
            style={styles.descriptionContainer}
            >
                <Text style={styles.title}>{item.title.toUpperCase()}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text>Listed By {posterUsername}</Text>
                <Text>On {formatDate(item.created_at)}</Text>
                <Text style={styles.description}>Description</Text>
                <Text>{item.description}</Text>
            </View>
        </ScrollView>
        <View style={styles.accept}>
            <CustomButton 
                text={ posterUsername === username ? "Cannot Accept Your Own Listing"
                                                : item.accepted ? "Accepted" : "Accept" }
                color={ styleColour }
                onPress={ item.accepted || posterUsername === username ? null : acceptTask }
            />
        </View>
        <AlertModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={async () => {
                            
                            try {
                                const {data, error} = await supabase
                                .from("Listings")
                                .update({ accepted_by: username, accepted: true })
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
                alertText="Are you sure you want to accept this task?"
                confirmOption="Accept"
            />
            <AlertModal
            visible={unacceptedModalVisible}
            onCancel={() => setUnacceptedModalVisible(false)}
            onConfirm={async () => {
                            try {
                                const { error } = await supabase
                                    .from("Listings")
                                    .update({ accepted_by: null, accepted: false })
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
            alertText="Are you sure you want to un-accept this task?"
            confirmOption="Undo Accept"
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
        flex: 1, // 1/3 of available width
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#eee',
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
    }
})