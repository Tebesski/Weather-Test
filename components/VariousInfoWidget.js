import { Text, View, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import IconMC from "react-native-vector-icons/MaterialCommunityIcons"
import IconF from "react-native-vector-icons/Feather"
import { useContext } from "react"
import { WeatherContext } from "../context/WeatherContext"

export default function VariousInfoWidget() {
   const { weatherData, currentTime } = useContext(WeatherContext)
   const themeStyles = currentTime === "night" ? darkStyles : styles

   function getSunriseOrDusk(time, timezoneOffset) {
      const date = new Date((time + timezoneOffset) * 1000)
      const hours = date.getUTCHours()
      const minutes = date.getUTCMinutes()

      const currentTimeInSeconds = Date.now() / 1000 // Current time in seconds
      const sunriseTime = weatherData.current.sunrise // Sunrise time in seconds
      const sunsetTime = weatherData.current.sunset // Sunset time in seconds

      let timeToDisplay
      let iconName
      if (currentTimeInSeconds < sunriseTime) {
         timeToDisplay = new Date(sunriseTime * 1000).toLocaleTimeString()
         iconName = "sunrise"
      } else if (currentTimeInSeconds < sunsetTime) {
         timeToDisplay = new Date(sunsetTime * 1000).toLocaleTimeString()
         iconName = "sunset"
      } else {
         timeToDisplay = "Tomorrow's sunrise"
         iconName = "sunrise"
      }

      return (
         <Text>
            <IconF name={iconName} size={20} style={themeStyles.sun} />
            {` ${hours}:${minutes.toString().padStart(2, "0")}`}
         </Text>
      )
   }

   return (
      <View style={styles.variousInfoContainer}>
         <Text style={themeStyles.variousInfoText}>
            {getSunriseOrDusk(
               currentTime === "night"
                  ? weatherData.current.sunrise
                  : weatherData.current.sunset,
               weatherData.timezone_offset
            )}
         </Text>

         <View style={styles.varInfoCombo}>
            <Icon
               name={`${
                  currentTime === "night" ? "water-outline" : "water-sharp"
               }`}
               size={20}
               style={themeStyles.drop}
            />
            <Text style={themeStyles.variousInfoText}>
               {weatherData.current.humidity}%
            </Text>
         </View>

         <View style={styles.varInfoCombo}>
            <IconMC name="weather-windy" size={20} style={themeStyles.wind} />
            <Text style={themeStyles.variousInfoText}>
               {weatherData.current.wind_speed}m/s
            </Text>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   variousInfoContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
   },
   variousInfoText: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "#ce4993",
   },
   varInfoCombo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
   },
   sun: {
      color: "#ee5d6c",
   },
   drop: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "#0784b5",
   },
   wind: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "gray",
   },
})

const darkStyles = StyleSheet.create({
   variousInfoText: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
   },
   sun: {
      color: "lightgray",
   },
   drop: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "lightgray",
   },
   wind: {
      opacity: 0.8,
      fontSize: 16,
      fontWeight: "bold",
      color: "lightgray",
   },
})
