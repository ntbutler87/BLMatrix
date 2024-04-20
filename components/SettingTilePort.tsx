import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, Image, View, Switch, TextInput } from "react-native";
import { MatrixInput, MatrixOutput, MatrixScene } from "../config/MatrixSDK";
import appSettings, { MatrixPort, MatrixPreset } from "../config/AppSettings";

import hdmiImage from '../resources/hdmi.png';
import screenImage from '../resources/monitor.png';
import stopImage from '../resources/no-parking.png';
import projectorImage from '../resources/projector.png';
import tvImage from '../resources/television.png';
import streamImage from '../resources/video-player.png';
import settingImage from '../resources/setting.png';

import inputImage from '../resources/input.png';

interface PortStatus {
    port: MatrixInput | MatrixOutput | MatrixScene;
    title: string;
    disabled?: boolean;
    onPress?: Function;
    appPortConfig?: MatrixPort;
}

const getImage = (name: string) => {
    if (name.toUpperCase().includes('PC') || name.toUpperCase().includes('COMPUTER')){
        return screenImage;
    }
    if (name.toUpperCase().includes("PROJ")){
        return projectorImage;
    }
    if (name.toUpperCase().includes('TV') || name.toUpperCase().includes('TELEVISION')){
        return tvImage;
    }
    if (name.toUpperCase().includes("STREAM")){
        return streamImage;
    }
    if (name.toUpperCase().includes('UNUSED' || name.toUpperCase().includes('NONE') || name.toUpperCase().includes('DISCONNECTED'))) {
        return stopImage;
    }
    return hdmiImage;
}

const styles = StyleSheet.create({
    btn: {
      margin: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    //   backgroundColor: '#FFFD5A',
      backgroundColor: '#FFF',
      shadowRadius: 4,
      shadowColor: 'rgb(20,20,20)',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.3,
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
        justifyContent: 'flex-start',
    },
    outputListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
    },
    isDisabled: {
        backgroundColor: '#aaa',
        opacity: 0.6,
    },
    detectedName: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        alignItems:'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    detectedNameText: {
        color: '#444',
        fontSize: 14,
        fontFamily: 'Courier New',
    },
    settingImage: {
        height: 20,
        width: 20,
        resizeMode:'contain',
        marginRight: 10,
    },
    overrideContainer: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        flexDirection: 'column',
    },
    overrideSwitchRow: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    overrideOptionText: {
    },
    overrideSwitch: {
        transform: [{scaleX: 0.8},{scaleY:0.8} ]
    },
    overrideOptionContainer:{
        margin: 5,
        borderTopColor: '#eee',
        borderTopWidth: 1,
        flexDirection: 'column'
    },
    overrideNameInput:{
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        padding: 5,
        paddingLeft: 15,
    },
    saveButton:{
        borderRadius: 8,
        padding: 10,
        margin: 10,
        backgroundColor: "#24D015",
        width: 80,
        alignItems: 'center',
        shadowRadius: 3,
        shadowColor: 'rgb(20,20,20)',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.6,
    },
    saveButtonText:{
        fontSize:18,
        color: '#fff',
        fontWeight: '800',
    },
  });

export default function SettingTilePort({ disabled, port, title, onPress, appPortConfig }: PortStatus) {
    const [debouncedName, setDebouncedName] = useState<string>('');
    const [nameInput, setNameInput] = useState<string>((appPortConfig?.name) ? appPortConfig.name : '');
    const [override, setOverride] = useState<boolean>((appPortConfig?.overrideName) ? appPortConfig.overrideName : false);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setDebouncedName(nameInput);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [nameInput, 1000]);
    
    // useEffect(() => {
    //     if (debouncedName !== appPortConfig?.name && debouncedName.length >= 2) {
    //         appSettings.overridePortName(port,debouncedName);
    //     }
    // }, [debouncedName]);

    const toggleOverrideName = (override: boolean) => {
        if (!override) {
            appSettings.overridePortName(port,'');
        }
        setOverride(override);
    }

    const validateNewName = () => {
        if (nameInput !== appPortConfig?.name && nameInput.length >= 2 && nameInput.length <= 10) {
            appSettings.overridePortName(port,nameInput);
        }
    }

    return (
        <TouchableOpacity style={[styles.btn, (disabled) ? styles.isDisabled : null]} onPress={ (disabled) ? () => {} : () => {if(onPress){onPress(port)}}}>
            <View style={{flex:1}}>
                <View style={styles.inputIconContainer}><Image style={styles.inputIcon} source={getImage(port.name)} /></View>
                <Text style={[styles.headerText]}>{title}</Text>
                <TouchableOpacity style={[styles.detectedName]}><Image style={styles.settingImage} source={inputImage}/><Text style={styles.detectedNameText}>{port.name}</Text></TouchableOpacity>
                <View style={[styles.overrideContainer]}>
                    <View style={[styles.overrideSwitchRow]}>
                        <Text style={[styles.overrideOptionText]}>Override name</Text>
                        <Switch style={styles.overrideSwitch} value={override} onValueChange={toggleOverrideName} />
                    </View>
                    {(override) ? 
                        <View style={styles.overrideOptionContainer}>
                            <TextInput 
                                style={styles.overrideNameInput} 
                                defaultValue={appPortConfig?.name} 
                                value={nameInput}
                                onChangeText={setNameInput}
                                onBlur={validateNewName}/>
                        </View>
                    : null}
                </View>

                {/* <Text style={[styles.headerText]}>{ (appPortConfig?.overrideName) ? appPortConfig.name : port.name}</Text> */}
            </View>
        </TouchableOpacity>
    );
}
