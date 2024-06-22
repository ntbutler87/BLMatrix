/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Share
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import appSettings, { AppConfig, Macro } from '../config/AppSettings';
import MacroTile from '../components/MacroTile';
import { MacroExport } from '../components/MacroTile';
import MacroImportTile from '../components/MacroImportTile';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
  newMacro: MacroExport;
  onCompleted: Function;
  onCancel: Function;
}
function ImportMacroScreen({matrixStatus, appConfig, newMacro, onCompleted, onCancel}: Props): React.JSX.Element {
  return (
    <View style={{flex:1,flexDirection:'column'}}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center',rowGap: 10}}>
        <Text style={{fontSize:40, color:'white'}}>Select a Macro to replace</Text>
        <TouchableOpacity 
        style={{width: 200, height: 60, backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}} 
        onPress={() => {onCancel()}} >
          <Text style={{color: 'white', fontSize:30}}>Cancel</Text></TouchableOpacity>
      </View>
      <View style={[styles.mainContainer,{flex:4}]}>
        {appConfig.Macro.map((item) => {
          return <MacroImportTile
            key={"MACRO" + item.port}
            appPortConfig={appConfig.Macro[item.port-1]}
            // disabled={!matrixStatus.isConnected }
            onConfirm={()=>{ 
              console.log("Importing macro to #" + item.port);
              appSettings.importMacro(item, newMacro);
              onCompleted();
            }} />
        }) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#006DB2',
    justifyContent: 'space-evenly', 
    alignItems:'center',
    alignContent: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    rowGap: 10,
  },
});

export default ImportMacroScreen;
