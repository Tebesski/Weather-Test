import { useContext } from "react"
import { StyleSheet, View, Text } from "react-native"
import { WeatherContext } from "../context/WeatherContext"

const geraltQuotes = {
   Clear: ["Sky's clear now. But for how long?"],
   Clouds: [
      "Another dreary day.",
      "The sky's as gray as an old fisherman's beard.",
   ],
   Rain: [
      "Looks like rain.",
      "Great. Rain again.",
      "Dark clouds gather. I smell rain.",
      "Clouds rolling in. Better find shelter.",
      "Rain's let up, but the ground's still soggy.",
   ],
   Snow: [
      "Biting cold today.",
      "Frosty...",
      "Chilly today.",
      "Snow's falling softly, like feathers from a bird.",
   ],
   Thunderstorm: [
      "Looks like a storm's brewing.",
      "The air feels heavy. Storm's on the way.",
      "Storm, damn it.",
      "Clouds rolling in. Better find shelter.",
   ],
   Drizzle: ["A drizzle's coming. I can smell it in the air."],
   Mist: [
      "Misty... fog's thick as curdled milk.",
      "Fog's thick as porridge today.",
   ],
   Fog: ["Fog crept in, on little cat feet.", "Foggy weather quote 2"],
   default: ["Hm..."],
}

export default function GeraltQuote() {
   const { weatherData, currentTime } = useContext(WeatherContext)
   const themeStyles = currentTime === "day" ? styles : darkStyles

   const getQuote = () => {
      if (
         weatherData.current.wind_speed > 8.5 &&
         weatherData.current.weather[0].main != "Thunderstorm"
      ) {
         const quotes = [
            "The wind's picking up. Something's coming.",
            "Wind's howling.",
            "The wind's howling",
         ]
         return quotes[Math.floor(Math.random() * quotes.length)]
      } else if (weatherData.current.temp >= 30) {
         const quotes = ["Damn, it's hot in here.", "Haze on the horizon."]
         return quotes[Math.floor(Math.random() * quotes.length)]
      } else if (
         weatherData.current.temp >= 20 &&
         currentTime === "day" &&
         weatherData.current.weather[0].main === "Clear"
      ) {
         const quotes = [
            "Clear skies and a light breeze, perfect day for a walk...",
            "Sun's shining. Wonder if it'll last...",
            "Warm sun, cool breeze. Perfect weather for a hunt.",
         ]
         return quotes[Math.floor(Math.random() * quotes.length)]
      } else {
         const weatherCondition = weatherData.current.weather[0].main
         const quotes =
            geraltQuotes[weatherCondition] || geraltQuotes["default"]
         return quotes[Math.floor(Math.random() * quotes.length)]
      }
   }

   return (
      <View style={styles.quoteContainer}>
         <Text style={themeStyles.quoteText}>{getQuote()}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   quoteContainer: {
      alignItems: "center",
   },

   quoteText: {
      fontSize: 24,
      color: "#113547",
      fontWeight: "bold",
      fontStyle: "italic",
      textAlign: "center",
   },
})

const darkStyles = StyleSheet.create({
   quoteText: {
      fontSize: 24,
      color: "gold",
      fontStyle: "italic",
      textAlign: "center",
   },
})
