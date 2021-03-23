import {setMsgOut} from '../framework/ConsoleBar/ConsoleBar';

function DEBUG(device, source) {
    let startTime = Date.now();
    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({
        code: source,
    });

    device.popErrorScope().then(err => {
        if (err) {
            /// setMsgOut(err.message);
        } else {
            let time = Date.now() - startTime;
            // setMsgOut(<div>
            //     <div style={{color: "#45FF56"}}>Shader compiled successfully.</div>
            //     <div>Compiled in {time} ms.</div>
            // </div>);
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

    changeFS(fs, isGlsl = false) {
        this.fs = fs;
        this.fragmentStage = {
            module: isGlsl ? DEBUG(this.device, fs) : DEBUG(this.device, fs),
            entryPoint: "main"
        };
    }
} 