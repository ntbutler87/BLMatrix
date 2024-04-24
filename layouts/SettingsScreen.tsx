/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import appSettings, { AppConfig, MatrixPort, MatrixPreset } from '../config/AppSettings';
import { PinCode, PinCodeT, DEFAULT } from '../components/PinCode';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabView, SceneMap } from 'react-native-tab-view';
import SettingTabConnection from './SettingTabConnection';
import SettingTabInputs from './SettingTabInputs';
import SettingTabHDMIOutputs from './SettingTabHDMIOut';
import SettingTabHDBTOutputs from './SettingTabHDBTOut';
import SettingsTabScenes from './SettingTabScenes';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}

function SettingsScreen({matrixStatus, appConfig}: Props): React.JSX.Element {
  const layout = useWindowDimensions();
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Enter);
  const [pinVisible, setPinVisible] = useState(true);
  const pin = appConfig?.pin;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Connection', title: 'Connection' },
    { key: 'Inputs', title: 'Inputs' },
    { key: 'HDMIOutputs', title: 'HDMI Outputs' },
    { key: 'HDBTOutputs', title: 'HDBT Outputs' },
    { key: 'Scences', title: 'Scenes' },
  ]);
  
  
  const ConnectionTab = () => {
    return <SettingTabConnection matrixStatus={matrixStatus} currentAppSettings={appConfig} />;
  }
  const InputsRoute = () => {
    return <SettingTabInputs matrixStatus={matrixStatus} currentAppSettings={appConfig} />;
  }
  const HDMIOutputsRoute = () => {
    return <SettingTabHDMIOutputs matrixStatus={matrixStatus} currentAppSettings={appConfig} />;
  }
  const HDBTOutputsRoute = () => {
    return <SettingTabHDBTOutputs matrixStatus={matrixStatus} currentAppSettings={appConfig} />;
  }
  const ScenesRoute = () => {
    return <SettingsTabScenes matrixStatus={matrixStatus} currentAppSettings={appConfig} />;
  };
const renderScene = SceneMap({
  Connection: ConnectionTab,
  Inputs: InputsRoute,
  HDMIOutputs: HDMIOutputsRoute,
  HDBTOutputs: HDBTOutputsRoute,
  Scences: ScenesRoute,
});
  return (
    <SafeAreaView style={styles.mainContainer}>
      <PinCode 
        pin={pin} 
        mode={pinMode} 
        visible={pinVisible} 
        options={{
          pinLength: 6, 
          allowReset: false,
          maxAttempt: 3,
          disableLock: true,
          allowCancel: true,
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
        }}
        onSetCancel={() => setPinVisible(false)}
        onReset={() => {}}
        onEnter={() => {setPinVisible(false); }}
        onCancel={() => { navigation.navigate('Operation')} }
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
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

export default SettingsScreen;
