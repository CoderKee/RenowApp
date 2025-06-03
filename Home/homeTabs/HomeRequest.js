import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/ItemCard';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';
import { supabase } from '../../server/supabase';

const PAGE_SIZE = 5;

const HomeRequest = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async (pageNumber) => {
    if (loading || noMoreData) return;
    setLoading(true);

    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('Listings')
      .select('*')
      .eq('request', true)
      .eq('accepted', false)
      .eq('completed', false)
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const renderItem = ({ item }) => <ItemCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
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
      />
    </SafeAreaView>
  );
}

export default HomeRequest

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
})