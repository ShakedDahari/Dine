import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { ContextPage } from '../Context/ContextProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

export default function Reservations({ restaurant }) {

    const { restaurantOrders, LoadRestaurantOrders, updateSeatsBack, fetchUserData, deleteOrder, changeApprovedOrder } = useContext(ContextPage);
    const [selectedOption, setSelectedOption] = useState('all');
    const [userDataMap, setUserDataMap] = useState({});
    const [loadingUserData, setLoadingUserData] = useState(true); 

    useEffect(() => {
        if (restaurant) {
            if (restaurant.orders) {
              LoadRestaurantOrders(restaurant._id);
              fetchUserDataForOrders();
            } else {
                setLoadingUserData(false); // Set loading state to false when orders is null
            }
        }
      }, [restaurant, restaurantOrders]);
    

      const fetchUserDataForOrders = async () => {
        const userDataForOrders = {};
        for (const order of restaurantOrders) {
          const userData = await fetchUserData(order.userId);
          userDataForOrders[order._id] = userData;
        }
        setUserDataMap(userDataForOrders);
        setLoadingUserData(false);
      };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
    };

  const handleDeleteOrder = (id, orderId) => {
    console.log(`Delete order with ID: ${orderId}`);
    // show a confirmation alert before deleting the order
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteOrder(id, orderId);
          await fetchUserDataForOrders(); // Fetch and update orders again
        }},
      ],
      { cancelable: true }
    );
  };

  const handleOrderDone = (id, orderId, diners, seatType) => {
    console.log(`Remove order with ID: ${orderId}`);
    // show a confirmation alert before deleting the order
    Alert.alert(
      'Remove Finished Order',
      'Are you sure you want to remove this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => { 
          await deleteOrder(id, orderId);
          await updateSeatsBack(id, seatType, diners);
          await fetchUserDataForOrders(); // Fetch and update orders again
        }}, 
      ],
      { cancelable: true }
    );
  };

  const handleApprovedOrder = async (id, orderId, email, seatType, diners) => {
    console.log(`Add order with ID: ${orderId}`);
    Alert.alert(
      'Approved Order',
      'Are you sure you want to approved this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', style: 'destructive', onPress: async () => { 
          await changeApprovedOrder(id, orderId, email, seatType, diners);
          await fetchUserDataForOrders(); // Fetch and update orders again
        },
       }
      ],
      { cancelable: true }
    );
  }

      const renderOrderItem = ({ item }) => {

        const userData = userDataMap[item._id] || {};

        if (selectedOption === 'all' && item.approved === true) { 
        return (
          <View style={styles.reservationContainer}>
          <View style={{flex: 1}}>
            <View style={styles.column}>
                <MaterialIcons name="email" size={30} />
                <Text style={styles.itemName}>{userData.email}</Text>
            </View>
            <View style={styles.column}>
                <MaterialIcons name="phone" size={30} />
                <Text style={styles.itemName}>{userData.phone}</Text>
            </View>
            <View style={styles.column}>
                <MaterialIcons name="person" size={30} />
                <Text style={styles.itemMore}>{item.diners}</Text>
            </View>
            <View style={styles.column}>
                <MaterialIcons name="event-seat" size={30} />
                <Text style={styles.itemName}>{item.seatType}</Text>
            </View>
            <View style={styles.column}>
                <MaterialIcons name="date-range" size={30} />
                <Text style={styles.itemMore}>{item.createdAt}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleOrderDone(restaurant._id, item._id, item.diners, item.seatType)}>
            <MaterialIcons name="delete" size={40} color="red" />
          </TouchableOpacity>
        </View>
        )} else {
          if (selectedOption === 'pending' && item.approved === false) {
            return (
                <View style={styles.reservationContainer}>
                <View style={{flex: 1}}>
                  <View style={styles.column}>
                      <MaterialIcons name="email" size={30} />
                      <Text style={styles.itemName}>{userData.email}</Text>
                  </View>
                  <View style={styles.column}>
                      <MaterialIcons name="phone" size={30} />
                      <Text style={styles.itemName}>{userData.phone}</Text>
                  </View>
                  <View style={styles.column}>
                      <MaterialIcons name="person" size={30} />
                      <Text style={styles.itemMore}>{item.diners}</Text>
                  </View>
                  <View style={styles.column}>
                      <MaterialIcons name="event-seat" size={30} />
                      <Text style={styles.itemName}>{item.seatType}</Text>
                  </View>
                  <View style={styles.column}>
                      <MaterialIcons name="date-range" size={30} />
                      <Text style={styles.itemMore}>{item.createdAt}</Text>
                  </View>
                </View>
              <TouchableOpacity onPress={() => handleApprovedOrder(restaurant._id, item._id, userData.email, item.seatType, item.diners)}>
              <MaterialIcons name="add" size={40} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteOrder(restaurant._id, item._id)}>
                <MaterialIcons name="delete" size={40} color="red" />
              </TouchableOpacity>
            </View>
            )
          }
        };
      }

  return (
    <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity style={[styles.optionButton, selectedOption === 'all' && styles.selectedOption]}
          onPress={() => handleSelectOption('all')}><Text>All</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, selectedOption === 'pending' && styles.selectedOption]}
          onPress={() => handleSelectOption('pending')}><Text>Requests</Text></TouchableOpacity>
        </View>
        {loadingUserData ? (
            <ActivityIndicator size={100} color="#D9D9D9"/> 
        ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <FlatList
            data={restaurantOrders}
            horizontal 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'column' }}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            ListEmptyComponent={() =><Text>No orders found</Text>}
            />
        </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    reservationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#aaccc6',
        borderRadius: 10,
        padding: 20,
        margin: 10, 
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
    column: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom: 5,
    },
    selectedOption: {
      backgroundColor: '#B0B0B0',
    },
    itemName: {
      fontFamily: 'eb-garamond', 
      margin: 3, 
      fontSize: 20,
    },
    itemMore: {
      fontFamily: 'eb-garamond-italic',
      paddingLeft: 3,
      fontSize: 20,
    },
});