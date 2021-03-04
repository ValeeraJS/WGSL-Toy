import React from "react";
import styles from './IconButton.module.css';
import { Tooltip } from 'antd';

interface ButtonProps {
    icon: any;
    onClick?: any;
    style?: any;
    tip?: string;
}

export default function BarIconButton(props: ButtonProps) {
    return (
        <Tooltip placement="right" title={props.tip} mouseEnterDelay={1}>
            <div className={styles.iconbutton} onClick={props.onClick} style={props.style || {}}>
                {props.icon}
            </div>
        </Tooltip >
    );
}