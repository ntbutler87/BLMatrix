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
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image
} from 'react-native';

import matrixSDK, { MatrixInput, MatrixOutput, MatrixStatus } from '../config/MatrixSDK';
import appSettings, { AppConfig, MatrixPort, MatrixPreset } from '../config/AppSettings';
import InputTile from '../components/InputTile';
import OutputSelectTile from '../components/OutputSelectTile';
import Logo1 from '../resources/LogoTransparent.png';
import connectedImage from '../resources/linked.png';
import disconnectedImage from '../resources/unlink.png';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function InputRoutingScreen({matrixStatus, appConfig}: Props): React.JSX.Element {
  const [selectedInput, setSelectedInput] = useState<MatrixInput | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<MatrixOutput[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === 'dark';

  const initiateSelectedOutputs = (input: MatrixInput) => {
    let currentOutputs = matrixStatus?.HDMI_OUT.filter((val) => { return val.input == input.port });
    if (!currentOutputs) {
      currentOutputs = [];
    }
    console.log("Current Outputs: " + currentOutputs.length);
    setSelectedOutputs([...currentOutputs]);
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
    console.log("launching popup - input: ");
    console.log(input);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }
  const closeOutputMapper = () => {
    console.log("closing popup");
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }

  const commitOutputMapping = () => {
    selectedOutputs.forEach((output) => {
      if (selectedInput && matrixStatus?.HDBT_OUT[output.port - 1].input !== selectedInput?.port) {
        setTimeout( (selectedInput, output) => {
          console.log("#video_d out" + output.port + " matrix=" + selectedInput?.port);
          matrixSDK.setOutputSource(output.port, selectedInput?.port);
        }, (output.port * 400), selectedInput, output )
      }
    });
    closeOutputMapper();
  }

  const getConnectionImage = (status: boolean | undefined) => {
    return (status) ? connectedImage : disconnectedImage;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.View style={[styles.outputMapper, {
        opacity: fadeAnim,
        zIndex: fadeAnim,
        transform: [{ scale: fadeAnim }]
      }]}>
        <View style={styles.outputMapperInner}>
          <Text>Input {selectedInput?.port}: {selectedInput?.name}</Text>
          <Text>Outputs: </Text>
          <FlatList
            data={matrixStatus?.HDMI_OUT}
            renderItem={({ item }) => (
              <OutputSelectTile
                port={item}
                selected={(selectedOutputs.includes(item))}
                onPress={toggleItemSelect}
              />
            )}
            keyExtractor={item => String(item.port)}
            extraData={selectedOutputs}
          />
          <TouchableOpacity style={styles.btn} onPress={commitOutputMapping}><Text>Full Send</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={closeOutputMapper}><Text>Close</Text></TouchableOpacity>
        </View>
      </Animated.View>
      {/* <Image style={{position:'absolute',bottom:0,left:0,height:150,resizeMode:'contain'}} source={Logo1} /> */}
      <View style={{ flex: 1, flexDirection: 'column'}}>
        <View style={{ flexDirection:'row',height: 25, alignItems:'center', alignSelf:'center', margin:10, columnGap: 10 }} >
          <View style={styles.connectedImageContainer}>
            <Image style={styles.connectionImage} source={getConnectionImage(matrixStatus?.isConnected)} />
          </View>
          <Text style={{fontSize:20, color:'#fff'}}>{matrixStatus?.isConnected ? "Connected" : "Offline"}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', rowGap: 10 }} >
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
      </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'rgb(250,250,250)',
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

export default InputRoutingScreen;
