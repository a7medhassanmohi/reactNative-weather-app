import axios,{AxiosPromise} from "axios"
const APIKEY="f6af4853ae18499caca145802211405"
 const BaseUrl="http://api.weatherapi.com/v1/"
export const weatherImages = {
    'Partly cloudy': require('../assets/images/partlycloudy.png'),
    'Moderate rain': require('../assets/images/moderaterain.png'),
    'Patchy rain possible': require('../assets/images/moderaterain.png'),
    'Sunny': require('../assets/images/sun.png'),
    'Clear': require('../assets/images/sun.png'),
    'Overcast': require('../assets/images/cloud.png'),
    'Cloudy': require('../assets/images/cloud.png'),
    'Light rain': require('../assets/images/moderaterain.png'),
    'Moderate rain at times': require('../assets/images/moderaterain.png'),
    'Heavy rain': require('../assets/images/heavyrain.png'),
    'Heavy rain at times': require('../assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
    'Mist': require('../assets/images/mist.png'),
    'Fog': require('../assets/images/mist.png'),
    'other': require('../assets/images/moderaterain.png')
}


export function WeatherApi(country:string|number):AxiosPromise{

    return axios.get(`${BaseUrl}forecast.json?key=${APIKEY}&q=${country}&days=4&aqi=no&alerts=no`)

}
export function WeatherApiٍSearch(country:string):AxiosPromise{

    return axios.get(`${BaseUrl}search.json?key=${APIKEY}&q=${country}`)
 
 }
