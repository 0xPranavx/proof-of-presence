import React, { useState, useEffect  } from 'react';
import { StyleSheet, View, Text , TouchableOpacity ,Modal,Pressable,TextInput } from 'react-native';
import MapView, { Marker ,Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import base64 from 'react-native-base64';

export default function  Presence({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleString());


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (location) {
        let addressResponse = await Location.reverseGeocodeAsync({
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        });
        setAddress(addressResponse[0]);
      }
    })();
  }, [location]);

  setInterval(() => {
    setCurrentDate(new Date().toLocaleString());
  }, 1000);

 
  
  const svf = () =>{
      
        
    const svg_part1 = ` <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs">
    <defs>
    <style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500');
  </style>
  <filter id="nnnoise-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
<feSpecularLighting surfaceScale="15" specularConstant="0.75" specularExponent="20" lighting-color="#ffffff" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting">
      <feDistantLight azimuth="3" elevation="100"></feDistantLight>
  </feSpecularLighting>

</filter>
  </defs>
  <rect width="500" height="500" fill="#9395d3" rx="25" ry="25"></rect>
  <rect width="500" height="500" fill="#ffffff" rx="25" ry="25" filter="url(#nnnoise-filter)"></rect>
  
   <text x="15" y="50" font-family="Poppins" font-weight="bold" font-size="25" fill="black">PROOF OF PRESENCE</text>
      <text x="15" y="100" font-family="Poppins" font-weight="bold" font-size="25" fill="black">location :</text>
     <text x="135" y="100" font-family="Poppins" font-weight="bold" font-size="20" fill="black">${address.name},${address.city}</text>
   <text x="15" y="150" font-family="Poppins" font-weight="bold" font-size="25" fill="black">token id :</text>
     <text x="135" y="150" font-family="Poppins" font-weight="bold" font-size="25" fill="black">01</text>
        <text x="15" y="200" font-family="Poppins" font-weight="bold" font-size="25" fill="black">minter address  :</text>
    <text x="15" y="225" font-family="Poppins" font-weight="bold" font-size="20" fill="black">3233803082028230</text>
         <text x="15" y="270" font-family="Poppins" font-weight="bold" font-size="25" fill="black">review :</text>
   <text x="15" y="295" font-family="Poppins" font-weight="bold" font-size="20" fill="black">${review}
         
      </text>
      <text x="15" y="489" font-family="Poppins" font-weight="bold" font-size="20" fill="black">${currentDate}</text>
      </svg>`
       const img = svg_part1
       const encode = base64.encode(img)
       console.log("data:image/svg+xml;base64,"+encode);
       
       return encode;
 
    }
  

    return (
    
      <View style={styles.container}>
       { location && address && (
         <>
          <MapView style={styles.map} onMapReady={() => console.log('Map is ready')} loadingEnabled={true} loadingBackgroundColor= '#ECFFDC' 
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}  />
            <Circle center={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} radius={400} strokeWidth={2} strokeColor='#9395d3' />
          </MapView><View
            style={{
              position: 'absolute',
              top: '90%',
              alignSelf: 'center' //for align to right
            }}
          >
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text> lets mint!!</Text>
              </TouchableOpacity>
  
            </View> 
            <View style={styles.addressContainer}>
          <View syle={styles.profile}>
          <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('Profile')}>
                <Text>profile</Text>
              </TouchableOpacity>
          </View>          
          <Text style={styles.address}>{address.name} {address.street} {address.postalCode} {address.city} </Text>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
    
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredModal}>
              <View style={styles.modalView}>
                <TextInput
    
                  style={styles.input}
                  placeholder="write some review"
                  // def={review}
                  value={review}
                  // defaultValue={review}
                  onChangeText={newText => setReview(newText)}
                //onSubmitEditing={(value) => setReview(value)}
    
    
                ></TextInput>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress= {svf}>
                  <Text style={styles.textStyle}>Press</Text>
    
                </Pressable>
    
              </View>
            </View>
          </Modal>
          </>
        ) }
        {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
      
      </View>
        
      
      
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black',
    flexDirection: 'column-reverse',
    

  },
  map: {
    flex: 1,
    backgroundColor: 'red',
  },
  addressContainer: {
   height: 85,
   flexDirection: 'row',
   justifyContent: 'space-evenly',
    alignItems:'flex-end',
    paddingBottom: 10,
    alignContent:'space-around',
   backgroundColor: '#9395d3',
   
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
       
    alignContent: 'center',

    
  },
  errorMsg: {
    fontSize: 16,
    color: 'red',
  },
  loading: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    textAlign:'center',
    backgroundColor:'yellow',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 15,
    borderColor:'black'

  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 22,
  },
  centeredModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-evenly',
    width:300,
    height:350,

  },
  
  buttonOpen: {
    backgroundColor: '#F194FF',

  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {

    height: 40,
    width: 250,
    margin: 20,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },

});

