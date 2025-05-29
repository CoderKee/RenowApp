import React from "react";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { 
  View, 
  Text, 
  StyleSheet,
  Image 
} from "react-native";


const ItemCard = ({ item }) => {
  const headerColour = item.request ? 'maroon' : '#001B5B';

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
          <Image
            // replace this pathing when we have actual images
            source={ require('../../assets/image.png') }
            style={styles.image}
          />
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
          <CustomButton text="Accept" color={headerColour}/>
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
    flex: 1,
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
    fontSize: 25
  },
  price: {
    paddingHorizontal: 5,
    color: "green"
  },
  image: {
    resizeMode: "contain",
    width: '100%',
    height: 100,
    color: '#333'
  },
  description: {
    padding: 5,
    fontSize: 16,
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