import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const Loading:React.FC = () => {
  return (
    <View style={{justifyContent:"center",flex:1 ,backgroundColor:"gray"}}>
  <StatusBar style='light'/>
    <Image
        source={require("../assets/bg.png")}
        style={style.image}
        blurRadius={70}
      />
  <ActivityIndicator size="large" />
  </View> 
)}
const style = StyleSheet.create({

  image: {
    position: "absolute",
    height: "100%",
  },
})
export default Loading