import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Modal,
	Pressable,
	TextInput,
  ActivityIndicator
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SvgXml } from "react-native-svg";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import base64 from "react-native-base64";
import { useWallet } from "../context/Wallet";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'

export default function Presence({ navigation }) {

  const { pubKey, key } = useWallet()
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [address, setAddress] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [review, setReview] = useState("");
	const [nft, setNft] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [minting, setMinting] = useState(false);

  const openLink = async (link) => {
    let result = await WebBrowser.openBrowserAsync(link);
    // uiConsole(result);
};

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
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
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});
				setAddress(addressResponse[0]);
			}
		})();
	}, [location]);

	const svf = () => {
		const svg_part1 = ` <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
      <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500');
    </style>
    </defs>
      
  
   <rect width="500" height="500" fill="white"/>
   <rect width="500" height="500" rx="15" fill="yellow" />
   <rect y="305" width="500" height="175" rx="15" fill="white" />
   <rect y="20" width="500" height="175" rx="15" fill="white" fill-opacity="0.49"/>
   <rect y="175" width="500" height="160" rx="15" fill="white" />
   <rect width="500" height="500" rx="15" stroke="black"/> 
  
   <text x="15" y="50" font-family="Poppins" font-weight="bold" font-size="25" fill="black">PROOF OF PRESENCE</text>
      <text x="15" y="100" font-family="Poppins" font-weight="bold" font-size="25" fill="black">location :</text>
     <text x="135" y="100" font-family="Poppins" font-weight="bold" font-size="25" fill="black">${address.city}</text>
   <text x="15" y="150" font-family="Poppins" font-weight="bold" font-size="25" fill="black">token id :</text>
     <text x="135" y="150" font-family="Poppins" font-weight="bold" font-size="25" fill="black">01</text>
        <text x="15" y="200" font-family="Poppins" font-weight="bold" font-size="25" fill="black">minter address  :</text>
    <text x="15" y="225" font-family="Poppins" font-weight="bold" font-size="20" fill="black">${pubKey}</text>
         <text x="15" y="270" font-family="Poppins" font-weight="bold" font-size="25" fill="black">review :</text>
   <text x="15" y="295" font-family="Poppins" font-weight="bold" font-size="20" fill="black">${review}
         
      </text></svg>`;
		const img = svg_part1;
		setNft(img);
		// console.log(img);
		const encode = base64.encode(img);
		// console.log("data:image/svg+xml;base64," + encode);
		// setNft("data:image/svg+xml;base64," + encode);
		return encode;
	};

  const mintNft = async () => {
    try {
      setMinting(true)
      // mint nft with users private key
      console.log("KEY ", key)
      const wallet = new ethers.Wallet(key)
      // use this wallet to mint NFT on polygon mumbai testnet
      const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
      const signer = wallet.connect(provider)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      // console.log("CONTRACT ", contract)
      console.log("MINTING ", (address.city)?.toString(), review?.toString())
      const mint_tx = await contract.mintNFT((address.city)?.toString(), review?.toString())
      // console.log("MINT TX ", mint_tx)
      const receipt = await mint_tx.wait()
      // console.log("RECEIPT ", receipt)
      const tokenId = receipt?.events[0]?.args[2]?.toString()
      console.log("TOKEN ID ", tokenId)
      setTokenId(tokenId)
      setMinting(false)

    } catch(err) {
      console.log(err)
      setMinting(false)
    }
  }

	return (
		<View style={styles.container}>
			{location ? (
				<>
					<MapView
						style={styles.map}
						customMapStyle={mapstyle[0]}
						initialRegion={{
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.0121,
						}}
					>
						<Marker
							coordinate={{
								latitude: location.coords.latitude,
								longitude: location.coords.longitude,
							}}
						/>
						<Circle
							center={{
								latitude: location.coords.latitude,
								longitude: location.coords.longitude,
							}}
							radius={400}
							strokeWidth={2}
							strokeColor="white"
						/>
					</MapView>
					<View
						style={{
							position: "absolute",
							top: "90%",
							alignSelf: "center", //for align to right
						}}
					>
						<TouchableOpacity
							style={styles.button}
							onPress={() => setModalVisible(true)}
						>
							<Text> lets mint!!</Text>
						</TouchableOpacity>
					</View>
				</>
			) : (
				<Text style={styles.loading}> loading..</Text>
			)}
			{address && (
				<View style={styles.addressContainer}>
					<View syle={styles.profile}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => navigation.navigate("Profile")}
						>
							<Text>profile</Text>
						</TouchableOpacity>
					</View>
					<Text style={styles.address}>
						{address.name} {address.street} {address.postalCode} {address.city}{" "}
					</Text>
				</View>
			)}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				{
          minting ? (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Minting NFT...</Text>
                <Text style={styles.modalText}>Please wait</Text>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            </View>
          ) : (
            nft ? (
              <View style={styles.centeredModal}>
                <View style={styles.modalView}>
                  {/* <Image
                      style={styles.image}
                      source={{
                        uri: nft,
                      }}
                    /> */}
                  <SvgXml xml={nft} width="100%" height="100%" />
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => mintNft()}
                  >
                    <Text style={styles.textStyle}>Mint</Text>
                  </Pressable>
                  {/* Open link in webview if tokenId exists */}
                  {tokenId && (
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() =>
                        openLink(`https://testnets.opensea.io/assets/mumbai/</View></View>/${CONTRACT_ADDRESS}/${tokenId}`)
                      }
                    >
                      <Text style={styles.textStyle}>View on OpenSea</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.centeredModal}>
                <View style={styles.modalView}>
                  <TextInput
                    style={styles.input}
                    placeholder="write some review"
                    // def={review}
                    value={review}
                    // defaultValue={review}
                    onChangeText={(newText) => setReview(newText)}
                    //onSubmitEditing={(value) => setReview(value)}
                  ></TextInput>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={svf}
                  >
                    <Text style={styles.textStyle}>Press</Text>
                  </Pressable>
                </View>
              </View>
            )
          )
        }
			</Modal>

			{errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
		flexDirection: "column-reverse",
	},
	map: {
		flex: 1,
	},
	addressContainer: {
		height: 85,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "flex-end",
		paddingBottom: 10,
		alignContent: "space-around",
		backgroundColor: "#232b2b",
	},
	address: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",

		alignContent: "center",
	},
	errorMsg: {
		fontSize: 16,
		color: "red",
	},
	loading: {
		color: "white",
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		textAlign: "center",
		backgroundColor: "yellow",
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 15,
		borderColor: "black",
	},

	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 30,
		alignItems: "center",
		marginTop: 22,
	},
	centeredModal: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		justifyContent: "space-evenly",
		width: 300,
		height: 350,
	},

	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
	input: {
		height: 40,
		width: 250,
		margin: 20,
		borderWidth: 1,
		borderRadius: 20,
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 20,
	},
});

