import React, { createContext, useEffect, useState } from "react";
import { apiUrl } from "../utils/api_url";

export const ContextPage = createContext();

export default function ContextProvider(props) {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();

  const [users, setUsers] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [foodType, setFoodType] = useState();
  const [diners, setDiners] = useState();

  const [foodListVisible, setFoodListVisible] = useState(false);
  const [dinersListVisible, setDinersListVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const foodTypes = [
  //   { key: 1, label: "Asian" },
  //   { key: 2, label: "Cafe" },
  //   { key: 3, label: "Dairy" },
  //   { key: 4, label: "Desserts" },
  //   { key: 5, label: "Fish" },
  //   { key: 6, label: "Indian" },
  //   { key: 7, label: "Italian" },
  //   { key: 8, label: "Mexican" },
  //   { key: 9, label: "Mediterranean" },
  //   { key: 10, label: "Pub" },
  //   { key: 11, label: "Meat" },
  //   { key: 12, label: "Vegetarian/Vegan" },
  // ];

  const dinersList = [
    { key: 1, value: "1" },
    { key: 2, value: "2" },
    { key: 3, value: "3" },
    { key: 4, value: "4" },
    { key: 5, value: "5" },
    { key: 6, value: "6" },
    { key: 7, value: "7" },
    { key: 8, value: "8" },
    { key: 9, value: "9" },
    { key: 10, value: "10" },
    { key: 11, value: "11" },
    { key: 12, value: "12" },
  ];

  const LoadUsers = async () => {
    try {
      let res = await fetch(`${apiUrl}/api/users`);
      let data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log({ error } );
    }
  };

  const LoadFoodTypes = async () => {
    try {
      let res = await fetch(`${apiUrl}/api/foodTypes`);
      let data = await res.json();
      setFoodTypes(data);
    } catch (error) {
      console.log({ error });
    }
  }

  const checkEmail = async (email) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/email/${email}`);
      let data = await res.json();
      return !!data;
    } catch (error) {
      return error;
    }
  };

  const checkUsername = async (userName) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/username/${userName}`);
      let data = await res.json();
      return !!data;
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async (user) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/add`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      LoadUsers();
    }
  };


  const findRestaurants = async (location, foodType, diners) => {
    try {
        let res = await fetch(`${apiUrl}/api/restaurants/find`, {
            method: "POST",
            body: JSON.stringify({ location, foodType, diners }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const text = await res.text();
            let data;
      
            try {
              data = await JSON.parse(text);
            } catch (error) {
              throw new Error('Invalid JSON response');
            }
      
            if (data) {
              setRestaurants(data);
              setIsLoading(false);
            }
            
            return data;
          } else {
            throw new Error(`Request failed ${res.status}`);
          }
    } catch (error) {
        console.log(error);
    }
  };

  const updateSeats = async (id, seatType, numDiners) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/seats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, seatType, numDiners }),
      });
      console.log(res.ok + " status");
      if (res.ok) {
        const text = await res.text();
        let data;
        console.log(data);
        try {
          data = await JSON.parse(text);
          console.log(data);
        } catch (error) {
          throw new Error('Invalid JSON response');
        }
        return data;
      } else {
        console.error('Error updating:', data);
      }
    } catch (error) {
      console.error('Error updating seats:', error);
    }
  }

  const value = {
    email,
    setEmail,
    phone,
    setPhone,
    userName,
    setUserName,
    password,
    setPassword,
    confirm,
    setConfirm,
    addUser,
    LoadUsers,
    LoadFoodTypes,
    users,
    checkEmail,
    checkUsername,
    location,
    setLocation,
    errorMsg,
    setErrorMsg,
    foodType,
    setFoodType,
    diners,
    setDiners,
    foodListVisible,
    setFoodListVisible,
    dinersListVisible, 
    setDinersListVisible,
    foodTypes,
    dinersList,
    restaurants,
    setRestaurants,
    findRestaurants,
    isLoading,
    setIsLoading,
    updateSeats,
  };

  return (
    <ContextPage.Provider value={value}>{props.children}</ContextPage.Provider>
  );
}
