import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { WeatherContext } from "../context/WeatherContext"
import { SearchContext } from "../context/SearchContext"

export default function WeatherWidgetLocation() {
   const { currentLocation, currentTime, isLoading } =
      useContext(WeatherContext)
   const { selectedCity, userLocation, userLocationAccess } =
      useContext(SearchContext)
   const themeStyles = currentTime === "night" ? darkStyles : styles

   const [locationString, setLocationString] = useState("")
   const [countryString, setCountryString] = useState("")

   useEffect(() => {
      if (currentLocation?.address && !isLoading) {
         const location = currentLocation.address?.city || selectedCity
         setLocationString(location)
         const country = currentLocation.address.country
         setCountryString(country)
      }
   }, [currentLocation])

   if (userLocationAccess && !userLocation) {
      return (
         <View style={styles.weatherWidgetLocationContainer}>
            <View style={{ alignItems: "center" }}>
               <Text style={styles.loadingText}>
                  Taking a moment to find your city ;)
               </Text>
               <ActivityIndicator size="small" color="black" />
            </View>
         </View>
      )
   }

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
   loadingText: {
      alignSelf: "center",
      fontSize: 18,
      // paddingLeft: 10,
      // paddingRight: 10,
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
