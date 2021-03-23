import {setMessage, MSG_TYPE} from '../features/editor/logSlice';
import {store} from './../app/store';

function getWgslModule(device, source) {
    // store.dispatch(setNeedUpdate(false));
    let startTime = Date.now();
    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({
        code: source,
    });

    device.popErrorScope().then(err => {
        if (err) {
            store.dispatch(setMessage({
                type: MSG_TYPE.ERROR,
                text: err.message,
                date: Date.now()
            }));
        } else {
            let time = Date.now() - startTime;
            store.dispatch(setMessage([{
                type: MSG_TYPE.SUCCESS,
                text: 'Shader compiled successfully.',
                date: Date.now()
            }, {
                type: MSG_TYPE.SUCCESS,
                text: `Compiled in ${time} ms.`,
                date: Date.now()
            }]));
        }
    });

    return shaderModule;
}

function getGlslModule(device, source, glslang) {
    let startTime = Date.now();
    device.pushErrorScope('validation');
    console.log(source)
    const shaderModule = device.createShaderModule({
        code: glslang.compileGLSL(source, 'fragment'),
    });

    device.popErrorScope().then(err => {
        if (err) {
            store.dispatch(setMessage({
                type: MSG_TYPE.ERROR,
                text: err.message,
                date: Date.now()
            }));
        } else {
            let time = Date.now() - startTime;
            store.dispatch(setMessage([{
                type: MSG_TYPE.SUCCESS,
                text: 'Shader compiled successfully.',
                date: Date.now()
            }, {
                type: MSG_TYPE.SUCCESS,
                text: `Compiled in ${time} ms.`,
                date: Date.now()
            }]));
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