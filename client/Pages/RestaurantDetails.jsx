import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function RestaurantDetails({ route }) {

    const {restaurant} = route.params;

  return (
    <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
        <View style={styles.upCon}>
            <Text style={styles.header}>{restaurant.name}</Text>
            <View style={{flexDirection: 'row', margin: 5}}> 
                <MaterialIcons name={'location-on'} style={styles.material} />
                <Text style={styles.font}>{restaurant.address}, {restaurant.location}</Text>
            </View>
            <View style={{flexDirection: 'row', margin: 5}}> 
                <MaterialIcons name={'call'} style={styles.material} />
                <Text style={styles.font}>{restaurant.phone}</Text>
            </View>
            <View style={{flexDirection: 'row', margin: 5}}> 
                <MaterialIcons name={'mail'} style={styles.material} />
                <Text style={styles.font}>{restaurant.email}</Text>
            </View>
        </View>
        <View>
            <Text>Menu: </Text>
        </View>
        </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
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
    },
    upCon: {
        marginHorizontal: 30,
    },
    image: {
        width: "90%",
        height: 200,
        alignSelf: 'center',
        borderRadius: 5,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'eb-garamond',
        padding: 15,
        color: '#90b2ac',
    },
    font: {
        fontSize: 20,
        fontFamily: 'eb-garamond-italic',
    },
    material: {
        fontSize: 25,
        textAlignVertical: 'center',
        paddingHorizontal: 10,
    }
});