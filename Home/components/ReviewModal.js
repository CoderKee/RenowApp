import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReviewInput from './ReviewInput';
import { useUser } from '../globalContext/UserContext';
import { supabase } from '../../server/supabase.js';

const ReviewModal = ({ visible, onClose, onReviewWritten, item, posterUsername }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const handleStarPress = (star) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    const info = {
            listing: item.listing_id,
            created_at: new Date().toISOString(),
            for: targetUsername,
            by: username,
            rating: rating,
            review: review,
        };
    
    const { error: error1 } = await supabase
        .from('Reviews')
        .insert([info]);
    
    let error2;
    if (username == posterUsername) {
        const { error: updateError } = await supabase
            .from("Listings")
            .update({ poster_reviewed: true })
            .eq("listing_id", item.listing_id);
        error2 = updateError;
    } else {
        const { error: updateError } = await supabase
            .from("Listings")
            .update({ accept_reviewed: true })
            .eq("listing_id", item.listing_id);
        error2 = updateError;
    }
    
    if (error1 || error2) {
        console.error('Error submitting review:', error1 || error2);
        return;
    }

    if (onReviewWritten) {
        onReviewWritten();
    }
    setRating(0);
    setReview("");
  };

  const handleCancel = () => {
    setRating(0);
    setReview("");
    onClose();
  };
  
  const {username} = useUser();
  const targetUsername = posterUsername == username ? item.accepted_by : posterUsername;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Writing a review for {targetUsername}</Text>

          <View style={styles.starsContainer}>
            {stars.map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Icon
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color="gold"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

            <ReviewInput value={review} setValue={setReview} placeholder="Write your review here..." charLimit={200} />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, styles.submit]}
              disabled={rating === 0} 
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

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
  },
  container: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: 'gray',
  },
  submit: {
    backgroundColor: 'maroon',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReviewModal;