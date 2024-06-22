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
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import { AppConfig } from '../config/AppSettings';
import OutputTile from '../components/OutputTile';
import InputSelectTile from '../components/InputSelectTile';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function OperationTabOutputMapping({matrixStatus, appConfig}: Props): React.JSX.Element {
  const [selectedInput, setSelectedInput] = useState<MatrixInput | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<MatrixOutput | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleItemSelect = (input: MatrixInput) => {
    setSelectedInput(input);
  };

  const popupOutputMapper = (output: MatrixOutput) => {
    setSelectedOutput(output);
    setSelectedInput(matrixStatus.HDMI_IN[output.input-1]);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }
  const closeOutputMapper = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }

  const commitOutputMapping = () => {
    if (selectedInput && selectedOutput) {
      matrixSDK.setOutputSource(selectedOutput.port, selectedInput.port);
      closeOutputMapper();
    }
  }

  return (
    <>
      <Animated.View style={[styles.outputMapper, {
        opacity: fadeAnim,
        zIndex: fadeAnim,
        transform: [{ scale: fadeAnim }]
      }]}>
        <View style={styles.outputMapperInner}>
          <View style={styles.outputMapperList}>
            <Text style={styles.outputMapperTitle}>Output {selectedOutput?.port}: { selectedOutput?.name}</Text>
            {matrixStatus.HDMI_IN.map((item) => {
              return <InputSelectTile
                key={"INPUTSELECT" + item.port}
                port={item}
                portConfig={appConfig.HDMI_IN[item.port-1]}
                selected={selectedInput === item}
                onPress={toggleItemSelect} />
            }) }
            <TouchableOpacity style={[styles.btn,styles.saveBtn]} onPress={commitOutputMapping}><Text style={[styles.btnText,styles.saveBtnText]}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn,styles.cancelBtn]} onPress={closeOutputMapper}><Text style={[styles.btnText,styles.cancelBtnText]}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <View style={styles.mainContainer}>
        {matrixStatus.HDMI_OUT.map((item) => {
          return <OutputTile
            key={"OUTPUTTILE" + item.port}
            port={item}
            input={matrixStatus.HDMI_IN[item.input -1]}
            appPortConfig={appConfig.HDMI_OUT[item.port-1]}
            disabled={!matrixStatus.isConnected}
            onPressF={popupOutputMapper} />
        }) }
      </View>
    </>
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
  btn: {
    flex:1,
    flexDirection:'row',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveBtn:{ 
    backgroundColor: '#00568C', 
    justifyContent: 'center' 
  },
  saveBtnText:{ 
    color: '#fff', 
    fontSize:18,
    fontWeight: '700' 
  },
  cancelBtn:{ 
    backgroundColor: '#E8F6FF', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#83CBFA',
  },
  cancelBtnText:{ 
    color: '#0496FF', 
    fontSize:18,
    fontWeight: '700' 
  },
  btnText:{
      color: '#00568C',
  },
  outputMapper: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
  },
  outputMapperInner: {
    flex: 1,
    padding: 40,
    marginHorizontal: 150,
    marginVertical: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(245,245,245)',
    borderRadius: 10,
    shadowRadius: 15,
    shadowColor: 'rgb(20,20,20)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
  },
  outputMapperTitle:{
    flex:1,
    fontSize: 28,
    fontWeight: '600',
    padding: 10,
    paddingBottom: 30,
    alignSelf: 'center',
  },
  outputMapperList:{
    flex:1,
    flexDirection:'column',
    flexGrow:1,
    width:600,
    rowGap: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    padding: 15,
    height: 100,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default OperationTabOutputMapping;
