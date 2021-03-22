import React, { useState } from "react";
import styles from './ConsoleBar.module.css';
import { StopOutlined } from '@ant-design/icons';
import IconButton from "../mainarea/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { message, setMessage } from '../../features/editor/logSlice';

let setMsgOut: any;

export {setMsgOut};

export default function ConsoleBar() {
    const dispatch = useDispatch();
    const msg = useSelector(message);
    // const [msg, setMsg] = useState('')
    // setMsgOut = setMsg;
    return (<div className={styles.consolebar}>
        <div className={styles.titleline}>
            Log
            <IconButton icon={<StopOutlined/>} style={{
                float: 'right',
            }} onClick={()=> {
                dispatch(setMessage(''));
            }}></IconButton>
        </div>
        <div className={styles.messagebox}>
            {
                typeof msg === "string" ? msg.split('\n').map((line, index) => {
                    return <div key={index}>{line}</div>;
                }): msg
            }
        </div>
    </div>);
}