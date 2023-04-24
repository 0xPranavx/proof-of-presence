import { View, Text, Button } from 'react-native'
import React from 'react'

import { useWallet } from '../context/Wallet'

const Login = () => {

    const { login, userData } = useWallet()

  return (
    // Container with button for login and if userData present then text
    // show button and text in middle of screen
    <View style={{ flex: 1 }}>
        <Button title="Login" onPress={login} />
        {userData && <Text>{JSON.stringify(userData)}</Text>}
    </View>
  )
}

export default Login