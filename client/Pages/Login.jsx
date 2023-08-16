import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ContextPage } from "../Context/ContextProvider";
import { sendPushNotification, registerForPushNotificationsAsync } from "./PushNotification";
import { Button, TextInput, HelperText, Checkbox } from 'react-native-paper';
import { useFonts } from "expo-font";


export default function Login(props) {
  
  const { expoPushToken, setExpoPushToken, userName, password, setUserName, setPassword, users, LoadUsers, setLoginUser, restaurants, LoadRestaurants, LoadFoodTypes, checkLoginUser, checkLoginRestaurant, } = useContext(ContextPage);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [bothHelper, setBothHelper] = useState(false);
  const [foundHelper, setFoundHelper] = useState(false);
  const [approvalHelper, setApprovalHelper] = useState(false);
  

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

  const checkInputsValidation = async () => {
    if (!userName || !password) {
      setBothHelper(true);
    } else {
      setBothHelper(false);
    }
  }


  const handleLogin = async() => {

    await checkInputsValidation();
    setFoundHelper(false);
    setApprovalHelper(false);

    if (bothHelper) {
      return;
    }

    // Call the appropriate login function based on user type
    try {
      if (!isRestaurantOwner) {
        const user = await checkLoginUser(userName, password);
        setLoginUser(user);
        if (user) {
           // Successfully logged in, now get the Expo push token and send a notification
          const token = await registerForPushNotificationsAsync();
          setExpoPushToken(token);
          await sendPushNotification('Login Successful', 'Welcome to the app!', token);
          if (userName === "Admin1" || userName === "Admin2") {
            props.navigation.navigate("Admin");
          } else {
            props.navigation.navigate("Main");
          }
        } else {
          //alert('Invalid Error');
          setFoundHelper(true);
        }
      } else {
        const restaurant = await checkLoginRestaurant(userName, password);
        if (restaurant) {
          if (restaurant.approved) {
            const token = await registerForPushNotificationsAsync();
            setExpoPushToken(token);
            await sendPushNotification('Login Successful', 'Welcome to the app!', token);
            props.navigation.navigate('RestaurantDetails', { userType: 'restaurantOwner', restaurant: restaurant  });
          } else {
            //alert("Your restaurant hasn't been approved yet. Please wait for approval.");
            setApprovalHelper(true);
          }
        } else {
          setFoundHelper(true);
        }
      }
      
    } catch (error) {
      //alert('Invalid Error');
      setFoundHelper(true);
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
          </View>
            <TextInput style={styles.outlinedInput}   
              mode="outlined"        
              label="Password"
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
              value={password}
              right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>}
              />
              <HelperText style={styles.helperText} type="error" visible={bothHelper || foundHelper || approvalHelper}>
                {bothHelper && 'Both fields are required.'}
                {!bothHelper && foundHelper && 'Account not found.'}
                {approvalHelper && 'Please wait for approval.'}
              </HelperText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Checkbox status={isRestaurantOwner ? 'checked' : 'unchecked'} onPress={() => setIsRestaurantOwner(!isRestaurantOwner)} />
            <Text>Login as a Restaurant Owner</Text>
          </View>
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
  helperText: {
    marginTop: -5,
    width: "80%",
    alignSelf: 'center',        
  },
  text: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: 'eb-garamond',
    fontWeight: 500,
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
