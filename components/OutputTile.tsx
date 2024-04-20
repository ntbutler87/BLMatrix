import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { MatrixInput, MatrixOutput } from "../config/MatrixSDK";

import hdmiImage from '../resources/hdmi-port.png';
import hdbtImage from '../resources/rj45.png';
import inputImage from '../resources/input.png';
import InputPort from "./InputPort";

interface PortStatus {
    hdmiPort: MatrixOutput;
    hdbtPort: MatrixOutput;
    inputPort: MatrixInput | null | undefined;
    disabled?: boolean;
}

const styles = StyleSheet.create({
    container: {
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'rgb(240,240,240)',
      backgroundColor: 'rgb(250,250,250)',
      borderRadius: 5
    },
    btn: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderStyle: 'dashed',
      borderWidth: 1,
      backgroundColor: 'rgb(240,240,240)',
    },
    connected: {
        borderStyle: 'solid',
        borderWidth: 2,
        backgroundColor: 'rgb(200,240,200)',
    },
    headerText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    subHeaderText: {
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: '400',
    },
    connectedText: {
        fontStyle:'italic',
        fontSize: 9,
    },
    portImage: {
        width: 15,
        height: 15,
    },
    portDisconnected: {
        opacity: 0.6,
    },
  });

export default function OutputTile({ disabled, hdbtPort, hdmiPort, inputPort }: PortStatus) {
    return (
        <TouchableOpacity style={[styles.container]}>
            <Text style={[styles.headerText]}>Output {hdmiPort.port}</Text>
            <Text style={[styles.subHeaderText]}><Image source={inputImage} style={styles.portImage} /> {inputPort ? inputPort.name : "Not Set"} </Text>
            

            <TouchableOpacity style={[styles.btn, (hdmiPort.sig == 1 ? styles.connected : null)]}>
                <Text><Image source={hdmiImage} style={styles.portImage} /> {hdmiPort.name}</Text>
                <Text style={[styles.connectedText]}>{hdmiPort.sig == 0 ? "Not" : null } Connected{hdmiPort.sig !== 0 ? " In:" + hdbtPort.input : null}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, (hdbtPort.sig == 1 ? styles.connected : null)]}>
                <Text><Image source={hdbtImage} style={styles.portImage} /> {hdbtPort.name}</Text>
                <Text style={[styles.connectedText]}>{hdbtPort.sig == 0 ? "Not" : null } Connected{hdbtPort.sig !== 0 ? " In:" + hdbtPort.input : null}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
