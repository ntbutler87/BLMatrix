import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StyleSheetProperties,
  StyleProp,
  ViewStyle,
  ScrollView
} from 'react-native';

import asyncstorage from '@react-native-async-storage/async-storage';
import matrixSDK, { MatrixInput, MatrixOutput, MatrixScene } from './MatrixSDK';
import hdmiImage from '../resources/hdmi.png';
import screenImage from '../resources/monitor.png';
import stopImage from '../resources/no-parking.png';
import projectorImage from '../resources/projector.png';
import tvImage from '../resources/television.png';
import streamImage from '../resources/video-player.png';
import settingImage from '../resources/setting.png';
import inputImage from '../resources/input.png';
import autoImage from '../resources/auto.png';

import oneImage from '../resources/one.png';
import twoImage from '../resources/two.png';
import threeImage from '../resources/three.png';
import fourImage from '../resources/four.png';
import fiveImage from '../resources/five.png';
import sixImage from '../resources/six.png';
import sevenImage from '../resources/seven.png';
import eightImage from '../resources/eight.png';
import cameraImage from '../resources/camera.png';
import checkedImage from '../resources/checked.png';
import churchImage from '../resources/church.png';
import guitarImage from '../resources/guitar.png';
import microphoneImage from '../resources/microphone.png';
import artImage from '../resources/modern-art.png';
import careImage from '../resources/social-care.png';
import tv2Image from '../resources/tv2.png';
import winnerImage from '../resources/winner.png';

import { ImageSourcePropType } from 'react-native';
import { MacroExport } from '../components/MacroTile';

const imageArray: Array<ImageSourcePropType> = [
    autoImage,
    hdmiImage,
    screenImage,
    projectorImage,
    tvImage,
    streamImage,
    settingImage,
    stopImage,
    inputImage,
    oneImage,
    twoImage,
    threeImage,
    fourImage,
    fiveImage,
    sixImage,
    sevenImage,
    eightImage,
    cameraImage,
    checkedImage,
    churchImage,
    guitarImage,
    microphoneImage,
    artImage,
    careImage,
    tv2Image,
    winnerImage,
];

export interface MatrixPort {
    port: number, 
    type: "HDMI_IN" | "HDMI_OUT" | "HDBT_OUT"
    name: string, 
    overrideName: boolean,
    imageIndex: number,
}

export interface MatrixPreset {
    port: number, 
    type: "Scene",
    name: string, 
    overrideName: boolean,
    imageIndex: number,
}

export interface Macro {
    port: number, 
    type: "Macro",
    name: string, 
    overrideName: boolean,
    imageIndex: number,
    commands: string,
    isRecording: boolean,
}

export interface AppConfig {
    pin: string,
    splashTimeout: number,
    splashImageSource: string | null,
    HDMI_IN: [ 
        MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort
    ],
    HDMI_OUT: [ 
        MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort
    ],
    HDBT_OUT: [ 
        MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort, MatrixPort
    ],
    Scene: [
        MatrixPreset, MatrixPreset, MatrixPreset, MatrixPreset, MatrixPreset, MatrixPreset, MatrixPreset, MatrixPreset
    ]
    Macro: [
        Macro, Macro, Macro, Macro, Macro, Macro, Macro, Macro
    ]
}

