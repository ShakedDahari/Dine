import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext } from 'react';
import { ContextPage } from '../Context/ContextProvider';

export default function Admin(props) {

    const { users, deleteUser } = useContext(ContextPage);

    
  const handleEditUser = (id) => {
    // Handle edit action for the user with the specified id
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDeleteUser = (id) => {
    // Handle delete action for the user with the specified id
    console.log(`Delete user with ID: ${id}`);
    // You can also show a confirmation alert before deleting the user
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

//   const deleteUserByID = async (id) => {
//     // try {
//     //   await axios.delete(`https://your-backend-api.com/api/users/${id}`); // Replace with your API endpoint
//     //   fetchUsers(); // Refresh the user list after deletion
//     // } catch (error) {
//     //   console.error('Error deleting user:', error);
//     // }
//   };

  const renderUserItem = ({ item }) => (
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
  );

  return (
    <View style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 0.5 }}>
        <View style={styles.iconCon}>
          <Image source={require("../assets/icon.png")} style={styles.icon}/>
          <Text style={styles.text}>DineInTime</Text>
        </View>
        <View style={styles.page}>
            <TouchableOpacity>
                <Text style={styles.head}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.head}>Businesses</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        <View style={{ flex: 2.5, paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={styles.columnHeader}>Email:</Text>
        <Text style={styles.columnHeader}>Name:</Text>
        <Text style={styles.columnHeader}>Phone:</Text>
      </View>
      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id} // Assuming the MongoDB document has an "_id" field
        renderItem={renderUserItem}
        ListEmptyComponent={() => <Text>No users found</Text>}
      />
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