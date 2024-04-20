
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
    input: null | number,
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
        {port: 1, name: "HDMI_OUT1", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 2, name: "HDMI_OUT2", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 3, name: "HDMI_OUT3", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 4, name: "HDMI_OUT4", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 5, name: "HDMI_OUT5", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 6, name: "HDMI_OUT6", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 7, name: "HDMI_OUT7", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
        {port: 8, name: "HDMI_OUT8", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDMI_OUT"},
    ],
    HDBT_OUT: [
        {port: 1, name: "HDBT_OUT1", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 2, name: "HDBT_OUT2", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 3, name: "HDBT_OUT3", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 4, name: "HDBT_OUT4", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 5, name: "HDBT_OUT5", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 6, name: "HDBT_OUT6", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 7, name: "HDBT_OUT7", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
        {port: 8, name: "HDBT_OUT8", hpd:null,sig:0,rat:null,col:null,hdcp:null,bit:null,input:null,type:"HDBT_OUT"},
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

    constructor() {
        this.statusUpdater = null;
        this.statusString = null;
        this.onChangeCallback = null;
        this.status = statusSchema;
    }

    init = async (onChangeCallback: Function) => {
        this.status.ip = await this.getStoredIP();
        this.onChangeCallback = onChangeCallback;
        console.log("Set MatrixSDK IP to: " + this.status.ip);
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

    getStatusUpdate = () => {
        axios.get('http://' + this.status.ip + '/all_dat.get' , { // + new Date().getTime(), {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
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
        console.log(this.status.ip + ": #video_d out" + output + " matrix=" + source);

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
        }).then( () => { console.log("Should have updated successfully") }).catch( () => { console.log("Didn't work...") } );

    }

}

const matrixSDK = new MatrixSDK();
export default matrixSDK;