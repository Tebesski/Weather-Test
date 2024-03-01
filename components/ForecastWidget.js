import { useContext } from "react"
import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native"
import { WeatherContext } from "../context/WeatherContext"
import WeatherStatusImage from "./WeatherStatusImage"
import { SearchContext } from "../context/SearchContext"

export default function ForecastWidget() {
   const { units, currentTime, forecastData, isLoading } =
      useContext(WeatherContext)
   const { isLoading: searchIsLoading } = useContext(SearchContext)
   const themeStyles = currentTime === "day" ? styles : darkStyles

   const DATA = forecastData
      ? forecastData.daily.slice(1).map((day, index) => {
           const date = new Date()
           date.setDate(date.getDate() + index + 1)

           return {
              day: new Intl.DateTimeFormat("default", {
                 weekday: "short",
                 timeZone: "UTC",
              }).format(date),
              temp: day.temp.day,
              weather: day.weather[0],
              forecast: day.weather[0].main,
              id: index.toString(),
           }
        })
      : []

   const Item = ({ day, temp, weather, forecast, styles }) => {
      const isLongDescription = weather.description.length > 14

      return isLoading || searchIsLoading ? null : (
         <View style={themeStyles.item}>
            <WeatherStatusImage forecastData={forecast} isForecast={true} />
            <Text
               style={[
                  themeStyles.description,
                  isLongDescription ? styles.longDescription : {},
               ]}
            >
               {weather.description.charAt(0).toUpperCase() +
                  weather.description.slice(1)}
            </Text>
            <Text style={themeStyles.title}>{day}</Text>
            <View style={{ flexDirection: "row" }}>
               <Text style={themeStyles.title}>
                  {units === "metric"
                     ? Number(temp).toFixed(0)
                     : ((Number(temp) * 9) / 5 + 32).toFixed(0)}
               </Text>
               <Text style={themeStyles.title}>
                  {units === "metric" ? "°C" : "°F"}
               </Text>
            </View>
         </View>
      )
   }

   return (
      <View style={styles.weatherForecastContainer}>
         <SafeAreaView>
            <FlatList
               data={DATA}
               renderItem={({ item }) => (
                  <Item
                     day={item.day}
                     temp={item.temp}
                     weather={item.weather}
                     forecast={item.forecast}
                     styles={themeStyles}
                  />
               )}
               keyExtractor={(item) => item.id}
               horizontal
            />
         </SafeAreaView>
      </View>
   )
}

const styles = StyleSheet.create({
   weatherForecastContainer: {
      flexDirection: "row",
      flex: 1,
   },
   longDescription: {
      fontSize: 11,
   },
   item: {
      minWidth: 115,
      maxWidth: 115,
      height: 130,
      backgroundColor: "#0784b5",
      opacity: 0.7,
      padding: 10,
      marginHorizontal: 11.5,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "flex-end",
   },
   title: {
      fontSize: 16,
   },
   description: {
      fontSize: 12,
      color: "lightgrey",
   },
})

const darkStyles = StyleSheet.create({
   item: {
      minWidth: 115,
      maxWidth: 115,
      height: 130,
      backgroundColor: "#565656",
      opacity: 0.7,
      padding: 10,
      marginHorizontal: 11.5,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "flex-end",
   },
   title: {
      fontSize: 16,
      color: "white",
   },
   description: {
      fontSize: 12,
      color: "lightgrey",
   },
})
