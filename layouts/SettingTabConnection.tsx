/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useRef, cloneElement } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  useWindowDimensions,
  Alert,
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import { PinCode, PinCodeT, DEFAULT } from '../components/PinCode';

import connectedImage from '../resources/linked.png';
import disconnectedImage from '../resources/unlink.png';
import appSettings, { AppConfig } from '../config/AppSettings';
import logoImage from '../resources/LogoTransparent.png';
import InputSpinner from "react-native-input-spinner";
import RNFS from 'react-native-fs';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';

interface Props {
  matrixStatus: MatrixStatus;
  currentAppSettings: AppConfig;
}

function SettingTabConnection({matrixStatus, currentAppSettings}: Props): React.JSX.Element {
  const [ipText,setIPText] = useState<string>((matrixStatus.ip) ? matrixStatus.ip : '');
  const [timeoutText,setTimeoutText] = useState<number>(currentAppSettings.splashTimeout);
  const { height, width } = useWindowDimensions(); 
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Set);
  const [pinVisible, setPinVisible] = useState(false);
  const pin = currentAppSettings.pin;
  
  const getConnectionImage = (status: boolean | undefined) => {
    return (status) ? connectedImage : disconnectedImage;
  }

  const logoAction = async () => {
    Alert.alert(
      "",
      "Do you want to load a new image or reset to default?",
      [
        {
          text: 'Load New',
          style: 'default',
          onPress: importLogo,
        },
        {
          text: 'Reset',
          onPress: () => {
            appSettings.updateLogo(null);
          },
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {}
      },  
    );
  }

  const importLogo = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 1080,
        maxWidth: 1920,
      });
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('Image picker error: ', response.errorMessage);
        } else {
          if (response.assets?.[0]?.base64) {
            console.log(JSON.stringify(response.assets?.[0]));
            let imageData = response.assets?.[0]?.base64;
            let logoFileString = "data:" + response.assets?.[0]?.type + ";base64," + response.assets?.[0]?.base64;
            appSettings.updateLogo(logoFileString);
          } else {
            Alert.alert(
              "Error",
              "Unable to import image. Try again, ensuring image is max 1920px x 1080px.",
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
        }
    } catch (e) {
        console.log(e)
    }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection:'column',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 10,
    backgroundColor: '#006DB2',
    padding: 10,
  },
  settingRow: {
    flex: 1,
    flexDirection: 'row',
    columnGap: 10,
  },
  settingContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: 'rgb(0,0,0)',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowRadius: 5,
    shadowColor: 'rgb(20,20,20)',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.7,
    padding: 20,
    maxHeight: (height / 2) - 100,
    maxWidth: (width / 2) - 10,
  },
  settingTitle: {
    // flex: 1,
    color:"#000",
    fontWeight:'600',
    fontSize:28, 
    alignSelf:'center',
  },
  splashContainer: {
    // flex: 2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    color: 'rgb(0,0,0)',
    backgroundColor: 'rgba(245,245,245,1)',
    shadowRadius: 5,
    shadowColor: 'rgb(20,20,20)',
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.4,
    maxWidth: (width / 2) - 50,
    aspectRatio: 3,
    // height: 100,
  },
  splashPreview: {
    // flex: 1,
    height: 100,
    width: 300,
    resizeMode: 'contain',
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
  settingGroupTitle: {
    color:"#fff",
    fontWeight:'600',
    fontSize:22,
  },
  settingTileRow: {
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    columnGap: 5,
    padding: 5,
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
  highlight: {
    fontWeight: '700',
  },
  btn: {
    width: 150,
    height: 50,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: 'rgb(200,200,200)',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'rgb(250,250,250)',
    alignItems:'center',
    justifyContent: 'center',
    shadowRadius: 4,
    shadowColor: 'rgb(20,20,20)',
    shadowOffset: {width: 1, height: 4},
    shadowOpacity: 0.3,
  },
  input: {
    padding: 15,
    height: 50,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
    color:'#333',
  },
});

  return (
    <View style={styles.mainContainer}>
      <PinCode 
        pin={pin} 
        mode={pinMode} 
        visible={pinVisible} 
        options={{
          pinLength: 6, 
          allowReset: false,
          maxAttempt: 3,
          disableLock: true,
          // allowCancel: true,
        }}
        styles={{ 
          main: {
            backgroundColor: '#006DB2',
            zIndex: 99 },
          enter: { 
            cancelText: {
              color: "#fff",
            } ,
            backspaceText: {
              color: "#fff",
            } 
          }
          
        }}
        onSet={(newPin) => {
          appSettings.updatePin(newPin);
        }}
        onSetCancel={() => setPinVisible(false)}
        onReset={() => {}}
        onEnter={() => {setPinVisible(false); }}
      />
      <View style={[styles.settingRow]}>
        <View style={[styles.settingContainer]}>
          <Text style={styles.settingTitle}>Matrix Connection</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', columnGap: 10}}>
            <View style={styles.connectedImageContainer}>
              <Image style={styles.connectionImage} source={getConnectionImage(matrixStatus?.isConnected)} />
            </View>
            <Text style={{fontSize:20}}>{matrixStatus?.isConnected ? "Connected" : "Offline"}</Text>
          </View>
          <View style={{flexDirection:'row', flexWrap: 'wrap', columnGap: 5, justifyContent: 'center'}}>
            <TextInput
              style={[styles.input, {width: 240}]}
              placeholder="Enter an IP address"
              keyboardType='decimal-pad'
              value={ipText}
              onChangeText={setIPText}
            />
            <TouchableOpacity
              onPress={() => {
                matrixSDK.setIPAddress(ipText);
              }} 
              style={styles.btn} >
              <Text>Update IP</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.settingContainer]}>
          <Text style={styles.settingTitle}>PIN Code</Text>
          <Text>Current PIN: {currentAppSettings.pin}</Text>
          <TouchableOpacity
            onPress={() => {
              setPinVisible(true);
            }} 
            style={styles.btn} >
              <Text>Update PIN</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.settingRow]}>
        <View style={[styles.settingContainer]}>
          <Text style={styles.settingTitle}>Splash Image</Text>
          <TouchableOpacity style={styles.splashContainer} onPress={logoAction}>
            <Image style={styles.splashPreview} source={(currentAppSettings.splashImageSource !== null) ? {uri: currentAppSettings.splashImageSource} : logoImage} />
          </TouchableOpacity>
          {/* <Text style={styles.settingTitle}>Splash Timeout</Text> */}
          <InputSpinner
            max={30}
            min={1}
            step={1}
            colorMax={"#f04048"}
            colorMin={"#40c5f4"}
            value={timeoutText}
            onChange={(num: number) => {
              appSettings.updateTimeout(num);
            }}
            editable={false}
            skin='clean'
            width={250}
            formatter={(elem) => {return elem + (elem == 1 ? " min" : " mins")}}
          />
        </View>

        {/* <View style={[styles.settingContainer]}>
          <Text style={styles.settingTitle}>Splash Timeout</Text>
          <View style={{flex:1, flexDirection:'row', columnGap: 5, justifyContent: 'center', margin:20}}>
            <InputSpinner
              max={30}
              min={1}
              step={1}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              value={timeoutText}
              onChange={(num: number) => {
                appSettings.updateTimeout(num);
              }}
              editable={false}
              skin='clean'
              width={250}
              formatter={(elem) => {return elem + (elem == 1 ? " min" : " mins")}}
            />
          </View>
        </View> */}
      </View>
    </View>
  );
  
}

export default SettingTabConnection;
