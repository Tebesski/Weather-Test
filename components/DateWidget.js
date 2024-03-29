import { View, Text, StyleSheet } from "react-native"
import { useContext, useEffect, useState } from "react"
import IconI from "react-native-vector-icons/Ionicons"
import { WeatherContext } from "../context/WeatherContext"
import { SearchContext } from "../context/SearchContext"

export default function DateWidget() {
   const [time, setTime] = useState(new Date())
   const { weatherData, currentTime, isLoading } = useContext(WeatherContext)
   const { isLoading: searchIsLoading } = useContext(SearchContext)
   const themeStyles = currentTime === "night" ? darkStyles : styles

   let date, day, dayNumber, formattedTime
   if (weatherData) {
      date = new Date(
         (weatherData.current.dt + weatherData.timezone_offset) * 1000
      )

      day = new Intl.DateTimeFormat("default", {
         weekday: "short",
         timeZone: "UTC",
      }).format(date)

      dayNumber = date.getUTCDate()

      formattedTime = `${time.getUTCHours().toString().padStart(2, "0")}:${time
         .getUTCMinutes()
         .toString()
         .padStart(2, "0")}:${time.getUTCSeconds().toString().padStart(2, "0")}`
   }

   useEffect(() => {
      if (weatherData) {
         const updateTime = () => {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000)
            const localTimeInSeconds =
               currentTimeInSeconds + weatherData.timezone_offset
            setTime(new Date(localTimeInSeconds * 1000))
         }

         updateTime()

         const timer = setInterval(updateTime, 1000)

         return () => {
            clearInterval(timer)
         }
      }
   }, [weatherData?.timezone_offset])

   return weatherData ? (
      <View style={styles.dateWidgetContainer}>
         <View style={styles.dateWidgetCombo}>
            <IconI
               color={`${currentTime === "day" ? "#0784b5" : "white"}`}
               name="calendar-clear-outline"
               size={24}
            />
            <Text style={themeStyles.dateWidgetDay}>
               {day}, {dayNumber}
            </Text>
         </View>
         <View style={styles.dateWidgetCombo}>
            <IconI
               color={`${currentTime === "day" ? "#0784b5" : "white"}`}
               name="time-outline"
               size={24}
            />
            <Text style={themeStyles.dateWidgetDay}>{formattedTime}</Text>
         </View>
      </View>
   ) : null
}

const styles = StyleSheet.create({
   dateWidgetContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
   },
   dateWidgetCombo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
   },
   dateWidgetDay: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000035",
      width: 110,
   },
})

const darkStyles = StyleSheet.create({
   dateWidgetDay: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      textAlignVertical: "center",
      width: 110,
   },
})
