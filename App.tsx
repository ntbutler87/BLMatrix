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
  Linking,
  Alert
} from 'react-native';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
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
import ImportMacroScreen from './layouts/ImportMacroScreen';
import { MacroExport } from './components/MacroTile';
import { btoa, atob } from 'react-native-quick-base64'

const useInitialURL = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  }, []);

  return {url, processing};
};

function App(): React.JSX.Element {
  const { height, width } = useWindowDimensions();
  const [matrixStatus, setMatrixStatus] = useState<MatrixStatus>(statusSchema);
  const [appConfig, setAppConfig] = useState<AppConfig>(blankConfig);
  const [displaySplash, setDisplaySplash] = useState<boolean>(true);
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [importMacro, setImportMacro] = useState<MacroExport|null>(null);

  const {url: initialUrl, processing} = useInitialURL();

  useEffect( () => {
    const eventListener = Linking.addEventListener('url', ({ url }) => {
      try {
        var data = (new URL(url).pathname);
        var macro: MacroExport = JSON.parse(atob(data.slice(1)));
        if (matrixSDK.validateCommandString(macro.commands)) {
          console.log(macro);
          setImportMacro(macro);
        } else {
          console.log("Invalid command string");
          throw "Invalid command string";
        }
      } catch {
        Alert.alert(
          "Error!",
          "Unable to decode valid macro data",
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {}
          },  
        );
      }
    });
    return eventListener.remove;
  }, []);


  const hideSplash = () => {
    const timeoutLength = appConfig.splashTimeout * 60000;

    setDisplaySplash(false);
    const timeoutId = setTimeout(() => {
      setDisplaySplash(true);
    }, timeoutLength); // Show the splash screen again after splashTimeout # of minutes
  }

  useEffect(() => {
    Promise.resolve(matrixSDK.init(updateStatusState)).catch((e) => { console.log(e) });
    return (() => { Promise.resolve(matrixSDK.stopConnection()); })
  }, []);

  const updateConfig = (config: AppConfig) => {
    setAppConfig({...config});
  }

  useEffect( () => {
    Promise.resolve(appSettings.init(updateConfig))
      .catch((e) => { console.log(e) });
  }, [] );

  const updateStatusState = (state: MatrixStatus) => {
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

  // const linking = {
  //   prefixes: ['blmatrixapp://'],
  //   config: {
  //     screens: {
  //       Operation: 'macro',
  //       Settings: 'import',
  //     }
  //   },
  // };

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
          <Image style={styles.splashImage} source={(appConfig.splashImageSource !== null) ? {uri: appConfig.splashImageSource} : logoImage}/>
          
          <Text style={styles.splashText}>Tap to start</Text>
          {/* <Text style={styles.splashText}>{initialUrl}</Text> */}
        </View>
      </TouchableOpacity>

      {
        (importMacro) 
        ? <ImportMacroScreen 
          matrixStatus={matrixStatus} 
          appConfig={appConfig} 
          newMacro={importMacro}
          onCompleted={() => {console.log("Finalised import"); setImportMacro(null)}} 
          onCancel={() => {setImportMacro(null)}} /> 
          
        : <NavigationContainer 
            // linking={linking} 
            >
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
          </NavigationContainer>}
      
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
