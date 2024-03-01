import { useContext } from "react"
import { Text, StyleSheet, TouchableOpacity, View } from "react-native"
import { WeatherContext } from "../context/WeatherContext"

export default function WeatherTempUnits() {
   const { weatherData, currentTime, units, setUnits } =
      useContext(WeatherContext)

   const themeStyles = currentTime === "night" ? darkStyles : styles

   function setCurrentUnits() {
      units === "metric" ? setUnits("imperial") : setUnits("metric")
   }

   if (!weatherData) {
      return null
   }

   return (
      <View style={styles.weatherTempContainer}>
         <Text style={themeStyles.weatherTempText}>
            {units === "metric"
               ? Number(weatherData.current.temp).toFixed(0)
               : ((Number(weatherData.current.temp) * 9) / 5 + 32).toFixed(0)}
         </Text>
         <TouchableOpacity onPress={() => setCurrentUnits()}>
            <Text style={themeStyles.weatherTempUnit}>
               {units === "metric" ? "°C" : "°F"}
            </Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   weatherTempContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   weatherTempText: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#113547",
   },
   weatherTempUnit: {
      fontSize: 40,
      fontWeight: "bold",
      opacity: 0.7,
      marginRight: 5,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderRadius: 7,
      width: 55,
      height: 50,
      color: "#277ca5",
      borderColor: "#277ca5",
      marginLeft: 2,
      paddingLeft: 2,
   },
})

const darkStyles = StyleSheet.create({
   weatherTempText: {
      fontSize: 40,
      fontWeight: "bold",
      color: "white",
   },
   weatherTempUnit: {
      fontSize: 40,
      fontWeight: "bold",
      opacity: 0.7,
      marginRight: 5,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderRadius: 7,
      width: 55,
      height: 50,
      color: "white",
      borderColor: "white",
      marginLeft: 2,
      paddingLeft: 2,
   },
})
