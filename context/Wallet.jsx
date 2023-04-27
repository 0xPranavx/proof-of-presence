import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { getAccounts } from "../utils/RPC/rpcFunctions"

import Web3Auth, {
	LOGIN_PROVIDER,
	OPENLOGIN_NETWORK,
	MFA_LEVELS,
} from "@web3auth/react-native-sdk";
// import { ethers } from "ethers";

import * as WebBrowser from "expo-web-browser";
import * as SecureStore from 'expo-secure-store';
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { Buffer } from "buffer";

global.Buffer = global.Buffer || Buffer;

const scheme = "pop";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: scheme });

const clientId = "BJokBlpfPMAN8iWCO4jQmpCqhi27e14yuAFx7s2ThQaHKLrDWRmgjVzf3y47qdr78lf-XO0qvq6yDEBTMvboTvU"

//Create the Auth Context with the data type specified
//and a empty object
const WalletContext = createContext({});

const WalletProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);
	const [key, setKey] = useState(null);
	const [pubKey, setPubKey] = useState(null);
	const [loading, setLoading] = useState(true);

    const getAccounts = (key) => {
    //     try {
    //         if (key) {
    //             const wallet = new ethers.Wallet(key);
    //             const address = wallet.address;
    //             return address;
	return "0x0"
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         return error;
    //     }
    };

	async function loadStorageData() {
		try {
			//Try get the data from Async Storage
			const userData = await AsyncStorage.getItem("@UserData");
			const privKey = await SecureStore.getItemAsync("@PrivKey");
			if (userData && privKey) {
				setUserData(JSON.parse(userData));
				setKey(privKey);
				const address = await getAccounts(privKey)
				setPubKey(address)
				// uiConsole("Logged In");
			}
		} catch (error) {
		} finally {
			//loading finished
			setLoading(false);
		}
	}

	const login = async () => {
		try {
			//loading started
			setLoading(true);
			//call the service passing credential (email and password).
			//In a real App this data will be provided by the user from some InputText components.
			const web3auth = new Web3Auth(WebBrowser, {
				clientId,
				network: OPENLOGIN_NETWORK.TESTNET,
				whiteLabel: {
					name: "Proof of presence",
					logoLight: "https://i.imgur.com/q2OP2EN.jpeg",
					logoDark: "https://i.imgur.com/q2OP2EN.jpeg",
					defaultLanguage: "en",
					dark: true, // whether to enable dark mode. defaultValue: false
				},
			});

			const loginData = await web3auth.login({
				// loginProvider: LOGIN_PROVIDER.FACEBOOK,
				loginProvider: LOGIN_PROVIDER.GOOGLE,
				redirectUrl: resolvedRedirectUrl,
				// mfaLevel: MFA_LEVELS.MANDATORY,
				mfaLevel: "none",
				curve: "secp256k1",
			});
			// console.log(loginData);
			// console.log(loginData)
			//Set the data in the context, so the App can be notified
			//and send the user to the AuthStack
			setKey(loginData.privKey)

			// Check if a user logged in for the first time or not in database
			// If not, create a new user in database and onboarding flow
			// else go to Home screen
			const address = await getAccounts(loginData.privKey)
			setPubKey(address)
			setUserData(loginData)

			//Persist the data in the Async Storage
			//to be recovered in the next user session.
			AsyncStorage.setItem("@UserData", JSON.stringify(loginData));
			await SecureStore.setItemAsync("@PrivKey", loginData.privKey);

		} catch (error) {
			//If the service call fails, throw an error
			// throw new Error("Error on login");
			// uiConsole(error)
		} finally {
			//loading finished
			setLoading(false);
		}

	};

	const logout = async () => {
		try {
			
			setUserData(null);
			setKey(null);
			setPubKey(null);
			//Remove the data from Async Storage
			//to NOT be recoverede in next session.
			await AsyncStorage.removeItem("@UserData");
			// await AsyncStorage.removeItem("@PrivKey");
			await SecureStore.deleteItemAsync("@PrivKey");
			// await AsyncStorage.removeItem("@FirstTime");
		} catch (error) {
		}
	};

    useEffect(() => {
		//Every time the App is opened, this provider is rendered
		//and call de loadStorage function.
		loadStorageData();
	}, []);

	let value = {
		userData,
		key,
		pubKey,
		login,
		logout,
		loading,
	}

	return (
		//This component will be used to encapsulate the whole App,
		//so all components will have access to the Context
		<WalletContext.Provider value={value}>
			{children}
		</WalletContext.Provider>
	);
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useWallet() {
	const context = useContext(WalletContext);

	if (!context) {
		throw new Error("useWallet must be used within an WalletProvider");
	}

	return context;
}

export { WalletContext, WalletProvider, useWallet };