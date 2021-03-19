import React, { useRef } from 'react';
import styles from './MainArea.module.css';
import PageTabs from './PageTabs';

export const CodePageRef = {} as any;

function MainArea() {
  const ref = useRef(null);
  CodePageRef.page = ref;
  return (
    <div className={styles.menuarea}>
      <PageTabs ref={ref}/>
    </div>
  );
}

export default MainArea;
