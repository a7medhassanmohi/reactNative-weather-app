import { View, Text, StyleSheet, Image, TextInput,Alert, ScrollView,TouchableOpacity,ActivityIndicator,StatusBar,Animated, KeyboardAvoidingView, Keyboard } from "react-native";
import React, { useEffect, useState,useRef } from "react";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import {AxiosResponse} from "axios";
import { WeatherApi, WeatherApiٍSearch, weatherImages } from "./utility";
import Loading from "./component/Loading";
import SearchComponent from "./component/SearchComponent";
type Condition="Partly cloudy" |"Moderate rain"|"Patchy rain possible"|"Sunny" |"Clear"|"Overcast"|"Cloudy"|"Light rain"|"Moderate rain at times"|"Heavy rain"|"Heavy rain at times"|"Moderate or heavy freezing rain"|"Moderate or heavy rain shower"|"Moderate or heavy rain with thunder"|"Mist"|"other"
interface WeatherData{
  city:String,
  country:String,
  time:string,
  temp:number,
  condition:Condition,
  wind:number,
  humidity:number,
}
interface ForeCastData{
  id:string
  temp:number,
  condition:Condition,
}
interface Search{
[key:string]:string | number
}
export type HandleInput=(...args:string[])=>void
const App: React.FC = () => {
  const [weatherData, setweatherData] = useState<WeatherData | null>(null)
  const [foreCastData, setforeCastData] = useState<ForeCastData[] | null>(null)
  const [loading, setloading] = useState<Boolean>(false)
  const [Search, setSearch] = useState<Search[]|null >(null)
  function convertData(date:string):string{
    const newDate = new Date(date);
    const timeString = newDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return  `${timeString}`
  }

    function handleInput(text:string|number):void{
      setSearch(null)
      setloading(true)
      WeatherApi(text).then((res:AxiosResponse)=>{
        const{location:{name,country,localtime},current:{temp_c,condition:{text},wind_kph,humidity},forecast:{forecastday}}=res.data
        const foreCast=forecastday.map((it:any,i:number)=>{
          const {avgtemp_c,condition:{text}}=it.day
          return {temp:avgtemp_c,condition:text,id:text+avgtemp_c+i}
        })
        setforeCastData(foreCast)
        setweatherData({city:name,country,time:convertData(localtime),
          temp:temp_c,condition:text,wind:wind_kph,humidity:humidity})
          setloading(false)
      }).catch((err)=>{
        Alert.alert("somthing went wrong",err.message)
        setloading(false)
      });
    
  }
  function handleSearch(text:string):void{
    setSearch(null)
    if(text.length<2)return
    WeatherApiٍSearch(text).then((res:AxiosResponse)=>{
      if(res.data.length){

        setSearch(res.data)
        Keyboard.dismiss()
      }
      
    }).catch((err)=>{
      Alert.alert("somthing went wrong",err.message)
      Keyboard.dismiss()
    });
  
}
 
  function debouncing<T extends HandleInput >(func:T,time:number):(...args: Parameters<T>) => void {
    let timeout:  NodeJS.Timeout
    return function(this:any,...args: Parameters<T>){
      const context = this;
      const argument=arguments
      clearTimeout(timeout)
      timeout=setTimeout(()=>{
        func.apply(this,args)
      },time)
    }
  }

if(loading){
return <Loading/>
}
  return (
    <View style={style.appContainer}>
      <StatusBar barStyle="light-content"/>
      <Image
        source={require("./assets/bg.png")}
        style={style.image}
        blurRadius={70}
      />
      <ScrollView style={style.allContent}>
        <View style={style.SearchContainer}>
         
         <SearchComponent debouncing={debouncing} handleSearch={handleSearch}  />
        </View>
        <KeyboardAvoidingView behavior="position" style={style.autoComplete}>
        <>
          {Search && Search.length && Search.map((it)=>{
            return (<TouchableOpacity key={it?.id} style={style.autoComplete_item} onPress={handleInput.bind(this,it.url)}>
              <Text style={style.autoComplete_item_text}>{it?.country}</Text>
              <Text style={style.autoComplete_item_text}>{it?.name}</Text>
              </TouchableOpacity>
            )
          }) }
         </>
        
        </KeyboardAvoidingView>
       
        <View style={style.nameCont}>
          <Text style={style.countryName}>{weatherData?.country}</Text>
          <Text style={style.cityName}>{weatherData?.city}</Text>
        </View>
        <View style={style.weatherInfo}>
          <Image
            source={weatherImages[weatherData?.condition || "other"]}
            resizeMode="contain"
            style={{ width: "100%", height: 200 }}
          />
          <Text style={style.degree}>{weatherData?.temp}</Text>
          <Text style={style.type}>{weatherData?.condition}</Text>
          <View style={style.extraInfo}>
            <View style={style.extraInfo_item}>
              <Feather name="wind" size={24} color="#c8c4c4" />
              <Text style={style.extraInfo_item_text}>{weatherData?.wind} Km</Text>
            </View>
            <View style={style.extraInfo_item}>
              <Ionicons name="water-outline" size={24} color="#c8c4c4" />
              <Text style={style.extraInfo_item_text}>{weatherData?.humidity} %</Text>
            </View>
            <View style={style.extraInfo_item}>
              <Ionicons name="sunny-outline" size={24} color="#c8c4c4" />
              <Text style={style.extraInfo_item_text}>{weatherData?.time}</Text>
            </View>
          </View>
        </View>
        <View style={style.forcast_title}>
          <AntDesign name="calendar" size={24} color="#c8c4c4" />
          <Text style={style.forcast_title_text}>Daily ForeCast</Text>
        </View>

        <ScrollView style={style.forecast} horizontal={true}>
          {foreCastData?.map((it)=>{
            return (  <View style={style.forecast_item} key={it.id}>
              <Image
                source={weatherImages[it?.condition]}
                resizeMode="contain"
                style={{ width: "100%", height: 30 }}
              />
              <Text style={style.forecast_item_degree}>{it?.temp}</Text>
              <Text style={style.forecast_item_type}>{it?.condition}</Text>
            </View>)
          })}
        </ScrollView>
      
      </ScrollView>
    </View>
  );
};
const style = StyleSheet.create({
  appContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#9b3d3d",
  },
  image: {
    position: "absolute",
    height: "100%",
  },
  allContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  SearchContainer: {
    marginTop: 20,
    borderRadius: 50,
    overflow: "hidden",
    height: 60,
    position: "relative",
    justifyContent: "center",
    zIndex:100
  },
  
  countryName: {
    fontSize: 23,
    color: "#d1cfcf",
    fontWeight: "800",
    textAlign:"center"
  },
  cityName: {
    fontSize: 23,
    color: "#dbd7d78e",
    width:"60%",
    textAlign:"center"
  },
  nameCont: {
    marginTop: 20,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  weatherInfo: {
    marginTop: 30,
    justifyContent: "center",
  },
  degree: {
    color: "#d4d0d0",
    fontSize: 70,
    fontWeight: "800",
    textAlign: "center",
  },
  type: { color: "#d4d0d0", fontSize: 30, textAlign: "center" },
  extraInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  extraInfo_item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  extraInfo_item_text: {
    color: "#c8c4c4",
    marginLeft: 5,
  },
  forecast: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 30,
    marginBottom:50
   
  },
  forecast_item: {
    alignItems: "center",
    backgroundColor: "#c6c3c327",
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginHorizontal: 10,
  },
  forecast_item_degree: {
    color: "#c8c4c4",
    fontSize: 20,
  },
  forecast_item_type: {
    color: "#c8c4c4",
    fontSize: 18,
    textAlign:"center"
  },
  forcast_title: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  forcast_title_text: {
    color: "#c8c4c4",
    marginLeft: 5,
    fontSize: 15,
    fontWeight: "500",
  },
  autoComplete:{
    position:"absolute",
    top:81,
    zIndex:99,
    backgroundColor: "#8080804f",
    borderRadius:10,
    width:"100%", 

  },
  autoComplete_item:{
    padding:10,
   borderBottomWidth:1,
   borderBottomColor:"#454545"

  },
  autoComplete_item_text:{
    color:"#ffffff",
    fontSize:15,
    fontWeight:"800",
    textAlign:"center"
  }
});
export default App;
