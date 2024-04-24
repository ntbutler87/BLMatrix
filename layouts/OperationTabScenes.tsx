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
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import { AppConfig } from '../config/AppSettings';
import SceneTile from '../components/SceneTile';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function OperationTabScenes({matrixStatus, appConfig}: Props): React.JSX.Element {

  return (
    <View style={styles.mainContainer}>
      {matrixStatus.Scenes.map((item) => {
        return <SceneTile
          key={"SCENESELECT" + item.port}
          port={item}
          appPortConfig={appConfig.Scene[item.port-1]}
          disabled={!matrixStatus.isConnected}
          onPressF={()=>{ 
            Alert.alert(
              "Warning!",
              "You are about to load a new configuration.\n\n This process can take 15-20 seconds.\n\n Are you SURE you want to continue?",
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Load',
                  onPress: () => {matrixSDK.manageScene(item.port, "load");},
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
    justifyContent: 'space-evenly', 
    alignItems:'center',
    alignContent: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    rowGap: 10,
  },
});

export default OperationTabScenes;
