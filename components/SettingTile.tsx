import { TouchableOpacity, StyleSheet, Text, Image, View, TextInput, Switch } from "react-native";
import { MatrixInput, MatrixOutput, MatrixScene } from "../config/MatrixSDK";
import { AppConfig, MatrixPort, MatrixPreset } from '../config/AppSettings';

interface TileConfig {
    matrixItem: MatrixInput | MatrixOutput | MatrixScene | undefined;
    settingItem: MatrixPort | MatrixPreset | undefined;
    onUpdate: Function;
}

const styles = StyleSheet.create({
    tile:{
        backgroundColor:"#FFFD5A", 
        borderRadius:5, 
        flex:1, 
        flexDirection:'column', 
        padding:5,
        height:100
    },
    tileHeader:{
      borderRadius:5,
      backgroundColor:"#555",
      alignItems:'center'
    },
    tileHeaderText:{
      flexWrap:'nowrap',
      fontSize:14,
      color:"#FFFD5A",
      fontWeight:'800',
    },
    tapToOverride: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center',
        flexGrow:1,
    },
    tapToOverrideText: {
        fontSize: 11,
        fontStyle: 'italic',
    }
  });

export default function SettingTile({ matrixItem, settingItem, onUpdate }: TileConfig) {
    if (matrixItem === undefined || settingItem === undefined){
        return <></>;
    }
    return (
        <View style={styles.tile}>
            <View style={styles.tileHeader}><Text style={styles.tileHeaderText}>{matrixItem.port}: {matrixItem.name}</Text></View>
            {(settingItem.overrideName)
                ? <><TextInput value={settingItem.name} />
                    <TouchableOpacity style={styles.tapToOverride}
                        onPress={() => {onUpdate(matrixItem, "")}}>
                        <Text style={styles.tapToOverrideText}>Tap to clear name</Text>
                    </TouchableOpacity></>
                : <TouchableOpacity 
                    style={styles.tapToOverride}
                    onPress={() => {onUpdate(matrixItem, "over" + matrixItem.port)}}>
                    <Text style={styles.tapToOverrideText}>Tap to override name</Text>
                </TouchableOpacity>
            }
        </View>
    );
}
