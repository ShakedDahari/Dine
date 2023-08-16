import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { ContextPage } from '../Context/ContextProvider';

export default function Reviews({ restaurant, userType }) {

    const { loginUser, restaurantReviews, LoadRestaurantReviews, addReview } = useContext(ContextPage);
    ///const [reviews, setReviews] = useState([]);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [ratingError, setRatingError] = useState(true);
    const [descriptionError, setDescriptionError] = useState(true);

    useEffect(() => {
        if (restaurant) {
          LoadRestaurantReviews(restaurant._id);
        }
      }, [restaurant, restaurantReviews]);

    const checkInputsValidation = async () => {
        if (rating === 0) {
            setRatingError(true);
        } else {
            setRatingError(false);
        }

        if (!description.trim()) {
            setDescriptionError(true);
        } else {
            setDescriptionError(false);
        }
    }

  const handleAddReview = async () => {

    await checkInputsValidation();
    
    const newReview = {
        restaurant: restaurant._id,
        username: loginUser.username,
        rating: rating,
        description: description,
    };
    
    if (!ratingError && !descriptionError) {
        const reviewAdded = await addReview(newReview.restaurant, newReview.username, newReview.rating, newReview.description);
        //setReviews([...reviews, reviewAdded]);
        console.log(reviewAdded);
        setIsAddingReview(false);
        setRating(0);
        setDescription('');
    }
  };

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <View>
        {userType !== 'restaurantOwner' && (
            <Button mode='outlined' style={styles.btn} onPress={() => setIsAddingReview(true)}>Add Review</Button>
        )}
      {restaurantReviews && restaurantReviews.map((review, index) => (
        <View key={index} style={styles.review}>
          <Text style={styles.reviewDescription}>{review.user}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((starNumber) => (
              <MaterialIcons
                key={starNumber}
                name={starNumber <= review.rating ? 'star' : 'star-border'}
                size={24}
                color={starNumber <= review.rating ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>
          <Text style={styles.reviewDescription}>{review.description}</Text>
          <Text style={styles.reviewDescription}>{review.createdAt}</Text>
        </View>
      ))}

      <Modal visible={isAddingReview} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.text}>Add Review</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((starNumber) => (
              <TouchableOpacity
                key={starNumber}
                onPress={() => handleStarPress(starNumber)}
                style={styles.starButton}
              >
                <MaterialIcons
                  name={starNumber <= rating ? 'star' : 'star-border'}
                  size={30}
                  color={starNumber <= rating ? '#90b2ac' : '#ccc'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <HelperText style={styles.helperText} type="error" visible={ratingError}>
            Please select a rating
          </HelperText>
          <TextInput
            mode="outlined"
            label="Description"
            onChangeText={setDescription}
            value={description}
            style={styles.outlinedInput}
          />
        <HelperText style={styles.helperText} type="error" visible={descriptionError}>
            Please provide a description
        </HelperText>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button mode='outlined' style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={() => handleAddReview()}>Add</Button>
          <Button mode='outlined' style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={() => setIsAddingReview(false)}>Cancel</Button>
        </View>
        </View>
      </Modal>
    </View>
  );
}

const styles =  StyleSheet.create({
  review: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewDescription: {
    fontSize: 16,
  },
  text: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: 'eb-garamond',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 180,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    elevation: 15,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starButton: {
    padding: 5,
  },
  outlinedInput: {
    width: "75%",
    alignSelf: 'center',
    minHeight: 80,
  },
  btn: {
    height: 50,
    alignSelf: "center",
    width: "75%",
    borderWidth: 2,
    margin: 10,
    },
helperText: {
    marginTop: -5,
    width: "80%",
    alignSelf: 'center',        
  },
});
