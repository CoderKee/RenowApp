import React, { useState, useEffect, useCallback, use } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/EditableItemCard';
import { useUser } from '../globalContext/UserContext';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList,
  
} from 'react-native';
import { supabase } from '../../server/supabase';

const PAGE_SIZE = 5;

const MyListing = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [noData, setNoData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (listing_id) => {
    setItems((prevItems) => prevItems.filter(item => item.listing_id !== listing_id));
  };

  const { username } = useUser();

  const fetchItems = async (pageNumber, reset = false) => {
    if (loading || (noMoreData && !reset)) return;
    setLoading(true);

    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('Listings')
      .select('*, Users!inner(username)')
      .eq('Users.username', username)
      .eq('accepted', false)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching items:', error);
    } else if (data) {
      if (reset) {
        setItems(data);
      } else {
        if (pageNumber === 0) { //check pageNumber === 0 to prevent duplicates from appending
        setItems(data); 
        } else {
        setItems((prevItems) => [...prevItems, ...data]); 
      }
      }
      setNoData(data.length === 0 && pageNumber === 0);
      setNoMoreData(data.length < PAGE_SIZE);
      setPage(pageNumber + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(0);
  }, []);

  // Manual and auto refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setNoMoreData(false);
    setPage(0);
    await fetchItems(0, true);
    setRefreshing(false);
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const handleLoadMore = () => {
    if (!loading && !noMoreData) {
      fetchItems(page);
    }
  };

  // this is EditableItemCard
  const renderItem = ({ item }) => (<ItemCard item={item} onDelete={handleDelete} />);

  return (
    <SafeAreaView style={styles.container}>
      {noData && <Text style={styles.text}>No postings</Text>}
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
        refreshing={refreshing}
        onRefresh={handleRefresh}
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