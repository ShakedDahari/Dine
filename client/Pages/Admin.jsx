import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { ContextPage } from '../Context/ContextProvider';
import { MaterialIcons } from '@expo/vector-icons';

export default function Admin(props) {

    const { users, restaurants, LoadRestaurants, deleteUser, deleteRestaurant, changeApprovedRestaurant, LoadUsers, sendEmail } = useContext(ContextPage);
    const [usersListVisible, setUsersListVisible] = useState(false);
    const [restaurantListVisible, setRestaurantListVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('all');

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

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleShowUsers = () => {
    setRestaurantListVisible(false);
    setUsersListVisible(true);
  }

  const handleShowRestaurants = () => {
    setUsersListVisible(false);
    setRestaurantListVisible(true);
  }

  const handleApprovedRestaurant = (id, email, name) => {
    console.log(`Add restaurant with ID: ${id}`);
    // show a confirmation alert before approving the restaurant
    console.log(id, email, name);
    Alert.alert(
      'Add Restaurant',
      'Are you sure you want to add this restaurant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', style: 'destructive', onPress: () => {
        if (id && email && name) {
          changeApprovedRestaurant(id);
          sendEmail(email, name);
         } 
        },
       }
      ],
      { cancelable: true }
    );
  }

  const renderUserItem = ({ item }) => {
    LoadUsers();
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
      <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }} />

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
        <MaterialIcons name="delete" size={40} color="red" />
      </TouchableOpacity>
    </View>
  )};


  const renderRestaurantItem = ({ item }) => {
    LoadRestaurants();
    if (selectedOption === 'all' && item.approved === true) { 
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
      <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }} />

      <View style={{ flex: 1 }}>
        <Text>{item.name}</Text>
        <View style={styles.column}>
          <Text>{item.location}</Text>
        </View>
        <View style={styles.column}>
          <Text>{item.foodType}</Text>
        </View>
      </View>

      {/* <TouchableOpacity onPress={() => handleApprovedRestaurant(item._id)}>
      <Text></Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => handleDeleteRestaurant(item._id)}>
        <MaterialIcons name="delete" size={40} color="red" />
      </TouchableOpacity>
    </View>
    )} else {
      if (selectedOption === 'pending' && item.approved === false) {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }} />
    
          <View style={{ flex: 1 }}>
            <Text>{item.name}</Text>
            <View style={styles.column}>
              <Text>{item.location}</Text>
            </View>
            <View style={styles.column}>
              <Text>{item.foodType}</Text>
            </View>
          </View>
    
          <TouchableOpacity onPress={() => handleApprovedRestaurant(item._id, item.email, item.name)}>
          <MaterialIcons name="add" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteRestaurant(item._id)}>
            <MaterialIcons name="delete" size={40} color="red" />
          </TouchableOpacity>
        </View>
        )
      }
    };
  }

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
        <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity style={[styles.optionButton, selectedOption === 'all' && styles.selectedOption]}
          onPress={() => handleSelectOption('all')}><Text>All</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, selectedOption === 'pending' && styles.selectedOption]}
          onPress={() => handleSelectOption('pending')}><Text>Requests</Text></TouchableOpacity>
        </View>
        <FlatList
          data={restaurants}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={renderRestaurantItem}
          ListEmptyComponent={() => <Text>No restaurants found</Text>}
        />
        </View>
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
    optionButton: {
      flex: 0.5,
      maxWidth: 100,
      alignItems: 'center',
      padding: 10,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    selectedOption: {
      backgroundColor: '#B0B0B0',
    },
});