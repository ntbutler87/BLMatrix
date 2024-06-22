
import asyncstorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface MatrixInput {
    port: number, 
    name: string, 
    pw5v: null | number, 
    sig: null | number, 
    rat: null | number, 
    col: null | number, 
    hdcp: null | number, 
    bit: null | number,
    type: "HDMI_IN",
}
export interface MatrixOutput {
    port: number, 
    name: string, 
    hpd: null | number, 
    sig: null | number, 
    rat: null | number, 
    col: null | number, 
    hdcp: null | number, 
    bit: null | number,
    input: number,
    type: "HDMI_OUT" | "HDBT_OUT",
}

export interface MatrixScene {
    port: number, 
    name: string, 
    type: "Scene",
}
export interface MatrixStatus {
    isConnected: boolean,
    ip: string | null,
    HDMI_IN: [ 
        MatrixInput, MatrixInput, MatrixInput, MatrixInput, MatrixInput, MatrixInput, MatrixInput, MatrixInput
    ],
    HDMI_OUT: [ 
        MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput
    ],
    HDBT_OUT: [ 
        MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput, MatrixOutput
    ],
    Scenes: [ 
        MatrixScene, MatrixScene, MatrixScene, MatrixScene, MatrixScene, MatrixScene, MatrixScene, MatrixScene
    ],
}

