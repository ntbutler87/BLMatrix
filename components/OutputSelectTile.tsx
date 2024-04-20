import { TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { MatrixInput, MatrixOutput } from "../config/MatrixSDK";

import hdmiImage from '../resources/hdmi-port.png';
import hdbtImage from '../resources/rj45.png';
import inputImage from '../resources/input.png';
import InputPort from "./InputPort";

interface PortStatus {
    port: MatrixOutput;
    selected: boolean;
    onPress: Function;
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
    selected: {
        borderStyle: 'solid',
        borderWidth: 2,
        backgroundColor: 'rgb(200,240,200)',
    },
    headerText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
    }
  });

export default function OutputSelectTile({ port, selected, onPress }: PortStatus) {
    return (
        <TouchableOpacity 
            style={[styles.container]}
            onPress={() => {onPress(port)}}
            >
            <Text style={[styles.headerText, selected ? styles.selected : null ]}>{port.port}: {port.name} -  {selected ? "Selected:" : "--------"}</Text>
        </TouchableOpacity>
    );
}
