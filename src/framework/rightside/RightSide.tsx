import React, { createRef } from 'react';
import styles from './RightSide.module.css';
import { useResizeDetector } from 'react-resize-detector';
import {f32BufferArray} from '../mainarea/CodePage';
import { FullscreenOutlined } from '@ant-design/icons';
import IconButton from '../mainarea/IconButton';

interface IRightProps {
  width?: number;
}

function setFullScreen(dom?: HTMLElement | null) {
  if (!dom) {
    return;
  }
  dom.requestFullscreen({ navigationUI: "show" }).catch(err => {
    alert(`An error occurred while trying to switch into full-screen mode: ${err.message} (${err.name})`);
  });
}

export const fpsText = {
  ref: createRef() as any
}

function RightSide(props: IRightProps) {
  const { width, height, ref } = useResizeDetector();
  f32BufferArray[2] = width || 0;
  f32BufferArray[3] = height || 0;
  return (
    <div className={styles.rightside} ref={ref as any}>
      <canvas id="renderTarget" width={width} height={height}></canvas>
      <div className={styles.toolbar}>
        <span className={styles.sizetext}>{width}×{height}</span>
        <span className={styles.sizetext} ref={fpsText.ref}></span>
        <IconButton icon={<FullscreenOutlined />} onClick={() => {
          setFullScreen(ref.current as any);
        }}></IconButton>
      </div>
    </div>
  );
}

export default RightSide;
