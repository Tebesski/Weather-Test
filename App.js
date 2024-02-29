import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"

import SearchWeather from "./components/SearchWeather"
import WeatherWidget from "./components/WeatherWidget"
import ForecastWidget from "./components/ForecastWidget"

import { WeatherContext, WeatherProvider } from "./context/WeatherContext"
import { SearchProvider } from "./context/SearchContext"

function MainApp() {
   const { currentTime, isLoading } = useContext(WeatherContext)
   const themeStyles = currentTime === "day" ? styles : darkStyles

   return isLoading ? null : (
      <View style={themeStyles.appContainer}>
         <SearchWeather />
         <WeatherWidget />
         <ForecastWidget />
      </View>
   )
}

export default function App() {
   return (
      <SearchProvider>
         <WeatherProvider>
            <MainApp />
         </WeatherProvider>
      </SearchProvider>
   )
}

const styles = StyleSheet.create({
   appContainer: {
      backgroundColor: "#e1f1fd",
      flexDirection: "column",
      height: "100%",
   },
})

const darkStyles = StyleSheet.create({
   appContainer: {
      backgroundColor: "#090088",
      flexDirection: "column",
      height: "100%",
   },
})
