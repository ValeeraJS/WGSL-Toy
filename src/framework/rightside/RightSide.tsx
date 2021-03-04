import React from 'react';
import styles from './RightSide.module.css';
import { useResizeDetector } from 'react-resize-detector';
import {f32BufferArray} from '../mainarea/CodePage';

interface IRightProps {
  width?: number;
}

function RightSide(props: IRightProps) {
  const { width, height, ref } = useResizeDetector();
  f32BufferArray[2] = width || 0;
  f32BufferArray[3] = height || 0;
  return (
    <div className={styles.rightside} ref={ref as any}>
      <canvas id="renderTarget" width={width} height={height}></canvas>
    </div>
  );
}

export default RightSide;
