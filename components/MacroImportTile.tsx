import { TouchableOpacity, StyleSheet, Text, Image, View, Alert, TextInput, ImageSourcePropType, ScrollView, useWindowDimensions } from "react-native";
import Share from 'react-native-share';
import { btoa, atob } from 'react-native-quick-base64'
import matrixSDK from "../config/MatrixSDK";
import appSettings, { ImagePicker, Macro, getImage } from "../config/AppSettings";

import shareImage from '../resources/share.png';
import recordImage from '../resources/record.png';
import recordingImage from '../resources/recording.png';
import playImage from '../resources/play-button.png';
import { useState } from "react";

interface PortStatus {
    onConfirm: Function;
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
      opacity: 0.7,
    },
    btnSelected: {
        opacity: 1,
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
        width: 70,
        height: 70,
        padding: 10,
        margin: 15,
        borderRadius: 100,
        backgroundColor: '#E8F6FF',
        alignSelf: 'center',
    },
    inputIcon: {
        width: 55,
        height: 55,
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
        flex: 7,
        flexDirection: 'column',
        justifyContent: 'center',
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
    shareImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
});

export default function MacroImportTile({ onConfirm, appPortConfig, disabled }: PortStatus) {
    const [nameInput, setNameInput] = useState<string>((appPortConfig?.name) ? appPortConfig.name : '');
    const [editingName, setEditName] = useState<boolean>(false);
    const [pickImage, setPickImage] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);
    const { height, width } = useWindowDimensions();

    const confirmOverwrite = () => {
        setSelected(true);
        Alert.alert(
            "Warning!",
            "Proceeding will erase and overwrite this macro'.\n\n Are you SURE you want to continue?",
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {setSelected(false)},
              },
              {
                text: 'Import',
                onPress: () => {onConfirm()},
                style: 'destructive',
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
            style={[
                styles.btn, 
                (disabled) ? styles.isDisabled : null, 
                (selected) ? styles.btnSelected : null,
                { maxWidth: ((width/4) - 15) }]}
            onPress={confirmOverwrite}
            >
            <View style={{flex:1}}>
                <TouchableOpacity 
                    style={[styles.inputIconContainer]}
                    onPress={() => {setPickImage(true)}}>
                    <Image style={[styles.inputIcon, (disabled) ? styles.isDisabled : null]} source={getImage(appPortConfig, appPortConfig)} />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}}>
                    <Text style={[styles.headerText]}>{appPortConfig.name}</Text>
                </TouchableOpacity>
                <View style={styles.actions}>
                    <ScrollView contentContainerStyle={styles.actions} >
                        {appPortConfig.commands.slice(1).split("#").map( (command, index) => {return <Text key={"CMD" + appPortConfig.port + index } >{command}</Text>} ) }
                    </ScrollView>
                    
                </View>
            </View>
        </TouchableOpacity>
    );
}
