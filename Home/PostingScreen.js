import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomDescriptionInput from './components/CustomDescriptionInput';
import CustomTitleInput from './components/CustomTitleInput';
import CustomPriceInput from './components/CustomPriceInput';
import CustomButton from './components/CustomButton';
import { supabase } from '../server/supabase.js';

const PostingScreen = ({username, navigation}) => {
  const[error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [serviceType, setServiceType] = useState('Cleaning');

  const addImage = () => {
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  const postAsRequest = async () => {
    setError("")
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

    
    const { data, error } = await supabase
            .from('Listings')
            .insert([{ user_id: user.user_id, title, description, price, type: serviceType, request: true}])
    
    if (error) {
      setError("Error creating listing.");
    } else {
      navigation.navigate('Listing');
      setError("");
      setTitle('')
      setDescription('')
      setPrice('')
      setServiceType('Cleaning')
    }
  };

  const postAsService = async () => {
    setError("")
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

    
    const { data, error } = await supabase
            .from('Listings')
            .insert([{ user_id: user.user_id, title, description, price, type: serviceType, request: false}])
    
    if (error) {
      setError("Error creating listing.");
    } else {
      navigation.navigate('Listing');
      setError("");
      setTitle('')
      setDescription('')
      setPrice('')
      setServiceType('Cleaning')
    }
  };

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
      <CustomTitleInput placeholder='Enter Title' value={title} setValue={setTitle}/>

      <Text style={styles.label}>Description</Text>
      <CustomDescriptionInput placeholder='Enter description' 
                    value={description} 
                    setValue={setDescription}/>


      <Text style={styles.label}>Price</Text>
      <CustomPriceInput placeholder='Enter price' value={price} setValue={setPrice}/>

      <Text style={styles.label}>Type of Service</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={serviceType}
          onValueChange={(itemValue) => setServiceType(itemValue)}
        >
          <Picker.Item label="Cleaning" value="Cleaning" />
          <Picker.Item label="Installation" value="Installation" />
          <Picker.Item label="Renovation" value="Renovation" />
          <Picker.Item label="Repairs" value="Repairs" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      {error !== "" && (
        <Text style={{color: 'red', marginTop: 20, marginBottom: -20}}>
          {error}
        </Text>
      )}
      <View style={styles.buttonRow}>
        <CustomButton text="Post as Request" onPress={postAsRequest} color='darkblue' />
        <View style={{ width: 10 }} />
        <CustomButton text="Post as Service" onPress={postAsService} color='darkgreen' />
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
    color: 'maroon'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
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
