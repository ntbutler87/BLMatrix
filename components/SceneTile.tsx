import { TouchableOpacity, StyleSheet, Text, Image, View, GestureResponderEvent } from "react-native";
import { MatrixInput, MatrixOutput, MatrixScene } from "../config/MatrixSDK";
import { MatrixPort, MatrixPreset, getImage } from "../config/AppSettings";

import inputImage from '../resources/input.png';

interface PortStatus {
    port: MatrixScene;
    onPressF: Function;
    appPortConfig: MatrixPreset;
    disabled?: boolean;
}

const styles = StyleSheet.create({
    btn: {
      margin: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: '#FFF',
      shadowRadius: 5,
      shadowColor: 'rgb(20,20,20)',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.7,
      width: 260,
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
        width: 100,
        height: 100,
        padding: 10,
        margin: 15,
        borderRadius: 100,
        backgroundColor: '#E8F6FF',
        alignSelf: 'center',
    },
    inputIcon: {
        width: 80,
        height: 80,
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

export default function SceneTile({ port, onPressF, appPortConfig, disabled }: PortStatus) {
    return (
        <TouchableOpacity style={[styles.btn, (disabled) ? styles.isDisabled : null]} onPress={ (disabled) ? () => {} : () => {onPressF(port)}}>
            <View style={{flex:1}}>
                <View style={[styles.inputIconContainer, (disabled) ? styles.isDisabled : null]}>
                    <Image style={[styles.inputIcon, (disabled) ? styles.isDisabled : null]} source={getImage(port, appPortConfig)} />
                </View>
                <Text style={[styles.headerText]}>{ (appPortConfig?.overrideName) ? appPortConfig.name : port.name}</Text>
            </View>
        </TouchableOpacity>
    );
}
