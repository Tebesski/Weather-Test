import { useEffect, useState } from "react"
import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   TextInput,
   TouchableOpacity,
} from "react-native"
import Modal from "react-native-modal"
import IconF from "react-native-vector-icons/Feather"
import { getCountries, getCities } from "../api/api"

import { Picker } from "@react-native-picker/picker"

export default function SearchModal({
   isModalVisible,
   setModalVisible,
   selectedCountry,
   setSelectedCountry,
   selectedCity,
   setSelectedCity,
   errorMessage,
   setErrorMessage,
   setSelectedCountryCode,
   handleSearchPress,
}) {
   const [countries, setCountries] = useState([])
   const [cities, setCities] = useState([])

   const [filteredCountries, setFilteredCountries] = useState([])
   const [filteredCities, setFilteredCities] = useState([])

   const [selectedInput, setSelectedInput] = useState(null)

   useEffect(() => {
      setSelectedCity("")
   }, [selectedCountry])

   useEffect(() => {
      if (countries) {
         setFilteredCountries(
            countries.filter((country) =>
               country.name.common
                  .toLowerCase()
                  .includes(selectedCountry.toLowerCase())
            )
         )
      }
   }, [selectedCountry, countries])

   useEffect(() => {
      if (cities.data?.length > 0) {
         setFilteredCities(
            cities.data.filter((city) =>
               city.toLowerCase().includes(selectedCity.toLowerCase())
            )
         )
      } else {
         setFilteredCities([])
      }
   }, [selectedCity, cities])

   useEffect(() => {
      getCountries()
         .then((data) => setCountries(data))
         .catch((err) => {
            console.error("Error getting countries in SearchModal", err)
         })
   }, [])

   useEffect(() => {
      if (selectedCountry) {
         getCities(selectedCountry.toLowerCase())
            .then((data) => {
               if (data.error) {
                  setCities([])
               }
               setCities(data)
            })
            .catch((err) => {
               console.error("Error gettingCities in SearchModal", err)
            })
      }
   }, [selectedCountry])

   const CountryPicker = ({
      selectedCountry,
      setSelectedCountry,
      setSelectedCountryCode,
      countries,
   }) => {
      return (
         <Picker
            selectedValue={selectedCountry}
            onValueChange={(itemValue, itemIndex) => {
               setSelectedCountry(itemValue)
               setSelectedCountryCode(countries[itemIndex].cca2)
            }}
            style={{ top: -25 }}
         >
            {countries
               .sort((a, b) => a.name.common.localeCompare(b.name.common))
               .map((item, index) => (
                  <Picker.Item
                     enabled={false}
                     key={item.cca3 || index}
                     label={`${item.flag || ""} ${
                        item.name ? item.name.common : item
                     }`}
                     value={item.name.common || item}
                  />
               ))}
         </Picker>
      )
   }

   const CityPicker = ({ selectedCity, setSelectedCity }) => {
      return (
         <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => {
               setSelectedCity(itemValue)
            }}
            style={{ top: -25 }}
         >
            {filteredCities.sort().map((item, index) => (
               <Picker.Item key={index} label={item} value={item} />
            ))}
         </Picker>
      )
   }

   function truncate(input, length) {
      if (input.length > length) {
         return input.substring(0, length) + "..."
      }
      return input
   }

   const inputsOrder = ["country", "city"]

   return (
      <Modal
         isVisible={isModalVisible}
         onBackdropPress={() => {
            setSelectedInput(null)
            setModalVisible(false)
         }}
         onBackButtonPress={() => {
            setSelectedInput(null)
            setModalVisible(false)
         }}
         style={styles.modal}
      >
         <SafeAreaView style={styles.modalContainer}>
            {inputsOrder.map((input) => {
               return (
                  <View key={input}>
                     <Text style={styles.modalText}>Select a {input}</Text>
                     <TextInput
                        style={styles.modalInput}
                        value={
                           {
                              country: truncate(selectedCountry, 15),
                              city: truncate(selectedCity, 15),
                           }[input]
                        }
                        onChangeText={(text) => {
                           if (input === "country") setSelectedCountry(text)
                           if (input === "city") setSelectedCity(text)
                        }}
                        onFocus={(event) => {
                           if (input === "city" && !selectedCountry) {
                              event.target.blur()
                           } else {
                              setSelectedInput(input)
                           }
                        }}
                        onBlur={() => setSelectedInput(null)}
                        onSubmitEditing={() => {
                           if (
                              input === "country" &&
                              filteredCountries.length > 0
                           ) {
                              setSelectedCountry(
                                 filteredCountries[0].name.common
                              )
                           }
                           if (input === "city" && filteredCities.length > 0) {
                              setSelectedCity(filteredCities[0])
                           }
                        }}
                     />
                     <IconF
                        style={{
                           position: "absolute",
                           right: 10,
                           top: 45,
                           zIndex: 1,
                           fontSize: 30,
                        }}
                        name="delete"
                        onPress={() => {
                           if (input === "country") setSelectedCountry("")
                           if (input === "city") setSelectedCity("")
                        }}
                     />
                  </View>
               )
            })}
            {selectedInput && (
               <View style={styles.overlay}>
                  {selectedInput === "country" && (
                     <CountryPicker
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        countries={filteredCountries}
                        setSelectedCountryCode={setSelectedCountryCode}
                     />
                  )}
                  {selectedInput === "city" && (
                     <CityPicker
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        cities={filteredCities}
                     />
                  )}
               </View>
            )}

            <View
               style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <TouchableOpacity
                  style={styles.checkWeatherButton}
                  onPress={() => {
                     if (
                        !filteredCountries.some(
                           (country) => country.name.common === selectedCountry
                        ) ||
                        !filteredCities.includes(selectedCity)
                     ) {
                        setErrorMessage(
                           "Please select a valid country and city from the list."
                        )
                        setTimeout(() => {
                           setErrorMessage(null)
                        }, 2000)
                     } else {
                        handleSearchPress()
                     }
                  }}
               >
                  <Text style={{ fontSize: 16 }}>Let's check the weather!</Text>
               </TouchableOpacity>
               <Text
                  style={{
                     alignSelf: "center",
                     width: 250,
                     textAlign: "center",
                     color: "#FF3333",
                  }}
               >
                  {errorMessage}
               </Text>
            </View>
         </SafeAreaView>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      position: "absolute",
      top: "43%",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      backgroundColor: "white",
   },
   centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
   },
   modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "80%",
      height: "30%",
   },
   modal: {
      justifyContent: "center",
      alignItems: "center",
   },
   modalContainer: {
      width: "80%",
      height: "50%",
      backgroundColor: "lightblue",
      justifyContent: "flex-start",
      alignItems: "center",
      opacity: 0.8,
   },
   modalText: {
      fontSize: 24,
      alignSelf: "center",
      paddingTop: 10,
   },
   modalInput: {
      borderColor: "black",
      borderRadius: 5,
      paddingLeft: 10,
      fontSize: 24,
      marginBottom: 12,
      backgroundColor: "white",
      minWidth: 235,
      height: 45,
   },
   chooseModalContainer: {
      justifyContent: "flex-end",
      margin: 0,
      backgroundColor: "lightblue",
   },
   chooseModalContent: {
      backgroundColor: "lightblue",
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      borderColor: "rgba(0, 0, 0, 0.1)",
      height: "30%",
   },
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5FCFF",
   },
   titleText: {
      color: "#000",
      fontSize: 25,
      marginBottom: 25,
      fontWeight: "bold",
   },
   pickerTitleStyle: {
      justifyContent: "center",
      flexDirection: "row",
      alignSelf: "center",
      fontWeight: "bold",
   },
   pickerStyle: {
      height: 54,
      width: 150,
      marginVertical: 10,
      borderColor: "#303030",
      alignItems: "center",
      marginHorizontal: 10,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 5,
      borderWidth: 2,
      fontSize: 16,
      color: "#000",
   },
   selectedCountryTextStyle: {
      paddingLeft: 5,
      color: "#000",
      textAlign: "right",
   },

   countryNameTextStyle: {
      paddingLeft: 10,
      color: "#000",
      textAlign: "right",
   },

   searchBarStyle: {
      flex: 1,
   },
   checkWeatherButton: {
      backgroundColor: "cyan",
      borderRadius: 15,
      padding: 10,
      margin: 15,
      height: 40,
   },
})
