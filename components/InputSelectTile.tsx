import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { MatrixInput, MatrixOutput } from "../config/MatrixSDK";

import hdmiImage from '../resources/hdmi-port.png';
import hdbtImage from '../resources/rj45.png';
import inputImage from '../resources/input.png';
import InputPort from "./InputPort";
import { MatrixPort } from "../config/AppSettings";

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        borderRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text:{
        fontSize:11,
        color: '#777',
    },
    selectedContainer:{
        borderWidth: 2,
        borderColor: '#00568C',
    },
    selectedText:{
        color: '#00568C',
    },

  });

  interface PortStatus {
    port: MatrixInput;
    portConfig: MatrixPort;
    selected: boolean;
    onPress: Function;
}

export default function InputSelectTile({ port, portConfig, selected, onPress }: PortStatus) {
    return (
        <TouchableOpacity 
            style={[styles.container, (selected) ? styles.selectedContainer : null]}
            onPress={ (selected) ? () => {} : () => {onPress(port)}}
            >
            <Text style={[styles.text,(selected) ? styles.selectedText : null]}>{port.port}: { (portConfig.overrideName) ? portConfig.name : port.name}</Text>
            {(selected) ? <Text style={styles.selectedText}>Selected</Text> : null}
        </TouchableOpacity>
    );
}
