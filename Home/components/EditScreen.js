import React, {useState, useEffect} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import CustomDescriptionInput from './CustomDescriptionInput';
import CustomTitleInput from './CustomTitleInput';
import CustomPriceInput from './CustomPriceInput';
import CustomButton from './CustomButton';
import LoadingScreen from './LoadingScreen.js';
import { useUser } from '../globalContext/UserContext.js';
import { supabase } from '../../server/supabase.js';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

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
  const [imageError, setImageError] = useState('')
  const [images, setImages] = useState(item?.images || []);
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [postType, setPostType] = useState('Request');
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState([]);

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
////////////////////////////////////FUNCTION DEMARCATION///////////////////////////////////////////
  // change this once image functionality is implemented
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
  
  const renderImage = ({ item, index }) => {

    const isLocal = item.startsWith('file://') || item.startsWith('data:');
    let imageSource;
    if (isLocal) {
      imageSource = { uri: item };
    } else {
      const { data, error: imageError } = supabase.storage.from('images').getPublicUrl(item);
      if (data?.publicUrl) {
        imageSource = { uri: data.publicUrl };
      } else {
        setImageError("Error fetching publicUrl for:", item, imageError);
      }
    }

    const handleDeleteImage = async () => {
      setImages(images.filter((_, i) => i !== index));
      setDeleted([...deleted, images[index]]);
      console.log(deleted)
    };

    return (
      <View style={{ position: 'relative', marginRight: 10 }}>
        <Image source={imageSource} style={styles.imageThumbnail} />
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
          onPress={handleDeleteImage}
        >
          <Text style={{ color: 'red', fontSize: 13, fontWeight: 'bold' }}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };


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
        //console.log("Error uploading:", error);
        return null;
      }

      //console.log("Uploaded file path:", data.path);
      return data.path;
    } catch (err) {
      //console.log("Error uploading:", err);
      return null;
    }
  };

const updateListing = async () => {
  setError("");
  if (!title || !description || !price) {
    setError("Please fill in all text fields.");
    return;
  }
  setLoading(true);
  const uploadedImagePaths = [];
  for (let i = 0; i < deleted.length; i++) {
    const isLocal = deleted[i].startsWith('file://') || deleted[i].startsWith('data:')
    if (!isLocal) {
        const { error } = await supabase.storage.from('images').remove([deleted[i]]);
        if (error) {         
        }
      }
  }
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (img.startsWith('file://') || img.startsWith('data:')) {
      const uploadedPath = await uploadImage(img, i);
      if (uploadedPath) {
        uploadedImagePaths.push(uploadedPath);
      } else {
        setLoading(false);
        setError("Failed to upload some images.");
        return;
      }
    } else {
      uploadedImagePaths.push(img);
    }
  }

  const { data, error } = await supabase
    .from('Listings')
    .update({
      title: title,
      description: description,
      price: price,
      type: serviceType,
      request: postType === 'Request',
      images: uploadedImagePaths, 
    })
    .eq('listing_id', item.listing_id);

  if (error) {
    //console.error('Error updating listing:', error);
    setLoading(false);
    setError("Error updating listing.");
  } else {
    //console.log('Listing updated successfully:', data);
    setLoading(false);
    navigation.goBack();
  }
};

////////////////////////////////////FUNCTION DEMARCATION///////////////////////////////////////////

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
      <LoadingScreen visible={loading} text={'Updating...'}/>
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