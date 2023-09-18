import React, { useContext, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { ContextPage } from "../Context/ContextProvider";
import WebView from "react-native-webview";

//Function to generate background colors
const generateBackgroundColors = (count) => {
  const colors = [];
  const hueStart = 180; // Starting hue value for blue-green
  const hueEnd = 240; // Ending hue value for blue-green

  for (let i = 0; i < count; i++) {
    const hue = hueStart + ((hueEnd - hueStart) * i) / (count - 3); // Distribute hues between the start and end values
    const saturation = "80%"; // Adjust the saturation value for desired effect
    const lightness = "70%"; // Adjust the lightness value for desired effect
    const color = `hsl(${hue}, ${saturation}, ${lightness})`;
    colors.push(color);
  }
  return colors;
};

export default function Charts() {
  const { LoadRestaurants, restaurants, LoadFoodTypes, foodTypes, LoadUsers, users } = useContext(ContextPage);

  useEffect(() => {
    LoadRestaurants();
    LoadFoodTypes();
    LoadUsers();
  }, []);

  // Generate background colors for food types
  const backgroundColors = generateBackgroundColors(foodTypes.length);

  const getFilteredRestaurantData = () => {
    return restaurants.filter((restaurant) => restaurant.approved === true);
  };

  const filteredRestaurantData = getFilteredRestaurantData();
  const filteredRestaurantNames = filteredRestaurantData.map((restaurant) => restaurant.name);
  const filteredAvailableSeatsData = filteredRestaurantData.map((restaurant) => restaurant.availableSeats);

  const usersAndRestaurantsChartConfig = {
    type: "bar",
    data: {
      labels: ["Users", "Restaurants"],
      datasets: [
        {
          label: "Amount",
          data: [users.length, restaurants.length],
          backgroundColor: ["#aaccc6", "#1a8e9a"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2, // Set step size for y-axis ticks
            font: {
              size: 25, // Adjust the font size for y-axis values
            },
          },
        },
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 25, // Adjust the font size for y-axis values
            },
          },
        },
      },
      plugins: {
        tooltip: {
          titleFont: {
            size: 35,
          },
          bodyFont: {
            size: 25,
          },
        },
        legend: {
          display: false, // Hide the legend label
        },
      },
    },
  };

  const chartHTMLCount = `
  <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <div style="width: 95%; margin: auto;">
        <canvas id="allUsersAndRestaurants"></canvas>
      </div>
      <script>
        const ctx = document.getElementById('allUsersAndRestaurants').getContext('2d');
        new Chart(ctx, ${JSON.stringify(usersAndRestaurantsChartConfig)});
      </script>
    </body>
  </html>
`;

  const chartConfig = {
    type: "bar",
    data: {
      labels: filteredRestaurantNames,
      datasets: [
        {
          label: "Available Seats",
          data: filteredAvailableSeatsData,
          backgroundColor: "#CDE9FF",
          borderWidth: 2,
          borderColor: "black",
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        tooltip: {
          titleFont: {
            size: 35,
          },
          bodyFont: {
            size: 25,
          },
        },
        legend: {
          display: false, // Hide the legend label
          labels: {
            font: {
              size: 25,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Restaurant Name",
            font: {
              size: 30, // Adjust the font size for the y-axis title
            },
            ticks: {
              font: {
                size: 20,
              },
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Seats",
            font: {
              size: 30, // Adjust the font size for the x-axis title
            },
          },
          ticks: {
            font: {
              size: 20,
            },
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

  // Calculate the percentage of each food type
  const foodTypeCounts = {};
  filteredRestaurantData.forEach((restaurant) => {
    const type = restaurant.foodType;
    foodTypeCounts[type] = (foodTypeCounts[type] || 0) + 1;
  });

  const totalRestaurants = filteredRestaurantData.length;
  const foodTypePercentages = foodTypes.map((type) => {
    const count = foodTypeCounts[type.name] || 0;
    const percentage = (count / totalRestaurants) * 100;
    return { type: type.name, percentage: parseFloat(percentage.toFixed(2)) };
  });

  // Prepare data for the doughnut chart
  const chartConfigFood = {
    type: "doughnut",
    data: {
      labels: foodTypePercentages.map((item) => item.type),
      datasets: [
        {
          data: foodTypePercentages.map((item) => item.percentage),
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: "black",
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          titleFont: {
            size: 35,
          },
          bodyFont: {
            size: 25,
          },
        },
        legend: {
          labels: {
            font: {
              size: 30,
            },
          },
          position: "bottom", // Show the legend at the bottom
        },
      },
      layout: {
        padding: 20, // Add some padding to the chart area
      },
    },
  };

  const chartHTMLFood = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <div style="width: 95%; height: 100%; margin: auto;">
          <canvas id="foodTypesChart"></canvas>
        </div>
        <script>
          const ctx = document.getElementById('foodTypesChart').getContext('2d');
          new Chart(ctx, ${JSON.stringify(chartConfigFood)});
        </script>
      </body>
    </html>
  `;

  const chartData = [
    { title: "Users and Restaurants", chartHTML: chartHTMLCount },
    { title: "Available Seats", chartHTML: chartHTML },
    { title: "Food Types Percentage", chartHTML: chartHTMLFood },
  ];

  // Render each chart with title
  const renderChart = ({ item }) => (
    <View>
      <Text
        style={{
          alignSelf: "center",
          margin: 15,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "eb-garamond",
        }}
      >
        {item.title}
      </Text>
      <View
        style={{ height: item.title === "Food Types Percentage" ? 400 : 200 }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{ html: item.chartHTML }}
          style={{ flex: 1, backgroundColor: "#ededed" }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ justifyContent: "center", width: "100%", height: "100%" }}>
      {restaurants.length === 0 &&
      foodTypes.length === 0 &&
      users.length === 0 ? (
        <ActivityIndicator size={100} color="#D9D9D9" />
      ) : (
        <FlatList
          data={chartData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderChart}
        />
      )}
    </View>
  );
}