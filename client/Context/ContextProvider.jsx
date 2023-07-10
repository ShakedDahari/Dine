import React, { createContext, useState } from "react";
import { apiUrl } from "../utils/api_url";
import { sendNotification } from "../Pages/PushNotification";

export const ContextPage = createContext();

export default function ContextProvider(props) {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [loginUser, setLoginUser] = useState();

  const [emailB, setEmailB] = useState();
  const [phoneB, setPhoneB] = useState();
  const [nameB, setNameB] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [foodTypeB, setFoodTypeB] = useState();
  const [imgB, setImgB] = useState();
  const [availableSeats, setAvailableSeats] = useState();
  const [inside, setInside] = useState();
  const [outside, setOutside] = useState();
  const [bar, setBar] = useState();
  const [passwordB, setPasswordB] = useState();
  const [confirmB, setConfirmB] = useState();

  const [users, setUsers] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [foodType, setFoodType] = useState();
  const [diners, setDiners] = useState();

  const [foodListVisible, setFoodListVisible] = useState(false);
  const [dinersListVisible, setDinersListVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const LoadRestaurants = async () => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants`);
      let data = await res.json();
      setRestaurants(data);
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

  const checkEmailBusiness = async (email) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/email/${email}`);
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

  const deleteUser = async (id) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/delete/${id}`, {
        method: "DELETE",
      });
      let data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      LoadUsers();
    }
  };

  const addRestaurant = async (business) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/add`, {
        method: "POST",
        body: JSON.stringify(business),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      LoadRestaurants();
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/delete/${id}`, {
        method: "DELETE",
      });
      let data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      LoadRestaurants();
    }
  };

  const changeApprovedRestaurant = async (id, email, name) => {
    try {
      console.log("context " + id, email, name);
      let res = await fetch(`${apiUrl}/api/restaurants/approved/${id}`, {
        method: "PUT",
        body: JSON.stringify({email, name}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.status);
      let data;
      if (res.status === 200) {
        const responseText = await res.text();
        data = responseText ? JSON.parse(responseText) : null;
      }
      console.log(data);
    } catch (error) {
      console.error({error: error.message});
    } finally {
      LoadRestaurants();
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
            console.log(data);
            if (data) {
              setFilteredRestaurants(data);
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
      if (res.status === 200) {
        // Successful response
        const data = await res.json();
        console.log(data);
        if (data) {
          sendNotification('Reservation Request Send', 'We will keep you informed once your reservation request is approved by the restaurant.');
          //handle reservation requests
          AddReservationRequest(id, loginUser._id, seatType, numDiners);
        }
        return data;
      } else {
        // Error response
        const errorData = await res.json();
        console.error('Error updating seats:', errorData);
      }
    } catch (error) {
      console.error('Error updating seats:', error);
    }
  };

  const AddReservationRequest = async (id, userId, seatType, diners) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/orders/${id}`, {
          method: "POST",
          body: JSON.stringify({ userId, seatType, diners }),
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
          console.log(data);  
          return data;
        } else {
          throw new Error(`Request failed ${res.status}`);
        }
    } catch (error) {
        console.log(error);
    }
  }


  const value = {
    email, setEmail,
    phone, setPhone,
    userName, setUserName,
    password, setPassword,
    confirm, setConfirm,
    addUser,
    LoadUsers,
    LoadFoodTypes,
    LoadRestaurants,
    users,
    checkEmail,
    checkUsername,
    location,setLocation,
    errorMsg,setErrorMsg,
    foodType,setFoodType,
    diners,setDiners,
    foodListVisible,setFoodListVisible,
    dinersListVisible, setDinersListVisible,
    foodTypes,
    dinersList,
    restaurants,setRestaurants,
    findRestaurants,
    isLoading,setIsLoading,
    updateSeats,
    filteredRestaurants, setFilteredRestaurants,
    deleteUser,
    deleteRestaurant,
    loginUser, setLoginUser,
    emailB, setEmailB,
    phoneB, setPhoneB,
    nameB, setNameB,
    address, setAddress,
    city, setCity,
    foodTypeB, setFoodTypeB,
    imgB, setImgB,
    availableSeats, setAvailableSeats,
    inside, setInside,
    outside, setOutside,
    bar, setBar,
    passwordB, setPasswordB, 
    confirmB, setConfirmB,
    addRestaurant,
    checkEmailBusiness,
    changeApprovedRestaurant,
  };

  return (
    <ContextPage.Provider value={value}>{props.children}</ContextPage.Provider>
  );
}