const mapstyle = [
	[
		{
			featureType: "all",
			elementType: "labels.text.fill",
			stylers: [
				{
					saturation: 36,
				},
				{
					color: "#000000",
				},
				{
					lightness: 40,
				},
			],
		},
		{
			featureType: "all",
			elementType: "labels.text.stroke",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
				{
					lightness: 16,
				},
			],
		},
		{
			featureType: "all",
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "administrative",
			elementType: "geometry.fill",
			stylers: [
				{
					color: "#0f9324",
				},
				{
					lightness: 20,
				},
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "administrative",
			elementType: "geometry.stroke",
			stylers: [
				{
					color: "#00700a",
				},
				{
					lightness: 17,
				},
				{
					weight: 1.2,
				},
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "administrative",
			elementType: "labels.text",
			stylers: [
				{
					color: "#93c991",
				},
				{
					visibility: "simplified",
				},
			],
		},
		{
			featureType: "landscape",
			elementType: "all",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 20,
				},
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "landscape.natural",
			elementType: "geometry.fill",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape.natural.landcover",
			elementType: "geometry",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape.natural.landcover",
			elementType: "geometry.fill",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape.natural.landcover",
			elementType: "geometry.stroke",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape.natural.terrain",
			elementType: "geometry.fill",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "landscape.natural.terrain",
			elementType: "geometry.stroke",
			stylers: [
				{
					visibility: "on",
				},
				{
					color: "#000000",
				},
			],
		},
		{
			featureType: "poi",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 21,
				},
			],
		},
		{
			featureType: "poi",
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "on",
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "geometry.fill",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 17,
				},
			],
		},
		{
			featureType: "road.highway",
			elementType: "geometry.stroke",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 29,
				},
				{
					weight: 0.2,
				},
			],
		},
		{
			featureType: "road.arterial",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 18,
				},
			],
		},
		{
			featureType: "road.local",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 16,
				},
			],
		},
		{
			featureType: "transit",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 19,
				},
			],
		},
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [
				{
					color: "#000000",
				},
				{
					lightness: 17,
				},
			],
		},
	],
];
