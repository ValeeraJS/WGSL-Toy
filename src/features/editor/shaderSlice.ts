import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import getDefaultCode from '../common/defaultCode';

export enum ShaderType {
	WGSL = "WGSL",
	ES45 = "GLSL ES4.5",
	ES30 = "GLSL ES3.0",
	ES20 = "GLSL ES2.0",
}

interface ShaderState {
	currentCode: string;
	needUpdate: boolean;
	currentShaderType: ShaderType;
	globalShaderType: ShaderType;
	webgpuSupported: boolean;
	webgl2Supported: boolean;
	webglSupported: boolean;
}

let webgpuS = !!document.createElement("canvas").getContext("gpupresent");
let webgl2S = !!document.createElement("canvas").getContext("webgl2");
let webglS = !!document.createElement("canvas").getContext("webgl");

export const SUPPORT_STATE = {
	WebGPU: webgpuS,
	WebGL2: webgl2S,
	WebGL: webglS
}

const initialState: ShaderState = {
	needUpdate: false,
	currentCode: getDefaultCode(webgpuS ? ShaderType.WGSL : webgl2S ? ShaderType.ES30 : ShaderType.ES20),
	currentShaderType: webgpuS ? ShaderType.WGSL : webgl2S ? ShaderType.ES30 : ShaderType.ES20,
	globalShaderType: webgpuS ? ShaderType.WGSL : webgl2S ? ShaderType.ES30 : ShaderType.ES20,
	webgpuSupported: webgpuS,
	webgl2Supported: webgl2S,
	webglSupported: webglS
};

export const shaderSlice = createSlice({
	name: 'shader',
	initialState,
	reducers: {
		setNeedUpdate: (state, action: PayloadAction<boolean>) => {
			state.needUpdate = action.payload;
		}, 
		setCurrentCode: (state, action: PayloadAction<string>) => {
			state.currentCode = action.payload;
		},
		setCurrentShaderType: (state, action: PayloadAction<ShaderType>) => {
			state.currentShaderType = action.payload;
		},
		setGlobalShaderType: (state, action: PayloadAction<ShaderType>) => {
			state.globalShaderType = action.payload;
		},
	},
});

export const { setCurrentCode, setCurrentShaderType, setGlobalShaderType, setNeedUpdate } = shaderSlice.actions;

export const codeNeedUpdate = (state: RootState) => state.shader.needUpdate;
export const currentCode = (state: RootState) => state.shader.currentCode;
export const currentShaderType = (state: RootState) => state.shader.currentShaderType;
export const globalShaderType = (state: RootState) => state.shader.globalShaderType;
export const webgpuSupported = (state: RootState) => state.shader.webgpuSupported;
export const webgl2Supported = (state: RootState) => state.shader.webgl2Supported;
export const webglSupported = (state: RootState) => state.shader.webglSupported;

export default shaderSlice.reducer;
