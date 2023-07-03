import { View, Text, StyleSheet, ScrollView, Image, TextInput, Modal, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { ContextPage } from "../Context/ContextProvider";

export default function Home(props) {

  const { location, setLocation, errorMsg, setErrorMsg, foodType, setFoodType, diners, setDiners, foodListVisible, 
    setFoodListVisible, dinersListVisible, setDinersListVisible, foodTypes, dinersList, findRestaurants, LoadFoodTypes, setIsLoading } = useContext(ContextPage);

    const cities = require('../utils/cities.json');

  useEffect(() => {
    (async () => {
      try {

      //LoadFoodTypes();

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      let heading = await Location.getHeadingAsync({});
      let reverse = await Location.reverseGeocodeAsync(location.coords, { language: 'en' });
      console.log(reverse, 'reverse');

      let l;
      
      if (reverse && reverse[0].city) {
        
        let cityName = reverse[0].city;
        console.log(cityName);
        
        // l = await cities.find((c) => c.name === cityName)?.english_name;
        l = await cities.find((c)=>cityName===c.english_name)?.english_name  //?.=setting l to the english name of the city
        if(l === undefined) {
          l = await cities.find((c) => c.name === cityName)?.english_name;
        }
        console.log(l);
        setLocation(l);        
        
      } else {
        // Handle the case when the city is not available
        let userLatitude = location.coords.latitude; // User's latitude
        let userLongitude = location.coords.longitude; // User's longitude

        let closestCity = null;
        let shortestDistance = Infinity;

        await cities.forEach((city) => {
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
          
          console.log("Closest city:", closestCity);
          setLocation(closestCity);
        }
      } catch (error) {
          console.log(error.message);
      }
    })();
  }, []);


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

  
  let text = "Searching for Location..";
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

  const handleFind = () => {
    console.log(location, foodType, diners);
    if (location && foodType && diners) {
        findRestaurants(location, foodType, diners);
        setIsLoading(true);
        props.navigation.navigate("Order");
    } else {
        alert('Invalid Error');
    }
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
        <View style={styles.inputCon}>
          <TextInput
            style={styles.input}
            placeholder="Search By Location"
            onChangeText={setLocation}
            value={text}
          />
          <TouchableOpacity onPress={() => setFoodListVisible(true)}>
            <Text style={styles.input}>{foodType || "Type of Food"}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setDinersListVisible(true)}>
            <Text style={styles.input}>{diners || "Diners Amount"}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.btn} onPress={handleFind}>
              <Text style={styles.title}>Find</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "#94B285",
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
    color: "#D9D9D9",
    fontSize: 30,
    fontFamily: "sans-serif-condensed",
    fontWeight: 700,
  },
  inputCon: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    margin: 30,
    padding: 20,
    marginTop: 80,
    height: 300,
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
    justifyContent: "center",
    width: "75%",
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
