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
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import { PinCode, PinCodeT, DEFAULT } from '../components/PinCode';

import connectedImage from '../resources/linked.png';
import disconnectedImage from '../resources/unlink.png';
import appSettings, { AppConfig } from '../config/AppSettings';

interface Props {
  matrixStatus: MatrixStatus;
  currentAppSettings: AppConfig;
}

function SettingTabConnection({matrixStatus, currentAppSettings}: Props): React.JSX.Element {
  const [ipText,setIPText] = useState<string>((matrixStatus.ip) ? matrixStatus.ip : '');
  const layout = useWindowDimensions();
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Set);
  const [pinVisible, setPinVisible] = useState(false);
  const pin = currentAppSettings.pin;
  
  const getConnectionImage = (status: boolean | undefined) => {
    return (status) ? connectedImage : disconnectedImage;
  }
  return (
    <View style={{flex:1, flexDirection:'column', rowGap: 20}}>
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
      <View style={{flex:1}}>
        <Text style={{color:"#fff",fontWeight:'600',fontSize:28, alignSelf:'center', margin: 20}}>Matrix Connection</Text>
        <View style={{ flexDirection:'row',height: 25, alignItems:'center', alignSelf:'center', margin:10, columnGap: 10 }} >
          <View style={styles.connectedImageContainer}>
            <Image style={styles.connectionImage} source={getConnectionImage(matrixStatus?.isConnected)} />
          </View>
          <Text style={{fontSize:20, color:'#fff'}}>{matrixStatus?.isConnected ? "Connected" : "Offline"}</Text>
        </View>
        <View style={{flex:1, flexDirection:'row', columnGap: 5, justifyContent: 'center', margin:20}}>
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
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            setPinVisible(true);
          }} 
          style={styles.btn} >
            <Text>Update PIN</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex:2, justifyContent: 'center', alignItems: 'center'}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: 'rgb(86, 182, 209)',
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
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'rgb(250,250,250)',
    alignItems:'center',
    justifyContent: 'center'
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

export default SettingTabConnection;
