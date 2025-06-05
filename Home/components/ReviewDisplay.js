import {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../server/supabase.js';
import dayjs from 'dayjs';

const ReviewDisplay = ({ visible, onClose, user }) =>{
    const [items, setItems] = useState([]);
    const [average, setAverage] = useState(0);
    
    useEffect(() => {
        if (!visible) return;

        const fetchItems = async () => {
            const { data, error } = await supabase
                .from('Reviews')
                .select('*')
                .eq('for', user);
            
            if (error) {
                console.error('Error fetching reviews:', error);
            } else {
                const ratings = data.map(item => item.rating);
                const avg = ratings.length > 0
                        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
                        : '0.0';
                setAverage(avg);
                setItems(data || []);
            }
        };
        fetchItems();
    }, [visible, user]);

    const renderItem = ({ item }) => (
        <View style={styles.reviewItem}>
        <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
            <Icon
                key={star}
                name={star <= item.rating ? 'star' : 'star-border'}
                size={20}
                color="#FFD700"
            />
            ))}
            <Text style={styles.dateText}>{dayjs(item.created_at).add(8, 'hour').format('DD MMM YYYY, hh:mm A')}</Text>
        </View>
        <Text style={styles.reviewText}>{item.review}</Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={styles.title}>{user}'s reviews</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.title}>{average}</Text>
                    <Icon name="star" size={20} color="#FFD700" style={{justifySelf:'center', marginLeft: 4}} />
                </View>
            </View>

            {items.length === 0 ? (
                <Text style={styles.noText}>No reviews yet.</Text>
            ) : (
                <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ maxHeight: 300 }}
                />
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginVertical: 40,
  },
  reviewItem: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 12,
    color: 'gray',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: 'maroon',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewDisplay;