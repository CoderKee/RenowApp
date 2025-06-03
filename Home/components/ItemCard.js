import React from "react";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../server/supabase";
import { 
  View, 
  Text, 
  StyleSheet,
  Image 
} from "react-native";


const ItemCard = ({ item }) => {
  const navigation = useNavigation();
  const viewDetail = () => {
    navigation.navigate('ItemDetails', { item });
  }

  const headerColour = item.request ? 'maroon' : '#001B5B';

  const { data, error } = supabase
  .storage
  .from('images')
  .getPublicUrl(item.images[0]);

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.header, { backgroundColor: headerColour }]}>
        <Text 
          style={styles.headerText}
        >
          {item.type.toUpperCase()}
        </Text>
      </View>
      <View
        style={styles.lowerContainer}
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
          <View
           style={styles.details}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text 
              style={styles.description}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </View>
          <View
            style={styles.button}
          >
          <CustomButton 
            text="View" 
            color={headerColour}
            onPress={viewDetail}
          />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lowerContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1, // 1/3 of available width
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#eee',
  },
  descriptionContainer: {
    flex: 2, // 2/3 of available width
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal:5,
    fontSize: 25,
    color:'black'
  },
  price: {
    paddingHorizontal: 5,
    color: "green"
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: '100%',
    height: 100,
    color: '#333'
  },
  description: {
    padding: 5,
    fontSize: 16,
    color: 'black',
  },
  details: {
    
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default ItemCard;