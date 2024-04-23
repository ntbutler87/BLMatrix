import { TouchableOpacity, StyleSheet, Text, Image, View, GestureResponderEvent } from "react-native";
import { MatrixInput, MatrixOutput } from "../config/MatrixSDK";
import { MatrixPort, getImage } from "../config/AppSettings";

import inputImage from '../resources/input.png';

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
      width: 260,
      height: 320,
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
        // alignSelf: 'flex-start',
        // flexDirection: 'row',
        // alignContent: 'center',
        color: '#303030', 
        fontSize: 13,
        fontWeight: '400',
        // backgroundColor: 'rgb(250,250,250)',
        // borderRadius: 4,
        // padding: 5,
    },
    portImage: {
        flex: 1,
        width: 15,
        height: 15,
        alignSelf: 'center',
        // marginRight: 20,
    },
    portDisconnected: {
        color: '#E31010',
        // opacity: 0.6,
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
        justifyContent: 'flex-start',
    },
    outputListItem: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
    },
    isDisabled: {
        backgroundColor: '#aaa',
        opacity: 0.6,
    },
  });

export default function InputTile({ disabled, port, outputs,onPressF,appPortConfig }: PortStatus) {
    return (
        <TouchableOpacity style={[styles.btn, (disabled) ? styles.isDisabled : null]} onPress={ (disabled) ? () => {} : () => {onPressF(port)}}>
            <View style={{flex:1}}>
                <View style={[styles.inputIconContainer, (disabled) ? styles.isDisabled : null]}>
                    <Image style={[styles.inputIcon, (disabled) ? styles.isDisabled : null]} source={getImage(port, appPortConfig)} />
                </View>
                <Text style={[styles.headerText]}>{ (appPortConfig?.overrideName) ? appPortConfig.name : port.name}</Text>
                <Text style={[styles.inputText]}><Text style={[styles.connectedText, (port.sig == 0 ? styles.portDisconnected : null)]}>{port.sig == 0 ? "Disconnected" : "Connected" }</Text></Text>
                {/* <Text style={[styles.connectedText, (port.sig == 0 ? styles.portDisconnected : null)]}>{port.sig == 0 ? "Not" : null } Connected</Text> */}
            </View>
            <View style={styles.outputList}>
                {outputs?.map((val) => {return <View key={val.port} style={styles.outputListItem} ><Image source={inputImage} style={styles.portImage} resizeMethod='resize' resizeMode='contain' /><Text style={styles.outputText}>{val.port}: {val.name}</Text></View>})}
            </View>
        </TouchableOpacity>
    );
}