export const blankConfig: AppConfig = {
    pin: '000000',
    splashTimeout: 3,
    splashImageSource: null,
    HDMI_IN: [
        {port: 1, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 2, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 3, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 4, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 5, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 6, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 7, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
        {port: 8, name:"", type:"HDMI_IN", overrideName: false, imageIndex:0},
    ],
    HDMI_OUT: [
        {port: 1, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 2, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 3, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 4, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 5, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 6, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 7, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
        {port: 8, name:"", type: "HDMI_OUT", overrideName: false, imageIndex:0},
    ],
    HDBT_OUT: [
        {port: 1, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 2, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 3, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 4, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 5, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 6, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 7, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
        {port: 8, name:"", type: "HDBT_OUT", overrideName: false, imageIndex:0},
    ],
    Scene: [
        {port: 1, name: "Scene01", type:"Scene", overrideName: false, imageIndex:0},
        {port: 2, name: "Scene02", type:"Scene", overrideName: false, imageIndex:0},
        {port: 3, name: "Scene03", type:"Scene", overrideName: false, imageIndex:0},
        {port: 4, name: "Scene04", type:"Scene", overrideName: false, imageIndex:0},
        {port: 5, name: "Scene05", type:"Scene", overrideName: false, imageIndex:0},
        {port: 6, name: "Scene06", type:"Scene", overrideName: false, imageIndex:0},
        {port: 7, name: "Scene07", type:"Scene", overrideName: false, imageIndex:0},
        {port: 8, name: "Scene08", type:"Scene", overrideName: false, imageIndex:0},
    ],
    Macro: [
        {port: 1, name: "Macro 1", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 2, name: "Macro 2", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 3, name: "Macro 3", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 4, name: "Macro 4", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 5, name: "Macro 5", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 6, name: "Macro 6", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 7, name: "Macro 7", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
        {port: 8, name: "Macro 8", type:"Macro", overrideName: false, imageIndex:0, commands: "", isRecording: false},
    ]
}

class AppSettings {
    onChangeCallback: Function;
    config: AppConfig;

    constructor() {
        this.onChangeCallback = () => {};
        this.config = blankConfig;
    }

    init = async (onChangeCallback: Function) => {
        this.onChangeCallback = onChangeCallback;
        const currentConfig = await this.getStoredSettings();
        // TODO: Ensure any new config properties are added to existing config if they don't exist (e.g. on new release with new features)
        if (currentConfig !== null){
            this.config = await this.validateStoredSettingsSchema(currentConfig);
        } else {
            await this.storeConfig(this.config);
        }
        this.onChangeCallback(this.config);
    }

    /**
     * Ensure that the settings stored in local storage have the most up-to-date schema, in case a new update has changed things
     */
    validateStoredSettingsSchema = async (currentConfig: AppConfig): Promise<AppConfig> => {
        if(currentConfig.pin === undefined) {
            currentConfig.pin = blankConfig.pin;
        }
        if(currentConfig.splashTimeout === undefined) {
            currentConfig.splashTimeout = blankConfig.splashTimeout;
        }
        if(currentConfig.Scene === undefined) {
            currentConfig.Scene = blankConfig.Scene;
        }
        if(currentConfig.Macro === undefined) {
            currentConfig.Macro = blankConfig.Macro;
        }
        if(currentConfig.splashImageSource === undefined) {
            currentConfig.splashImageSource = null;
        }
        await this.storeConfig(currentConfig);
        return currentConfig;
    }

    getStoredSettings = async (): Promise<AppConfig | null> => {
        try {
            const jsonValue = (await asyncstorage.getItem('appConfig'));
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
        }
        return null;
    }

    storeConfig = async (config: AppConfig): Promise<boolean> => {
        try {
            const jsonValue = JSON.stringify(config);
            await asyncstorage.setItem('appConfig', jsonValue);
        } catch (e) {
            return false;
        }
        return true;
    }

    updatePin = async (pin: string) => {
        this.config.pin = pin;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
    }

    updateLogo = async (dataURI: string | null) => {
        this.config.splashImageSource = dataURI;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
    }

    updateTimeout = async (timeout: number) => {
        this.config.splashTimeout = timeout;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
    }

    overridePortName = async (port: MatrixInput | MatrixOutput | MatrixScene | Macro, override: boolean, name: string) => {
        this.config[port.type][port.port - 1].name = name;
        this.config[port.type][port.port - 1].overrideName = override;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
    }

    setPortImageIndex = async (port: MatrixPort | MatrixPreset | Macro, index: number): Promise<boolean> => {
        if (index < 0 || index > imageArray.length - 1) {
            return false;
        }
        this.config[port.type][port.port - 1].imageIndex = index;

        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
        return true;
    }


    getPortConfig(port: MatrixInput | MatrixOutput): MatrixPort {
        if (port.type === "HDMI_IN") {
            return this.config.HDMI_IN[port.port-1];
        }
        if (port.type === "HDMI_OUT") {
            return this.config.HDMI_OUT[port.port-1];
        }
        return this.config.HDBT_OUT[port.port-1];
    }

    getJoinedOutputPortConfig(port: MatrixPort | MatrixOutput): MatrixPort {
        if (port.type === "HDMI_OUT") {
            return this.config.HDBT_OUT[port.port-1];
        }
        return this.config.HDMI_OUT[port.port-1];
    }

    startRecordingMacro = async (port: Macro, enableOutputControl: boolean): Promise<boolean> => {
        this.config.Macro[port.port-1].isRecording = true;
        matrixSDK.startMacroRecord(enableOutputControl);
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
        return true;

    }

    saveMacro = async (port: Macro): Promise<boolean> => {
        // validate command?
        const macroString = matrixSDK.stopMacroRecord();
        this.config.Macro[port.port-1].commands = macroString;
        this.config.Macro[port.port-1].isRecording = false;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
        return true;
    }

    importMacro = async (port: Macro, newMacro: MacroExport): Promise<boolean> => {
        this.config.Macro[port.port-1].commands = newMacro.commands;
        this.config.Macro[port.port-1].imageIndex = newMacro.iconIndex;
        this.config.Macro[port.port-1].name = newMacro.name;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
        return true;
    }

}

export interface ImagePreviewInterface {
    image: ImageSourcePropType
    onSelect: Function,
}
export function ImagePreview({image, onSelect}: ImagePreviewInterface): React.JSX.Element {
    return (
        <TouchableOpacity 
            onPress={() => {onSelect()}}
            style={{width: 60, height: 60, 
            padding: 10,
            borderRadius: 60,
            backgroundColor: '#E8F6FF',justifyContent:'center',alignItems:'center'}} >
            <Image source={image} 
                style={{
                    width: 45,
                    height: 45,
                    alignSelf: 'center',}} />
        </TouchableOpacity>
    );
}

export interface ImagePickerInterface {
    style?: StyleProp<ViewStyle>
    onSelect: Function,
    horizontal: boolean,
}
export function ImagePicker({style, onSelect, horizontal}: ImagePickerInterface): React.JSX.Element {
    return (
        <ScrollView contentContainerStyle={{alignItems: 'center',}} horizontal={horizontal} style={[{},style]}>
            {imageArray.map( (image, index) => {
                return <ImagePreview key={"IMAGE"+index} image={image} onSelect={() => {onSelect(image, index)}} />
            } )}
        </ScrollView>
    );
}

export const getImage = (port: MatrixInput | MatrixOutput | MatrixScene | Macro, item: MatrixPreset | MatrixPort | Macro ) => {
    if (item === undefined){
        return hdmiImage;
    }
    if (item.imageIndex !== 0){
        return imageArray[item.imageIndex];
    } 

    let name = (item.overrideName) ? item.name : port.name;
    if (port.type === "Scene" || port.type === "Macro"){
        if (name.includes('1')){
            return oneImage;
        }
        if (name.includes('2')){
            return twoImage;
        }
        if (name.includes('3')){
            return threeImage;
        }
        if (name.includes('4')){
            return fourImage;
        }
        if (name.includes('5')){
            return fiveImage;
        }
        if (name.includes('6')){
            return sixImage;
        }
        if (name.includes('7')){
            return sevenImage;
        }
        if (name.includes('8')){
            return eightImage;
        }
    }
    if (name.toUpperCase().includes('PC') || name.toUpperCase().includes('COMPUTER')){
        return screenImage;
    }
    if (name.toUpperCase().includes("PROJ")){
        return projectorImage;
    }
    if (name.toUpperCase().includes("CHURCH")){
        return churchImage;
    }
    if (name.toUpperCase().includes("CAMERA")){
        return cameraImage;
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


const appSettings = new AppSettings();
export default appSettings;