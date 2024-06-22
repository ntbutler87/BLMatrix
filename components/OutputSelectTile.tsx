import { TouchableOpacity, StyleSheet, Text, Alert, StyleProp, ViewStyle } from "react-native";
import { MatrixOutput } from "../config/MatrixSDK";

import { MatrixPort } from "../config/AppSettings";

interface PortStatus {
    port: MatrixOutput;
    portConfig: MatrixPort;
    selected: boolean;
    onPress: Function;
    currentPatched: boolean;
    style?: StyleProp<ViewStyle>;
    recordingMacro?: boolean;
}

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
    currentPatchedContainer:{
        borderWidth: 2,
        borderColor: '#72f2b0',
    },
    currentPatchedText:{
        color: '#72f2b0',
    },

  });

export default function OutputSelectTile({ port, portConfig, selected, onPress, currentPatched, style, recordingMacro = false }: PortStatus) {
    const alertCannotChange = () => {
        Alert.alert(
            "Already Patched",
            "You can't de-select an input that's already patched here.\n\nSelect another output and patch it there instead.",
            [
            {
                text: 'OK',
                style: 'default',
            },
            ],
            {
            cancelable: true,
            onDismiss: () => {}
            },
        );
    }

    return (
        <TouchableOpacity 
            style={[styles.container, (selected) ? styles.selectedContainer : null,(currentPatched && !recordingMacro) ? styles.currentPatchedContainer : null, style]}
            onPress={ (currentPatched && !recordingMacro) ? alertCannotChange: () => {onPress(port)}}
            >
            <Text style={[styles.text,(selected) ? styles.selectedText : null]}>{port.port}: { (portConfig.overrideName) ? portConfig.name : port.name}</Text>
            {(selected) ? <Text style={[styles.selectedText, (currentPatched) ? styles.currentPatchedText : null]}>{ (currentPatched) ? "Patched" : "Selected"}</Text> : null}
        </TouchableOpacity>
    );
}
