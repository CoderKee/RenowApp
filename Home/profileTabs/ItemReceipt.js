import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../globalContext/UserContext';
import { supabase } from '../../server/supabase';
import CustomButton from '../components/CustomButton';
import ReviewModal from '../components/ReviewModal';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from 'react-native';

const ItemReceipt = ({ route, navigation }) => {
  const { item } = route.params;
  const [posterUsername, setPosterUsername] = useState('');
  const [reviewVisible, setReviewVisible] = useState(false);

  const fetchPosterUserName = useCallback(async () => {
      if (!item.user_id) return;
      const { data, error } = await supabase
          .from('Users')
          .select('username')
          .eq('user_id', item.user_id)
          .single();
      if (error) {
          console.error('Error fetching poster username', error);
      } else if (data) {
          setPosterUsername(data.username)
      }
  }, [item.user_id]);

  useEffect(() => {
      fetchPosterUserName();
  }, [fetchPosterUserName]);

  function formatDate(timeStamp) {
    const date = new Date(timeStamp);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Determine if review is written
  const written = posterUsername === item.accepted_by
    ? item.accept_reviewed
    : item.poster_reviewed;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <Image 
              source={require("../../assets/Renow.png")} 
              style={{ width: 100, height: 100}}
              resizeMode='contain'
            />
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 28, color: 'black', fontWeight: 'bold', marginLeft: 10 }}>
              Proof of Completion
            </Text>
          </View>
          <Text style={styles.title}>
            Listing title: {item.title}
          </Text>
          <Text style={styles.text}>
            Price: ${item.price}
          </Text>
          <Text style={styles.text}>
            Listing description:
          </Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.font}>{item.description}</Text>
          </View>
          <Text style={styles.text}>
            Service received by: {item.request ? posterUsername : item.accepted_by}
          </Text>
          <Text style={styles.text}>
            Service provided by: {item.request ? item.accepted_by : posterUsername}
          </Text>
          <Text style={styles.text}>
            Completed on {formatDate(item.completed_on)}
          </Text>
        </ScrollView>
        <View style={styles.accept}>
          <CustomButton
            text={written ? "Review Written" : "Write a Review"}
            color={written ? "gray" : "maroon"}
            onPress={written ? null : () => setReviewVisible(true)}
          />
        </View>
        <ReviewModal
          visible={reviewVisible}
          onClose={() => setReviewVisible(false)}
          item={item}
          posterUsername={posterUsername}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80
  },
  font: {
    color: 'black',
  },
  text : {
    textAlign: 'flex-start',
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  title: {
    textAlign: 'flex-start',
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 20
  },
  descriptionBox: {
    height: 300,
    alignContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  accept: {
    minHeight: '10%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 10
  }
});

export default ItemReceipt;