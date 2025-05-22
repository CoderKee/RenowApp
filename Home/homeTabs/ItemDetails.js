import React, { useState, useEffect } from 'react'
import CustomButton from '../components/CustomButton';
import { supabase } from '../../server/supabase';
import { useUser } from '../globalContext/UserContext';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    Image,
    Alert 
} from 'react-native'

const ItemDetails = ({ route }) => {
    const { item } = route.params;
    const { username } = useUser();
     const [posterUsername, setPosterUsername] = useState('');

     useEffect(() => {
        async function fetchPosterUserName() {
            if (!item.user_id) {
                return;
            }

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
        }
        fetchPosterUserName();
    }, [item]);

  
    const styleColour = item.request 
                        ? item.accepted || posterUsername === username
                            ? '#997570'
                            : 'maroon'
                        : item.accepted || posterUsername === username
                            ? '#7393B3'
                            : '#001B5B';

    const dateFormat = {day: 'numeric', month: 'long', year: 'numeric'};

    const acceptTask = async () => {
        Alert.alert(
            "Confirm Task Acceptance",
            "Do you want to accept this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        console.log("Acceptance Cancelled")
                    },
                },
                {
                    text: "Accept",
                    onPress: async () => {
                        
                        try {
                            const {data, error} = await supabase
                            .from("Listings")
                            .update({ accepted_by: username, accepted: true })
                            .eq("listing_id", item.listing_id)

                            if (error) {
                                Alert.alert("Error", error.message);
                            } else {
                                Alert.alert("Success", "Task accepted successfully.");
                                // Navigate to accepted Listing and refresh everything
                            }

                        } catch (err) {
                            console.error(err);
                            Alert.alert("Error", "An unexpected error has occurred.");
                        }
                    },
                }
            ]
        )
    };

    const unAcceptTask = () => {};

    function formatDate(timeStamp) {
        const date = new Date(timeStamp);
        return date.toLocaleDateString('en-GB', dateFormat);
    }

  return (
    <View style={styles.container}>
      <ScrollView 
      contentContainerStyle={styles.contentContainer}
      styles={styles.scrollArea}
      >
        <View
        style={styles.imageContainer}
        >
            <Image
            // remember to change the pathing
            source={ require('../../assets/image.png') }
            style={styles.image}
            />
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