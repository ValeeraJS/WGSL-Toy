import React, { useState } from "react";
import styles from './ConsoleBar.module.css';
import { StopOutlined } from '@ant-design/icons';
import IconButton from "../mainarea/IconButton";

let setMsgOut: any;

export {setMsgOut};

export default function ConsoleBar() {
    const [msg, setMsg] = useState('')
    setMsgOut = setMsg;
    return (<div className={styles.consolebar}>
        <div className={styles.titleline}>
            Log
            <IconButton icon={<StopOutlined/>} style={{
                float: 'right',
            }} onClick={()=> {
                setMsg('');
            }}></IconButton>
        </div>
        <div className={styles.messagebox}>
            {
                msg.split('\n').map((line, index) => {
                    return <div key={index}>{line}</div>;
                })
            }
        </div>
    </div>);
}