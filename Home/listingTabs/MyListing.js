import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/EditableItemCard';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList,
  Button
} from 'react-native';
import { supabase } from '../../server/supabase';

const PAGE_SIZE = 5;

const MyListing = ({username, navigation}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [noMoreData, setNoMoreData] = useState(false);
  const [noData, setNoData] = useState(false);

  const handleDelete = (listing_id) => {
    setItems((prevItems) => prevItems.filter(item => item.listing_id !== listing_id));
  } ;

  const checkdata = async () => {
    const {data: userData, error: userError} = await supabase
      .from('Users')
      .select('user_id')
      .eq('username', username)
      .single()
    const userID = userData.user_id
    const { data, error } = await supabase
      .from('Listings')
      .select('*')
      .eq('user_id', userID);
    if (!data || data.length === 0) {
      setNoData(true)
    } else {
      setLoading(false)
      setNoMoreData(false)
      setNoData(false)
      fetchItems(0)
    }
  }

  const fetchItems = async (pageNumber) => {
    if (loading || noMoreData) return;
    setLoading(true);

    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const {data: userData, error: userError} = await supabase
      .from('Users')
      .select('user_id')
      .eq('username', username)
      .single()

    const userID = userData.user_id
    const { data, error } = await supabase
      .from('Listings')
      .select('*')
      .eq('user_id', userID)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching items:', error);
    } else if (data) {
      if (data.length < PAGE_SIZE) {
        setNoMoreData(true);
      }
      setItems((prevItems) => [...prevItems, ...data]);
      setPage(pageNumber + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkdata();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setItems([]);
      setPage(0);
      setLoading(true);
      setNoMoreData(false);
      setNoData(false);
      checkdata();
    }, [username])
);

  const handleLoadMore = () => {
    if (!loading && !noMoreData) {
      fetchItems(page);
    }
  };

  const renderItem = ({ item }) => (<ItemCard item={item} onDelete={handleDelete} />);

  return (
    <SafeAreaView style={styles.container}>
      {noData && <Text style={styles.text}>
        "No postings"
      </Text>}
      {!noData && 
      <FlatList
        data={items}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : null
        }
      />}
    </SafeAreaView>
  );
}

export default MyListing

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center'
  }
})