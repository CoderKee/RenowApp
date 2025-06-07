import React, { useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/ItemCard';
import FilterModal from '../components/FilterModal';
import { supabase } from '../../server/supabase';
import Icon from 'react-native-vector-icons/Feather';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList,
  TextInput,
  TouchableOpacity,
   
} from 'react-native';
import Vi from 'dayjs/locale/vi';

const PAGE_SIZE = 5;

const HomeService = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({ type: null, minPrice: null, maxPrice: null });

  const fetchItems = async (pageNumber, filters, searchText) => {
    if ((loading || noMoreData) && pageNumber > 0) return;
      setLoading(true);

      try {
        const from = pageNumber * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
          .from('Listings')
          .select('*')
          .eq('request', false)
          .eq('accepted', false)
          .eq('completed', false);

        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.minPrice != null) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice != null) {
          query = query.lte('price', filters.maxPrice);
        }
        if (searchText) {
          query = query.ilike('title', `%${searchText}%`);
        }

        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching items:', error);
        } else if (data) {
          if (data.length < PAGE_SIZE) {
            setNoMoreData(true);
          }
          if (pageNumber === 0) {
            setItems(data); // Replace items on first page
          } else {
            setItems((prevItems) => [...prevItems, ...data]);
          }
          setPage(pageNumber + 1);
        }
      } finally {
        setLoading(false);
  }
  };

  useEffect(() => {
    setItems([]);         // Clear previous items
    setPage(0);           // Reset page
    setNoMoreData(false); // Reset noMoreData
    fetchItems(0, filters, searchText);
  }, [filters, searchText]);

  const handleLoadMore = () => {
    if (!loading && !noMoreData) {
      fetchItems(page, filters, searchText);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setNoMoreData(false);
    setPage(0);
    setItems([]);
    await fetchItems(0, filters, searchText);
    setRefreshing(false);
  }, [filters, searchText]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const renderItem = ({ item }) => <ItemCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchFilterRow}>
        <View style={{ flex: 1, position: 'relative' }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 12,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                zIndex: 2,
              }}
              onPress={() => setSearchText('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="x-octagon" size={18} color="maroon" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="sliders" size={24} color="maroon" />
        </TouchableOpacity>
      </View>
      {!loading && items.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
          <Text style={{ color: 'black', fontSize: 20 }}>No Listing matches your search</Text>
        </View>
      )}
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
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </SafeAreaView>
  );
}

export default HomeService

const styles = StyleSheet.create({
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3E6E6',
  },
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