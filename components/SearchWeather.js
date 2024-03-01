import { useContext } from "react"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { WeatherContext } from "../context/WeatherContext"
import IconI from "react-native-vector-icons/Ionicons"
import { SearchContext } from "../context/SearchContext"

export default function SearchWeather() {
   const { currentTime } = useContext(WeatherContext)
   const { toggleModal } = useContext(SearchContext)
   const themeStyles = currentTime === "night" ? darkStyles : styles

   return (
      <View style={styles.searchContainer}>
         <Text style={themeStyles.searchButtonText}>choose</Text>
         <TouchableOpacity
            style={themeStyles.searchButtonContainer}
            onPress={toggleModal}
         >
            <IconI name="earth" size={80} style={themeStyles.globe} />
         </TouchableOpacity>
         <Text style={themeStyles.searchButtonText}>location</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      marginTop: 20,
      width: "100%",
   },

   searchInput: {
      borderBottomWidth: 1,
      borderColor: "black",
      paddingBottom: 5,
      fontSize: 24,
      marginBottom: 12,
   },

   searchButtonContainer: {
      backgroundColor: "transparent",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
   },
   searchButtonText: {
      fontSize: 12,
      color: "#39ace7",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase",
   },
   globe: {
      color: "#0784b5",
   },
})

const darkStyles = StyleSheet.create({
   searchInput: {
      borderBottomWidth: 1,
      borderColor: "white",
      paddingBottom: 5,
      fontSize: 24,
      marginBottom: 12,
      color: "white",
   },
   searchButtonContainer: {
      backgroundColor: "transparent",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
   },
   searchButtonText: {
      fontSize: 12,
      color: "white",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase",
   },
   globe: {
      color: "lightgreen",
   },
})
