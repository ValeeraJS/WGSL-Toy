import React from 'react';
import styles from './Sidebar.module.css';
import { GithubOutlined } from '@ant-design/icons';
import BarIconButton from './BarIconButton';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <BarIconButton icon={<GithubOutlined style={{
        fontSize: 40
      }}/>} tip="Go to Github repository page"></BarIconButton>
    </div>
  );
}

export default Sidebar;
