import React, { useState } from "react";
import {supabase} from '../../server/supabase';
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import CustomButton from "./CustomButton";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import  AlertModal  from "./AlertModal"; 
import EditScreen from "./EditScreen";


const ItemCard = ({ item, onDelete }) => {
  const headerColour = item.request ? 'maroon' : '#001B5B';
  const navigation = useNavigation();
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {

    const { data, error } = await supabase
      .from('Listings')
      .delete()
      .eq('listing_id', item.listing_id);
    
    if (error) {
      console.error('Error deleting item:', error);
    } else {
      onDelete(item.listing_id);
      setModalVisible(false);
    }
    
  };

  const viewDetail = () => {
    navigation.navigate('ItemDetails', { item });
  }

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.header, { backgroundColor: headerColour }]}>
        <View style={[{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.headerText}>{item.type.toUpperCase()}</Text>
          <View style={[{flexDirection:'row'}]}>
            <TouchableOpacity onPress={() => navigation.navigate("EditScreen", {item: item})}>
              <MaterialIcons name="edit" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialIcons name="delete" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <View style={styles.imageContainer}> 
          <Image
            source={ require('../../assets/image.png') }
            style={styles.image}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.details}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
          <View style={styles.button}>
            <CustomButton 
              text="View" 
              color={headerColour} 
              onPress={viewDetail}
            />
          </View>
        </View>
      </View>

      <AlertModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDelete}
        alertText="Are you sure you want to delete this item?"
        confirmOption="Delete"
      />
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
    flex: 2, 
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
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: 'maroon',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default ItemCard;