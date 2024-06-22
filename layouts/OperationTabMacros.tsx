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
import { AppConfig, Macro } from '../config/AppSettings';
import MacroTile from '../components/MacroTile';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function OperationTabMacros({matrixStatus, appConfig}: Props): React.JSX.Element {
  const recordingMacro: Macro | undefined = appConfig.Macro.find( (macro) => { return macro.isRecording } );
  return (
    <View style={styles.mainContainer}>
      {appConfig.Macro.map((item) => {
        return <MacroTile
          key={"MACRO" + item.port}
          appPortConfig={appConfig.Macro[item.port-1]}
          disabled={!matrixStatus.isConnected || ( recordingMacro && item !== recordingMacro) }
          onPressF={()=>{ 
            Alert.alert(
              "Warning!",
              "You are about to run the macro '" + item.name + "'.\n\n Are you SURE you want to continue?",
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Load',
                  onPress: () => {matrixSDK.runMacroCommand(item.commands)},
                  style: 'destructive',
                },
              ],
              {
                cancelable: true,
                onDismiss: () => {}
              },
            ); }} />
      }) }
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#006DB2',
    justifyContent: 'space-around',
    alignItems:'center',
    alignContent: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    rowGap: 10,
  },
});

export default OperationTabMacros;
