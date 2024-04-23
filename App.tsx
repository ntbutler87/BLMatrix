/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef  } from 'react';
import {
  useWindowDimensions,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Button,
  View,
  Image,
  Text,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import matrixSDK, { MatrixStatus, statusSchema } from './config/MatrixSDK';
import appSettings, { AppConfig, blankConfig } from './config/AppSettings';
import SettingsScreen from './layouts/SettingsScreen';
import { RootStackParamList } from './layouts/types';
import logoImage from './resources/LogoTransparent.png';
import connectedImage from './resources/linked.png';
import disconnectedImage from './resources/unlink.png';
import OperationScreen from './layouts/OperationScreen';

function App(): React.JSX.Element {
  const { height, width } = useWindowDimensions();
  const [matrixStatus, setMatrixStatus] = useState<MatrixStatus>(statusSchema);
  const [appConfig, setAppConfig] = useState<AppConfig>(blankConfig);
  const [displaySplash, setDisplaySplash] = useState<boolean>(true);
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const hideSplash = () => {
    const timeoutLength = appConfig.splashTimeout * 60000;
    console.log ("SplashTimeout: " + appConfig.splashTimeout + " - Timeout: " + timeoutLength);
    console.log (JSON.stringify(appConfig));

    setDisplaySplash(false);
    const timeoutId = setTimeout(() => {
      setDisplaySplash(true);
    }, timeoutLength); // Show the splash screen again after splashTimeout # of minutes
  }

  useEffect(() => {
    Promise.resolve(matrixSDK.init(updateStatusState)).catch((e) => { console.log(e) });
    console.log("MatrixIP Currently: " + matrixStatus?.ip);
    return (() => { Promise.resolve(matrixSDK.stopConnection()); })
  }, []);

  const updateConfig = (config: AppConfig) => {
    console.log("New config:");
    console.log(JSON.stringify(config));
    setAppConfig({...config});
  }

  useEffect( () => {
    Promise.resolve(appSettings.init(updateConfig))
      .then( () => {
        console.log("Got app config");
      } )
      .catch((e) => { console.log(e) });
  }, [] );

  const updateStatusState = (state: MatrixStatus) => {
    console.log("Updating local matrixState - should re-render...");
    setMatrixStatus({ ...state });
  }

  const getConnectionImage = (status: boolean | undefined) => {
    return (status) ? connectedImage : disconnectedImage;
  }

  const connectionStatusElement = () => {
    return (
      <View style={{ flexDirection:'row',height: 25, alignItems:'center', alignSelf:'center', margin:10, columnGap: 10 }} >
        <View style={styles.connectedImageContainer}>
          <Image style={styles.connectionImage} source={getConnectionImage(matrixStatus?.isConnected)} />
        </View>
        <Text style={{fontSize:20, color:'#fff'}}>{matrixStatus?.isConnected ? "Connected" : "Offline"}</Text>
      </View>
      );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TouchableOpacity 
      activeOpacity={0.99}
        style={[styles.splashContainer, (displaySplash) ? null : styles.splashHidden]}
        onPress={() => {
          hideSplash();
        }}
        >
        <View style={styles.splashInnerContainer}>
          <Image style={styles.splashImage} source={logoImage}/>
          <Text style={styles.splashText}>Tap to start</Text>
        </View>
      </TouchableOpacity>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="Operation" options={({ navigation, route }) => ({
            headerStyle: {
              backgroundColor: '#006DB2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerRight: () => (
              <Button
                onPress={() => {
                  navigation.navigate('Settings')
                }}
                title="Settings"
                color="#fff"
              />
            ),
            headerLeft: connectionStatusElement
          })}>
            {(props) => <OperationScreen 
                matrixStatus={matrixStatus}
                appConfig={appConfig}
              />}
          </Stack.Screen>

          <Stack.Screen name="Settings" options={{
            headerStyle: {
              backgroundColor: '#006DB2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
          }}>
            {(props) => <SettingsScreen 
                matrixStatus={matrixStatus}
                appConfig={appConfig}
              />}
          </Stack.Screen>


        </Stack.Navigator>
      </NavigationContainer>
      
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#006DB2',
  },
  connectedImageContainer: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: '#E8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  splashContainer:{
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#006DB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashInnerContainer:{
    width: 800,
    flexDirection: 'column',
    paddingBottom: 50,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  splashHidden:{
    zIndex: -10,
    opacity: 0,
  },
  splashImage:{
    width: 600,
    height: 336,
    resizeMode: 'contain',
  },
  splashText:{
    fontSize: 30,
    color: '#777',
  },
  outputMapper: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: 'rgba(50,50,50,0.5)',
    borderRadius: 10,
    shadowRadius: 15,
    shadowColor: 'rgb(20,20,20)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
  },
  outputMapperInner: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 150,
    backgroundColor: 'rgb(250,250,250)',
    borderRadius: 10,
  },
});

export default App;
