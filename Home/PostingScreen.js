import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomDescriptionInput from './components/CustomDescriptionInput';
import CustomTitleInput from './components/CustomTitleInput';
import CustomPriceInput from './components/CustomPriceInput';
import CustomButton from './components/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../server/supabase.js';
import { useUser } from './globalContext/UserContext.js';

const PostingScreen = ({ route, navigation }) => {
  const {username} = useUser();
  const {item} = route?.params || {};
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');


  const [open, setOpen] = useState(false);
  const [serviceType, setServiceType] = useState('Cleaning');
  const [items, setItems] = useState([
    { label: 'Cleaning', value: 'Cleaning' },
    { label: 'Installation', value: 'Installation' },
    { label: 'Renovation', value: 'Renovation' },
    { label: 'Repairs', value: 'Repairs' },
    { label: 'Others', value: 'Others' },
  ]);
  const [postType, setPostType] = useState('Request');
  const [postTypeOpen, setPostTypeOpen] = useState(false);
  const [postTypeItems, setPostTypeItems] = useState([
    { label: 'Request', value: 'Request' },
    { label: 'Service', value: 'Service' },
  ]);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setPrice(item.price?.toString() || '');
      setServiceType(item.type || 'Cleaning');
      setImages(item.images || []);
      setPostType(item.request ? 'Request' : 'Service')
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setServiceType('Cleaning');
      setImages([]);
      setPostType('Request')
    }
  }, [item]);

  const addImage = () => {

  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  const post = async () => {
    setError("");
    if (!title || !description || !price) {
      setError("Please fill in all text fields.");
      return;
    }

    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('user_id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      setError("User not found.");
      return;
    }

    const info = {
      user_id: user.user_id,
      title,
      description,
      price,
      type: serviceType,
      request: postType === 'Request' ? true : false,
      created_at: new Date().toISOString(),
    };

    let result;
    if (item && item.listing_id) {
      result = await supabase
        .from('Listings')
        .update(info)
        .eq('listing_id', item.listing_id);
    } else {
      result = await supabase
        .from('Listings')
        .insert([info]);
    }

    if (result.error) {
      setError("Error saving listing.");
    } else {
      setError("");
      setTitle('');
      setDescription('');
      setPrice('');
      setServiceType('Cleaning');
      navigation.setParams({ item: undefined });
      navigation.navigate('Listing',
        {screen: 'My Listing'}
      );
    }
  };

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
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
        /* [for listMode: Modal if there are multiple options in the future]
        modalProps={{
          animationType: 'fade',
          transparent: false,
        }}
        modalTitle="Select service type"
        modalAnimationType="slide"
        */
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
          text={item ? "Update" : "Post"}
          onPress={post}
          color="maroon"
        />
        
      </View>
    </KeyboardAwareScrollView>
  );
};

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
});

export default PostingScreen;
