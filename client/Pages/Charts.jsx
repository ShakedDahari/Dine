import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ContextPage } from '../Context/ContextProvider';
import WebView from 'react-native-webview';

export default function Charts(props) {

    const { LoadRestaurants, restaurants } = useContext(ContextPage);
    const [selectedCity, setSelectedCity] = useState('All'); 
    const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    LoadRestaurants();
  }, []);

  
  const restaurantNames = restaurants.map(restaurant => restaurant.name);
  const availableSeatsData = restaurants.map(restaurant => restaurant.availableSeats);
  const cityList = ['All', ...new Set(restaurants.map(restaurant => restaurant.location))];

  const getFilteredRestaurantData = () => {
    if (selectedCity === 'All') {
      return restaurants;
    }
    return restaurants.filter(restaurant => restaurant.location === selectedCity);
  };

  const filteredRestaurantData = getFilteredRestaurantData();
  const filteredRestaurantNames = filteredRestaurantData.map(restaurant => restaurant.name);
  const filteredAvailableSeatsData = filteredRestaurantData.map(
    restaurant => restaurant.availableSeats
  );

  // Render the city dropdown
  const renderCityDropdown = () => {
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
            {cityList.map(city => (
              <TouchableOpacity
                key={city}
                onPress={() => {
                  setSelectedCity(city);
                  setModalVisible(false);
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  const chartConfig = {
    type: 'bar',
    data: {
      labels: filteredRestaurantNames,
      datasets: [
        {
          label: 'Available Seats',
          data: filteredAvailableSeatsData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Seats',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Restaurant Name',
          },
        },
      },
    },
  };

  const chartHTML = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <div style="width: 95%; margin: auto;">
          <canvas id="availableSeatsChart"></canvas>
        </div>
        <script>
          const ctx = document.getElementById('availableSeatsChart').getContext('2d');
          new Chart(ctx, ${JSON.stringify(chartConfig)});
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      {restaurants.length === 0 ? (
         <ActivityIndicator size={100} color="#D9D9D9" />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>Filter by City:</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ fontSize: 16 }}>{selectedCity}</Text>
            </TouchableOpacity>
          </View>
          {renderCityDropdown()}
          <View style={{ width: '100%', height: '100%' }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: chartHTML }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

