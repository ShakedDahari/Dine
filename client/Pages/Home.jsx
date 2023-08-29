import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { ContextPage } from "../Context/ContextProvider";
import { Button, TextInput, HelperText, RadioButton  } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Slider } from '@react-native-assets/slider';


export default function Home(props) {

  const { restaurants, location, setLocation, errorMsg, setErrorMsg, foodType, setFoodType, diners, setDiners, foodListVisible, filteredRestaurants, setFilteredRestaurants, 
    setFoodListVisible, dinersListVisible, setDinersListVisible, foodTypes, dinersList, findRestaurants, nearbyRestaurants, setIsLoading } = useContext(ContextPage);
    const [pressed, setPressed] = useState(false);
    const [userLocation, setUserLocation] = useState();
    const [isLocationLoad, setIsLocationLoad] = useState(false);
    const [newLocation, setNewLocation] = useState();
    const [chosenRange, setChosenRange] = useState(5);
    const [searchType, setSearchType] = useState('city');
    
    const cities = require('../utils/cities.json');
    
    useEffect(() => {
      (async () => {
        try {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      //let heading = await Location.getHeadingAsync({});
      setUserLocation(location.coords);
      let reverse = await Location.reverseGeocodeAsync(location.coords, { language: 'en' });
      console.log(reverse);
      await locationToCity(reverse);
      
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);
  
  const locationToCity = async (reverse) => {
    let l;
    if (reverse && reverse[0].city) {
      
      let cityName = reverse[0].city;
      l = cities.find((c)=>cityName===c.english_name)?.english_name;  //?.=setting l to the english name of the city
      if (l === undefined) {
        l = cities.find((c) => c.name === cityName)?.english_name;
      }
      setLocation(l);        
      
    } else {
      // Handle the case when the city is not available
      let userLatitude = location.coords.latitude; // User's latitude
      let userLongitude = location.coords.longitude; // User's longitude
      
      let closestCity = null;
      let shortestDistance = Infinity;
      
      cities.forEach((city) => {
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          city.latt,
          city.long
          );
          
          if (distance < shortestDistance) {
            shortestDistance = distance;
            closestCity = city.english_name;
          }
        });
        
        setLocation(closestCity);
      }
  }

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  // Function to calculate the distance between two points using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;
    return distance;
  }

  // Function to convert degrees to radians
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  
  let text = "Searching for Location";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    //console.log(location);
    if (typeof location === "string") {
      text = location;
    } else {
      text = JSON.stringify(location);
    }
  }

  const handleMap = () => {
    if (isLocationLoad) {
      setIsLocationLoad(false);
    } else {
      setIsLocationLoad(true);
    }
  }

  const saveLocation = async () => {
      if (newLocation) {
        let reverse = await Location.reverseGeocodeAsync(newLocation);
        await locationToCity(reverse);
      } 
      setIsLocationLoad(false);
  }

  const resetLocation = async () => {
    setNewLocation(''); // Clear the new location
    let reverse = await Location.reverseGeocodeAsync(userLocation, { language: 'en' });
    await locationToCity(reverse);
  }

  const findNearbyRestaurants = async () => {
    const nearbyRestaurants = await Promise.all(
      filteredRestaurants.map(async (restaurant) => {
        if (restaurant.location) {
          const reverse = await Location.reverseGeocodeAsync(restaurant.location);
          const distance = calculateDistance(
            newLocation ? newLocation.latitude : userLocation.latitude,
            newLocation ? newLocation.longitude : userLocation.longitude,
            reverse[0].latitude,
            reverse[0].longitude
          );
          return distance <= chosenRange ? restaurant : null;
        }
      })
    );
     // Filter out null values (restaurants that are not within the chosen range)
     if (nearbyRestaurants) {
       const validNearbyRestaurants = nearbyRestaurants.filter((restaurant) => restaurant !== null);
       setFilteredRestaurants(validNearbyRestaurants);
     }
  }

  const handleFind = () => {
    console.log(location, foodType, diners);
    if (location && foodType && diners) {
      if (searchType === 'city') {
        findRestaurants(location, foodType, diners);
      } else {
        nearbyRestaurants(foodType, diners);
        findNearbyRestaurants();
      }
        setIsLoading(true);
        props.navigation.navigate("Order");
    } 
    // else {
    //     alert('Invalid Error');
    // }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <View style={styles.iconCon}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>DineInTime</Text>
        </View>
      <Button style={{paddingTop: 10}} icon={() => <MaterialCommunityIcons name="map-search" size={50} color="#333" />} onPress={handleMap}></Button>
      {isLocationLoad && (
        <MapView
          style={{ width: '100%', height: 300 }}
          initialRegion={{
            latitude: userLocation ? userLocation.latitude : 0,
            longitude: userLocation ? userLocation.longitude : 0,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }} onPress={(e) => {         
            setNewLocation(e.nativeEvent.coordinate);
          }}>
          {userLocation && (
            <Marker coordinate={userLocation} title="You are here" />
          )}
          {newLocation && (
            <Marker coordinate={newLocation} title="New Location" pinColor="#aaccc6" />
          )}
          {userLocation && (
          <Circle
            center={newLocation ? newLocation : userLocation}
            radius={chosenRange * 1000} // Convert range to meters
            fillColor="rgba(90, 157, 255, 0.3)"
            strokeColor="rgba(90, 157, 255, 0.5)"
          />)}
        </MapView>    
      )}
      {isLocationLoad && (<View style={styles.rangeContainer}>
        <Text>Range: {chosenRange} km</Text>
        <Slider
          style={{ width: 200, height: 50 }}
          minimumValue={5}
          maximumValue={20}
          step={1}
          value={chosenRange}
          onValueChange={(value) => setChosenRange(value)}
        />
      </View>)}
      {isLocationLoad && (
      <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 10 }}>
        <Button mode="outlined" style={{ marginHorizontal: 5 }} onPress={saveLocation}>Save</Button>
        <Button mode="outlined" style={{ marginHorizontal: 5 }} onPress={resetLocation}>Reset</Button>
      </View>)}
        <View style={styles.inputCon}>
          <TextInput
            style={styles.outlinedInput2}
            mode="outlined"
            disabled="true"
            placeholder="Search By Location"
            onChangeText={setLocation}
            editable={false}
            value={text}
          />
           <HelperText style={styles.helperText} type="error" visible={!location}>
              Location not found
            </HelperText>
          <TouchableOpacity style={styles.outlinedInput1} onPress={() => setFoodListVisible(true)}>
            <Text style={{ fontSize: 14, color: '#1C1B1F', margin: 10 }}>{foodType || "Type of Food"}</Text>
          </TouchableOpacity>
            <HelperText style={styles.helperText} type="error" visible={!foodType}>
              Please select food type
            </HelperText>
          <Modal
            animationType="slide"
            transparent={true}
            visible={foodListVisible}
            onRequestClose={() => setFoodListVisible(false)}
          >
            <View style={styles.modal}>
              {foodTypes.map((item) => (
                <TouchableOpacity style={styles.modalTO}
                  key={item._id}
                  onPress={() => {
                    setFoodType(item.name);
                    setFoodListVisible(false);
                  }}
                >
                  <Text style={styles.modalItem}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <TouchableOpacity style={styles.outlinedInput1} onPress={() => setDinersListVisible(true)}>
            <Text style={{ fontSize: 14, color: '#1C1B1F', margin: 10 }}>{diners || "Diners Amount"}</Text>
          </TouchableOpacity>
            <HelperText style={styles.helperText} type="error" visible={!diners}>
              Please select diners
            </HelperText>
          <Modal
            animationType="slide"
            transparent={true}
            visible={dinersListVisible}
            onRequestClose={() => setDinersListVisible(false)}
          >
            <View style={styles.modal}>
              {dinersList.map((item) => (
                <TouchableOpacity
                  style={styles.modalTO}
                  key={item.key}
                  onPress={() => {
                    setDiners(item.value);
                    setDinersListVisible(false);
                  }}
                >
                  <Text style={styles.modalItem}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={(value) => setSearchType(value)}
              value={searchType}>
              <View style={styles.radioOption}>
                <RadioButton value="city" color="#90b2ac" />
                <Text style={styles.radioLabel}>Search by City</Text>
                <RadioButton value="nearest" color="#90b2ac" />
                <Text style={styles.radioLabel}>Search Nearest</Text>
              </View>
            </RadioButton.Group>
          </View>
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleFind}>
              <Button icon="store-search-outline" style={styles.btn} mode={pressed ? 'outlined' : 'contained'}><Text style={{fontFamily: 'eb-garamond', fontSize: 18}}>Find</Text></Button>
            </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    //backgroundColor: "#94B285",
    width: "100%",
    height: "100%",
  },
  iconCon: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: 'eb-garamond',
    fontWeight: 500,
  },
  inputCon: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    margin: 30,
    padding: 20,
    height: 380,
    justifyContent: "center",
  },
  outlinedInput1: {
    width: "75%",
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  outlinedInput2: {
    // margin: 5,
    width: "75%",
    alignSelf: 'center',
  },
  modal: {
    flex: 0.7,
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: "50%",
  },
  modalTO: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  modalItem: {
    fontSize: 14,
  },
  btn: {
    height: 50,
    alignSelf: "center",
    width: "75%",
    borderWidth: 2,
    borderColor: "#90b2ac",
    margin: 10,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
  },
  helperText: {
    marginTop: -5,
    width: "80%",
    alignSelf: 'center',        
  },
  rangeContainer: {
    padding: 10,
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'eb-garamond',
  },
});
