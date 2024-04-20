import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { MatrixInput } from "../config/MatrixSDK";

import hdmiImage from '../resources/hdmi-port.png';

interface PortStatus {
    port: MatrixInput;
    disabled?: boolean;
}

const styles = StyleSheet.create({
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
    connectedText: {
        fontStyle:'italic',
        fontSize: 9,
        textAlignVertical: 'center'
    },
    headerText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    portImage: {
        width: 15,
        height: 15,
    },
    portDisconnected: {
        opacity: 0.6,
    },
  });

export default function InputPort({ disabled, port }: PortStatus) {
    return (
        <TouchableOpacity style={[styles.btn, (port.sig == 1 ? styles.connected : null)]}>
            <Text style={[styles.headerText]}>Input {port.port}</Text>
            <Text>{port.name}</Text>
            <Text style={[styles.connectedText, (port.sig == 0 ? styles.portDisconnected : null)]}><Image source={hdmiImage} style={styles.portImage} /> {port.sig == 0 ? "Not" : null } Connected</Text>
        </TouchableOpacity>
    );
}
