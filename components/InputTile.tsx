import { TouchableOpacity, StyleSheet, Text, Image, View, GestureResponderEvent, ScrollView, useWindowDimensions } from "react-native";
import matrixSDK, { MatrixInput, MatrixOutput } from "../config/MatrixSDK";
import appSettings, { MatrixPort, getImage } from "../config/AppSettings";

import inputImage from '../resources/input.png';
import { useEffect, useRef, useState } from "react";

interface PortStatus {
    port: MatrixInput;
    outputs: MatrixOutput[];
    disabled?: boolean;
    onPressF: Function;
    appPortConfig: MatrixPort;
}

const styles = StyleSheet.create({
    btn: {
      margin: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    //   backgroundColor: '#FFFD5A',
      backgroundColor: '#FFF',
      shadowRadius: 5,
      shadowColor: 'rgb(20,20,20)',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.7,
      width: 300,
      height: 300,
    },
    connected: {
        borderStyle: 'solid',
        borderWidth: 2,
        backgroundColor: 'rgb(200,240,200)',
    },
    connectedText: {
        color: '#24D015', 
        alignSelf: 'center',
        // fontStyle:'italic',
        fontSize: 14,
        textAlignVertical: 'center'
    },
    headerText: {
        color: '#303030', 
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    inputText: {
        color: '#303030', 
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '400',
        margin: 5,
    },
    outputItem: {
        flex:1,
    },
    outputText: {
        flex:3,
        color: '#303030', 
        fontSize: 13,
        fontWeight: '400',
    },
    portImage: {
        flex: 1,
        width: 15,
        height: 15,
        alignSelf: 'center',
    },
    portDisconnected: {
        color: '#E31010',
    },
    inputIconContainer: {
        width: 50,
        height: 50,
        padding: 10,
        margin: 15,
        borderRadius: 50,
        backgroundColor: '#E8F6FF',
        alignSelf: 'center',
    },
    inputIcon: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    outputList: {
        flex:1, 
        flexDirection: 'column',        
    },
    outputListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    isDisabled: {
        backgroundColor: '#aaa',
        opacity: 0.6,
    },
    btnTouchable: {
        flex:1,
        backgroundColor:'#f8f8f8',
        borderRadius:5,
        shadowRadius: 2,
        shadowColor: 'rgb(20,20,20)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.2,
    },
  });

export type ScrollViewRef = ScrollView & {
    flashScrollIndicators: () => void;
};
export default function InputTile({ disabled, port, outputs,onPressF,appPortConfig }: PortStatus) {
    const scrollViewRef = useRef<ScrollViewRef | null>(null);
    const { height, width } = useWindowDimensions();
    // For iOS - scrollview indicator flash every few seconds
    useEffect(() => {
        const flasherInterval = setInterval(function () {
            scrollViewRef.current?.flashScrollIndicators();
        }, 3000);
        return  () => clearTimeout(flasherInterval);
    }, []);

    return (
        <View style={[styles.btn, (disabled) ? styles.isDisabled : null, { maxWidth: ((width/4) - 15) }]} >
            <TouchableOpacity style={styles.btnTouchable} onPress={ (disabled) ? () => {} : () => {onPressF(port)}}>
                <View style={[styles.inputIconContainer, (disabled) ? styles.isDisabled : null]}>
                    <Image style={[styles.inputIcon, (disabled) ? styles.isDisabled : null]} source={getImage(port, appPortConfig)} />
                </View>
                <Text style={[styles.headerText]}>{ (appPortConfig?.overrideName) ? appPortConfig.name : port.name}</Text>
                <Text style={[styles.inputText]}><Text style={[styles.connectedText, (port.sig == 0 ? styles.portDisconnected : null)]}>{port.sig == 0 ? "Disconnected" : "Connected" }</Text></Text>
            </TouchableOpacity>
            <View style={styles.outputList}>
                <ScrollView persistentScrollbar={true} ref={scrollViewRef} showsVerticalScrollIndicator={true}>
                    {outputs?.map((val) => {
                        let joinedPort = matrixSDK.getJoinedOutputPort(val);
                        let joinedPortConfig = appSettings.getJoinedOutputPortConfig(val);
                        let portConfig = appSettings.getPortConfig(val);
                        let portName = (portConfig.overrideName) ? portConfig.name : val.name;
                        let joinedPortName = (joinedPortConfig.overrideName) ? joinedPortConfig.name : joinedPort.name;
                        if (portName !== joinedPortName){
                            portName += " / " + joinedPortName;
                        }
                        return <View key={val.port} style={styles.outputListItem} >
                            <Image source={inputImage} style={styles.portImage} resizeMethod='resize' resizeMode='contain' />
                            <Text style={styles.outputText}>{val.port}: {portName}</Text>
                        </View>})}
                </ScrollView>
            </View>
        </View>
    );
}