export const statusSchema: MatrixStatus = {
    isConnected: false,
    ip: null,
    HDMI_IN: [
        {port: 1, name: "HDMI_IN1", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 2, name: "HDMI_IN2", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 3, name: "HDMI_IN3", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 4, name: "HDMI_IN4", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 5, name: "HDMI_IN5", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 6, name: "HDMI_IN6", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 7, name: "HDMI_IN7", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
        {port: 8, name: "HDMI_IN8", pw5v:null,sig:0,rat:null,col:null,hdcp:null,bit:null,type:"HDMI_IN"},
    ],
    HDMI_OUT: [
        {port: 1, name: "HDMI_OUT1", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:1,type:"HDMI_OUT"},
        {port: 2, name: "HDMI_OUT2", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:2,type:"HDMI_OUT"},
        {port: 3, name: "HDMI_OUT3", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:3,type:"HDMI_OUT"},
        {port: 4, name: "HDMI_OUT4", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:4,type:"HDMI_OUT"},
        {port: 5, name: "HDMI_OUT5", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:5,type:"HDMI_OUT"},
        {port: 6, name: "HDMI_OUT6", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:6,type:"HDMI_OUT"},
        {port: 7, name: "HDMI_OUT7", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:7,type:"HDMI_OUT"},
        {port: 8, name: "HDMI_OUT8", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:8,type:"HDMI_OUT"},
    ],
    HDBT_OUT: [
        {port: 1, name: "HDBT_OUT1", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:1,type:"HDBT_OUT"},
        {port: 2, name: "HDBT_OUT2", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:2,type:"HDBT_OUT"},
        {port: 3, name: "HDBT_OUT3", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:3,type:"HDBT_OUT"},
        {port: 4, name: "HDBT_OUT4", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:4,type:"HDBT_OUT"},
        {port: 5, name: "HDBT_OUT5", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:5,type:"HDBT_OUT"},
        {port: 6, name: "HDBT_OUT6", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:6,type:"HDBT_OUT"},
        {port: 7, name: "HDBT_OUT7", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:7,type:"HDBT_OUT"},
        {port: 8, name: "HDBT_OUT8", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:8,type:"HDBT_OUT"},
    ],
    Scenes: [
        {port: 1, name: "Scene1", type:"Scene"},
        {port: 2, name: "Scene2", type:"Scene"},
        {port: 3, name: "Scene3", type:"Scene"},
        {port: 4, name: "Scene4", type:"Scene"},
        {port: 5, name: "Scene5", type:"Scene"},
        {port: 6, name: "Scene6", type:"Scene"},
        {port: 7, name: "Scene7", type:"Scene"},
        {port: 8, name: "Scene8", type:"Scene"},
    ],
};

class MatrixSDK {
    statusUpdater: number | null;
    statusString: string | null;
    onChangeCallback: Function | null;
    status: MatrixStatus;
    controlEnabled: boolean;
    blockRefresh: boolean;
    recordingMacro: boolean;
    preRecordControlState: boolean;
    macroString: string;

    constructor() {
        this.statusUpdater = null;
        this.statusString = null;
        this.onChangeCallback = null;
        this.status = statusSchema;
        this.controlEnabled = true;
        this.blockRefresh = false;
        this.recordingMacro = false;
        this.preRecordControlState = true;
        this.macroString = "";
    }

    init = async (onChangeCallback: Function) => {
        this.status.ip = await this.getStoredIP();
        this.onChangeCallback = onChangeCallback;
        if (this.status.ip !== null) {
            this.startConnection();
        }
        this.onChangeCallback(this.status);
    }

    startConnection = () => {
        if (this.statusUpdater === null){
            this.statusUpdater = Number(setInterval( 
                this.getStatusUpdate
            , 1000 ));
        } else {
        }
    }

    stopConnection = () => {
        if(this.statusUpdater !== null){
            clearInterval(this.statusUpdater);
        }
        this.statusUpdater = null;
        return true;
    }

    setOutputControlEnabled = (enabled: boolean) => {
        this.controlEnabled = enabled;
    }

    getOutputControlState = () => {
        return this.controlEnabled;
    }

    startMacroRecord = (allowOutputControl: boolean) => {
        this.macroString = ""; // ensure macro command string is cleared before starting
        this.recordingMacro = true;
        this.preRecordControlState = this.controlEnabled; // Store the current control state, so we can re-instate it after macro record
        if (!allowOutputControl) {
            this.controlEnabled = false;
        }
    }

    stopMacroRecord = (): string => {
        const macroCommand = this.macroString;
        this.macroString = "";
        this.recordingMacro = false;
        this.controlEnabled = this.preRecordControlState;
        return macroCommand;
    }

    getStatusUpdate = () => {
        if (this.blockRefresh) {
            console.log("Refresh currently blocked. Not querying matrix for status");
            return;
        }
        axios.get('http://' + this.status.ip + '/all_dat.get' + new Date().getTime(), {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            timeout: 1000
        })
            .then( (response) => {
                if (this.status.isConnected === false) {
                    this.status.isConnected = true;
                    if (this.onChangeCallback !== null){
                        this.onChangeCallback(this.status);
                    }
                }
                if(this.statusString !== response.data){
                    this.statusString = response.data;
                    this.parseStatusString();
                    if (this.onChangeCallback !== null){
                        this.onChangeCallback(this.status);
                    } else {
                    }
                } else {
                    console.log("No status change");
                }
            })
            .catch( (error) => {
                if (this.status.isConnected === true) {
                    this.status.isConnected = false;
                    if (this.onChangeCallback !== null){
                        this.onChangeCallback(this.status);
                    } else {
                    }
                }
            }); 
    }

    parseStatusString = () => {
        // Parsing code taken from the amazing built-in webpage of the device...
        var o = this.statusString;
        if (o === null){ return }
        var sw_info = o.split(";").slice(0,48);
        var edid_info = o.split(";").slice(48,88);
        var port_name = o.split(";").slice(88,112);
        var scene_name = o.split(";").slice(112,120);
        var login_info = o.split(";").slice(120,136);

        var input_info = o.replace('INPORT:','').split(";").slice(136,144);
        var hdmi_info = o.replace('OUTHDMIPORT:','').split(";").slice(144,152);
        var hdbt_info = o.replace('OUTHDBTPORT:','').split(";").slice(152,160);

        // Input > Output matching
        var outStatuses = sw_info.filter((str) => {return str.startsWith("VO")})
        for(var i=0; i<outStatuses.length; i++){
            var outputID = parseInt(outStatuses[i].split(":")[1],10);
            var inputID = parseInt(outStatuses[i].split(":")[2],10);
            this.status.HDBT_OUT[outputID-1].input = inputID
            this.status.HDMI_OUT[outputID-1].input = inputID
        }

        // Port Names:
        this.status.HDMI_IN[0].name = port_name[0].split(":")[1];
        this.status.HDMI_IN[1].name = port_name[1].split(":")[1];
        this.status.HDMI_IN[2].name = port_name[2].split(":")[1];
        this.status.HDMI_IN[3].name = port_name[3].split(":")[1];
        this.status.HDMI_IN[4].name = port_name[4].split(":")[1];
        this.status.HDMI_IN[5].name = port_name[5].split(":")[1];
        this.status.HDMI_IN[6].name = port_name[6].split(":")[1];
        this.status.HDMI_IN[7].name = port_name[7].split(":")[1];

        for (var i=0; i<input_info.length; i++) {
            var infoArray = input_info[i].split(",");
            this.status.HDMI_IN[i].pw5v = parseInt(infoArray[0].split('=')[1],10)
            this.status.HDMI_IN[i].sig  = parseInt(infoArray[1].split('=')[1],10)
            this.status.HDMI_IN[i].rat  = parseInt(infoArray[2].split('=')[1],10)
            this.status.HDMI_IN[i].col  = parseInt(infoArray[3].split('=')[1],10)
            this.status.HDMI_IN[i].hdcp = parseInt(infoArray[4].split('=')[1],10)
            this.status.HDMI_IN[i].bit  = parseInt(infoArray[5].split('=')[1],10)
        }

        this.status.HDMI_OUT[0].name = port_name[8].split(":")[1];
        this.status.HDMI_OUT[1].name = port_name[9].split(":")[1];
        this.status.HDMI_OUT[2].name = port_name[10].split(":")[1];
        this.status.HDMI_OUT[3].name = port_name[11].split(":")[1];
        this.status.HDMI_OUT[4].name = port_name[12].split(":")[1];
        this.status.HDMI_OUT[5].name = port_name[13].split(":")[1];
        this.status.HDMI_OUT[6].name = port_name[14].split(":")[1];
        this.status.HDMI_OUT[7].name = port_name[15].split(":")[1];

        for (var i=0; i<hdmi_info.length; i++) {
            infoArray = hdmi_info[i].split(",");
            this.status.HDMI_OUT[i].hpd = parseInt(infoArray[0].split('=')[1],10)
            this.status.HDMI_OUT[i].sig  = parseInt(infoArray[1].split('=')[1],10)
            this.status.HDMI_OUT[i].rat  = parseInt(infoArray[2].split('=')[1],10)
            this.status.HDMI_OUT[i].col  = parseInt(infoArray[3].split('=')[1],10)
            this.status.HDMI_OUT[i].hdcp = parseInt(infoArray[4].split('=')[1],10)
            this.status.HDMI_OUT[i].bit  = parseInt(infoArray[5].split('=')[1],10)
        }

        this.status.HDBT_OUT[0].name = port_name[16].split(":")[1];
        this.status.HDBT_OUT[1].name = port_name[17].split(":")[1];
        this.status.HDBT_OUT[2].name = port_name[18].split(":")[1];
        this.status.HDBT_OUT[3].name = port_name[19].split(":")[1];
        this.status.HDBT_OUT[4].name = port_name[20].split(":")[1];
        this.status.HDBT_OUT[5].name = port_name[21].split(":")[1];
        this.status.HDBT_OUT[6].name = port_name[22].split(":")[1];
        this.status.HDBT_OUT[7].name = port_name[23].split(":")[1];
        

        for (var i=0; i<hdbt_info.length; i++) {
            infoArray = hdbt_info[i].split(",");
            this.status.HDBT_OUT[i].hpd = parseInt(infoArray[0].split('=')[1],10)
            this.status.HDBT_OUT[i].sig  = parseInt(infoArray[1].split('=')[1],10)
            this.status.HDBT_OUT[i].rat  = parseInt(infoArray[2].split('=')[1],10)
            this.status.HDBT_OUT[i].col  = parseInt(infoArray[3].split('=')[1],10)
            this.status.HDBT_OUT[i].hdcp = parseInt(infoArray[4].split('=')[1],10)
            this.status.HDBT_OUT[i].bit  = parseInt(infoArray[5].split('=')[1],10)
        }

        this.status.Scenes[0].name = scene_name[0].split(":")[1];
        this.status.Scenes[1].name = scene_name[1].split(":")[1];
        this.status.Scenes[2].name = scene_name[2].split(":")[1];
        this.status.Scenes[3].name = scene_name[3].split(":")[1];
        this.status.Scenes[4].name = scene_name[4].split(":")[1];
        this.status.Scenes[5].name = scene_name[5].split(":")[1];
        this.status.Scenes[6].name = scene_name[6].split(":")[1];
        this.status.Scenes[7].name = scene_name[7].split(":")[1];

    }

    getCurrentIP = () => {
        return this.status.ip;
    }

    getStoredIP = async () => {
        try {
            return (await asyncstorage.getItem('matrixIP'));
        } catch (error) {
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            console.log(message);
        }
        return null;
    }

    getJoinedOutputPort(port: MatrixOutput): MatrixOutput {
        if (port.type === "HDMI_OUT") {
            return this.status.HDBT_OUT[port.port-1];
        }
        return this.status.HDMI_OUT[port.port-1];
    }

    setIPAddress = (ipAddress: string) => {
        asyncstorage.setItem('matrixIP', ipAddress);
        this.status.ip = ipAddress;
        this.stopConnection();
        this.startConnection();
    }

    setOutputSource = (output: number, source: number) => {
        if (output < 1 || output > 8 || source < 1 || source > 8){
            return false
        }
        
        if (this.recordingMacro) {
            this.macroString += "#video_d out" + output + " matrix=" + source;
        }

        if (!this.controlEnabled) {
            console.log("Output control temporarily disabled - exiting method")
            return;
        }

        // Block the app from refreshing for a moment - troubleshooting for bug where matrix does not action the commands in some cases
        this.blockRefresh = true;

        fetch('http://' + this.status.ip + '/video.set', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Accept': '*/*',
                'Origin':'http://' + this.status.ip,
                'Referer':'http://' + this.status.ip + '/',
                'Connection': 'close',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            },
            body: "#video_d out" + output + " matrix=" + source
        }).catch( () => { console.log("Set output failed") } );

        // Let the app start refreshing again
        this.blockRefresh = false;

    }

    setOutputSourceMultiple = (inputPort: number, outputPorts: Array<number>) => {
        if (inputPort < 1 || inputPort > 8){
            return false; //return false for invalid input
        }
        var commandString = "";
        for(var i=0; i<outputPorts.length; i++){
            if (outputPorts[i] < 1 || outputPorts[i] > 8 ){ return false;} //return false for invalid input
            commandString += "#video_d out" + outputPorts[i] + " matrix=" + inputPort;
        }

        if (this.recordingMacro) {
            this.macroString += commandString;
        }

        if (!this.controlEnabled) {
            console.log("Output control temporarily disabled - exiting method")
            return;
        }

        // Block the app from refreshing for a moment - troubleshooting for bug where matrix does not action the commands in some cases
        this.blockRefresh = true;

        fetch('http://' + this.status.ip + '/video.set', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Accept': '*/*',
                'Origin':'http://' + this.status.ip,
                'Referer':'http://' + this.status.ip + '/',
                'Connection': 'close',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            },
            body: commandString
        }).catch( () => { console.log("Set output failed") } );

        // Let the app start refreshing again
        this.blockRefresh = false;
    }

    manageScene = (scene: number, operation: "load" | "save") => {
        if (scene < 1 || scene > 8 || scene < 1 || scene > 8){
            return false
        }
        // exe=1 to save a scene | exe=2 to load a scene
        let exeParam = (operation === "save") ? 1 : 2; 

        if (this.recordingMacro) {
            this.macroString += "#group" + scene + " exe=" + exeParam;
        }

        if (!this.controlEnabled) {
            console.log("Output control temporarily disabled - exiting method")
            return;
        }

        // Block the app from refreshing for a moment - troubleshooting for bug where matrix does not action the commands in some cases
        this.blockRefresh = true;

        fetch('http://' + this.status.ip + '/video.set', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Accept': '*/*',
                'Origin':'http://' + this.status.ip,
                'Referer':'http://' + this.status.ip + '/',
                'Connection': 'close',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            },
            body: "#group" + scene + " exe=" + exeParam
        }).catch( () => { console.log(operation + " scene failed") } );

        // Let the app start refreshing again
        this.blockRefresh = false;
    }


    runMacroCommand = (macro: string): boolean => {
        //  should parse the macro string here and make sure it's valid...
        console.log("Running macro: " + macro);

        if (this.recordingMacro) {
            // Currently recording a macro - cannot run one at the same time
            return false;
        }

        if (!this.controlEnabled) {
            console.log("Output control temporarily disabled - exiting method")
            return false;
        }

        // Block the app from refreshing for a moment - troubleshooting for bug where matrix does not action the commands in some cases
        this.blockRefresh = true;

        fetch('http://' + this.status.ip + '/video.set', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Accept': '*/*',
                'Origin':'http://' + this.status.ip,
                'Referer':'http://' + this.status.ip + '/',
                'Connection': 'close',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            },
            body: macro
        }).catch( () => { console.log("Set output failed"); return false } );

        // Let the app start refreshing again
        this.blockRefresh = false;

        return true;
    }

    validateCommandString = (commands: string): boolean => {
        if (commands[0] !== "#") {
            return false;
        }
        let commandList = commands.slice(1).split("#");
        // TODO: The tedious work of validation of all the commands... Should start with 
        for (var i=0; i<commandList.length; i++) {
            let body = commandList[i].split(" ");
            switch (true) {
                case body[0].startsWith("video_"):
                    break;
                case body[0].startsWith("audio_"): 
                    break;
                case body[0].startsWith("edid_"):
                    break;
                case body[0] === "lcd":
                    break;
                case body[0].startsWith("group"):
                    break;
                case body[0] === "register":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "login":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "port":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "power":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "ip":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "system":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                case body[0] === "factory":
                    return false; // Probably want to stop these from being run in a macro
                    break;
                default:
                    return false;
            }
        }
        return true;
    }
}

const matrixSDK = new MatrixSDK();
export default matrixSDK;