import React, { createContext, useState } from "react";
import { apiUrl } from "../utils/api_url";
import { sendPushNotification } from "../Pages/PushNotification";

export const ContextPage = createContext();

export default function ContextProvider(props) {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [loginUser, setLoginUser] = useState();

  const [userData, setUserData] = useState({});
  const [expoPushToken, setExpoPushToken] = useState('');

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
  const [restaurantOrders, setRestaurantOrders] = useState([]);
  const [restaurantReviews, setRestaurantReviews] = useState([]);

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

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  const phoneRegex = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/gm
  const usernameRegex = /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9_-]+([^._-])$/
  const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{5,})\S$/
  const numbersRegex = /^[0-9]+$/

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  }

  const isValidPhone = (phone) => {
    return phoneRegex.test(phone);
  }

  const isValidUsername = (username) => {
    return usernameRegex.test(username);
  }

  const isValidPassword = (password) => {
    return passwordRegex.test(password);
  }

  const isValidNumbers = (number) => {
    return numbersRegex.test(number);
  }

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

  const LoadRestaurantOrders = async (id) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/${id}/orders`);
      let data = await res.json();
      setRestaurantOrders(data);
    } catch (error) {
      console.log({ error });
    } finally {
      LoadRestaurants();
    }
  }

  const LoadRestaurantReviews = async (id) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/${id}/reviews`);
      let data = await res.json();
      setRestaurantReviews(data);
    } catch (error) {
      console.log({ error });
    } finally {
      LoadRestaurants();
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

  const checkLoginUser = async (username, password) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/login`, {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      LoadUsers();
    }
  };
  
  const checkLoginRestaurant = async (username, password) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/login`, {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      LoadUsers();
    }
  };

  // const uploadImage = async (img) => {
  //   const formData = new FormData();
  //   formData.append('image', img);
  
  //   try {
  //     let res = await fetch(`${apiUrl}/upload`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (res.ok) {
  //       console.log('Image uploaded successfully');
  //     } else {
  //       console.error('Image upload failed');
  //     }
  //   } catch (error) {
  //     console.error('Image upload error:', error);
  //   }
  // }

  const fetchUserData = async (userId) => {
    try {
      let res = await fetch(`${apiUrl}/api/users/${userId}`);
      let data = await res.json();
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

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
      let res = await fetch(`${apiUrl}/api/restaurants/approved/${id}`, {
        method: "PUT",
      });
      let data = await res.json();
      if (data) {
        console.log(data);
        let subject = 'Restaurant Approval';
        let message = `Congratulations! Your restaurant ${name} has been approved.`;
        await sendEmail(email, subject, message);
      }
    } catch (error) {
      console.error({error: error.message});
    } finally {
      LoadRestaurants();
    }
  };

  const sendEmail = async (email, subject, message) => {
    try {
      //console.log(subject, message);
      let res = await fetch(`${apiUrl}/api/restaurants/sendemail`, {
        method: "POST",
        body: JSON.stringify({ email, subject, message }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        let data = await res.json();
        console.log(data);
        if (data) {
          console.log('Email sent successfully');
        } else {
          console.error('Failed to send email');
        }
        return data;
      }
    } catch (error) {
      console.error(error);
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
        const data = await res.json();
        console.log(data);
        if (data) {
          return data;
        }
      } else {
        const errorData = await res.json();
        console.log('Error updating seats:', errorData);
      }
    } catch (error) {
      console.error('Error updating seats:', error);
    }  finally {
      LoadRestaurants();
    }
  };

  const updateSeatsBack = async (id, seatType, numDiners) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/inc/seats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, seatType, numDiners }),
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        if (data) {
          return data;
        }
      } else {
        const errorData = await res.json();
        console.log('Error updating seats:', errorData);
      }
    } catch (error) {
      console.error('Error updating seats:', error);
    }  finally {
      LoadRestaurants();
    }
  };

  const AddReservationRequest = async (id, seatType, diners, email) => {
    try {
      let userId = await loginUser._id;
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
            
            //handle reservation requests
            let subject = 'New Reservation';
            let message = `We would like to inform you that a new reservation has been made at your restaurant.\n
            To manage and approve the reservation, please access the app.`;
            await sendEmail(email, subject, message);
            await sendPushNotification('Reservation Request Send', 'We will keep you informed once your reservation request is approved by the restaurant.', expoPushToken);  
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
    }  finally {
      LoadRestaurantOrders(id);
    }
  }

  const changeApprovedOrder = async (id, orderId, email, seatType, numDiners) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/${id}/order/approved`, {
        method: "PUT",
        body: JSON.stringify({ orderId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      if (data) {
        console.log(data);
        await updateSeats(id, seatType, numDiners);
        let subject = 'Order Approval';
        let message = `Congratulations! Your Order number: ${orderId} has been approved.\n
        You requested ${numDiners} seat(s) of type ${seatType}.\nThank you for choosing us!`;
        await sendEmail(email, subject, message);
      }
    } catch (error) {
      console.error({error: error.message});
    } finally {
      LoadRestaurantOrders(id);
    }
  };

  const deleteOrder = async (id, orderId) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/${id}/orders/delete`, {
        method: "DELETE",
        body: JSON.stringify({orderId}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.status);
      if (res.ok) {
        let data = await res.json();
        console.log(data);
      }
    } catch (error) {
     console.log(error); 
    } finally {
      LoadRestaurantOrders(id);
    }
  }

  const addItem = async (id, name, price, image, category) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/${id}/menu`, {
        method: "POST",
        body: JSON.stringify({name, price, image, category}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        return data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      LoadRestaurants();
    }
  }
  
  const editItem = async (id, itemId, name, price, image, category) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/edit/${id}/menu`, {
        method: "PUT",
        body: JSON.stringify({ itemId, name, price, image, category }),
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
      console.error(error);
    } finally {
      LoadRestaurants();
    }
  }


  const deleteItem = async (id, itemId) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/menu/${id}/delete`, {
        method: "DELETE",
        body: JSON.stringify({itemId}),
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

  const addReview = async (id, user, rating, description) => {
    try {
      let res = await fetch(`${apiUrl}/api/restaurants/reviews/${id}`, {
          method: "POST",
          body: JSON.stringify({ user, rating, description }),
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
    }  finally {
      LoadRestaurantReviews(id);
    }
  }


  const value = { 
    isValidEmail, isValidPhone, isValidUsername, isValidPassword, isValidNumbers,
    email, setEmail,
    phone, setPhone,
    userName, setUserName,
    password, setPassword,
    confirm, setConfirm,
    addUser,
    LoadUsers,
    LoadFoodTypes,
    LoadRestaurants,
    users, expoPushToken, setExpoPushToken,
    userData, setUserData, fetchUserData,
    checkEmail, checkUsername,
    checkLoginUser, checkLoginRestaurant,
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
    updateSeats, AddReservationRequest,
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
    addItem, deleteItem, editItem,
    restaurantOrders, setRestaurantOrders, LoadRestaurantOrders,
    deleteOrder, updateSeatsBack, changeApprovedOrder,
    restaurantReviews, setRestaurantReviews, LoadRestaurantReviews,
    addReview,
  };

  return (
    <ContextPage.Provider value={value}>{props.children}</ContextPage.Provider>
  );
}
