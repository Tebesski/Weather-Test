import { useContext } from "react"
import { StyleSheet, View, Text } from "react-native"
import WeatherStatusImage from "./WeatherStatusImage"
import WeatherWidgetLocation from "./WeatherWidgetLocation"
import WeatherTempUnits from "./WeatherTempUnits"
import VariousInfoWidget from "./VariousInfoWidget"
import DateWidget from "./DateWidget"
import { WeatherContext } from "../context/WeatherContext"
import GeraltQuote from "./GeraltQuote"

export default function WeatherWidget() {
   const { isLoading } = useContext(WeatherContext)

   return isLoading ? (
      <Text>"Loading..."</Text>
   ) : (
      <View style={styles.weatherWidgetContainer}>
         <View style={styles.weatherA}>
            <WeatherWidgetLocation />
            <WeatherStatusImage forecast={false} />
            <WeatherTempUnits />
         </View>

         <View style={styles.weatherB}>
            <GeraltQuote />
            <View style={{ display: "flex", gap: 20 }}>
               <VariousInfoWidget />
               <DateWidget />
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   weatherWidgetContainer: {
      flex: 3,
      flexDirection: "column",
      width: "100%",
   },

   weatherA: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
   },
   weatherB: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-evenly",
      width: "100%",
   },
})
