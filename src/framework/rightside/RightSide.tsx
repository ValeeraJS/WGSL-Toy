import React from 'react';
import styles from './RightSide.module.css';
import { useResizeDetector } from 'react-resize-detector';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import IconButton from '../mainarea/IconButton';
import { useSelector, useDispatch } from "react-redux";
import { fps, fullscreen, setFullscreen } from '../../features/editor/runtimeSlice';
import { currentShaderType, ShaderType } from '../../features/editor/shaderSlice';
import RenderingAreaWebGPU, { f32BufferArray } from './RenderingAreaWebGPU';


interface IRightProps {
  width?: number;
}

function RightSide(props: IRightProps) {
  const dispatch = useDispatch();
  const fpsInfo = useSelector(fps);
  const shaderType = useSelector(currentShaderType);
  const isFullscreen = useSelector(fullscreen);
  const { width, height, ref } = useResizeDetector();
  f32BufferArray[2] = width || 0;
  f32BufferArray[3] = height || 0;
  return (
    <div className={styles.rightside} ref={ref as any}>
      <RenderingAreaWebGPU id="webgpuTarget" width={width} height={height}/>
      <canvas id="webgl2Target" width={width} height={height} style={{
        display: shaderType === ShaderType.ES30 ? 'auto' : 'none',
      }}></canvas>
      <canvas id="webglTarget" width={width} height={height} style={{
        display: shaderType === ShaderType.ES20 ? 'auto' : 'none',
      }}></canvas>
      <div className={styles.toolbar}>
        <span className={styles.sizetext}>{width}×{height}</span>
        <span className={styles.sizetext}>{fpsInfo.toFixed(2)}fps</span>
        <IconButton icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={() => {
          if (isFullscreen) {
            document.exitFullscreen();
            dispatch(setFullscreen(false));
          } else {
            (ref.current as any)?.requestFullscreen();
            dispatch(setFullscreen(true));
          }
        }}></IconButton>
      </div>
    </div>
  );
}

export default RightSide;
