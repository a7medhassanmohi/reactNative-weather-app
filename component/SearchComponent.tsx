import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { HandleInput } from '../App';

type Debouncing<T extends HandleInput>=(func:T,time:number)=>(...args: Parameters<T>)=>void;
type Search=(text:string)=>void;
type OpenSearch=()=>void
interface Props{
    debouncing:Debouncing<HandleInput>,
    handleSearch:Search,
}
const SearchComponent:React.FC<Props > = ({debouncing,handleSearch}) => {
    const slide = useRef(new Animated.Value(1000)).current;
    const [isOpen, setisOpen] = useState<Boolean>(false)
    function handleOpenSearch(){
        if(isOpen){
    
          Animated.timing(slide, {
            toValue: 1000,
            duration: 500,
            useNativeDriver: true,
          }).start();
          setisOpen(false)
        }else{
          Animated.timing(slide, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
          setisOpen(true)
        }
      }

    const animatedStyle = {
        transform: [{ translateX: slide.interpolate({
          inputRange: [0, 100],
          outputRange: [0,100],
        })}],
      };
  return (
    <>
     <Animated.View style={animatedStyle}>
          <TextInput style={style.searchInput} autoCorrect={false} onChangeText={debouncing(handleSearch,1000)} />
          </Animated.View>
          
          <TouchableOpacity style={style.iconCon} onPress={handleOpenSearch}>
            <Ionicons name="md-search-outline" size={24} color="#d0cccc" />
          </TouchableOpacity>
          </>
)}

const style = StyleSheet.create({

    searchInput: {
        backgroundColor: "#8080804f",
        height: "100%",
        paddingHorizontal:10,
        fontSize:20,
        borderRadius: 50,
        color:"#c8c4c4",
       
      },
      iconCon: {
        position: "absolute",
        right: 0,
        height: 60,
        width: 60,
        backgroundColor: "#605f5f",
        borderRadius: 50,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      },
  })

export default SearchComponent