import { createContext, useState, useEffect } from "react"
import SearchModal from "../components/SearchModal"
import { Keyboard } from "react-native"
import { getCurrentLocation } from "../api/api"
import * as Location from "expo-location"

export const SearchContext = createContext("", "")

export const SearchProvider = ({ children }) => {
   const [isModalVisible, setModalVisible] = useState(false)

   const [selectedCountry, setSelectedCountry] = useState("")
   const [selectedCity, setSelectedCity] = useState("")
   const [selectedCountryCode, setSelectedCountryCode] = useState("")

   const [userLocationAccess, setUserLocationAccess] = useState()
   const [userLocation, setUserLocation] = useState(null)

   const [selectedCityLat, setSelectedCityLat] = useState("")
   const [selectedCityLon, setSelectedCityLon] = useState("")

   const [isLoading, setIsLoading] = useState(true)

   const [errorMessage, setErrorMessage] = useState(null)

   useEffect(() => {
      const fetchUserLocation = async () => {
         let { status } = await Location.requestForegroundPermissionsAsync()
         if (status !== "granted") {
            setUserLocationAccess(false)
            console.error("Permission to access location was denied")
            setSelectedCityLat(process.env.EXPO_PUBLIC_DEFAULT_LAT)
            setSelectedCityLon(process.env.EXPO_PUBLIC_DEFAULT_LON)
            setIsLoading(false)
            return
         }

         setUserLocationAccess(true)
         let location = await Location.getCurrentPositionAsync({})
         setUserLocation(location)
         setSelectedCityLat(location.coords.latitude.toString())
         setSelectedCityLon(location.coords.longitude.toString())
         setIsLoading(false)
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
            userLocation,
            userLocationAccess,
         }}
      >
         {
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
         }
      </SearchContext.Provider>
   )
}
