import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface RuntimeState {
	fullscreen: boolean;
	fps: number;
}

const initialState: RuntimeState = {
	fps: 0,
	fullscreen: false,
};

export const runtimeSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		setFPS: (state, action: PayloadAction<number>) => {
			state.fps = action.payload;
		},
		setFullscreen: (state, action: PayloadAction<boolean>) => {
			state.fullscreen = action.payload;
		},
	},
});

export const { setFPS, setFullscreen } = runtimeSlice.actions;

export const fps = (state: RootState) => state.runtime.fps;
export const fullscreen = (state: RootState) => state.runtime.fullscreen;

export default runtimeSlice.reducer;
