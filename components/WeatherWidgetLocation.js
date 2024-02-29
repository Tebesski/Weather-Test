import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { WeatherContext } from "../context/WeatherContext"

export default function WeatherWidgetLocation() {
   const { currentLocation, currentTime, isLoading } =
      useContext(WeatherContext)
   const themeStyles = currentTime === "night" ? darkStyles : styles

   const [locationString, setLocationString] = useState("")
   const [countryString, setCountryString] = useState("")

   if (isLoading) return <Text>Loading...</Text>

   useEffect(() => {
      if (currentLocation?.address && !isLoading) {
         const location =
            currentLocation.address?.city ||
            currentLocation.address?.state_district ||
            currentLocation.address?.state ||
            currentLocation.address?.suburb ||
            currentLocation.address.country
         setLocationString(location)
         const country = currentLocation.address.country
         setCountryString(country)
      }
   }, [currentLocation])

   return (
      <View style={styles.weatherWidgetLocationContainer}>
         <Text style={themeStyles.weatherWidgetCity}>{locationString},</Text>
         <Text style={themeStyles.weatherWidgetCountryState}>
            {countryString}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create({
   weatherWidgetLocationContainer: {
      flexDirection: "row",
   },
   weatherWidgetCountryState: {
      marginTop: 8,
      fontSize: 16,
      color: "#113547",
   },
   weatherWidgetCity: {
      fontSize: 24,
      fontWeight: "bold",
      opacity: 0.7,
      color: "#113547",
      marginRight: 5,
   },
})

const darkStyles = StyleSheet.create({
   weatherWidgetCountryState: {
      marginTop: 8,
      fontSize: 16,
      color: "white",
   },
   weatherWidgetCity: {
      fontSize: 24,
      fontWeight: "bold",
      opacity: 0.7,
      color: "white",
      marginRight: 5,
   },
})
