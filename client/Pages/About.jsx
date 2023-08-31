import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';

export default function About() {
  return (
    <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
            </View>
            <View>
                <Text style={styles.heading}>Welcome to DineInTime - your ultimate dining companion!
                Whether you're a food enthusiast, a social diner, or someone seeking culinary adventures, 
                DineInTime is designed to redefine your dining experience.</Text>
               <Text style={styles.header}>Discover Amazing Restaurants</Text>
                <Text style={styles.description}>
                Explore a diverse range of restaurants, cafes, and eateries near you or in any location you desire. 
                From casual diners to upscale dining establishments, our app brings you an extensive collection of culinary destinations to choose from.
                </Text>
                <Text style={styles.header}>Effortless Reservations</Text>
                <Text style={styles.description}>
                Bid farewell to long waiting times! With DineInTime, reserving a table at your preferred restaurant is a breeze. 
                Avoid the hassle and uncertainty - book a table in advance and enjoy a seamless dining experience.
                </Text>
                <Text style={styles.header}>Real-Time Availability</Text>
                <Text style={styles.description}>
                Want to dine at a specific time? Check real-time availability and select the perfect dining slot that fits your schedule. 
                Whether it's a special occasion or a spontaneous outing, DineInTime keeps you informed.
                </Text>
                <Text style={styles.header}>Preview Menus Beforehand</Text>
                <Text style={styles.description}>
                Make informed choices by exploring restaurant menus in advance. 
                Browse through delectable dishes, chef's specials, and more, ensuring you know exactly what to expect before you arrive.
                </Text>
                <Text style={styles.header}>Ratings and Reviews</Text>
                <Text style={styles.description}>
                Read authentic reviews and ratings from fellow diners to guide your dining decisions. 
                Share your experiences and contribute to our community of food enthusiasts.
                </Text>
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
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
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'eb-garamond',
        margin: 30,
        width: '90%',
    },
    header: {
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'eb-garamond',
        marginBottom: 10,
        width: '80%',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'eb-garamond',
        marginBottom: 20,
        width: '75%',
        alignSelf: 'center',
    },
});