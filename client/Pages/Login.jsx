import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ContextPage } from "../Context/ContextProvider";
import { sendNotification } from "./PushNotification";

export default function Login(props) {

  const { userName, password, setUserName, setPassword, users, LoadUsers } = useContext(ContextPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await LoadUsers();
      } catch (error) {
        console.log('Error loading users:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleLogin = async() => {
    try {
    console.log(userName, password);

    let foundUser = false;
    if (userName && password) {
       users.forEach(user => {
        if ((userName === user.username || userName === user.email) && password === user.password) {
          foundUser = true;
        }  });
    } 
    console.log(foundUser);
    if (foundUser) {
      sendNotification('Login Successful', 'Welcome to the app!');
      props.navigation.navigate("Main");
    } else {
      alert('Invalid username or password');
      return;
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
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              onChangeText={setUserName}
              value={userName}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={styles.title}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomCon}>
            <TouchableOpacity>
              <Text style={styles.join} onPress={() => props.navigation.navigate("Register")}>
                Join Us
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
  text: {
    alignSelf: "center",
    color: "#D9D9D9",
    fontSize: 30,
    fontFamily: "sans-serif-condensed",
    fontWeight: 700,
  },
  btn: {
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    width: "75%",
    backgroundColor: "#B0B0B0",
    borderColor: "#838383",
    borderWidth: 3,
    margin: 10,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
  },
  bottomCon: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  join: {
    alignSelf: "center",
    fontSize: 18,
    color: "#D9D9D9",
  },
});
