import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard';
import { useUser } from '../globalContext/UserContext';
import { supabase } from '../../server/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';


const PAGE_SIZE = 5;

const AcceptedListing = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [noData, setNoData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { username } = useUser();

  const fetchItems = async (pageNumber) => {
  if (loading || noMoreData) return;
  setLoading(true);

  const from = pageNumber * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Listings')
    .select('*')
    .eq('accepted_by', username)
    .order('created_at', { ascending: false })
    .range(from, to);

    if (error) {
      console.error('Error fetching items:', error);
    } else if (data) {
      if (data.length < PAGE_SIZE) {
        setNoMoreData(true);
      }
      if (pageNumber === 0) {
        setItems(data); 
      } else {
        setItems((prevItems) => [...prevItems, ...data]); 
      }
      setNoData(data.length === 0 && pageNumber === 0);
      setPage(pageNumber + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(0);
  }, []);

  const handleLoadMore = () => {
    if (!loading && !noMoreData) {
      fetchItems(page);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setNoMoreData(false);
    setPage(0);
    setItems([]);
    await fetchItems(0);
    setRefreshing(false);
  }, [username]);

  // auto refresh
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const renderItem = ({ item }) => <ItemCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      {noData && <Text style={styles.text}>No accepted listings</Text>}
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
          // manual refresh when user pulls down the list
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    </SafeAreaView>
  );
}

export default AcceptedListing;

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