import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button, TextInput, HelperText, ActivityIndicator } from 'react-native-paper';
import { ContextPage } from '../Context/ContextProvider';
import WebView from 'react-native-webview';

export default function Reviews({ restaurant, userType }) {

    const { rating, setRating, description, setDescription, loginUser, restaurantReviews, LoadRestaurantReviews, loadingReviews, setLoadingReviews, addReview, editReview, deleteReview } = useContext(ContextPage);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [ratingError, setRatingError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState();
    const reviewsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (restaurant) {
            //LoadRestaurantReviews(restaurant._id);    
            fetchReviewsData();                          
        }
      }, [restaurant]);


      const fetchReviewsData = async () => {
        try {
            setLoadingReviews(true);
            setCurrentPage(1);
            await LoadRestaurantReviews(restaurant._id);
        } catch (error) {
            // Handle any error that might occur during loading reviews
            console.error('Error loading reviews:', error);
        }  finally {
            setLoadingReviews(false); // Ensure loading state is set to false whether successful or not
        }
      }

      const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
      };
    
      const startIndex = (currentPage - 1) * reviewsPerPage;
      const endIndex = startIndex + reviewsPerPage;
      const paginatedReviews = restaurantReviews.slice(startIndex, endIndex);

    const checkInputsValidation = async () => {
        if (rating === 0) {
            setRatingError(true);
        } else {
            setRatingError(false);
        }

        if (description === '') {
            setDescriptionError(true);
        } else {
            setDescriptionError(false);
        }
    }

    // Function to handle canceling the edit modal
  const handleCancelEdit = () => {
    if (isAddingReview) {
      setIsAddingReview(false);
    } else {
      // Close the edit modal
      setIsEditingReview(false);
    }
  };

  const handleAddReview = async () => {

    await checkInputsValidation();
    
        const newReview = {
            restaurant: restaurant._id,
            username: loginUser.username,
            rating: rating,
            description: description,
        };
        
        if (restaurant._id && loginUser.username && rating && description) {
            setIsAddingReview(false);         
            const reviewAdded = await addReview(newReview.restaurant, newReview.username, newReview.rating, newReview.description);
            await fetchReviewsData();
            console.log(reviewAdded);
            setRating(0);
            setDescription('');
        }
  };


  const handleEditReview = async (review) => {
    // Handle edit action for the user with the specified id
    console.log(`Edit review with ID: ${review._id}`);
    setIsEditingReview(true);
    setReviewToEdit(review);
    setRating(review.rating);
    setRatingError(false);
    setDescription(review.description);
    setDescriptionError(false);
  };

  const saveEditReview = async () => {
    console.log(reviewToEdit);

    await checkInputsValidation();

    if (restaurant._id && reviewToEdit.user && rating && description) {
        setIsEditingReview(false);
        
        const reviewEdit = await editReview(restaurant._id, reviewToEdit._id, reviewToEdit.user, rating, description);
        await fetchReviewsData();
        console.log(reviewEdit);
        setRating(0);
        setDescription('');
    }
  }

  const handleDeleteReview = (id, reviewId) => {
    console.log(`Delete review with ID: ${reviewId}`);
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteReview(id, reviewId);
          fetchReviewsData(); 
        } },
      ],
      { cancelable: true }
    );
  };

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const renderChart = () => {
    const ratingCounts = [0, 0, 0, 0, 0]; // Initialize an array to count ratings from 1 to 5

        // Count the ratings
        restaurantReviews.forEach(review => {
          ratingCounts[review.rating - 1]++; // Increment the count for the corresponding rating
        });        
   
    const totalReviews = restaurantReviews.length;
    const totalRatings = restaurantReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / totalReviews;

    const generateStarIcons = (averageRating) => {
        const fullStars = Math.floor(averageRating);
        const emptyStars = 5 - fullStars;
        const starIcons = Array(fullStars).fill('★').concat(Array(emptyStars).fill('☆')).join('');
        return starIcons;
    };

    const ratingPercentages = [
        (ratingCounts[4] / totalReviews) * 100,
        (ratingCounts[3] / totalReviews) * 100,
        (ratingCounts[2] / totalReviews) * 100,
        (ratingCounts[1] / totalReviews) * 100,
        (ratingCounts[0] / totalReviews) * 100,
      ];
 
    const chartConfig = {
        type: 'bar',
        data: {
            labels: ['5', '4', '3', '2', '1'],
            datasets: [
              {
                label: 'Number of Reviews',
                data: ratingPercentages,
                backgroundColor: '#aaccc6',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 20,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                stacked: true,
                max: 100,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 40,
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
            },
          },
    };
  
    const chartHTML = `
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body style="display: flex; flex-direction: row; align-items: center; text-align: center;" >
      <div style="width: 95%;">
        <canvas id="reviewChart"></canvas>
      </div>
      <div>
        <p style="font-size: 80px; margin: 0;">${averageRating.toFixed(1)}</p>
        <p style="font-size: 50px; color: #aaccc6; margin: 0;">${generateStarIcons(averageRating)}</p>
        <p style="font-size: 40px; margin-top: 10px;">${totalReviews} Reviews</p>
      </div>
      <script>
        const ctx = document.getElementById('reviewChart').getContext('2d');
        new Chart(ctx, ${JSON.stringify(chartConfig)});
      </script>
    </body>
  </html>
    `;

    return (
      <View style={{ height: 200 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: chartHTML }}
          style={{ flex: 1, backgroundColor: '#ededed' }}
        />
      </View>
    );
  };

  return (
    <View>
        {userType !== 'restaurantOwner' && (
            <Button icon="note-edit-outline" mode='outlined' style={styles.btn} onPress={() => setIsAddingReview(true)}>Add Review</Button>
        )}

    {loadingReviews ? (
        <ActivityIndicator size={100} color="#D9D9D9" />
    ) : restaurantReviews && restaurantReviews.length > 0 ? (
        <>
        {renderChart()}
        {paginatedReviews.map((review, index) => (
            <View key={index} style={styles.review}>
            <Text style={styles.reviewDescription}>{review.user}</Text>
            <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((starNumber) => (
                <MaterialIcons
                    key={starNumber}
                    name={starNumber <= review.rating ? 'star' : 'star-border'}
                    size={24}
                    color={starNumber <= review.rating ? '#90b2ac' : '#ccc'}
                />
                ))}
            </View>
            <Text style={styles.reviewDescription}>{review.description}</Text>
            <Text style={styles.reviewDescription}>{review.createdAt}</Text>
            {loginUser && loginUser.username === review.user || userType === 'adminUser' ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => handleEditReview(review)}>
                    <MaterialIcons name="edit" size={40} color="#90b2ac" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteReview(restaurant._id, review._id)}>
                    <MaterialIcons name="delete" size={40} color="red" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
        ))}
         <View style={styles.pagination}>
            <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1}>
              <MaterialCommunityIcons name="arrow-left-circle-outline" size={40} color={currentPage === 1 ? '#ccc' : '#90b2ac'} />
            </TouchableOpacity>
            <Text style={styles.paginationText}>{currentPage}</Text>
            <TouchableOpacity onPress={handleNextPage} disabled={endIndex >= restaurantReviews.length}>
              <MaterialCommunityIcons name="arrow-right-circle-outline" size={40} color={endIndex >= restaurantReviews.length ? '#ccc' : '#90b2ac'} />
            </TouchableOpacity>
          </View>
        </>
    ) : (
        <Text style={styles.notFoundText}>No Reviews Available</Text>
    )}

      <Modal visible={isAddingReview || isEditingReview} transparent={true} animationType="slide" onRequestClose={handleCancelEdit}>
        <View style={styles.modalContainer}>
        {isAddingReview ? (<Text style={styles.text}>Add Review</Text> ) : (
            <Text style={styles.text}>Edit Review</Text>
        )}
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
            {isAddingReview ? (
                <Button mode='outlined' style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={handleAddReview}>Add</Button>
                ) : (
                <Button icon="content-save" mode='outlined' style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={saveEditReview}>Save</Button>)}
          <Button mode='outlined' style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={handleCancelEdit}>Cancel</Button>
        </View>
        </View>
      </Modal>
    </View>
  );
}

const styles =  StyleSheet.create({
  review: {
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#aaccc6',
    borderRadius: 10,
    padding: 20,
    margin: 10, 
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewDescription: {
    fontSize: 20,
    fontFamily: 'eb-garamond',
    margin: 5,
  },
  text: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: 'eb-garamond',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 150,
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
    width: "50%",
    borderWidth: 2,
    borderColor: "#90b2ac",
    margin: 10,
    },
helperText: {
    marginTop: -5,
    width: "80%",
    alignSelf: 'center',        
  },
  notFoundText: {
    alignSelf: 'center', 
    fontSize: 16, 
    fontFamily: 'eb-garamond-italic',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  paginationText: {
    fontSize: 25,
    marginHorizontal: 30,
  },
});
