import {setMsgOut} from '../framework/ConsoleBar/ConsoleBar';

function DEBUG(device, source) {
    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({
        code: source,
    });

    device.popErrorScope().then(err => {
        if (err) {
            setMsgOut(err.message);
        } else {
            setMsgOut('success');
        }
    });

    return shaderModule;
}

export default class Material {
    constructor(device, vs, fs) {
        this.vs = vs;
        this.fs = fs;
        this.device = device;
        this.vertexStage = {
            module: device.createShaderModule({
                code: vs,
            }),
            entryPoint: "main",
        };
        this.fragmentStage = {
            module: DEBUG(device, fs),
            entryPoint: "main"
        };
    }

    changeFS(fs) {
        this.fs = fs;
        this.fragmentStage = {
            module: DEBUG(this.device, fs),
            entryPoint: "main"
        };
        window.stage = this.fragmentStage;
        console.log(this.fragmentStage)
    }
} 