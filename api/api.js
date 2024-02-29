export async function getWeatherData(units, lat, lon) {
   try {
      const response = await fetch(
         `${process.env.EXPO_PUBLIC_WEATHER_API_URL}lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}`
      )
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
   } catch (error) {
      console.error(
         "There was a problem with the fetch operation: " + error.message
      )
      throw error
   }
}

export async function getForecastData(
   setIsLoading,
   setForecastData,
   units,
   lat,
   lon
) {
   setIsLoading(true)
   const response = await fetch(
      `${process.env.EXPO_PUBLIC_WEATHER_API_URL}lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}`
   )
   const data = await response.json()
   setForecastData(data)
}

export async function getLocationName(lat, lon) {
   try {
      const response = await fetch(
         `https://us1.locationiq.com/v1/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en&key=${process.env.EXPO_PUBLIC_LOCATION_API_KEY}`
      )
      const data = await response.json()
      return data
   } catch (error) {
      console.error("getLocationName", error)
   }
}

export async function getCurrentLocation(query) {
   try {
      const response = await fetch(
         `${process.env.EXPO_PUBLIC_LOCATION_SEARCH_API_URL}?key=${process.env.EXPO_PUBLIC_LOCATION_API_KEY}&q=${query}&format=json`
      )
      const data = await response.json()
      return data
   } catch (error) {
      console.error("getCurrentLocation", error)
   }
}

export async function getCountries() {
   try {
      const response = await fetch("https://restcountries.com/v3.1/all")
      const data = await response.json()
      return data
   } catch (error) {
      console.error("Error fetching countries:", error)
   }
}

export const getCities = async (country) => {
   try {
      const response = await fetch(
         "https://countriesnow.space/api/v0.1/countries/cities",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               country: country,
            }),
         }
      )
      const data = await response.json()
      return data
   } catch (error) {
      console.error("getCities", error)
   }
}
