import { useState,useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View,TouchableOpacity,Text,Image } from 'react-native';

import { useWallet } from "../context/Wallet"


export default function Profile({ navigation }) { 

  const { userData } = useWallet();
  
  return (
    <View style={styles.container}>

      <View style={{height:45 , backgroundColor:"#b3b3b3" , borderBottomWidth:5 , borderBottomColor:"#b3b3b3"}}>

      </View>
      
      <View style={styles.userDataDisplayContainer}>
        {userData && <DisplayUserInfo userdata={userData}/>}
        <View style={{padding:7}}>
        <Text style={{color:'#FFFFFF'}}>{userData.userInfo.email}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity   style={styles.button}
        onPress={() => navigation.navigate("Presence")}>
        <Text> location</Text>
        </TouchableOpacity>
      </View>
     
      <StatusBar style="auto" />
     
     
    </View>
    );
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    justifyContent: 'space-between',
    
    paddingBottom:63,
  },

  userDataDisplayContainer:{
    flex: 1,
    backgroundColor: '#3d3d3d',
    paddingBottom:63,
  },

  buttonContainer:{
    
    flexDirection:"row",
    justifyContent:"center",

  },
 
  button:{
    textAlign:'center',
    backgroundColor:'yellow',
    maxWidth:75,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 15,

  },
  
  profileBar:{
    
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:10,
    backgroundColor:"#3d3d3d",
    padding:10 ,
    borderBottomColor:"black",
    borderBottomWidth:2
  }
 
});

const DisplayUserInfo = (props)=>{
  
  return(
    <View style={styles.profileBar}>
      <Text style={{color:'#FFFFFF'}}>{props.userdata.userInfo.name}</Text>
      <TouchableOpacity>
        <View>
          <Image source={{uri: props.userdata.userInfo.profileImage}} style={{ width :50 , height:50 ,borderRadius:50}}/>
        </View>
      </TouchableOpacity>
      
    </View>
  )
}