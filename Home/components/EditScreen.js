import React, {useState, useEffect} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import CustomDescriptionInput from './CustomDescriptionInput';
import CustomTitleInput from './CustomTitleInput';
import CustomPriceInput from './CustomPriceInput';
import CustomButton from './CustomButton';
import { useUser } from '../globalContext/UserContext.js';
import { supabase } from '../../server/supabase.js';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  FlatList, 
  Image 
} from 'react-native';

const EditScreen = ({ route, navigation }) => {
  
  const { item } = route?.params || {};
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [postType, setPostType] = useState('Request');

  const [open, setOpen] = useState(false);
  const [serviceType, setServiceType] = useState(item.type || 'Cleaning');
  const [items, setItems] = useState([
    { label: 'Cleaning', value: 'Cleaning' },
    { label: 'Installation', value: 'Installation' },
    { label: 'Renovation', value: 'Renovation' },
    { label: 'Repairs', value: 'Repairs' },
    { label: 'Others', value: 'Others' },
  ]);
  const [postTypeOpen, setPostTypeOpen] = useState(false);
  const [postTypeItems, setPostTypeItems] = useState([
    { label: 'Request', value: 'Request' },
    { label: 'Service', value: 'Service' },
  ]);

  const { username } = useUser();

  // change this once image functionality is implemented
  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  const addImage = () => {

  };

  const updateListing = async () => {
    setError("");
    if (!title || !description || !price) {
      setError("Please fill in all text fields.");
      return;
    }
    const { data, error } = await supabase
      .from('Listings')
      .update({
        title: title,
        description: description,
        price: price,
        type: serviceType,
        request: postType === 'Request',
      })
      .eq('listing_id', item.listing_id);

    if (error) {
      console.error('Error updating listing:', error);
      setError("Error updating listing.");
    } else {
      console.log('Listing updated successfully:', data);
      navigation.goBack();
    }
    
  }

  return (
    
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Upload Images</Text>
      <FlatList
        horizontal
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImage}
        ListFooterComponent={
          <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
            <Text style={{ fontSize: 30, color: '#666' }}>＋</Text>
          </TouchableOpacity>
        }
      />

      <Text style={styles.label}>Title</Text>
      <CustomTitleInput placeholder="Enter Title" value={title} setValue={setTitle} />

      <Text style={styles.label}>Description</Text>
      <CustomDescriptionInput placeholder="Enter description" value={description} setValue={setDescription} />
      
      <Text style={styles.label}>Type of Service</Text>
      <DropDownPicker
        open={open}
        value={serviceType}
        items={items}
        setOpen={setOpen}
        setValue={setServiceType}
        setItems={setItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        
        listMode="SCROLLVIEW"  
      />
      <Text style={styles.label}>Price</Text>
      <CustomPriceInput placeholder="Enter price" value={price} setValue={setPrice} />

      {error !== "" && (
        <Text style={{ color: 'red', marginTop: 20, marginBottom: -20 }}>{error}</Text>
      )}

      <Text style={styles.label}>Post as</Text>
      <DropDownPicker
        open={postTypeOpen}
        value={postType}
        items={postTypeItems}
        setOpen={setPostTypeOpen}
        setValue={setPostType}
        setItems={setPostTypeItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listMode="SCROLLVIEW"
      />

      <View style={styles.buttonRow}>
        <CustomButton
          text="Update"
          onPress={updateListing}
          color="maroon"
        />
        
      </View>
    </ScrollView>
    
  )
}

export default EditScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
    zIndex: 1000,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'maroon',
  },
  dropdown: {
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1000,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
})