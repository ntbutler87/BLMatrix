import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, Image, View, Switch, TextInput, ImageSourcePropType, GestureResponderEvent, useWindowDimensions } from "react-native";
import { MatrixInput, MatrixOutput, MatrixScene } from "../config/MatrixSDK";
import appSettings, { MatrixPort, MatrixPreset, getImage, ImagePicker } from "../config/AppSettings";

import inputImage from '../resources/input.png';
import saveImage from '../resources/save-red.png';

interface PortStatus {
    port: MatrixInput | MatrixOutput | MatrixScene;
    title: string;
    disabled?: boolean;
    onPress?: Function;
    appPortConfig: MatrixPort | MatrixPreset;
    onSavePress?: (event: GestureResponderEvent) => void,
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
      width: 300,
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
        width: 80,
        height: 80,
        padding: 10,
        margin: 15,
        borderRadius: 50,
        backgroundColor: '#E8F6FF',
        alignSelf: 'center',
    },
    inputIcon: {
        width: 60,
        height: 60,
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
    imagePicker: {
        columnGap:5,
        borderTopColor: '#006DB2',
        borderBottomColor: '#006DB2',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        
    },
    manualImage: {
        backgroundColor:'#faefd4',
    },
    saveImageContainer: {
        zIndex:2,
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffdede',

    },
    saveImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
  });

export default function SettingTilePort({ disabled, port, title, onPress, appPortConfig, onSavePress }: PortStatus) {
    const [nameInput, setNameInput] = useState<string>((appPortConfig?.name) ? appPortConfig.name : '');
    const [override, setOverride] = useState<boolean>((appPortConfig?.overrideName) ? appPortConfig.overrideName : false);
    const [pickImage, setPickImage] = useState<boolean>(false);
    const { height, width } = useWindowDimensions();
    

    const toggleOverrideName = (override: boolean) => {
        // if (!override) {
            appSettings.overridePortName(port,override,appPortConfig.name);
        // }
        setOverride(override);
    }

    const validateNewName = () => {
        // if (nameInput !== appPortConfig?.name) { // && nameInput.length >= 2 && nameInput.length <= 10) {
            appSettings.overridePortName(port,override,nameInput);
        // }
    }

    return (
        <View 
            style={[styles.btn, (disabled) ? styles.isDisabled : null,{justifyContent:'space-between',rowGap: 10, maxWidth: ((width/4) - 20) }]}>
            
            {(!pickImage && onSavePress) ? 
            <TouchableOpacity style={styles.saveImageContainer} onPress={onSavePress}>
                <Image style={styles.saveImage} source={saveImage} />
            </TouchableOpacity> : null}

            <View style={{flex:4}}>                
            {(pickImage) ? <ImagePicker 
                horizontal={true}
                style={styles.imagePicker}
                onSelect={(image: ImageSourcePropType, index: number) => {setPickImage(false); appSettings.setPortImageIndex(appPortConfig, index)}}/> :
                <TouchableOpacity 
                    style={[styles.inputIconContainer,(appPortConfig.imageIndex !== 0) ? styles.manualImage : null]}
                    onPress={() => {setPickImage(true)}}>
                    <Image style={[styles.inputIcon]} source={getImage(port, appPortConfig)} />
                </TouchableOpacity>}
            </View>
            <View style={{flex:3}}>
                <Text style={[styles.headerText]}>{title}</Text>
                <TouchableOpacity style={[styles.detectedName]}><Image style={styles.settingImage} source={inputImage}/><Text style={styles.detectedNameText}>{port.name}</Text></TouchableOpacity>
            </View>
            <View style={{flex:4}}>
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
        </View>
    );
}
