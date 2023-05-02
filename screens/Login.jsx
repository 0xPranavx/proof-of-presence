import { View, Text, TouchableOpacity ,Image ,StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useWallet } from '../context/Wallet'

const Login = ({ navigation }) => {

    const { login, userData , loggedIn, loadStorageData } = useWallet() ;

    const loginFunc = async () => {
        await login() ;
        console.log(`login page - ${loggedIn}`);
        loggedIn && navigation.navigate("Profile");
    }
    
    useEffect(() => {
      loadStorageData()
    }, []);

  return (
    // Container with button for login and if userData present then text
    // show button and text in middle of screen
    <View style={styles.Container}>

        <TouchableOpacity title="Login" onPress={ async()=>{ await login() ;console.log(`login page - ${loggedIn}`); loggedIn && navigation.navigate("Profile"); }} >
          <View>
          <Image source={require("./image/btn.png")} style={{width: 300, height: 40}} />
          </View>
        </TouchableOpacity>
    </View>
    
  )
};


const styles = StyleSheet.create({
    Container:{
      flex:1,
      flexDirection:'column',
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:'#b3b3b3',
    }
})

export default Login