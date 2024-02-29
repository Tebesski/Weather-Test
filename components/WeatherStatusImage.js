import { useContext } from "react"
import { Image, StyleSheet } from "react-native"

import { WeatherContext } from "../context/WeatherContext"

export default function WeatherStatusImage({ forecastData, isForecast }) {
   const { weatherData, currentTime } = useContext(WeatherContext)

   const images = {
      day: require("../assets/animated/day.gif"),
      night: require("../assets/animated/night.gif"),
      cloudy_day: require("../assets/animated/cloudy_day.gif"),
      cloudy_night: require("../assets/animated/cloudy_night.gif"),
      rainy_day: require("../assets/animated/rainy_day.gif"),
      rainy_night: require("../assets/animated/rainy_night.gif"),
      snowy_day: require("../assets/animated/snowy_day.gif"),
      snowy_night: require("../assets/animated/snowy_night.gif"),
   }

   const forecastImages = {
      day: "https://openweathermap.org/img/wn/01d@2x.png",
      cloudy_day: "https://openweathermap.org/img/wn/03d@2x.png",
      rainy_day: "https://openweathermap.org/img/wn/10d@2x.png",
      snowy_day: "https://openweathermap.org/img/wn/13d@2x.png",
   }

   const getWeatherCondition = () => {
      switch (weatherData.current.weather[0].main) {
         case "Clear":
            return images[`${currentTime}`]

         case "Clouds":
            return images[`cloudy_${currentTime}`]

         case "Rain":
            return images[`rainy_${currentTime}`]

         case "Snow":
            return images[`snowy_${currentTime}`]

         default:
            return images[`${currentTime}`]
      }
   }

   const getForecastCondition = () => {
      switch (forecastData) {
         case "Clear":
            return forecastImages.day

         case "Clouds":
            return forecastImages.cloudy_day

         case "Rain":
            return forecastImages.rainy_day

         case "Snow":
            return forecastImages.snowy_day

         default:
            return forecastImages.day
      }
   }

   const weatherCondition = getWeatherCondition()
   const forecastCondition = getForecastCondition()

   return isForecast ? (
      <Image
         style={forecastStyles.statusImage}
         source={{ uri: forecastCondition }}
      />
   ) : (
      <Image style={styles.statusImage} source={weatherCondition} />
   )
}

const styles = StyleSheet.create({
   statusImage: {
      width: 300,
      height: 300,
   },
})
const forecastStyles = StyleSheet.create({
   statusImage: {
      width: 80,
      height: 80,
   },
})
