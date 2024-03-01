import { createContext, useState, useEffect } from "react"
import { View, Text } from "react-native"
import SearchModal from "../components/SearchModal"
import { Keyboard } from "react-native"
import { getCurrentLocation } from "../api/api"
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const SearchContext = createContext("", "")

export const SearchProvider = ({ children }) => {
   const [isModalVisible, setModalVisible] = useState(false)

   const [selectedCountry, setSelectedCountry] = useState("")
   const [selectedCity, setSelectedCity] = useState("")
   const [selectedCountryCode, setSelectedCountryCode] = useState("")

   const [selectedCityLat, setSelectedCityLat] = useState("")
   const [selectedCityLon, setSelectedCityLon] = useState("")

   const [isLoading, setIsLoading] = useState(true)

   const [errorMessage, setErrorMessage] = useState(null)

   useEffect(() => {
      const fetchUserLocation = async () => {
         const lat = await AsyncStorage.getItem("latitude")
         const lon = await AsyncStorage.getItem("longitude")

         if (lat && lon) {
            setSelectedCityLat(lat)
            setSelectedCityLon(lon)
            setIsLoading(false)
         } else {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
               console.error("Permission to access location was denied")
               setSelectedCityLat(process.env.DEFAULT_LAT)
               setSelectedCityLon(process.env.DEFAULT_LON)
               setIsLoading(false)
               return
            }

            let location = await Location.getLastKnownPositionAsync({})
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
      if (selectedCity && selectedCountry) {
         getCurrentLocation(selectedCity, selectedCountry).then((data) => {
            const city = data.find(
               (item) => item.country === selectedCountryCode
            )

            if (city?.length > 0) {
               console.log(city)
               setSelectedCityLat(city[0].lat)
               setSelectedCityLon(city[0].lon)
            } else {
               setSelectedCityLat(data[0].lat)
               setSelectedCityLon(data[0].lon)
            }
         })
      }
      setModalVisible(false)
      Keyboard.dismiss()
   }

   const handleSearchPress = () => {
      if (selectedCountry && selectedCountryCode) {
         handleSearch()
      } else {
         setSelectedCountryCode((currentCountryCode) => {
            handleSearch()
            return currentCountryCode
         })
      }
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
            setErrorMessage,
            errorMessage,
            setSelectedCountryCode,
            selectedCountryCode,
            handleSearchPress,
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
                  handleSearchPress={handleSearchPress}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setSelectedCountryCode={setSelectedCountryCode}
                  selectedCountryCode={selectedCountryCode}
               />
            </>
         )}
      </SearchContext.Provider>
   )
}
