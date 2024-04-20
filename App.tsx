/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Button
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import matrixSDK, { MatrixStatus, statusSchema } from './config/MatrixSDK';
import InputRoutingScreen from './layouts/InputRoutingScreen';
import SettingsScreen from './layouts/SettingsScreen';
import appSettings, { AppConfig, blankConfig } from './config/AppSettings';
import { RootStackParamList } from './layouts/types';

function App(): React.JSX.Element {
  const { height, width } = useWindowDimensions();
  const [matrixStatus, setMatrixStatus] = useState<MatrixStatus>(statusSchema);
  const [appConfig, setAppConfig] = useState<AppConfig>(blankConfig);
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();

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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="Input Routing" options={({ navigation, route }) => ({
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
          })}>
            {(props) => <InputRoutingScreen 
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
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#006DB2',
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
