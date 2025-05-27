import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomDescriptionInput from './components/CustomDescriptionInput';
import CustomTitleInput from './components/CustomTitleInput';
import CustomPriceInput from './components/CustomPriceInput';
import CustomButton from './components/CustomButton';
import { supabase } from '../server/supabase.js';
import { useUser } from './globalContext/UserContext.js';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';


const PostingScreen = ({ route, navigation }) => {
  const {username} = useUser();
  const {item} = route?.params || {};
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('')
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

  ///////////////////////////Functions demarcation////////////////////////////////////

  const addImage = async () => {
    if (images.length >= 3) {
      setImageError("You can only upload up to 3 images.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setImageError("Permission to access media library is required!");
      return;
    }

    let uploads = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1], 
      base64: true
    });

    if (!uploads.canceled) {
      const uri = uploads.assets[0].uri;
      setImages([...images, uri]);
      setImageError("");
    }
  };


  const renderImage = ({ item, index }) => (
    <View style={{ position: 'relative', marginRight: 10 }}>
      <Image source={{ uri: item }} style={styles.imageThumbnail} />
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: -5,
          width: 20, 
          height: 20,
          backgroundColor: 'white',
          borderRadius: 10, 
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setImages(images.filter((_, i) => i !== index));
        }}
      >
        <Text style={{ color: 'red', fontSize:  13, fontWeight: 'bold'}}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const uploadImage = async (uri, index) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const buffer = decode(base64Image);

      const extension = uri.split('.').pop();
      const fileName = `image_${Date.now()}_${index}.${extension || 'jpg'}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg', 
          upsert: true,
        });

      if (error) {
        console.log("Error uploading:", error);
        return null;
      }

      //console.log("Uploaded file path:", data.path);
      return data.path;
    } catch (err) {
      //console.log("Error uploading:", err);
      return null;
    }
  };

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

    const uploads = [];

    for (let i = 0; i < images.length; i++) { //for image upload
      //console.log(1)
      const path = await uploadImage(images[i], i);
      //console.log(path)
      if (path) uploads.push(path);
    }
    //console.log(uploads)

    const info = {
      user_id: user.user_id,
      title,
      description,
      price,
      type: serviceType,
      request: postType === 'Request' ? true : false,
      created_at: new Date().toISOString(),
      images: uploads,
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
      setImages([]);
      navigation.setParams({ item: undefined });
      navigation.navigate('Listing',
        {screen: 'My Listing'}
      );
    }
  };

  ///////////////////////////Functions demarcation////////////////////////////////////

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.label}>
        Upload Images <Text style={{ fontWeight: 'normal', color: '#666' }}>({images.length}/3)</Text>
      </Text>
      
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

      {imageError !== "" && (
        <Text style={{ color: 'red'}}>{imageError}</Text>
      )}

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
        style={[styles.dropdown, { zIndex: 2 }]}
        dropDownContainerStyle={[styles.dropdownContainer, { zIndex: 2 }]}
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
        style={[styles.dropdown, { zIndex: 1 }]}
        dropDownContainerStyle={[styles.dropdownContainer, { zIndex: 1 }]}
        listMode="SCROLLVIEW"
      />

      <View style={styles.buttonRow}>
        <CustomButton
          text={item ? "Update" : "Post"}
          onPress={post}
          color="maroon"
        />
        
      </View>
    </ScrollView>
  );

  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
