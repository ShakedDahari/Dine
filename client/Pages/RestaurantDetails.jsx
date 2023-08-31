import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Alert, BackHandler, Linking, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ContextPage } from '../Context/ContextProvider';
import { Button, Modal, TextInput, RadioButton, HelperText  } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import Reservations from './Reservations';
import Reviews from './Reviews';

export default function RestaurantDetails({ route, navigation }) {

  const { userType, restaurant } = route.params;
  const { addItem, deleteItem, editItem, imgSrc, setImgSrc, isUploading, handleLocalImageUpload } = useContext(ContextPage);
  
  // State variables for the new menu item details
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

    // State variables for editing an existing item
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedItemId, setEditedItemId] = useState('');
  const [editedItemName, setEditedItemName] = useState('');
  const [editedItemPrice, setEditedItemPrice] = useState('');
  const [editedItemImage, setEditedItemImage] = useState('');
  const [editedItemCategory, setEditedItemCategory] = useState('');

  const [filterCategory, setFilterCategory] = useState('All'); 
  const categoryList = ['All', ...(menuItems ? new Set(menuItems.map(item => item.category)) : [])];
  const [restaurantLocation, setRestaurantLocation] = useState([]);

  
  // Update the menuItems state when the restaurant prop changes
  useEffect(() => {
    if (restaurant) {
      setMenuItems(restaurant.menu);
      fetchRestaurantData();
    }
  }, [restaurant]);

  const getFilteredCategories = () => {
    if (menuItems) {
      if (filterCategory === 'All') {
        return menuItems.filter(item => item.category !== undefined);
      } 
      return menuItems.filter(item => item.category === filterCategory); 
    } else {
      return null;
    }
  };

    useFocusEffect(
      React.useCallback(() => {
        const handleBackPress = () => {
          switch (userType) {
            case 'regularUser':
              navigation.navigate('Home'); 
              return true; // Prevent the default back press behavior
            case 'restaurantOwner':
              navigation.navigate('Login'); 
              return true;
            case 'orderUser':
              navigation.navigate('Order');
              return true; 
            case 'adminUser':
              navigation.navigate('Admin');
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


    const fetchRestaurantData = async () => {
      // Fetch restaurant data
      const location = await Location.geocodeAsync(restaurant.location);
      if (location) {
        setRestaurantLocation(location[0]);
      }
    };
    
    const handleCall = (phoneNumber) => {
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.canOpenURL(phoneUrl)
        .then((supported) => {
          if (!supported) {
            console.log(`Phone call not supported for number: ${phoneNumber}`);
          } else {
            return Linking.openURL(phoneUrl);
          }
        })
        .catch((error) => console.error('Error opening phone app:', error));
    };  
    
    const handleEmail = (emailAddress) => {
      const emailUrl = `mailto:${emailAddress}`;
      Linking.canOpenURL(emailUrl)
        .then((supported) => {
          if (!supported) {
            console.log(`Email not supported for address: ${emailAddress}`);
          } else {
            return Linking.openURL(emailUrl);
          }
        })
        .catch((error) => console.error('Error opening email app:', error));
    };    

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
  });
    if (!result.canceled) {
      await handleLocalImageUpload(result.assets[0].uri);
      // if (!isAddingItem) {
      //   // setEditedItemImage(result.assets[0].uri);
      //   // setImgSrc(result.assets[0].uri);
      // } else {
      //   // setNewItemImage(result.assets[0].uri);
      //   // setImgSrc(result.assets[0].uri);
      //   await handleLocalImageUpload(result.assets[0].uri);
      // }
    }
};

const handleAddItem = () => {
    setImgSrc('');
    setIsAddingItem(true);
};

  // Function to handle adding the new menu item
  const handleSaveItem = async () => {
    // Create a new item object with the captured details
    const newItem = {
      name: newItemName,
      price: parseFloat(newItemPrice),
      image: imgSrc,
      category: selectedCategory,
    };

    console.log(newItem);
    if (newItemName && newItemPrice && imgSrc && selectedCategory) {
      const itemAdded = await addItem(restaurant._id, newItem.name, newItem.price, newItem.image, newItem.category);
      if (menuItems === undefined) {
        // If menuItems is empty, create a new array with the newItem
        setMenuItems([itemAdded]);
      } else {
        // If menuItems already has items, spread the existing items and add the newItem
        setMenuItems([...menuItems, itemAdded]);
      }  
    } 
    // else {
    //   alert('Invalid Error');
    // }

    // Close the modal and reset the captured details
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemPrice('');
    setImgSrc('');
    setNewItemImage('');
    setSelectedCategory('');
  };
  
  const handleEditItem = (id) => {
    // Handle edit action for the user with the specified id
    console.log(`Edit item with ID: ${id}`);
    const selectedItem = menuItems.find((item) => item._id === id);
    if (selectedItem) {
      setEditedItemId(id);
      setEditedItemName(selectedItem.name);
      setEditedItemPrice(selectedItem.price.toString());
      setImgSrc(selectedItem.image);
      setEditedItemImage(selectedItem.image);
      setEditedItemCategory(selectedItem.category);
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
      image: imgSrc,
      category: editedItemCategory,
    };

    console.log(updateItem);

    if (editedItemId && editedItemName && editedItemPrice && imgSrc && editedItemCategory) {
      editItem(restaurant._id, updateItem.itemId, updateItem.name, updateItem.price, updateItem.image, updateItem.category);
      // Update the state by replacing the old item with the edited item
      setMenuItems((prevItems) => {
        return prevItems.map((item) => {
          if (item._id === updateItem.itemId) {
            return {
              ...item, // Keep the original properties
              name: updateItem.name,
              price: updateItem.price,
              image: updateItem.image,
              category: updateItem.category,
            };
          } else {
            return item;
          }
        });
      });
    } 
    // else {
    //   alert('Invalid Error');
    // }

    // Close the edit modal
    setEditModalVisible(false);
    setEditedItemId('');
    setEditedItemName('');
    setEditedItemPrice('');
    setImgSrc('');
    setEditedItemImage('');
    setEditedItemCategory('');
  };

  // Function to handle canceling the edit modal
  const handleCancelEdit = () => {
    if (isAddingItem) {
      setIsAddingItem(false);
    } else {
      // Close the edit modal
      setEditModalVisible(false);
    }
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

    // Custom sorting function for the categoryList
    const customCategorySorting = (categoryA, categoryB) => {
      // Define the order in which categories should appear
      const order = ['All', 'Appetizers', 'Add-ons', 'Main Dishes', 'Desserts', 'Beverages'];
      const indexA = order.indexOf(categoryA);
      const indexB = order.indexOf(categoryB);
  
      return indexA - indexB;
    };

  const renderMenuItem = ({ item }) => {
    return (
    <View key={item._id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
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


  const renderCategoryLink = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => setFilterCategory(item)}>
        <Text style={[styles.categoryLink, filterCategory === item && styles.activeLink]}>{item}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled" overScrollMode='never' style={{ flex: 1 }}>
        <Image source={require("../assets/icon.png")} style={styles.icon}/>
        <Text style={styles.text}>DineInTime</Text>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
    <View style={styles.upCon}>
        <Text style={styles.header}>{restaurant.name}</Text>
        <View style={{flexDirection: 'row', margin: 5}}> 
            <MaterialIcons name={'location-on'} style={styles.material} />
            <Text style={styles.font}>{restaurant.location}</Text>
        </View>
        <View style={{flexDirection: 'row', margin: 5}}> 
            <MaterialIcons name={'call'} style={styles.material} />
            <Text style={styles.font} onPress={() => handleCall(restaurant.phone)}>{restaurant.phone}</Text>
        </View>
        <View style={{flexDirection: 'row', margin: 5}}> 
            <MaterialIcons name={'mail'} style={styles.material} />
            <Text style={styles.font} onPress={() => handleEmail(restaurant.email)}>{restaurant.email}</Text>
        </View>
    </View> 
        {restaurantLocation && restaurantLocation.latitude && restaurantLocation.longitude  && (
        <MapView
          key={`${restaurantLocation.latitude}_${restaurantLocation.longitude}`}
          style={{ width: '100%', height: 200 }}
          initialRegion={{
            latitude: restaurantLocation ? restaurantLocation.latitude : 0,
            longitude: restaurantLocation ? restaurantLocation.longitude : 0,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }}>
        <Marker
            coordinate={restaurantLocation}
            title={restaurant.name}
        />
        </MapView>
        )}
    <View>
      <Text style={styles.menu}>Menu</Text>
      {categoryList.length > 1 ? (
        <FlatList
            horizontal
            data={categoryList.sort(customCategorySorting)}
            renderItem={renderCategoryLink}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.options}
        />
      ) : (
        <Text style={styles.notFoundText}>No Menu Available</Text> 
      )}  
      {userType === 'restaurantOwner' && ( 
         <Button icon="note-plus-outline" mode='outlined' style={styles.btn} onPress={handleAddItem}>Add Item</Button>
        )}

      <ScrollView>
        {categoryList && categoryList.map((category) => {
          if (menuItems) {
    
          const filteredItems = getFilteredCategories().filter((item) => item.category === category); 

          // Render sections only if there are menu items in the category
          if (filteredItems.length > 0) {
            return (
              <View style={styles.section} key={category}>
                <Text style={styles.sectionTitle}>{category}</Text>
                {filteredItems.map((item) => (
                  <View key={item._id}>
                    {renderMenuItem({ item })}
                  </View>
                ))}
              </View>
            );
          } else {
            return null;
          }
        }
      })}
      </ScrollView>
    </View>

      {userType === 'restaurantOwner' && (
        <View>
          <Text style={styles.menu}>Reservations</Text>
          <Reservations restaurant={restaurant} />
        </View>
      )}
      <View>
        <Text style={styles.menu}>Reviews</Text>
        <Reviews restaurant={restaurant} userType={userType} />
      </View>
    </ScrollView>
    <Modal visible={isAddingItem || editModalVisible} 
        transparent={true} 
        animationType="slide"
        onDismiss={handleCancelEdit}>
      <View style={styles.modalContainer}>
        <TextInput
          mode="outlined"
          label="Item Name"
          value={isAddingItem ? newItemName : editedItemName}
          onChangeText={isAddingItem ? setNewItemName : setEditedItemName}
          style={styles.outlinedInput}
        />
        <HelperText style={styles.helperText} type="error" visible={isAddingItem ? !newItemName : !editedItemName}>
          Item name is required
        </HelperText> 
        <TextInput
          mode="outlined"
          label="Item Price"
          value={isAddingItem ? newItemPrice : editedItemPrice}
          onChangeText={isAddingItem ? setNewItemPrice : setEditedItemPrice}
          keyboardType="numeric"
          style={styles.outlinedInput}
        />
        <HelperText style={styles.helperText} type="error" visible={isAddingItem ? !newItemPrice : !editedItemPrice}>
          Item price is required  
        </HelperText>
        <View style={{flexDirection: 'row'}}>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons style={styles.imgBtn} name="add-photo-alternate" />
          </TouchableOpacity>
          {isUploading ? (
              <ActivityIndicator size={50} color="#90b2ac" />
            ) : imgSrc ? (
              <Image source={{ uri: imgSrc }} style={{ margin: 10, padding: 5, width: 65, height: 65, alignSelf: 'center' }} />
            ) : null}
          <HelperText style={styles.helperText2} type="error" visible={!imgSrc}>
            Item image is required
          </HelperText>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <RadioButton.Group onValueChange={(value) => {
                if (isAddingItem) {
                  setSelectedCategory(value);
                } else {
                  setEditedItemCategory(value); // Use for editing
                }
              }}
              value={isAddingItem ? selectedCategory : editedItemCategory}
            >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="Appetizers" color="#90b2ac" />
            <Text style={styles.radioLabel}>Appetizers</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="Add-ons" color="#90b2ac" />
            <Text style={styles.radioLabel}>Add-ons</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="Main Dishes" color="#90b2ac" />
            <Text style={styles.radioLabel}>Main Dishes</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="Desserts" color="#90b2ac" />
            <Text style={styles.radioLabel}>Desserts</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="Beverages" color="#90b2ac" />
            <Text style={styles.radioLabel}>Beverages</Text>
          </View>
        </RadioButton.Group>
        <HelperText style={styles.helperText2} type="error" visible={isAddingItem ? !selectedCategory : !editedItemCategory}>
          Please select a category
        </HelperText>
        </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button icon="content-save" mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={() => {
              if (isAddingItem) {
                if (newItemName && newItemPrice && imgSrc && selectedCategory) {
                  handleSaveItem();
                } 
              } else {
                if (editedItemName && editedItemPrice && imgSrc && editedItemCategory) {
                  handleSaveEdit();
                } 
              }}}>Save</Button>
          <Button mode="outlined" style={{ backgroundColor: '#f0f0f0', margin: 5 }} onPress={isAddingItem ? () => setIsAddingItem(false) : handleCancelEdit}>Cancel</Button>
        </View>
      </View>
    </Modal>
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
  notFoundText: {
    alignSelf: 'center', 
    fontSize: 16, 
    fontFamily: 'eb-garamond-italic',
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
        width: "50%",
        borderWidth: 2,
        borderColor: "#90b2ac",
        margin: 10,
    },
    imgBtn: {
        fontSize: 50,
        alignSelf: "center",
        borderColor: "#90b2ac",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
    radioLabel: {
      fontSize: 14,
      fontFamily: 'eb-garamond',
    },
    helperText: {
      marginTop: -5,
      width: "80%",
      alignSelf: 'center',        
    },
    helperText2: {
      marginTop: -5,
      alignSelf: 'center',        
    },
    options: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    categoryLink: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'eb-garamond',
      color: '#333',
      paddingHorizontal: 10,
    },
    activeLink: {
      color: '#90b2ac', // Change the color for the active link
    },
    section: {
      backgroundColor: '#fff',
      marginVertical: 10,
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'eb-garamond',
      marginBottom: 10,
    },
    modalContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      margin: 20,
      alignItems: 'center',
      elevation: 15,
    },
    outlinedInput: {
      width: "75%",
      alignSelf: 'center',
    },
});