import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ShaderType } from './shaderSlice';

interface TabState {
    activeKey: string;
	panes: TabDescripter[];
}

export interface TabDescripter {
    title: string,
    content: string,
    language?: ShaderType,
    code?: string,
    isCodePage?: boolean,
    key: string;
}

const initialState: TabState = {
    activeKey: '0',
	panes: []
};

export const tabSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		addTab: (state, action: PayloadAction<TabDescripter>) => {
            let panes = [...state.panes];
            panes.push(action.payload);
            state.panes = panes;
        },
        editTab: (state, action: PayloadAction<TabDescripter>) => {
            let panes = [...state.panes];
            for (let i = 0; i < panes.length; i++) {
                if (panes[i].key === action.payload.key) {
                    panes[i] = action.payload;
                    break;
                }
            }
            state.panes = panes;
        },
        removeTab: (state, action: PayloadAction<string>) => {
            let panes = [...state.panes];
            for (let i = 0; i < panes.length; i++) {
                if (panes[i].key === action.payload) {
                    panes.splice(i, 1);
                    break;
                }
            }
            state.panes = panes;
        },
        activeTab: (state, action: PayloadAction<string>) => {
            state.activeKey = action.payload;
        },
        setTabs: (state, action: PayloadAction<TabDescripter[]>) => {
            state.panes = action.payload;
        }
	},
});

export const { addTab, activeTab, editTab, removeTab, setTabs } = tabSlice.actions;

export const message = (state: RootState) => state.tabs.panes;

export default tabSlice.reducer;
