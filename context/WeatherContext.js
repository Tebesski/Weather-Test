import React, { useState, createContext, useEffect, useContext } from "react"
import { getWeatherData, getLocationName } from "../api/api"
import { SearchContext } from "./SearchContext"
import moment from "moment-timezone"

export const WeatherContext = createContext()

export const WeatherProvider = ({ children }) => {
   const { selectedCityLat, selectedCityLon } = useContext(SearchContext)
   const [isLoading, setIsLoading] = useState(true)
   const [weatherData, setWeatherData] = useState(null)
   const [forecastData, setForecastData] = useState(null)
   const [currentLocation, setCurrentLocation] = useState(null)
   const [currentTime, setCurrentTime] = useState(null)
   const [units, setUnits] = useState("metric")

   const getTimeOfDay = (weatherData) => {
      const date = moment.unix(weatherData.current.dt).tz(weatherData.timezone)
      const hours = date.hours()
      const timeOfDay = hours > 6 && hours < 18 ? "day" : "night"
      return timeOfDay
   }

   useEffect(() => {
      setIsLoading(true)
      const lat = selectedCityLat || process.env.EXPO_PUBLIC_DEFAULT_LAT
      const lon = selectedCityLon || process.env.EXPO_PUBLIC_DEFAULT_LAT
      getWeatherData("metric", lat, lon)
         .then((data) => {
            setForecastData(data)
            setWeatherData(data)
         })
         .catch((error) =>
            console.error("Error getting weather data in WeatherContext", error)
         )
         .finally(() => setIsLoading(false))
   }, [selectedCityLat, selectedCityLon])

   useEffect(() => {
      if (weatherData) {
         if (selectedCityLat && selectedCityLon) {
            getLocationName(selectedCityLat, selectedCityLon)
               .then((data) => {
                  setCurrentLocation(data)
               })
               .catch((error) =>
                  console.error(
                     "Error getting location name in Weather Context",
                     error
                  )
               )
               .finally(() => {
                  setIsLoading(false)
               })

            setCurrentTime(getTimeOfDay(weatherData))

            return
         }
         getLocationName(
            setIsLoading,
            process.env.EXPO_PUBLIC_DEFAULT_LAT,
            process.env.EXPO_PUBLIC_DEFAULT_LAT,
            setCurrentLocation
         )
         setCurrentTime(getTimeOfDay(weatherData))
      }
   }, [weatherData, selectedCityLat, selectedCityLon])

   return (
      <WeatherContext.Provider
         value={{
            isLoading,
            weatherData,
            forecastData,
            currentLocation,
            currentTime,
            units,
            setUnits,
         }}
      >
         {children}
      </WeatherContext.Provider>
   )
}
