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
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import { AppConfig, Macro } from '../config/AppSettings';
import InputTile from '../components/InputTile';
import OutputSelectTile from '../components/OutputSelectTile';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function OperationTabInputMapping({matrixStatus, appConfig}: Props): React.JSX.Element {
  const [selectedInput, setSelectedInput] = useState<MatrixInput | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<MatrixOutput[]>([]);
  const [currentOutputs, setCurrentOutputs] = useState<MatrixOutput[]>([]);
  const recordingMacro: Macro | undefined = appConfig.Macro.find( (macro) => { return macro.isRecording } );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const initiateSelectedOutputs = (input: MatrixInput) => {
    let currentOutputs = matrixStatus?.HDMI_OUT.filter((val) => { return val.input == input.port });
    if (!currentOutputs) {
      currentOutputs = [];
    }
    setSelectedOutputs([...currentOutputs]);
    setCurrentOutputs([...currentOutputs]);
  }

  const toggleItemSelect = (output: MatrixOutput) => {
    if (selectedOutputs.includes(output)) {
      setSelectedOutputs(selectedOutputs => selectedOutputs.filter(item => item.port !== output.port));
    } else {
      setSelectedOutputs(selectedOutputs => [...selectedOutputs, output]);
    }
  };

  const popupOutputMapper = (input: MatrixInput) => {
    setSelectedInput(input);
    initiateSelectedOutputs(input);
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
    var outputs: Array<number> = [];
    for (var i=0; i<selectedOutputs.length; i++){
      outputs.push(selectedOutputs[i].port);
    }
    if (selectedInput)
      matrixSDK.setOutputSourceMultiple(selectedInput?.port, outputs);
    // selectedOutputs.forEach((output) => {
    //   if (selectedInput && matrixStatus?.HDBT_OUT[output.port - 1].input !== selectedInput?.port) {
    //     setTimeout( (selectedInput, output) => {
    //       matrixSDK.setOutputSource(output.port, selectedInput?.port);
    //     }, (output.port * 50), selectedInput, output )
    //   }
    // });
    closeOutputMapper();
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
            <Text style={styles.outputMapperTitle}>Input {selectedInput?.port}: {selectedInput?.name}</Text>
            {matrixStatus.HDMI_OUT.map((item) => {
              return <OutputSelectTile
                key={"OUTPUTSELECT" + item.port}
                port={item}
                portConfig={appConfig.HDMI_OUT[item.port-1]}
                selected={selectedOutputs.includes(item)}
                currentPatched={currentOutputs.includes(item)}
                onPress={toggleItemSelect}
                style={{}}
                recordingMacro={recordingMacro !== undefined} />
            }) }
            <TouchableOpacity style={[styles.btn,styles.saveBtn]} onPress={commitOutputMapping}><Text style={[styles.btnText,styles.saveBtnText]}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn,styles.cancelBtn]} onPress={closeOutputMapper}><Text style={[styles.btnText,styles.cancelBtnText]}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <View style={styles.mainContainer}>
          {matrixStatus?.HDMI_IN.map(data => {
            return <InputTile
              key={"HDMI_IN" + data.port}
              disabled={!matrixStatus.isConnected}
              port={data}
              onPressF={popupOutputMapper}
              outputs={matrixStatus?.HDMI_OUT.filter((val) => { return val.input == data.port })}
              appPortConfig={appConfig?.HDMI_IN[data.port - 1]}
            />
          })}
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
    // width:600,
    rowGap: 10,
  },
  highlight: {
    fontWeight: '700',
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
  input: {
    padding: 15,
    height: 100,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default OperationTabInputMapping;
