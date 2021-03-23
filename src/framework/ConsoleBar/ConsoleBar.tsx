import React from "react";
import styles from './ConsoleBar.module.css';
import { StopOutlined } from '@ant-design/icons';
import IconButton from "../mainarea/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { messages, MSG_TYPE, setMessage } from '../../features/editor/logSlice';

export default function ConsoleBar() {
    const dispatch = useDispatch();
    const msgs = useSelector(messages);
    return (<div className={styles.consolebar}>
        <div className={styles.titleline}>
            Log
            <IconButton icon={<StopOutlined/>} style={{
                float: 'right',
            }} onClick={()=> {
                dispatch(setMessage([]));
            }}></IconButton>
        </div>
        <div className={styles.messagebox}>
            {
                msgs.map(msg => {
                    if (msg.type === MSG_TYPE.WARNING) {
                        return <div key={msg.text} className={styles.warning}>{msg.text}</div>
                    }
                    if (msg.type === MSG_TYPE.SUCCESS) {
                        return <div key={msg.text} className={styles.success}>{msg.text}</div>
                    }
                    return <div key={msg.text} className={styles.info}>{msg.text}</div>
                })
            }
        </div>
    </div>);
}