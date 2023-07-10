import { View, Text, Button, Modal, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { ContextPage } from '../Context/ContextProvider';
import { useEffect } from 'react';
import Charts from './Charts';


export default function Page1(props) {

  const { LoadFoodTypes, foodTypes, restaurants, LoadRestaurants } = useContext(ContextPage);
  const [selectedFoodType, setSelectedFoodType] = useState();
  
  useEffect(() => {
    LoadFoodTypes();
  }, []);
  
  const renderRestaurants = (foodType) => {
    LoadRestaurants();
    const filteredRestaurants = restaurants.filter((restaurant) => restaurant.foodType === foodType && restaurant.approved === true);
    return filteredRestaurants.map((restaurant) => (
      <View key={restaurant._id} style={styles.restaurantContainer}>
        <View style={{flex: 1, width: '100%', height: 100}}>
        <Image source={{ uri: restaurant.image }} style={styles.restImg} />
        </View>
        <View style={{flex: 1, height: 70, alignItems: 'center'}}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.address}>{restaurant.location}</Text>  
        </View>
      </View>
    ));
  }

  const getImageSource = (image) => {
    switch (image) {
      case '../assets/Asian.png':
        return require('../assets/Asian.png');
      case '../assets/Burgers.png':
        return require('../assets/Burgers.png');
      case '../assets/Cafe.png':
        return require('../assets/Cafe.png');
      case '../assets/Italian.png':
        return require('../assets/Italian.png');
      case '../assets/Pub.png':
        return require('../assets/Pub.png');
      case '../assets/Fish.png':
        return require('../assets/Fish.png');
      case '../assets/Meat.png':
        return require('../assets/Meat.png');
      case '../assets/Vegan.png':
        return require('../assets/Vegan.png');
      default:
        return require('../assets/icon.png'); // Provide a fallback image if the path is not found
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.name === selectedFoodType;
    const backgroundColor = isSelected ? '#838383' : '#D9D9D9';
    const color = isSelected ? 'white' : 'black';

    return (
      <View>
        <TouchableOpacity
          onPress={() => setSelectedFoodType(item.name)}
          style={[styles.foodList, {backgroundColor}]}
        >
          <Image source={getImageSource(item.image)} style={{ width: 60, height: 60 }} />
          <Text style={[styles.foodName, {color}]}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{flex: 1}}>
        <View style={styles.iconCon}>
          <Image source={require("../assets/icon.png")} style={styles.icon}/>
          <Text style={styles.text}>DineInTime</Text>
        </View>
        <TouchableOpacity>
            <Text style={styles.headline} onPress={() => props.navigation.navigate("Home")}>Search by Location</Text>
        </TouchableOpacity>
        <View>
            <Text style={styles.categories}>Categories</Text>
        </View>
        <View>
          <FlatList style={{flexDirection: "row"}}
            data = {foodTypes}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10, flexDirection: "row" }}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}/>
          {selectedFoodType && (
            <View>
              {renderRestaurants(selectedFoodType)}
            </View>
          )}
          <Charts />
        </View>
    </ScrollView>
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
  headline: {
    margin: 10,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    alignSelf: "center",
  },
  categories: {
    fontSize: 40,
    alignSelf: "center",
    padding: 5,
    fontWeight: "800",
  },
  foodList: {
    margin: 10,
    padding: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 40,
  },
  foodName: {
    alignSelf: "center",
    paddingTop: 10,
    fontSize: 15,
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
  restImg: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
});

