import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, TouchableWithoutFeedback } from 'react-native';
import React, { useContext } from 'react';
import { ContextPage } from '../Context/ContextProvider';
import { useState } from 'react';
import { Button, TextInput, HelperText } from 'react-native-paper';

export default function Order(props) {

    const { setFoodType, diners, setDiners, isLoading, updateSeats, filteredRestaurants, AddReservationRequest } = useContext(ContextPage);
    const [searchInput, setSearchInput] = useState('');
    const [pressed, setPressed] = useState(false);


    const handlePressIn = () => {
      setPressed(true);
    };
  
    const handlePressOut = () => {
      setPressed(false);
    };
    
    const handleNavigateToDetails = (restaurant) => {
      props.navigation.navigate('RestaurantDetails', { userType: 'orderUser', restaurant: restaurant });
    };

    const filtered = filteredRestaurants.filter((restaurant) =>
    restaurant.approved === true && 
    restaurant.name.toLowerCase().includes(searchInput.toLowerCase()));

    const handleReset = () => {
        setFoodType('');
        setDiners('');
        setSearchInput('');
        props.navigation.navigate("Home");
    }

    const handleSeatReservation = async (restaurant, seatType) => {
        let numDiners = await diners; // Number of diners for the reservation
        let id = await restaurant._id.toString();
        let name = await restaurant.name;
        let email = await restaurant.email;
        console.log(id, seatType, numDiners);
        Alert.alert(
          'Make Reservation',
          `Do you want to make a reservation for ${numDiners} persons at ${name} - ${seatType}?`,
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
               if (id && seatType && numDiners) { 
                AddReservationRequest(id, seatType, numDiners, email);
                props.navigation.navigate("Main");               
              };
              },
            },
          ]
        );      
    };  


  return (
    <View>
    {isLoading ? (
      <View style={styles.container}>
        <ActivityIndicator size={100} color="#D9D9D9" />
      </View>
    ) : (
      <>
        {filtered.length === 0 ? (
        <View style={styles.container}>
        <View>
          <Image source={require("../assets/icon.png")} style={styles.icon} />
          <Text style={styles.textLogo}>DineInTime</Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            style={styles.outlinedInput}
            mode='outlined'
            label="Search restaurants"
            onChangeText={setSearchInput}
            value={searchInput}
          />
        </View>
        <View style={{flex: 1.5}}>
            <Text style={styles.text}>
              Sorry, no restaurants match your search.
            </Text>
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleReset}>
              <Button icon="backspace-outline" style={styles.btn} mode={pressed ? 'outlined' : 'contained'}><Text style={{fontFamily: 'eb-garamond', fontSize: 18}}>Back</Text></Button>
            </TouchableWithoutFeedback>
        </View>
          </View>
        ) : (
        <View style={styles.container}>
        <View>
          <Image source={require("../assets/icon.png")} style={styles.icon} />
          <Text style={styles.textLogo}>DineInTime</Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            style={styles.outlinedInput}
            mode="outlined"        
            label="Search restaurants"
            onChangeText={setSearchInput}
            value={searchInput}
          />
        </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleNavigateToDetails(item)}>
              <View style={styles.restaurantContainer}>
                <View style={{flex: 1, width: '100%', height: 100}}>
                  <Image source={{ uri: item.image }} style={styles.restImg} />
                </View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.location}</Text>
                <Text style={styles.seatContainer}>
                  {item.locationSeats.inside > 0 && (
                    <TouchableOpacity  onPress={() => handleSeatReservation(item, 'inside')}>
                      <Text style={styles.seatText}>Inside</Text>
                    </TouchableOpacity>
                  )}
                  {item.locationSeats.outside > 0 && (
                    <TouchableOpacity  onPress={() => handleSeatReservation(item, 'outside')}>
                      <Text style={styles.seatText}>Outside</Text>
                    </TouchableOpacity>
                  )}
                  {item.locationSeats.bar > 0 && (
                    <TouchableOpacity  onPress={() => handleSeatReservation(item, 'bar')}>
                      <Text style={styles.seatText}>Bar</Text>
                    </TouchableOpacity>
                  )}
                </Text>
              </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
          </View>
        )}
      </>
    )}
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      //backgroundColor: "#94B285",
      width: "100%",
      height: "100%",
    },
    icon: {
      width: 100,
      height: 100,
      alignSelf: "center",
    },
    inputCon: {
      backgroundColor: "#D9D9D9",
      borderRadius: 10,
      margin: 20,
      padding: 20,
      height: 70,
      justifyContent: "center",
    },
    input: {
        height: 50,
        width: "75%",
        alignSelf: "center",
        verticalAlign: "middle",
        borderColor: "#B0B0B0",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
    outlinedInput: {
      margin: 5,
      width: "75%",
      alignSelf: 'center',
    },
    textLogo: {
      alignSelf: "center",
      fontSize: 18,
      fontFamily: 'eb-garamond',
      fontWeight: 500,
    },
      restaurantContainer: {
        flex: 2,
        width: '85%',
        alignSelf: 'center',   
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#838383',
        borderColor: '#B0B0B0',
        borderRadius: 10,
        padding: 5,
        margin: 20,
    },
      restaurantInfo: {
        flex: 1,
    },
      name: {
        fontSize: 25,
        color: '#D9D9D9',
        fontWeight: 'bold',
        marginBottom: 5,
    },
      address: {
        color: '#D9D9D9',
        fontStyle: 'italic',
        marginBottom: 5,
    },
     seatContainer: {
        borderRadius: 5,
    },
      seatText: {
        fontSize: 15,
        borderRadius: 5,
        padding: 15,
        margin: 10,
        backgroundColor: '#e6e6e6',
    },
      image: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
      listContent: {
        flexGrow: 1,
    },
    text: {
        alignSelf: "center",
        fontFamily: 'eb-garamond',
        fontSize: 18,
    },
    btn: {
      height: 50,
      alignSelf: "center",
      width: "75%",
      borderWidth: 2,
      margin: 10,
      },
      title: {
        alignSelf: "center",
        fontSize: 20,
      },
      restImg: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
      },
});