import React from "react";
import styles from './IconButton.module.css';

interface ButtonProps {
    icon: any;
    onClick?: any;
    style?: any;
}

export default function IconButton(props: ButtonProps) {
    return (<div className={styles.iconbutton} onClick={props.onClick} style={props.style || {}}>
        {props.icon}
    </div>)
}