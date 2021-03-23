import {setMsgOut} from '../framework/ConsoleBar/ConsoleBar';

function getWgslModule(device, source) {
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

function getGlslModule(device, source, glslang) {
    console.log(source, glslang)
    let startTime = Date.now();
    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({
        code: glslang.compileGLSL(source, 'fragment'),
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
    constructor(device, vs, fs, glslang) {
        this.glslang = glslang;
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
            module: getWgslModule(device, fs),
            entryPoint: "main"
        };
    }

    changeFS(fs, isGlsl = false) {
        this.fs = fs;
        this.fragmentStage = {
            module: isGlsl ? getGlslModule(this.device, fs, this.glslang) : getWgslModule(this.device, fs),
            entryPoint: "main"
        };
    }
} 