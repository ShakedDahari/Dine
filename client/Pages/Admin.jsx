import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { ContextPage } from '../Context/ContextProvider';

export default function Admin(props) {

    const { users, restaurants, LoadRestaurants, deleteUser, deleteRestaurant } = useContext(ContextPage);
    const [usersListVisible, setUsersListVisible] = useState(false);
    const [restaurantListVisible, setRestaurantListVisible] = useState(false);

    useEffect(() => {
      LoadRestaurants();
    }, []);
    
  const handleEditUser = (id) => {
    // Handle edit action for the user with the specified id
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDeleteUser = (id) => {
    // Handle delete action for the user with the specified id
    console.log(`Delete user with ID: ${id}`);
    // show a confirmation alert before deleting the user
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteUser(id) },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteRestaurant = (id) => {
    // Handle delete action for the user with the specified id
    console.log(`Delete restaurant with ID: ${id}`);
    // show a confirmation alert before deleting the user
    Alert.alert(
      'Delete Restaurant',
      'Are you sure you want to delete this restaurant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRestaurant(id) },
      ],
      { cancelable: true }
    );
  };

  const handleShowUsers = () => {
    setRestaurantListVisible(false);
    setUsersListVisible(true);
  }

  const handleShowRestaurants = () => {
    setUsersListVisible(false);
    setRestaurantListVisible(true);
  }


  const renderUserItem = ({ item }) => {
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
      <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25 }} />

      <View style={{ flex: 1 }}>
        <Text>{item.email}</Text>
        <View style={styles.column}>
          <Text>{item.username}</Text>
        </View>
        <View style={styles.column}>
          <Text>{item.phone}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleEditUser(item._id)}>
        <Text style={{ color: 'blue', marginRight: 10 }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  )};

  const renderRestaurantItem = ({ item }) => {
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
      {/* <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25 }} /> */}

      <View style={{ flex: 1 }}>
        <Text>{item.name}</Text>
        <View style={styles.column}>
          <Text>{item.location}</Text>
        </View>
        <View style={styles.column}>
          <Text>{item.foodType}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleEditUser(item._id)}>
        <Text style={{ color: 'blue', marginRight: 10 }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteRestaurant(item._id)}>
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
    )};

  return (
    <View style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 0.5 }}>
        <View style={styles.iconCon}>
          <Image source={require("../assets/icon.png")} style={styles.icon}/>
          <Text style={styles.text}>DineInTime</Text>
        </View>
        <View style={styles.page}>
            <TouchableOpacity onPress={handleShowUsers}>
                <Text style={styles.head}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShowRestaurants}>
                <Text style={styles.head}>Restaurants</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        <View style={{ flex: 2.5, paddingHorizontal: 16, paddingTop: 16 }}>
          <View>
      {usersListVisible && ( 
        <FlatList
          data={users}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          ListEmptyComponent={() => <Text>No users found</Text>}
        />
      )}
      {restaurantListVisible && (
        <FlatList
          data={restaurants}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={renderRestaurantItem}
          ListEmptyComponent={() => <Text>No restaurants found</Text>}
        />
      )}
    </View>
    </View>
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
    page: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
    head: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 15,
        textAlign: 'center',
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    columnHeader: {
        fontWeight: 'bold',
        marginRight: 0,
    },
});