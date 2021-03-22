import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface ShaderState {
	message: string | JSX.Element;
}

const initialState: ShaderState = {
	message: "",
};

export const logSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		setMessage: (state, action: PayloadAction<string | JSX.Element>) => {
			state.message = action.payload;
		},
	},
});

export const { setMessage } = logSlice.actions;

export const message = (state: RootState) => state.logInfo.message;

export default logSlice.reducer;
