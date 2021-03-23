import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SUPPORT_STATE } from './shaderSlice';

export enum MSG_TYPE {
	INFO = "info",
	WARNING = "warning",
	ERROR = "error",
	SUCCESS = "success"
}

interface IMessage {
	type: MSG_TYPE;
	text: string;
	date?: number;
}

interface LogState {
	messages: IMessage[];
}

let initMessage = [{
	type: MSG_TYPE.INFO,
	text: 'Welcome to use WGSL-Toy. Try your first shader program.',
	date: Date.now()
}];

if (!SUPPORT_STATE.WebGPU) {
	initMessage.push({
		type: MSG_TYPE.WARNING,
		text: 'Your browser does not support WebGPU. You might not be able to use WGSL or GLSL ES4.5. Please use Chrome Canary.',
		date: Date.now()
	});
}

if (!SUPPORT_STATE.WebGL2) {
	initMessage.push({
		type: MSG_TYPE.WARNING,
		text: 'Your browser does not support WebGL2. You might not be able to use GLSL ES3.5. Please use modern browsers such as Chrome, Firefox, Safari.',
		date: Date.now()
	});
}

if (!SUPPORT_STATE.WebGL) {
	initMessage.push({
		type: MSG_TYPE.WARNING,
		text: 'Your browser does not support WebGL. You might not be able to use GLSL ES2.0. Please use modern browsers such as Chrome, Firefox, Safari.',
		date: Date.now()
	});
}

const initialState: LogState = {
	messages: initMessage,
};

export const logSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		setMessage: (state, action: PayloadAction<IMessage | IMessage[]>) => {
			if (action.payload instanceof Array) {
				state.messages = action.payload;
			} else {
				state.messages = [action.payload];
			}
		},
		pushMessage: (state, action: PayloadAction<IMessage | IMessage[]>) => {
			let result = [...state.messages];
			if (action.payload instanceof Array) {
				result = result.concat(action.payload);
			} else {
				result.push(action.payload);
			}
			state.messages = result;
		}, 
	},
});

export const { setMessage, pushMessage } = logSlice.actions;

export const messages = (state: RootState) => state.logInfo.messages;

export default logSlice.reducer;
