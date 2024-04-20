
import asyncstorage from '@react-native-async-storage/async-storage';
import { MatrixInput, MatrixOutput, MatrixScene } from './MatrixSDK';

export interface MatrixPort {
    port: number, 
    type: "HDMI_IN" | "HDMI_OUT" | "HDBT_OUT"
    name: string, 
    overrideName: boolean,
}

export interface MatrixPreset {
    port: number, 
    type: "Scene",
    name: string, 
    overrideName: boolean,
}

export interface AppConfig {
    pin: string,
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
}

export const blankConfig: AppConfig = {
    pin: '9071369',
    HDMI_IN: [
        {port: 1, name:"", type:"HDMI_IN", overrideName: false},
        {port: 2, name:"", type:"HDMI_IN", overrideName: false},
        {port: 3, name:"", type:"HDMI_IN", overrideName: false},
        {port: 4, name:"", type:"HDMI_IN", overrideName: false},
        {port: 5, name:"", type:"HDMI_IN", overrideName: false},
        {port: 6, name:"", type:"HDMI_IN", overrideName: false},
        {port: 7, name:"", type:"HDMI_IN", overrideName: false},
        {port: 8, name:"", type:"HDMI_IN", overrideName: false}
    ],
    HDMI_OUT: [
        {port: 1, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 2, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 3, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 4, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 5, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 6, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 7, name:"", type: "HDMI_OUT", overrideName: false},
        {port: 8, name:"", type: "HDMI_OUT", overrideName: false}
    ],
    HDBT_OUT: [
        {port: 1, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 2, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 3, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 4, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 5, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 6, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 7, name:"", type: "HDBT_OUT", overrideName: false},
        {port: 8, name:"", type: "HDBT_OUT", overrideName: false}
    ],
    Scene: [
        {port: 1, name: "scene01", type:"Scene", overrideName: false},
        {port: 2, name: "scene02", type:"Scene", overrideName: false},
        {port: 3, name: "scene03", type:"Scene", overrideName: false},
        {port: 4, name: "scene04", type:"Scene", overrideName: false},
        {port: 5, name: "scene05", type:"Scene", overrideName: false},
        {port: 6, name: "scene06", type:"Scene", overrideName: false},
        {port: 7, name: "scene07", type:"Scene", overrideName: false},
        {port: 8, name: "scene08", type:"Scene", overrideName: false},
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
        if (currentConfig !== null){
            this.config = currentConfig;
        } else {
            await this.storeConfig(this.config);
        }
        this.onChangeCallback(this.config);
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

    overridePortName = async (port: MatrixInput | MatrixOutput | MatrixScene, name: string) => {
        this.config[port.type][port.port - 1].name = name;
        var override: boolean = (name.length === 0) ? false : true;
        this.config[port.type][port.port - 1].overrideName = override;
        await this.storeConfig(this.config);
        await this.onChangeCallback(this.config);
    }

}

const appSettings = new AppSettings();
export default appSettings;