import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Alert, BackHandler } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';
import { Button, Modal, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

export default function RestaurantDetails({ route, navigation }) {

  const { userType, restaurant } = route.params;
  const { addItem, deleteItem, editItem } = useContext(ContextPage);

    // State variables for the new menu item details
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [menuItems, setMenuItems] = useState(restaurant.menu);

    // State variables for editing an existing item
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedItemId, setEditedItemId] = useState('');
  const [editedItemName, setEditedItemName] = useState('');
  const [editedItemPrice, setEditedItemPrice] = useState('');
  const [editedItemImage, setEditedItemImage] = useState('');

    useFocusEffect(
      React.useCallback(() => {
        const handleBackPress = () => {
          switch (userType) {
            case 'regularUser':
              navigation.navigate('Main'); 
              return true; // Prevent the default back press behavior
            case 'restaurantOwner':
              navigation.navigate('Login'); 
              return true;
            default:
              return false;
          }
        };
  
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress); // Cleanup: remove the event listener
        };
      }, [navigation, userType]) 
    );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
  });
    if (!result.canceled) {
        setNewItemImage(result.assets[0].uri);
  }
};

const handleAddItem = () => {
    setIsAddingItem(true);
  };

  // Function to handle adding the new menu item
  const handleSaveItem = () => {
    // Create a new item object with the captured details
    const newItem = {
      name: newItemName,
      price: parseFloat(newItemPrice),
      image: newItemImage,
    };

    if (newItemName && newItemPrice && newItemImage) {
      addItem(restaurant._id, newItem.name, newItem.price, newItem.image);
      setMenuItems([...menuItems, newItem]); // Update the state with the new item
    } else {
      alert('Invalid Error');
    }

    // Close the modal and reset the captured details
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
  };
  
  const handleEditItem = (id) => {
    // Handle edit action for the user with the specified id
    console.log(`Edit item with ID: ${id}`);
    const selectedItem = menuItems.find((item) => item._id === id);
    if (selectedItem) {
      setEditedItemId(id);
      setEditedItemName(selectedItem.name);
      setEditedItemPrice(selectedItem.price.toString());
      setEditedItemImage(selectedItem.image);
      setEditModalVisible(true);
    }
  };

   // Function to handle saving the edited item
   const handleSaveEdit = () => {
    // Create a new item object with the captured details
    const updateItem = {
      itemId: editedItemId,
      name: editedItemName,
      price: parseFloat(editedItemPrice),
      image: editedItemImage,
    };

    if (editedItemName && editedItemPrice && editedItemImage) {
      editItem(restaurant._id, updateItem.itemId, updateItem.name, updateItem.price, updateItem.image);
      // Update the state by replacing the old item with the edited item
      const updatedMenuItems = menuItems.map(item => {
        if (item._id === updateItem.itemId) {
          return updateItem;
        } else {
          return item;
        }
      });
      setMenuItems(updatedMenuItems);
    } else {
      alert('Invalid Error');
    }

    // Close the edit modal
    setEditModalVisible(false);
    setEditedItemId('');
    setEditedItemName('');
    setEditedItemPrice('');
    setEditedItemImage('');
  };

  // Function to handle canceling the edit modal
  const handleCancelEdit = () => {
    // Close the edit modal
    setEditModalVisible(false);
  };

  const handleDeleteItem = (id, itemId) => {
    // Handle delete action for the user with the specified id
    console.log(`Delete item with ID: ${itemId}`);
    // show a confirmation alert before deleting the user
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteItem(id, itemId);
          setMenuItems(menuItems.filter((item) => item._id !== itemId)); // Update the state by removing the deleted item
        }}
      ],
      { cancelable: true }
    );
  };

  const renderMenuItem = ({ item }) => {
    return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
      <Image source={{ uri: item?.image }} style={{ width: 70, height: 70, borderRadius: 15, margin: 15 }} />

      <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', marginHorizontal: 10 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[styles.itemName, {paddingLeft: 30}]}>{item.price.toFixed(2)} ₪</Text>
    { userType === 'restaurantOwner' && (
      <View style={{ flexDirection: 'row', marginLeft: 15 }}>
      <TouchableOpacity onPress={() => handleEditItem(item._id)}>
        <MaterialIcons name="edit" size={40} color="#90b2ac" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteItem(restaurant._id, item._id)}>
        <MaterialIcons name="delete" size={40} color="red" />
      </TouchableOpacity>
      </View>
      )}
      </View>
    </View>
  )};

  return (
    <View>
        {userType === 'regularUser' ? (
    <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{ flex: 1 }}>
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
            <Text style={styles.menu}>Menu</Text>
            <FlatList
                data={menuItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "column" }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                renderItem={renderMenuItem}
                ListEmptyComponent={() => <Text>No items found</Text>}
            />
        </View>
        </ScrollView>
  </View>
  ) : (
    <View style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{ flex: 1 }}>
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
        <Text style={styles.menu}>Menu</Text>
        <FlatList
          data={menuItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "column" }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
          renderItem={renderMenuItem}
          ListEmptyComponent={() => <Text>No items found</Text>}
        />
        <Button mode='outlined' style={styles.btn} onPress={handleAddItem}>Add Item</Button>
    </View>
    {/* <Modal visible={isAddingItem} transparent={true} animationType="slide">
        <View style={{backgroundColor: '#aaccc6', width: '50%', alignSelf: 'center', padding: 10, margin: 5}}>
          <TextInput
            mode="outlined" 
            label="Item Name"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <TextInput
            mode="outlined" 
            label="Item Price"
            value={newItemPrice}
            onChangeText={setNewItemPrice}
            keyboardType="numeric"
          />
           <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={pickImage}><MaterialIcons style={styles.imgBtn} name="add-photo-alternate" /></TouchableOpacity>
            </View>
            {newItemImage && <Image source={{ uri: newItemImage }} style={{ width: 100, height: 100, alignSelf:'center' }} />}
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Button mode='outlined' style={{backgroundColor: '#f0f0f0', margin: 5}}  onPress={handleSaveItem}>Save</Button>
            <Button mode='outlined' style={{backgroundColor: '#f0f0f0',  margin: 5}} onPress={() => setIsAddingItem(false)}>Cancel</Button>
          </View>
        </View>
      </Modal> */}
      <Modal visible={isAddingItem || editModalVisible} transparent={true} animationType="slide">
      <View style={{ backgroundColor: '#aaccc6', width: '50%', alignSelf: 'center', padding: 10, margin: 5 }}>
        <TextInput
          mode="outlined"
          label="Item Name"
          value={isAddingItem ? newItemName : editedItemName}
          onChangeText={isAddingItem ? setNewItemName : setEditedItemName}
        />
        <TextInput
          mode="outlined"
          label="Item Price"
          value={isAddingItem ? newItemPrice : editedItemPrice}
          onChangeText={isAddingItem ? setNewItemPrice : setEditedItemPrice}
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons style={styles.imgBtn} name="add-photo-alternate" />
          </TouchableOpacity>
        </View>
        {isAddingItem ? (
          newItemImage && <Image source={{ uri: newItemImage }} style={{ width: 100, height: 100, alignSelf: 'center' }} />
        ) : (
          editedItemImage && <Image source={{ uri: editedItemImage }} style={{ width: 100, height: 100, alignSelf: 'center' }} />
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            mode="outlined"
            style={{ backgroundColor: '#f0f0f0', margin: 5 }}
            onPress={isAddingItem ? handleSaveItem : handleSaveEdit}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            style={{ backgroundColor: '#f0f0f0', margin: 5 }}
            onPress={isAddingItem ? () => setIsAddingItem(false) : handleCancelEdit}
          >
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
    </ScrollView>
    </View>
  )}
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
    menu: {
      fontSize: 30,
      marginTop: 20,
      fontFamily: 'eb-garamond',
      alignSelf: 'center',
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
    },
    head: {
        fontSize: 20,
        fontFamily: 'eb-garamond',
        margin: 15,
        textAlign: 'center',
    },
    itemName: {
        fontFamily: 'eb-garamond-italic', 
        margin: 3, 
        fontSize: 24,
    },
    btn: {
        height: 50,
        alignSelf: "center",
        width: "75%",
        borderWidth: 2,
        margin: 10,
    },
    imgBtn: {
        fontSize: 50,
        alignSelf: "center",
        borderColor: "#B0B0B0",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
});