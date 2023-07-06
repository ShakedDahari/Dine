import { View, Text, StyleSheet, ScrollView, Image, TextInput, Modal, TouchableOpacity, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { ContextPage } from '../Context/ContextProvider';
import { useState } from 'react';

export default function Order(props) {

    const { setFoodType, diners, setDiners, isLoading, updateSeats, filteredRestaurants } = useContext(ContextPage);
    const [searchInput, setSearchInput] = useState('');

    const filtered = filteredRestaurants.filter((restaurant) =>
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
                updateSeats(id, seatType, numDiners);
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
        <View style={styles.iconCon}>
          <Image source={require("../assets/icon.png")} style={styles.icon} />
          <Text style={styles.textLogo}>DineInTime</Text>
        </View>
        <View style={{flex: 1.5}}>
            <Text style={styles.text}>
              Sorry, no restaurants match your search.
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleReset}>
              <Text style={styles.title}>Back</Text>
            </TouchableOpacity>
        </View>
          </View>
        ) : (
        <View style={styles.container}>
        <View style={styles.iconCon}>
          <Image source={require("../assets/icon.png")} style={styles.icon} />
          <Text style={styles.textLogo}>DineInTime</Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            style={styles.input}
            placeholder="Search restaurants"
            onChangeText={setSearchInput}
            value={searchInput}
          />
        </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.restaurantContainer}>
                <Text style={styles.name}>{item.name}</Text>
                {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
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
      backgroundColor: "#94B285",
      width: "100%",
      height: "100%",
    },
    icon: {
      width: 100,
      height: 100,
      alignSelf: "center",
    },
    iconCon: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    inputCon: {
      backgroundColor: "#D9D9D9",
      borderRadius: 10,
      margin: 20,
      padding: 20,
      height: 60,
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
    textLogo: {
      alignSelf: "center",
      color: "#D9D9D9",
      fontSize: 30,
      fontFamily: "sans-serif-condensed",
      fontWeight: 700,
    },
      restaurantContainer: {
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
        color: '#D9D9D9',
        fontSize: 18,
    },
    btn: {
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        width: "55%",
        backgroundColor: "#B0B0B0",
        borderColor: "#838383",
        borderWidth: 3,
        margin: 10,
      },
      title: {
        alignSelf: "center",
        fontSize: 20,
      },
});