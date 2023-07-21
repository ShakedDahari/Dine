import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ContextPage } from "../Context/ContextProvider";
import { sendNotification } from "./PushNotification";
import { MaterialIcons } from '@expo/vector-icons';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useFonts } from "expo-font";


export default function Login(props) {
  
  const { userName, password, setUserName, setPassword, users, LoadUsers, setLoginUser, restaurants, LoadRestaurants, LoadFoodTypes } = useContext(ContextPage);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [submit, setSubmit] = useState(false);
  
  useEffect(() => {
    LoadUsers();
    LoadRestaurants();
    LoadFoodTypes();
  }, []);

const [loaded] = useFonts({
  'eb-garamond': require('../assets/EBGaramond-VariableFont_wght.ttf'),
  'eb-garamond-italic': require('../assets/EBGaramond-Italic-VariableFont_wght.ttf'),
});

if (!loaded) {
  return;
}

  
  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const handleLogin = async() => {
    try {
    console.log(userName, password);
    // setSubmit(true);
    let foundUser = false;
    if (userName && password) {
       users.forEach(user => {
        if ((userName === user.username || userName === user.email) && password === user.password) {
          foundUser = true;
          setLoginUser(user);
        }  
      });
    } 
    console.log(foundUser);
    if (foundUser) {
      sendNotification('Login Successful', 'Welcome to the app!');
      if (userName === "Admin1" || userName === "Admin2") {
        props.navigation.navigate("Admin");
      } else {
        props.navigation.navigate("Main");
      }
    } else {
      // Find the restaurant based on the email provided by the user
      let userRestaurant = restaurants.find(rest => rest.email === userName);
      if (userRestaurant) {
        if (userRestaurant.approved) {
          props.navigation.navigate('RestaurantDetails', { userType: 'restaurantOwner', restaurant: userRestaurant  });
        } else {
          alert("Your restaurant hasn't been approved yet. Please wait for approval.");
        }
      } else {
        alert('Invalid username or password');
        return;
      }
    }
        
    
   } catch (error) {
      alert('Invalid Error');
      console.log('Error loading users:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <View style={styles.iconCon}>
            <Image source={require("../assets/icon.png")} style={styles.icon}/>
            <Text style={styles.text}>DineInTime</Text>
          </View>
          <View style={styles.inputCon}>
            <View>
            <TextInput
              style={styles.outlinedInput}
              mode="outlined"        
              label="Email / Username"
              onChangeText={setUserName}
              value={userName}
            />
          {/* <HelperText style={styles.error} type="error" visible={!userName}>
            Email / Username is invalid
          </HelperText> */}
          </View>
            <TextInput style={styles.outlinedInput}   
              mode="outlined"        
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
            />
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleLogin}>
              <Button icon="login" style={styles.btn} mode={pressed ? 'outlined' : 'contained'}><Text style={{fontFamily: 'eb-garamond', fontSize: 18}}>Login</Text></Button>
            </TouchableWithoutFeedback>
          </View> 
          <View style={styles.bottomCon}>
            <TouchableOpacity>
              <Text style={styles.join} onPress={() => props.navigation.navigate("Register")}>
                No Account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    //backgroundColor: "#94B285",
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
    borderColor: "#B0B0B0",
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  outlinedInput: {
    margin: 5,
    width: "75%",
    alignSelf: 'center',
  },
  text: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: 'eb-garamond',
    fontWeight: 500,
  },
  error: {
    width: "75%",
    left: 30,
  },
  btn: {
    height: 50,
    alignSelf: "center",
    width: "75%",
    borderWidth: 2,
    margin: 10,
  },
  bottomCon: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  join: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: 'eb-garamond',
    margin: 10,
  },
  pass: {
    height: 50,
    width: "75%",
    alignSelf: "center",
    borderColor: "#B0B0B0",
    borderWidth: 1,
    margin: 10,
    padding: 5,
},
});
