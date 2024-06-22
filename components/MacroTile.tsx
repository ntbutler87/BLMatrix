import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Image, View, Alert, TextInput, ImageSourcePropType, useWindowDimensions } from "react-native";
import Share from 'react-native-share';
import { btoa, atob } from 'react-native-quick-base64'
import matrixSDK from "../config/MatrixSDK";
import appSettings, { ImagePicker, Macro, getImage } from "../config/AppSettings";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import shareImage from '../resources/share.png';
import recordImage from '../resources/record.png';
import recordingImage from '../resources/recording.png';
import playImage from '../resources/play-button.png';
import importImage from '../resources/import.png';

interface PortStatus {
    onPressF: Function;
    appPortConfig: Macro;
    disabled?: boolean;
}

export interface MacroExport {
    name: string,
    iconIndex: number,
    type: 'Macro',
    commands: string,
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
        flex: 1,
        color: '#303030', 
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    headerInput: {
        borderWidth: 1,
        borderColor: 'rgba(100,100,100,1)',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 20,
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
        flex: 2,
        width: 100,
        maxHeight: 100,
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
    actions: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionImage: {
        flex: 1,
        width: 50,
        height: 50,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    imagePicker: {
        columnGap:5,
        borderTopColor: '#006DB2',
        borderBottomColor: '#006DB2',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    shareImageContainer: {
        zIndex:2,
        position: 'absolute',
        top: 5,
        right: 2,
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F6FF',
    },
    importImageContainer: {
        zIndex:2,
        opacity: 0.5,
        position: 'absolute',
        top: 5,
        left: 2,
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F6FF',

    },
    shareImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
});

export default function MacroTile({ onPressF, appPortConfig, disabled }: PortStatus) {
    const [nameInput, setNameInput] = useState<string>((appPortConfig?.name) ? appPortConfig.name : '');
    const { height, width } = useWindowDimensions();
    const [editingName, setEditName] = useState<boolean>(false);
    const [pickImage, setPickImage] = useState<boolean>(false);
    
    const  confirmOutputControl = () => {
        const outputEnabled = true;
        Alert.alert(
            "Disable output control?",
            "Do you want to disable output control whilst recording the macro? This will allow you to record a macro without actually making changes to the matrix",
            [
              {
                text: 'Disable',
                onPress: () => {
                    appSettings.startRecordingMacro(appPortConfig, !outputEnabled);
                },
              },
              {
                text: 'Enable',
                onPress: () => {
                    appSettings.startRecordingMacro(appPortConfig, outputEnabled);
                },
              },
              {
                text: 'Cancel',
                onPress: () => {},
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {}
            },  
        );
    }

    const confirmRecord = () => {
        Alert.alert(
            "Warning!",
            "Proceeding will erase and overwrite this macro'.\n\n Are you SURE you want to continue?",
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Start Record',
                onPress: () => {
                    confirmOutputControl();
                },
                style: 'destructive',
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {}
            },  
        );
    }

    const shareMethodPrompt = async () => {
        Alert.alert(
            "",
            "Do you want to AirDrop the config, or save as a JSON file?",
            [
              {
                text: 'AirDrop',
                style: 'default',
                onPress: () => {
                    shareMacro("AirDrop");
                },
              },
              {
                text: 'Store JSON',
                onPress: () => {
                    shareMacro("File");
                },
                style: 'default',
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {}
            },  
        );

    }

    const shareMacro = async (method: "AirDrop" | "File") => {
        let macroFileString = "data:application/json;base64,";
        let macroObject = {
            name: (appPortConfig.name) ? appPortConfig.name : 'New Macro',
            iconIndex: appPortConfig.imageIndex,
            type: 'Macro',
            commands: appPortConfig.commands,
        }
        var base64encodedFile = btoa ( JSON.stringify(macroObject) );
        // console.log(base64encodedFile);
        macroFileString += base64encodedFile;
        let macroURL = "blmatrixapp://import/" + base64encodedFile;
        
        try {
            switch (method) {
                case "AirDrop":
                    Share.open({
                        url: macroURL
                    })
                        .catch((err) => {
                            err && console.log(err);
                        });
                    break;
                case "File":
                    Share.open({
                        filename: 'Macro.json',
                        url: macroFileString
                    })
                        .catch((err) => {
                            err && console.log(err);
                        });
                    break;
            }
                
        } catch (error: any) {
            Alert.alert(error.message);
        }
    }

    const importMacro = async () => {
        try {
            const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
                type: types.json,
            });
            const fileContent = await RNFS.readFile(decodeURIComponent(pickerResult.uri), 'utf8');
            const newMacro = JSON.parse(fileContent);
            appSettings.importMacro(appPortConfig, newMacro);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={[styles.btn, (disabled) ? styles.isDisabled : null, { maxWidth: ((width/4) - 15) }]}>
            <View style={{flex:1}}>
                <TouchableOpacity style={styles.importImageContainer} onPress={importMacro}>
                    <Image style={styles.shareImage} source={importImage} />
                </TouchableOpacity> 
                {(appPortConfig.commands.length > 0) ? 
                <TouchableOpacity style={styles.shareImageContainer} onPress={shareMethodPrompt}>
                    <Image style={styles.shareImage} source={shareImage} />
                </TouchableOpacity> : null}
                {(pickImage) ? <ImagePicker 
                    horizontal={true}
                    style={styles.imagePicker}
                    onSelect={(image: ImageSourcePropType, index: number) => {setPickImage(false); appSettings.setPortImageIndex(appPortConfig, index)}}/> :
                    <TouchableOpacity 
                        style={[styles.inputIconContainer]}
                        onPress={() => {setPickImage(true)}}>
                        <Image style={[styles.inputIcon, (disabled) ? styles.isDisabled : null]} source={getImage(appPortConfig, appPortConfig)} />
                    </TouchableOpacity>}
                <TouchableOpacity style={{flex:1}} onPress={() => {setEditName(!editingName); }}>
                    {(editingName) ? 
                        <TextInput 
                            style={[styles.headerText, styles.headerInput]} 
                            defaultValue={appPortConfig?.name} 
                            value={nameInput}
                            onChangeText={setNameInput}
                            onBlur={ () => {appSettings.overridePortName(appPortConfig, true, nameInput);} }/>
                        : <Text style={[styles.headerText]}>{appPortConfig.name}</Text>} 
                    {/* <Text style={[styles.headerText]}>{appPortConfig.name}</Text> */}
                </TouchableOpacity>
                <View style={styles.actions}>
                    { (!appPortConfig.isRecording) ? 
                        <TouchableOpacity onPress={confirmRecord} ><Image source={recordImage} style={[styles.actionImage, (disabled) ? styles.isDisabled : null]} /></TouchableOpacity>
                        : <TouchableOpacity onPress={ () => { appSettings.saveMacro(appPortConfig); } } ><Image source={recordingImage} style={[styles.actionImage, (disabled) ? styles.isDisabled : null]} /></TouchableOpacity>
                    }
                    { (!appPortConfig.isRecording && appPortConfig.commands.length > 0) ? <TouchableOpacity onPress={() => {onPressF(appPortConfig)}} ><Image source={playImage} style={[styles.actionImage, (disabled) ? styles.isDisabled : null]} /></TouchableOpacity> : null}
                    
                </View>
            </View>
        </View>
    );
}
