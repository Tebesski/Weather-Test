import { createContext, useState, useEffect } from "react"
import { View, Text } from "react-native"
import SearchModal from "../components/SearchModal"
import { Keyboard } from "react-native"
import { getCurrentLocation } from "../api/api"
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const SearchContext = createContext("", "")

export const SearchProvider = ({ children }) => {
   const DEFAULT_LAT = "33"
   const DEFAULT_LON = "22"
   const [isModalVisible, setModalVisible] = useState(false)

   const [selectedCountry, setSelectedCountry] = useState("")
   const [selectedCity, setSelectedCity] = useState("")

   const [selectedCityLat, setSelectedCityLat] = useState("")
   const [selectedCityLon, setSelectedCityLon] = useState("")

   const [isLoading, setIsLoading] = useState(true)

   const [errorMessage, setErrorMessage] = useState(null)

   useEffect(() => {
      const fetchUserLocation = async () => {
         let lat = await AsyncStorage.getItem("latitude")
         let lon = await AsyncStorage.getItem("longitude")

         if (lat && lon) {
            setSelectedCityLat(lat)
            setSelectedCityLon(lon)
            setIsLoading(false)
         } else {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
               console.error("Permission to access location was denied")
               setSelectedCityLat(DEFAULT_LAT)
               setSelectedCityLon(DEFAULT_LON)
               setIsLoading(false)
               return
            }

            let location = await Location.getCurrentPositionAsync({})
            setSelectedCityLat(location.coords.latitude.toString())
            setSelectedCityLon(location.coords.longitude.toString())
            setIsLoading(false)

            AsyncStorage.setItem(
               "latitude",
               location.coords.latitude.toString()
            )
            AsyncStorage.setItem(
               "longitude",
               location.coords.longitude.toString()
            )
         }
      }

      fetchUserLocation()
   }, [])

   const toggleModal = () => {
      setModalVisible(!isModalVisible)
   }

   const handleSearch = () => {
      if (selectedCity) {
         getCurrentLocation(selectedCity).then((data) => {
            setSelectedCityLat(data[0].lat)
            setSelectedCityLon(data[0].lon)
         })
      }
      setModalVisible(false)
      Keyboard.dismiss()
   }

   return (
      <SearchContext.Provider
         value={{
            toggleModal,
            selectedCityLat,
            selectedCityLon,
            selectedCity,
            selectedCountry,
            setSelectedCity,
            setSelectedCountry,
            handleSearch,
            DEFAULT_LAT,
            DEFAULT_LON,
            setErrorMessage,
            errorMessage,
         }}
      >
         {isLoading ? (
            <View>
               <Text style={{ color: "gray" }}>Loading...</Text>
            </View>
         ) : (
            <>
               {children}
               <SearchModal
                  isModalVisible={isModalVisible}
                  setModalVisible={setModalVisible}
                  handleSearch={handleSearch}
                  setSelectedCity={setSelectedCity}
                  setSelectedCountry={setSelectedCountry}
                  selectedCountry={selectedCountry}
                  selectedCity={selectedCity}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
               />
            </>
         )}
      </SearchContext.Provider>
   )
}
